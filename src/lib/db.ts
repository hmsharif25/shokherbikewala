import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type {
  BrandSettings,
  Category,
  HomeSections,
  Inquiry,
  Product,
  ProductSpecification,
  ProductReview,
  Testimonial,
} from '@/types'

type DBProduct = {
  id: string
  name: string
  slug: string
  description: string | null
  short_description: string | null
  specifications: ProductSpecification[] | null
  reviews: ProductReview[] | null
  price: number | string
  discount_price: number | string | null
  category_id: string | null
  images: string[] | null
  featured: boolean
  in_stock: boolean
  created_at: string
}

type DBCategory = {
  id: string
  name: string
  slug: string
  image_url: string | null
  created_at: string
}

type DBBrand = {
  id: string
  brand_name: string
  tagline: string | null
  logo_url: string | null
  hero_image_url: string | null
  whatsapp: string | null
  facebook: string | null
  tiktok: string | null
  instagram: string | null
}

type DBTestimonial = {
  id: number
  name: string
  rating: number
  text: string
  product: string | null
}

type DBInquiry = {
  id: number
  customer_name: string
  phone: string
  product_name: string | null
  message: string | null
  status: 'new' | 'contacted' | 'completed' | 'cancelled'
  created_at: string
}

const num = (v: number | string | null | undefined): number =>
  v == null ? 0 : typeof v === 'number' ? v : Number(v)

const numOrNull = (
  v: number | string | null | undefined,
): number | null => (v == null ? null : num(v))

export const mapProduct = (row: DBProduct): Product => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  description: row.description ?? '',
  short_description: row.short_description ?? undefined,
  specifications: row.specifications ?? undefined,
  reviews: row.reviews ?? undefined,
  price: num(row.price),
  discount_price: numOrNull(row.discount_price),
  category_id: row.category_id ?? '',
  images: row.images ?? [],
  featured: row.featured,
  in_stock: row.in_stock,
  created_at: row.created_at,
})

export const mapCategory = (row: DBCategory): Category => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  image_url: row.image_url ?? '',
  created_at: row.created_at,
})

export const mapBrand = (row: DBBrand): BrandSettings => ({
  id: row.id,
  brand_name: row.brand_name,
  tagline: row.tagline ?? '',
  logo_url: row.logo_url ?? '',
  hero_image_url: row.hero_image_url ?? '',
  whatsapp: row.whatsapp ?? '',
  facebook: row.facebook ?? '',
  tiktok: row.tiktok ?? '',
  instagram: row.instagram ?? '',
})

export const mapTestimonial = (row: DBTestimonial): Testimonial => ({
  id: row.id,
  name: row.name,
  rating: row.rating,
  text: row.text,
  product: row.product ?? '',
})

export const mapInquiry = (row: DBInquiry): Inquiry => ({
  id: row.id,
  customer_name: row.customer_name,
  phone: row.phone,
  product_name: row.product_name ?? '',
  message: row.message ?? '',
  status: row.status,
  created_at: row.created_at,
})

export type RemoteSnapshot = {
  products?: Product[]
  categories?: Category[]
  brandSettings?: BrandSettings
  testimonials?: Testimonial[]
  inquiries?: Inquiry[]
}

export async function loadRemotePublic(): Promise<RemoteSnapshot> {
  if (!isSupabaseConfigured()) return {}
  const out: RemoteSnapshot = {}
  try {
    const [products, categories, brand, testimonials] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('created_at', { ascending: false }),
      supabase.from('brand_settings').select('*').limit(1).maybeSingle(),
      supabase.from('testimonials').select('*').order('id', { ascending: false }),
    ])

    if (products.data) out.products = products.data.map(mapProduct)
    if (categories.data) out.categories = categories.data.map(mapCategory)
    if (brand.data) out.brandSettings = mapBrand(brand.data)
    if (testimonials.data) out.testimonials = testimonials.data.map(mapTestimonial)
  } catch (err) {
    console.warn('[db] loadRemotePublic failed; falling back to local data', err)
  }
  return out
}

