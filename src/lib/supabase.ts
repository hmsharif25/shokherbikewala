import { createClient } from '@supabase/supabase-js'

const DEFAULT_SUPABASE_URL = 'https://pfegrhsefyqqjzmbgurs.supabase.co'

const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) || DEFAULT_SUPABASE_URL
const supabaseAnonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey || 'placeholder-key', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

export const isSupabaseConfigured = () => {
  return Boolean(supabaseAnonKey) && supabaseUrl !== 'https://placeholder.supabase.co'
}

export const supabaseProjectRef = (() => {
  try {
    const host = new URL(supabaseUrl).host
    return host.split('.')[0]
  } catch {
    return ''
  }
})()
