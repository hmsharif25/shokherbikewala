import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

interface User {
  id: string
  email: string
  name?: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>
  signUpWithEmail: (email: string, password: string, name: string) => Promise<{ error: string | null }>
  signInWithGoogle: () => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

const ADMIN_EMAILS = ['admin@shokherbikewala.com']
const DEMO_USER_KEY = 'sbw_demo_user'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      const demoUser = localStorage.getItem(DEMO_USER_KEY)
      if (demoUser) {
        try {
          setUser(JSON.parse(demoUser))
        } catch {
          // ignore
        }
      }
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
          avatar: session.user.user_metadata?.avatar_url,
        })
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
          avatar: session.user.user_metadata?.avatar_url,
        })
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signInWithEmail = async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      const demoUser: User = { id: 'demo-1', email, name: email.split('@')[0] }
      setUser(demoUser)
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser))
      return { error: null }
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error?.message || null }
  }

  const signUpWithEmail = async (email: string, password: string, name: string) => {
    if (!isSupabaseConfigured()) {
      const demoUser: User = { id: 'demo-' + Date.now(), email, name }
      setUser(demoUser)
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser))
      return { error: null }
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    })
    return { error: error?.message || null }
  }

  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured()) {
      const demoUser: User = { id: 'demo-google', email: 'demo@gmail.com', name: 'Demo User' }
      setUser(demoUser)
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser))
      return { error: null }
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    return { error: error?.message || null }
  }

  const signOut = async () => {
    if (!isSupabaseConfigured()) {
      setUser(null)
      localStorage.removeItem(DEMO_USER_KEY)
      localStorage.removeItem('admin_demo')
      return
    }
    await supabase.auth.signOut()
    setUser(null)
  }

  const isAdmin = user ? (ADMIN_EMAILS.includes(user.email) || user.id.startsWith('demo')) : false

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle,
      signOut,
      isAdmin,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
