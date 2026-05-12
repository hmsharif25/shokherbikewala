import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff, Shield, CheckCircle, AlertCircle } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import AnimatedSection from '@/components/ui/AnimatedSection'

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const passwordStrength = (pwd: string): { label: string; color: string; width: string } => {
    if (pwd.length === 0) return { label: '', color: '', width: '0%' }
    if (pwd.length < 6) return { label: 'Weak', color: 'bg-red-500', width: '25%' }
    if (pwd.length < 8) return { label: 'Fair', color: 'bg-yellow-500', width: '50%' }
    if (pwd.length < 12 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd))
      return { label: 'Good', color: 'bg-cyan', width: '75%' }
    if (pwd.length >= 12 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd))
      return { label: 'Strong', color: 'bg-green-500', width: '100%' }
    return { label: 'Fair', color: 'bg-yellow-500', width: '50%' }
  }

  const strength = passwordStrength(newPassword)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      return
    }

    if (currentPassword === newPassword) {
      setError('New password must be different from current password')
      return
    }

    setLoading(true)

    if (!isSupabaseConfigured()) {
      await new Promise(r => setTimeout(r, 1000))
      setSuccess('Password changed successfully! (Demo Mode)')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setLoading(false)
      return
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (updateError) {
        setError(updateError.message)
      } else {
        setSuccess('Password changed successfully!')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-display font-bold text-white mb-1">Change Password</h1>
        <p className="text-gray-400 text-sm">Update your admin account password</p>
      </div>

      <AnimatedSection>
        <div className="p-6 rounded-xl glass space-y-6">
          <div className="flex items-center gap-4 pb-4 border-b border-white/5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-cyan flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">Security Settings</h2>
              <p className="text-gray-400 text-sm">Keep your account secure with a strong password</p>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm"
            >
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              {success}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Current Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  required
                  className="w-full pl-11 pr-11 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  className="w-full pl-11 pr-11 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {newPassword.length > 0 && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-400">Password strength</span>
                    <span className={`text-xs font-medium ${
                      strength.label === 'Weak' ? 'text-red-400' :
                      strength.label === 'Fair' ? 'text-yellow-400' :
                      strength.label === 'Good' ? 'text-cyan' : 'text-green-400'
                    }`}>
                      {strength.label}
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: strength.width }}
                      className={`h-full rounded-full ${strength.color} transition-all`}
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  className={`w-full pl-11 pr-11 py-3 rounded-xl bg-white/5 border text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                    confirmPassword.length > 0 && confirmPassword !== newPassword
                      ? 'border-red-500/50'
                      : confirmPassword.length > 0 && confirmPassword === newPassword
                      ? 'border-green-500/50'
                      : 'border-white/10'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {confirmPassword.length > 0 && confirmPassword !== newPassword && (
                <p className="text-red-400 text-xs mt-1">Passwords do not match</p>
              )}
            </div>

            <div className="pt-2">
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-primary to-primary-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-shadow disabled:opacity-50"
              >
                <Lock className="w-5 h-5" />
                {loading ? 'Updating Password...' : 'Update Password'}
              </motion.button>
            </div>
          </form>

          <div className="pt-4 border-t border-white/5">
            <h3 className="text-white font-semibold text-sm mb-3">Password Requirements</h3>
            <ul className="space-y-1.5 text-xs text-gray-400">
              <li className={`flex items-center gap-2 ${newPassword.length >= 6 ? 'text-green-400' : ''}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${newPassword.length >= 6 ? 'bg-green-400' : 'bg-gray-600'}`} />
                At least 6 characters
              </li>
              <li className={`flex items-center gap-2 ${/[A-Z]/.test(newPassword) ? 'text-green-400' : ''}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(newPassword) ? 'bg-green-400' : 'bg-gray-600'}`} />
                At least one uppercase letter
              </li>
              <li className={`flex items-center gap-2 ${/[0-9]/.test(newPassword) ? 'text-green-400' : ''}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${/[0-9]/.test(newPassword) ? 'bg-green-400' : 'bg-gray-600'}`} />
                At least one number
              </li>
              <li className={`flex items-center gap-2 ${/[^A-Za-z0-9]/.test(newPassword) ? 'text-green-400' : ''}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${/[^A-Za-z0-9]/.test(newPassword) ? 'bg-green-400' : 'bg-gray-600'}`} />
                At least one special character
              </li>
            </ul>
          </div>
        </div>
      </AnimatedSection>
    </div>
  )
}
