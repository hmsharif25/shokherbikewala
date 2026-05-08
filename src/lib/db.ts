import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type {
  BrandSettings,
  Category,
  Inquiry,
  Product,
  Testimonial,
} from '@/types'

type DBProduct = {
  id: string
  name: string
  slug: string
  description: string | null
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

export async function submitInquiry(input: {
  customer_name: string
  phone: string
  product_name?: string
  message?: string
}): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured()) {
    // No-op fallback; UI handles localStorage append elsewhere
    return { error: null }
  }
  const { error } = await supabase.from('inquiries').insert({
    customer_name: input.customer_name,
    phone: input.phone,
    product_name: input.product_name ?? '',
    message: input.message ?? '',
  })
  return { error: error?.message ?? null }
}
