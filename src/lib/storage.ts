import { supabase, isSupabaseConfigured } from './supabase'

const BUCKET = 'assets'

/** Slugify a filename so it's safe for object storage paths. */
function safeName(name: string) {
  const lastDot = name.lastIndexOf('.')
  const stem = lastDot > 0 ? name.slice(0, lastDot) : name
  const ext = lastDot > 0 ? name.slice(lastDot).toLowerCase() : ''
  const cleanStem = stem
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'file'
  return `${cleanStem}${ext}`
}

export interface UploadOptions {
  /** Logical folder inside the bucket. e.g. "products", "categories", "brand". */
  folder?: string
}

export interface UploadResult {
  url: string
  path: string
}

/**
 * Upload an image to the public `assets` bucket and return its public URL.
 * Throws if Supabase isn't configured or the upload fails — callers should
 * surface a friendly error to the user.
 */
export async function uploadImage(
  file: File,
  options: UploadOptions = {}
): Promise<UploadResult> {
  if (!isSupabaseConfigured()) {
    throw new Error(
      'Image upload requires Supabase. Add VITE_SUPABASE_ANON_KEY in Vercel and run the storage migration.'
    )
  }

  const folder = (options.folder || 'misc').replace(/^\/+|\/+$/g, '')
  const path = `${folder}/${Date.now()}-${safeName(file.name)}`

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type || undefined,
  })

  if (error) {
    throw new Error(error.message || 'Upload failed')
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return { url: data.publicUrl, path }
}

/** Try to extract the storage path from a public URL we previously returned. */
export function pathFromPublicUrl(url: string): string | null {
  try {
    const u = new URL(url)
    const marker = `/storage/v1/object/public/${BUCKET}/`
    const idx = u.pathname.indexOf(marker)
    if (idx === -1) return null
    return u.pathname.slice(idx + marker.length)
  } catch {
    return null
  }
}

/** Best-effort delete; safe to call with a URL that doesn't belong to us. */
export async function deleteImageByUrl(url: string): Promise<void> {
  if (!isSupabaseConfigured()) return
  const path = pathFromPublicUrl(url)
  if (!path) return
  await supabase.storage.from(BUCKET).remove([path])
}
