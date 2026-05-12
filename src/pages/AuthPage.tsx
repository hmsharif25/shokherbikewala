import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Mail, Eye, EyeOff, User, ArrowLeft, Sparkles, Shield, ShoppingBag, KeyRound } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import ParticleBackground from '@/components/ui/ParticleBackground'

const friendlyAuthError = (raw: string): string => {
  const m = raw.toLowerCase()
  if (m.includes('invalid login credentials')) return 'Wrong email or password. Try again.'
  if (m.includes('email not confirmed')) return 'Please confirm your email first — check your inbox.'
  if (m.includes('user already registered')) return 'This email is already registered — sign in instead.'
  if (m.includes('provider is not enabled') || m.includes('oauth') || m.includes('unsupported provider')) {
    return 'Google sign-in is not enabled on the server yet. Use email + password for now.'
  }
  if (m.includes('rate limit')) return 'Too many attempts. Please wait a moment and try again.'
  if (m.includes('network') || m.includes('fetch')) return 'Network error. Check your connection.'
  return raw
}

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [forgotMode, setForgotMode] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const navigate = useNavigate()
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, configured, resetPassword, user, isAdmin } = useAuth()

  useEffect(() => {
    if (user) {
      navigate(isAdmin ? '/admin' : '/profile', { replace: true })
    }
  }, [user, isAdmin, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (isSignUp) {
      if (!name.trim()) {
        setError('Please enter your name')
        setLoading(false)
        return
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters')
        setLoading(false)
        return
      }
      const { error: err, needsConfirm } = await signUpWithEmail(email, password, name)
      if (err) {
        setError(friendlyAuthError(err))
      } else if (needsConfirm) {
        setSuccess('Account created! Check your email to confirm, then sign in here.')
        setIsSignUp(false)
      } else {
        navigate('/')
      }
    } else {
      const { error: err } = await signInWithEmail(email, password)
      if (err) {
        setError(friendlyAuthError(err))
      } else {
        navigate('/')
      }
    }
    setLoading(false)
  }

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    setError('')
    const { error: err } = await signInWithGoogle()
    if (err) {
      setError(friendlyAuthError(err))
      setGoogleLoading(false)
    }
    // On success Supabase performs a redirect; no navigate() needed.
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-bg relative overflow-hidden py-10">
      <ParticleBackground />
      <div className="absolute inset-0 z-[1]">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute inset-0 premium-mesh-bg opacity-30" />
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
            className="inline-flex items-center gap-2 text-fg-muted hover:text-primary transition-colors text-sm font-racing"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Store
          </Link>
          <Link
            to="/admin/login"
            className="inline-flex items-center gap-1.5 text-fg-soft hover:text-cyan transition-colors text-xs font-racing"
            title="Admin sign in"
          >
            <Shield className="w-3.5 h-3.5" />
            Admin
          </Link>
        </div>

        <div className="relative p-7 sm:p-8 rounded-2xl glass-premium border border-primary/20 shadow-[0_24px_70px_-26px_rgba(255,106,26,0.3)] overflow-hidden">
          <div className="absolute -top-px left-6 right-6 divider-glow" />

          <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/30 flex items-center gap-1">
            <ShoppingBag className="w-3 h-3 text-primary" />
            <span className="text-[10px] font-racing tracking-widest text-primary uppercase">Customer</span>
          </div>

          <div className="text-center mb-7 mt-4">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.15 }}
              className="w-16 h-16 mx-auto mb-4 rounded-2xl speedometer-ring flex items-center justify-center overflow-hidden relative p-0.5"
            >
              <div className="w-full h-full bg-bg rounded-xl flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="Shokher Bikewala"
                  className="w-10 h-10 object-contain drop-shadow-[0_0_10px_rgba(255,106,26,0.55)]"
                />
              </div>
            </motion.div>
            <h1 className="text-2xl font-display font-bold text-fg mb-1">
              <span className="text-gradient-fire">{isSignUp ? 'Join the Riders' : 'Welcome Back'}</span>
            </h1>
            <p className="text-fg-muted text-sm font-racing">
              {isSignUp ? 'Create your customer account' : 'Sign in to track your orders'}
            </p>
          </div>

          {!configured && (
            <div className="mb-5 p-3 rounded-lg bg-gold/10 border border-gold/30 text-gold text-xs text-center font-racing tracking-wide">
              Demo mode — set <code className="px-1">VITE_SUPABASE_ANON_KEY</code> for real auth.
            </div>
          )}

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                key={error}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-racing"
              >
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div
                key={success}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-5 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-racing"
              >
                {success}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            onClick={handleGoogleLogin}
            disabled={loading || googleLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 mb-5 rounded-xl bg-bg-2 border border-line text-fg font-medium flex items-center justify-center gap-3 hover:bg-primary/5 hover:border-primary/30 transition-all disabled:opacity-50 font-racing tracking-wide"
          >
            {googleLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                Redirecting…
              </span>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </>
            )}
          </motion.button>

          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-line" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-bg-2 text-fg-soft font-racing tracking-wide">or continue with email</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {forgotMode ? (
              <motion.div
                key="forgot"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                {resetSent ? (
                  <div className="text-center py-4">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center">
                      <Mail className="w-6 h-6 text-green-400" />
                    </div>
                    <h3 className="text-lg font-bold text-fg mb-2 font-racing">Check Your Email</h3>
                    <p className="text-fg-muted text-sm mb-6 font-racing">
                      We sent a password reset link to <span className="text-primary">{email}</span>. Click the link in the email to set a new password.
                    </p>
                    <button
                      onClick={() => { setForgotMode(false); setResetSent(false); setError('') }}
                      className="text-sm text-fg-muted hover:text-primary transition-colors font-racing"
                    >
                      ← Back to sign in
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault()
                      setResetLoading(true)
                      setError('')
                      const { error: err } = await resetPassword(email)
                      if (err) {
                        setError(friendlyAuthError(err))
                      } else {
                        setResetSent(true)
                      }
                      setResetLoading(false)
                    }}
                    className="space-y-4"
                  >
                    <div className="text-center mb-2">
                      <KeyRound className="w-8 h-8 text-primary mx-auto mb-2" />
                      <p className="text-fg-muted text-sm font-racing">
                        Enter your email and we'll send you a link to reset your password.
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-fg-muted mb-1.5 font-racing">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-fg-soft" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          autoComplete="email"
                          required
                          className="w-full pl-11 pr-4 py-3 rounded-xl bg-bg-2 border border-line text-fg placeholder-fg-soft focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all"
                        />
                      </div>
                    </div>
                    <motion.button
                      type="submit"
                      disabled={resetLoading}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3.5 bg-gradient-to-r from-primary via-primary to-primary-600 text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-shadow disabled:opacity-60 font-racing tracking-wide flex items-center justify-center gap-2"
                    >
                      {resetLoading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Sending…
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4" />
                          Send Reset Link
                        </>
                      )}
                    </motion.button>
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => { setForgotMode(false); setError('') }}
                        className="text-sm text-fg-muted hover:text-primary transition-colors font-racing"
                      >
                        ← Back to sign in
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="auth-forms"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
              >
                <form onSubmit={handleSubmit} className="space-y-4">
                  <AnimatePresence>
                    {isSignUp && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <label className="block text-sm font-medium text-fg-muted mb-1.5 font-racing">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-fg-soft" />
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your full name"
                            autoComplete="name"
                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-bg-2 border border-line text-fg placeholder-fg-soft focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div>
                    <label className="block text-sm font-medium text-fg-muted mb-1.5 font-racing">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-fg-soft" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        autoComplete="email"
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-bg-2 border border-line text-fg placeholder-fg-soft focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-sm font-medium text-fg-muted font-racing">Password</label>
                      {!isSignUp && configured && (
                        <button
                          type="button"
                          onClick={() => { setForgotMode(true); setError(''); setSuccess('') }}
                          className="text-xs text-primary hover:text-primary-400 transition-colors font-racing"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-fg-soft" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        autoComplete={isSignUp ? 'new-password' : 'current-password'}
                        className="w-full pl-11 pr-11 py-3 rounded-xl bg-bg-2 border border-line text-fg placeholder-fg-soft focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-fg-soft hover:text-fg-muted"
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
                    className="w-full py-3.5 bg-gradient-to-r from-primary via-primary to-primary-600 text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-shadow disabled:opacity-60 font-racing tracking-wide flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Please wait…
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        {isSignUp ? 'Create Account' : 'Sign In'}
                      </>
                    )}
                  </motion.button>
                </form>

                <div className="mt-6 flex items-center justify-between gap-3 text-xs">
                  <button
                    onClick={() => {
                      setIsSignUp(!isSignUp)
                      setError('')
                      setSuccess('')
                    }}
                    className="text-fg-muted hover:text-primary transition-colors font-racing"
                  >
                    {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                  </button>
                  <Link
                    to="/track"
                    className="text-cyan hover:underline font-racing"
                  >
                    Track order →
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
