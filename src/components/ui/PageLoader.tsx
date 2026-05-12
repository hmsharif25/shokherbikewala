import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/context/ThemeContext'

const SESSION_KEY = 'sbw_boot_done'

/**
 * Premium first-paint loader. Renders a clean centered logo with a smooth
 * progress bar; auto-dismisses after a short ramp animation; only renders
 * once per session to avoid jank.
 */
export default function PageLoader() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [done, setDone] = useState(false)
  const [pct, setPct] = useState(0)

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) {
      setDone(true)
      return
    }
    const start = Date.now()
    const target = 760
    const id = setInterval(() => {
      const t = Math.min(1, (Date.now() - start) / target)
      const eased = 1 - Math.pow(1 - t, 3)
      setPct(Math.round(eased * 100))
      if (t >= 1) {
        clearInterval(id)
        sessionStorage.setItem(SESSION_KEY, '1')
        setTimeout(() => setDone(true), 140)
      }
    }, 30)
    return () => clearInterval(id)
  }, [])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
          className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center overflow-hidden ${
            isDark ? 'bg-dark' : 'bg-white'
          }`}
        >
          <div
            className={`absolute inset-0 ${
              isDark
                ? 'bg-[radial-gradient(ellipse_at_center,rgba(255,106,26,0.10),transparent_60%)]'
                : 'bg-[radial-gradient(ellipse_at_center,rgba(255,106,26,0.07),transparent_65%)]'
            }`}
          />

          {isDark && (
            <>
              <div className="boot-bracket boot-bracket-tl" />
              <div className="boot-bracket boot-bracket-tr" />
              <div className="boot-bracket boot-bracket-bl" />
              <div className="boot-bracket boot-bracket-br" />
              <div className="boot-grid absolute inset-0" />
            </>
          )}

          <div className="sb-loader-shell relative flex flex-col items-center gap-6 px-6 max-w-sm w-full">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="relative w-20 h-20 sm:w-24 sm:h-24"
            >
              <motion.div
                aria-hidden
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                className={`absolute inset-0 rounded-full border ${
                  isDark ? 'border-primary/40' : 'border-primary/25'
                }`}
                style={isDark ? { boxShadow: '0 0 20px rgba(255, 106, 26, 0.2)' } : undefined}
              />
              {isDark && (
                <motion.div
                  aria-hidden
                  animate={{ rotate: -360 }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                  className="absolute -inset-1 rounded-full border border-cyan/20"
                  style={{ boxShadow: '0 0 14px rgba(0, 212, 255, 0.1)' }}
                />
              )}
              <div className="absolute inset-2 rounded-full bg-primary/5 flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="Shokher Bikewala"
                  className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
                />
              </div>
            </motion.div>

            <div className="text-center">
              <div
                className={`font-display font-bold text-xl sm:text-2xl tracking-tight ${
                  isDark ? 'text-white' : 'text-fg'
                }`}
              >
                Shokher Bikewala
              </div>
              <div className={`text-xs mt-1 font-racing tracking-[0.2em] uppercase ${isDark ? 'text-cyan/60' : 'text-fg-soft'}`}>
                {isDark ? 'INITIALIZING SYSTEM...' : 'Loading premium ride gear'}
              </div>
            </div>

            <div className="w-full">
              <div
                className={`h-1 rounded-full overflow-hidden ${
                  isDark ? 'bg-white/10' : 'bg-black/10'
                }`}
              >
                <motion.div
                  className="h-full bg-primary"
                  style={{
                    width: `${pct}%`,
                    boxShadow: isDark ? '0 0 12px rgba(255, 106, 26, 0.6)' : undefined,
                  }}
                  transition={{ ease: 'linear' }}
                />
              </div>
              {isDark && (
                <div className="text-right mt-1">
                  <span className="font-racing text-[10px] tracking-[0.25em] text-primary/60">
                    {pct}%
                  </span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
