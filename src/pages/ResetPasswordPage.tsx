import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Eye, EyeOff, ArrowLeft, ShieldCheck, KeyRound } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import ParticleBackground from '@/components/ui/ParticleBackground'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [sessionReady, setSessionReady] = useState(false)
  const navigate = useNavigate()
  const { updatePassword } = useAuth()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === 'PASSWORD_RECOVERY') {
          setSessionReady(true)
        }
      },
    )
    return () => subscription.unsubscribe()
  }, [])

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    const { error: err } = await updatePassword(password)
    if (err) {
      setError(err)
    } else {
      setSuccess(true)
    }
    setLoading(false)
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
        <div className="mb-5">
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 text-fg-muted hover:text-primary transition-colors text-sm font-racing"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Link>
        </div>

        <div className="relative p-7 sm:p-8 rounded-2xl glass-premium border border-primary/20 shadow-[0_24px_70px_-26px_rgba(255,106,26,0.3)] overflow-hidden">
          <div className="absolute -top-px left-6 right-6 divider-glow" />

          <div className="text-center mb-7 mt-2">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.15 }}
              className="w-16 h-16 mx-auto mb-4 rounded-2xl speedometer-ring flex items-center justify-center overflow-hidden relative p-0.5"
            >
              <div className="w-full h-full bg-bg rounded-xl flex items-center justify-center">
                <KeyRound className="w-8 h-8 text-primary" />
              </div>
            </motion.div>
            <h1 className="text-2xl font-display font-bold text-fg mb-1">
              <span className="text-gradient-fire">Set New Password</span>
            </h1>
            <p className="text-fg-muted text-sm font-racing">
              Enter your new password below
            </p>
          </div>

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
          </AnimatePresence>

          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-lg font-bold text-fg mb-2 font-racing">Password Updated!</h3>
              <p className="text-fg-muted text-sm mb-6 font-racing">
                Your password has been successfully changed. You can now sign in with your new password.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/auth')}
                className="px-6 py-3 bg-gradient-to-r from-primary via-primary to-primary-600 text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-shadow font-racing tracking-wide"
              >
                Go to Sign In
              </motion.button>
            </motion.div>
          ) : !sessionReady ? (
            <div className="text-center py-4">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-fg-muted text-sm font-racing">
                Verifying your reset link...
              </p>
              <p className="text-fg-soft text-xs mt-3 font-racing">
                If this takes too long, the link may have expired.{' '}
                <Link to="/auth" className="text-primary hover:underline">
                  Request a new one
                </Link>
              </p>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-fg-muted mb-1.5 font-racing">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-fg-soft" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
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

              <div>
                <label className="block text-sm font-medium text-fg-muted mb-1.5 font-racing">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-fg-soft" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat your new password"
                    autoComplete="new-password"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-bg-2 border border-line text-fg placeholder-fg-soft focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all"
                    required
                    minLength={6}
                  />
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
                    Updating...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Update Password
                  </>
                )}
              </motion.button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  )
}
