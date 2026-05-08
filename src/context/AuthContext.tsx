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
  configured: boolean
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>
  signUpWithEmail: (
    email: string,
    password: string,
    name: string,
  ) => Promise<{ error: string | null; needsConfirm?: boolean }>
  signInWithGoogle: () => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

const ADMIN_EMAILS = [
  'hmsharif2002@gmail.com',
  'admin@shokherbikewala.com',
]
const DEMO_USER_KEY = 'sbw_demo_user'
const DEMO_ADMIN_PASSWORD = 'admin'

const normalizeEmail = (email: string) => email.trim().toLowerCase()

const isAdminEmail = (email: string) =>
  ADMIN_EMAILS.map(normalizeEmail).includes(normalizeEmail(email))

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const configured = isSupabaseConfigured()

  useEffect(() => {
    if (!configured) {
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
          name:
            session.user.user_metadata?.full_name ||
            session.user.email?.split('@')[0],
          avatar: session.user.user_metadata?.avatar_url,
        })
      }
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name:
            session.user.user_metadata?.full_name ||
            session.user.email?.split('@')[0],
          avatar: session.user.user_metadata?.avatar_url,
        })
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [configured])

  const signInWithEmail = async (email: string, password: string) => {
    const cleanEmail = normalizeEmail(email)
    if (!configured) {
      if (isAdminEmail(cleanEmail) && password !== DEMO_ADMIN_PASSWORD) {
        return {
          error:
            'Demo admin password is "admin". Configure Supabase for real auth.',
        }
      }
      const demoUser: User = {
        id: 'demo-' + Date.now(),
        email: cleanEmail,
        name: cleanEmail.split('@')[0],
      }
      setUser(demoUser)
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser))
      return { error: null }
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    })
    return { error: error?.message || null }
  }

  const signUpWithEmail = async (
    email: string,
    password: string,
    name: string,
  ) => {
    const cleanEmail = normalizeEmail(email)
    if (!configured) {
      const demoUser: User = {
        id: 'demo-' + Date.now(),
        email: cleanEmail,
        name,
      }
      setUser(demoUser)
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser))
      return { error: null }
    }

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: window.location.origin,
      },
    })
    if (error) return { error: error.message }
    return { error: null, needsConfirm: !data.session }
  }

  const signInWithGoogle = async () => {
    if (!configured) {
      const demoUser: User = {
        id: 'demo-google-' + Date.now(),
        email: 'demo@gmail.com',
        name: 'Demo User',
      }
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
    if (!configured) {
      setUser(null)
      localStorage.removeItem(DEMO_USER_KEY)
      return
    }
    await supabase.auth.signOut()
    setUser(null)
  }

  const isAdmin = user ? isAdminEmail(user.email) : false

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        configured,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signOut,
        isAdmin,
      }}
    >
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

export const ADMIN_EMAIL_LIST = ADMIN_EMAILS
