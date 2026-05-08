import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Boot-screen style loader shown on first paint. Auto-dismisses after a
 * short ramp animation; only renders once per session to avoid jank.
 */
export default function PageLoader() {
  const [done, setDone] = useState(false)
  const [pct, setPct] = useState(0)

  useEffect(() => {
    if (sessionStorage.getItem('sbw_boot_done')) {
      setDone(true)
      return
    }
    const start = Date.now()
    const target = 1400
    const id = setInterval(() => {
      const t = Math.min(1, (Date.now() - start) / target)
      // Ease-out for a more "ramping" feel.
      const eased = 1 - Math.pow(1 - t, 3)
      setPct(Math.round(eased * 100))
      if (t >= 1) {
        clearInterval(id)
        sessionStorage.setItem('sbw_boot_done', '1')
        setTimeout(() => setDone(true), 250)
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
          transition={{ duration: 0.45 }}
          className="fixed inset-0 z-[10000] bg-dark flex flex-col items-center justify-center"
        >
          <div className="absolute inset-0 carbon-fiber opacity-40" />
          <div className="absolute inset-0 hud-scanlines opacity-50" />

          <div className="relative flex flex-col items-center gap-6 px-6">
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative w-20 h-20 rounded-2xl speedometer-ring overflow-hidden p-0.5"
            >
              <div className="w-full h-full bg-dark rounded-xl flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="Shokher Bike Wala"
                  className="w-12 h-12 object-contain drop-shadow-[0_0_10px_rgba(255,69,0,0.6)]"
                />
              </div>
            </motion.div>

            <div className="text-center">
              <div className="font-display tracking-[0.4em] text-[10px] text-cyan/80 mb-1">
                SHOKHER BIKE WALA
              </div>
              <div className="font-display font-bold text-2xl bg-gradient-to-r from-primary via-gold to-cyan bg-clip-text text-transparent">
                BOOTING ENGINE
              </div>
            </div>

            <div className="w-64 max-w-[80vw]">
              <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary via-gold to-cyan"
                  style={{ width: `${pct}%` }}
                  transition={{ ease: 'linear' }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between font-racing text-[10px] tracking-widest text-gray-500">
                <span>SYSTEMS ONLINE</span>
                <span className="text-primary">{pct}%</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
