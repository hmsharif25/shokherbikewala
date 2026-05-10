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
  // Add a small random suffix so two near-simultaneous uploads of the
  // same filename don't collide on the millisecond timestamp.
  const rand = Math.random().toString(36).slice(2, 8)
  const path = `${folder}/${Date.now()}-${rand}-${safeName(file.name)}`

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type || undefined,
  })

  if (error) {
    throw new Error(friendlyStorageError(error.message))
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return { url: data.publicUrl, path }
}

/** Translate raw Supabase storage errors into actionable messages. */
function friendlyStorageError(message: string | undefined): string {
  const m = (message || '').toLowerCase()
  if (!message) return 'Upload failed.'
  if (m.includes('bucket') && m.includes('not found')) {
    return 'Storage bucket "assets" is missing. Run supabase/migrations/0002_storage.sql in the Supabase SQL editor, then retry.'
  }
  if (m.includes('row-level security') || m.includes('not authorized') || m.includes('unauthorized')) {
    return 'Image upload requires admin access. Sign in with an admin email (e.g. hmsharif2002@gmail.com) and try again.'
  }
  if (m.includes('payload too large') || m.includes('too large')) {
    return 'Image is too large. Please upload a file under 8 MB.'
  }
  return message
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
