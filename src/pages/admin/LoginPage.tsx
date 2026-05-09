import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowLeft, Lock as LockIcon } from 'lucide-react'
import { isSupabaseConfigured } from '@/lib/supabase'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth, ADMIN_EMAIL_LIST } from '@/context/AuthContext'
import ParticleBackground from '@/components/ui/ParticleBackground'

const PRIMARY_ADMIN_EMAIL = ADMIN_EMAIL_LIST[0]

const friendlyAuthError = (raw: string): string => {
  const m = raw.toLowerCase()
  if (m.includes('invalid login credentials')) return 'Wrong admin password.'
  if (m.includes('email not confirmed')) return 'Admin account email is not yet confirmed.'
  if (m.includes('rate limit')) return 'Too many attempts. Please wait a moment.'
  if (m.includes('network') || m.includes('fetch')) return 'Network error. Check your connection.'
  return raw
}

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
    const isAllowedAdmin = ADMIN_EMAIL_LIST.map((a) => a.toLowerCase()).includes(cleanEmail)
    if (!isAllowedAdmin) {
      setError('This email is not authorized for admin access.')
      setLoading(false)
      return
    }

    const { error: authError } = await signInWithEmail(cleanEmail, password)
    if (authError) {
      setError(friendlyAuthError(authError))
      setLoading(false)
      return
    }
    setSubmitted(true)
  }

  useEffect(() => {
    if (isAdmin) navigate('/admin', { replace: true })
  }, [isAdmin, navigate])

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
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-[#0a0d14]">
      <ParticleBackground />

      {/* Admin-only red/cyan threat-grid backdrop */}
      <div className="absolute inset-0 z-[1]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(220,38,38,0.18),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(0,183,229,0.12),transparent_55%)]" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(220,38,38,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,0.4) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan/60 to-transparent" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-5">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan transition-colors text-sm font-racing"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Store
          </Link>
          <Link
            to="/auth"
            className="inline-flex items-center gap-1.5 text-gray-400 hover:text-primary transition-colors text-xs font-racing"
          >
            Customer login →
          </Link>
        </div>

        <div className="relative p-7 sm:p-8 rounded-2xl bg-[#0d121c]/95 backdrop-blur-xl border border-red-500/30 shadow-[0_24px_70px_-26px_rgba(220,38,38,0.45)] overflow-hidden">
          {/* Top warning band */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-red-400 to-red-500 animate-pulse" />

          <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/15 border border-red-500/40">
            <LockIcon className="w-3 h-3 text-red-400" />
            <span className="text-[10px] font-racing tracking-widest text-red-400 uppercase">Restricted</span>
          </div>

          <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan/10 border border-cyan/40">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
            <span className="text-[10px] font-racing tracking-widest text-cyan uppercase">Secure</span>
          </div>

          <div className="text-center mb-7 mt-6">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center relative p-0.5 bg-gradient-to-br from-red-500/40 via-red-500/10 to-cyan/30"
            >
              <div className="w-full h-full bg-[#0a0d14] rounded-xl flex items-center justify-center relative">
                <img
                  src="/logo.png"
                  alt="Shokher Bike Wala"
                  className="w-10 h-10 object-contain drop-shadow-[0_0_10px_rgba(220,38,38,0.6)]"
                />
                <ShieldCheck className="w-3.5 h-3.5 text-cyan absolute -bottom-0.5 -right-0.5 bg-[#0a0d14] rounded-full p-0.5 border border-cyan/40" />
              </div>
            </motion.div>
            <h1 className="text-2xl font-display font-bold text-white mb-1 tracking-wide">
              <span className="bg-gradient-to-r from-red-400 via-red-300 to-cyan bg-clip-text text-transparent">
                Admin Panel
              </span>
            </h1>
            <p className="text-gray-400 text-sm font-racing tracking-wider uppercase">
              Authorized personnel only
            </p>
          </div>

          {!isSupabaseConfigured() && (
            <div className="mb-5 p-3 rounded-lg bg-gold/10 border border-gold/30 text-gold text-xs text-center font-racing tracking-wide">
              Demo mode — admin password is <code className="px-1">admin</code>.
            </div>
          )}

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                key={error}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/40 text-red-400 text-sm font-racing"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5 font-racing tracking-wide">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  autoComplete="username"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/40 border border-red-500/20 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500/40 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5 font-racing tracking-wide">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  autoComplete="current-password"
                  className="w-full pl-11 pr-11 py-3 rounded-xl bg-black/40 border border-red-500/20 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500/40 transition-all"
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
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-shadow disabled:opacity-60 font-racing tracking-widest uppercase flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Authenticating…
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Sign In
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[10px] text-gray-600 font-racing tracking-widest uppercase">
              All login attempts are logged
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