export async function loadRemoteInquiries(): Promise<Inquiry[]> {
  if (!isSupabaseConfigured()) return []
  const { data, error } = await supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) {
    console.warn('[db] loadRemoteInquiries failed', error)
    return []
  }
  return (data || []).map(mapInquiry)
}

export async function loadInquiriesByPhone(phone: string): Promise<Inquiry[]> {
  if (!isSupabaseConfigured()) return []
  const cleaned = phone.replace(/[^0-9]/g, '').slice(-10)
  if (!cleaned) return []
  const { data, error } = await supabase
    .from('inquiries')
    .select('*')
    .ilike('phone', `%${cleaned}%`)
    .order('created_at', { ascending: false })
  if (error) {
    console.warn('[db] loadInquiriesByPhone failed', error)
    return []
  }
  return (data || []).map(mapInquiry)
}

export async function submitInquiry(input: {
  customer_name: string
  phone: string
  product_name?: string
  message?: string
}): Promise<{ error: string | null; id?: number }> {
  if (!isSupabaseConfigured()) {
    // No-op fallback; UI handles localStorage append elsewhere
    return { error: null }
  }
  const { data, error } = await supabase
    .from('inquiries')
    .insert({
      customer_name: input.customer_name,
      phone: input.phone,
      product_name: input.product_name ?? '',
      message: input.message ?? '',
    })
    .select('id')
    .maybeSingle()
  return { error: error?.message ?? null, id: data?.id }
}

/* ── Product CRUD ── */

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const isUuid = (v: string) => UUID_RE.test(v)

async function resolveCategoryId(
  categoryId: string,
  categories: { id: string; name: string; slug: string; image_url: string }[],
): Promise<string | null> {
  if (!categoryId) return null
  if (UUID_RE.test(categoryId)) return categoryId
  const demo = categories.find(c => c.id === categoryId)
  if (!demo) return null
  const { data: existing } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', demo.slug)
    .maybeSingle()
  if (existing) return existing.id
  const { data: created } = await supabase
    .from('categories')
    .insert({ name: demo.name, slug: demo.slug, image_url: demo.image_url })
    .select('id')
    .single()
  return created?.id ?? null
}

export async function insertProductRemote(
  input: {
    name: string
    slug: string
    description: string
    short_description?: string
    specifications?: ProductSpecification[]
    price: number
    discount_price: number | null
    category_id: string
    images: string[]
    in_stock: boolean
    featured: boolean
  },
  categories: { id: string; name: string; slug: string; image_url: string }[] = [],
): Promise<{ error: string | null; product?: Product }> {
  if (!isSupabaseConfigured()) return { error: null }
  const resolvedCategoryId = await resolveCategoryId(input.category_id, categories)
  const row: Record<string, unknown> = {
    name: input.name,
    slug: input.slug,
    description: input.description,
    price: input.price,
    discount_price: input.discount_price,
    category_id: resolvedCategoryId,
    images: input.images,
    in_stock: input.in_stock,
    featured: input.featured,
  }
  if (input.short_description !== undefined) row.short_description = input.short_description
  if (input.specifications !== undefined) row.specifications = input.specifications
  const { data, error } = await supabase
    .from('products')
    .insert(row)
    .select('*')
    .single()
  if (error) return { error: error.message }
  return { error: null, product: mapProduct(data) }
}

export async function updateProductRemote(
  id: string,
  input: {
    name: string
    slug: string
    description: string
    short_description?: string
    specifications?: ProductSpecification[]
    price: number
    discount_price: number | null
    category_id: string
    images: string[]
    in_stock: boolean
    featured: boolean
  },
  categories: { id: string; name: string; slug: string; image_url: string }[] = [],
): Promise<{ error: string | null; product?: Product }> {
  if (!isSupabaseConfigured()) return { error: null }
  const resolvedCategoryId = await resolveCategoryId(input.category_id, categories)
  const row: Record<string, unknown> = {
    name: input.name,
    slug: input.slug,
    description: input.description,
    price: input.price,
    discount_price: input.discount_price,
    category_id: resolvedCategoryId,
    images: input.images,
    in_stock: input.in_stock,
    featured: input.featured,
  }
  if (input.short_description !== undefined) row.short_description = input.short_description
  if (input.specifications !== undefined) row.specifications = input.specifications
  const { data, error } = await supabase
    .from('products')
    .update(row)
    .eq('id', id)
    .select('*')
    .single()
  if (error) return { error: error.message }
  return { error: null, product: mapProduct(data) }
}

