import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ImagePlus, Loader2, Trash2, UploadCloud } from 'lucide-react'
import { uploadImage } from '@/lib/storage'
import { isSupabaseConfigured } from '@/lib/supabase'

interface Props {
  /** Current image URL(s). String for single-image mode, string[] for multi. */
  value: string | string[]
  onChange: (value: string | string[]) => void
  /** Logical folder inside the `assets` bucket. */
  folder?: string
  /** When true, accepts multiple uploads and stores an array of URLs. */
  multiple?: boolean
  /** Visible label above the input. */
  label?: string
  /** Helper text under the input. */
  hint?: string
  className?: string
}

export default function ImageUpload({
  value,
  onChange,
  folder = 'misc',
  multiple = false,
  label,
  hint,
  className = '',
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const urls: string[] = multiple
    ? Array.isArray(value)
      ? value
      : value
        ? [value as string]
        : []
    : value
      ? [value as string]
      : []

  const supabaseReady = isSupabaseConfigured()

  const setUrls = (next: string[]) => {
    if (multiple) {
      onChange(next)
    } else {
      onChange(next[0] || '')
    }
  }

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setError(null)
    setBusy(true)
    try {
      const list = Array.from(files)
      const uploaded: string[] = []
      for (const f of list) {
        if (!f.type.startsWith('image/')) {
          throw new Error(`${f.name} is not an image.`)
        }
        if (f.size > 8 * 1024 * 1024) {
          throw new Error(`${f.name} is larger than 8 MB.`)
        }
        const { url } = await uploadImage(f, { folder })
        uploaded.push(url)
        if (!multiple) break
      }
      setUrls(multiple ? [...urls, ...uploaded] : uploaded)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Upload failed'
      setError(msg)
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const removeAt = (i: number) => {
    const next = urls.filter((_, idx) => idx !== i)
    setUrls(next)
  }

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm text-fg-muted mb-1.5">{label}</label>
      )}

      <div className="rounded-xl border border-dashed border-line bg-surface-soft p-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-fg-muted text-sm">
            <UploadCloud className="w-4 h-4" />
            <span>{multiple ? 'Upload one or more images' : 'Upload an image'}</span>
          </div>
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-primary text-white font-medium disabled:opacity-60"
          >
            {busy ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading…
              </>
            ) : (
              <>
                <ImagePlus className="w-4 h-4" />
                Choose file{multiple ? 's' : ''}
              </>
            )}
          </motion.button>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {!supabaseReady && (
          <p className="mt-3 text-xs text-amber-600">
            Image upload requires Supabase. Add <code>VITE_SUPABASE_ANON_KEY</code> in Vercel
            and run <code>supabase/migrations/0002_storage.sql</code>. You can paste an image
            URL below as a fallback.
          </p>
        )}

        {urls.length > 0 && (
          <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
            {urls.map((u, i) => (
              <div
                key={`${u}-${i}`}
                className="relative group aspect-square rounded-lg overflow-hidden border border-line bg-bg-2"
              >
                <img src={u} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  title="Remove"
                  className="absolute top-1.5 right-1.5 p-1.5 rounded-md bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-3">
          <label className="block text-[11px] text-fg-soft mb-1">
            …or paste image URL{multiple ? '(s)' : ''} (comma separated)
          </label>
          <input
            type="text"
            value={multiple ? urls.join(', ') : urls[0] || ''}
            onChange={(e) => {
              if (multiple) {
                const next = e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                setUrls(next)
              } else {
                setUrls([e.target.value])
              }
            }}
            placeholder="https://…"
            className="w-full px-3 py-2 rounded-lg bg-bg border border-line text-fg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
        {hint && !error && <p className="mt-2 text-xs text-fg-soft">{hint}</p>}
      </div>
    </div>
  )
}
