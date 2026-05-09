import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowLeft } from 'lucide-react'
import { isSupabaseConfigured } from '@/lib/supabase'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth, ADMIN_EMAIL_LIST } from '@/context/AuthContext'
import ParticleBackground from '@/components/ui/ParticleBackground'

const PRIMARY_ADMIN_EMAIL = ADMIN_EMAIL_LIST[0]

export default function AdminLoginPage() {
  const [email, setEmail] = useState(PRIMARY_ADMIN_EMAIL)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const navigate = useNavigate()
  const { signInWithEmail, signOut, isAdmin, user } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const cleanEmail = email.trim().toLowerCase()
    const isAllowedAdmin = ADMIN_EMAIL_LIST.map((a) => a.toLowerCase()).includes(
      cleanEmail,
    )
    if (!isAllowedAdmin) {
      setError('This email is not authorized for admin access.')
      setLoading(false)
      return
    }

    const { error: authError } = await signInWithEmail(cleanEmail, password)
    if (authError) {
      setError(authError)
      setLoading(false)
      return
    }
    // Mark as submitted; the effect below will navigate once isAdmin flips true.
    setSubmitted(true)
  }

  // Already authenticated as admin? Skip the form.
  useEffect(() => {
    if (isAdmin) navigate('/admin', { replace: true })
  }, [isAdmin, navigate])

  // Defensive: if Supabase login succeeds for a non-admin email, sign out and surface error.
  useEffect(() => {
    if (!submitted) return
    if (user && !isAdmin) {
      signOut().finally(() => {
        setError('Signed-in account is not authorized for admin access.')
        setLoading(false)
        setSubmitted(false)
      })
    }
  }, [submitted, user, isAdmin, signOut])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-dark relative overflow-hidden">
      <ParticleBackground />
      <div className="absolute inset-0 z-[1]">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-primary transition-colors mb-6 text-sm font-racing"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Store
        </Link>

        <div className="p-8 rounded-2xl glass-premium border border-white/10">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="w-16 h-16 mx-auto mb-4 rounded-2xl speedometer-ring flex items-center justify-center overflow-hidden relative p-0.5"
            >
              <div className="w-full h-full bg-dark rounded-xl flex items-center justify-center relative">
                <img
                  src="/logo.png"
                  alt="Shokher Bike Wala"
                  className="w-10 h-10 object-contain drop-shadow-[0_0_10px_rgba(255,69,0,0.6)]"
                />
                <ShieldCheck className="w-3.5 h-3.5 text-cyan absolute -bottom-0.5 -right-0.5 bg-dark rounded-full p-0.5 border border-cyan/40" />
              </div>
            </motion.div>
            <h1 className="text-2xl font-display font-bold text-white mb-1">
              <span className="bg-gradient-to-r from-primary to-gold bg-clip-text text-transparent">Admin</span> Panel
            </h1>
            <p className="text-gray-400 text-sm font-racing tracking-wide">
              Sign in to manage your store
            </p>
          </div>

          {!isSupabaseConfigured() && (
            <div className="mb-6 p-3 rounded-lg bg-gold/10 border border-gold/20 text-gold text-xs text-center font-racing tracking-wide">
              Demo mode — admin password is <code className="px-1">admin</code>. Set <code className="px-1">VITE_SUPABASE_ANON_KEY</code> for real auth.
            </div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-11 pr-11 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 bg-gradient-to-r from-primary to-primary-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-shadow disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