export async function deleteProductRemote(
  id: string,
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured()) return { error: null }
  // Demo / locally-created products use timestamp-style ids (e.g. '1' or
  // '1700000000000') that can't exist in Supabase (the column is uuid).
  // Skip the round-trip and let the caller remove it from local state.
  if (!UUID_RE.test(id)) return { error: null }
  const { error } = await supabase.from('products').delete().eq('id', id)
  return { error: error?.message ?? null }
}

/* ── Category CRUD ── */

export async function insertCategoryRemote(input: {
  name: string
  slug: string
  image_url: string
}): Promise<{ error: string | null; category?: Category }> {
  if (!isSupabaseConfigured()) return { error: null }
  // If a row with this slug already exists, reuse it instead of failing on
  // the unique constraint. Lets admins re-add a category they previously
  // deleted only locally.
  const { data: existing } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', input.slug)
    .maybeSingle()
  if (existing) {
    const { data: updated, error } = await supabase
      .from('categories')
      .update({ name: input.name, image_url: input.image_url })
      .eq('id', existing.id)
      .select('*')
      .single()
    if (error) return { error: error.message }
    return { error: null, category: mapCategory(updated) }
  }
  const { data, error } = await supabase
    .from('categories')
    .insert({
      name: input.name,
      slug: input.slug,
      image_url: input.image_url,
    })
    .select('*')
    .single()
  if (error) return { error: error.message }
  return { error: null, category: mapCategory(data) }
}

export async function updateCategoryRemote(
  id: string,
  input: { name: string; slug: string; image_url: string },
): Promise<{ error: string | null; category?: Category }> {
  if (!isSupabaseConfigured()) return { error: null }
  // Demo categories don't yet exist in Supabase — promote them via insert.
  if (!UUID_RE.test(id)) return insertCategoryRemote(input)
  const { data, error } = await supabase
    .from('categories')
    .update({
      name: input.name,
      slug: input.slug,
      image_url: input.image_url,
    })
    .eq('id', id)
    .select('*')
    .single()
  if (error) return { error: error.message }
  return { error: null, category: mapCategory(data) }
}

export async function deleteCategoryRemote(
  id: string,
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured()) return { error: null }
  // Demo ids (e.g. '1') aren't valid Supabase uuids — nothing to delete
  // remotely; the caller will drop it from local state.
  if (!UUID_RE.test(id)) return { error: null }
  const { error } = await supabase.from('categories').delete().eq('id', id)
  return { error: error?.message ?? null }
}

export async function updateInquiryStatusRemote(
  id: number,
  status: Inquiry['status'],
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured()) return { error: null }
  const { error } = await supabase
    .from('inquiries')
    .update({ status })
    .eq('id', id)
  return { error: error?.message ?? null }
}

export async function deleteInquiryRemote(
  id: number,
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured()) return { error: null }
  const { error } = await supabase.from('inquiries').delete().eq('id', id)
  return { error: error?.message ?? null }
}

/* ── Site Config (home sections etc.) ── */

export async function loadHomeSectionsRemote(): Promise<HomeSections | null> {
  if (!isSupabaseConfigured()) return null
  try {
    const { data, error } = await supabase
      .from('site_config')
      .select('value')
      .eq('key', 'home_sections')
      .maybeSingle()
    if (error || !data) return null
    return data.value as HomeSections
  } catch {
    return null
  }
}

export async function saveHomeSectionsRemote(
  sections: HomeSections,
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured()) return { error: null }
  const { error } = await supabase
    .from('site_config')
    .upsert({ key: 'home_sections', value: sections as unknown as Record<string, unknown>, updated_at: new Date().toISOString() }, { onConflict: 'key' })
  return { error: error?.message ?? null }
}
