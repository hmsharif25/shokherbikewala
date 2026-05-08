import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const BOOT_MESSAGES = [
  'BOOT // BIOS v3.7.1',
  'LOAD // ENGINE.MOD',
  'CALIBRATE // GYRO',
  'SYNC // TELEMETRY',
  'IGNITION // READY',
]

const SESSION_KEY = 'sbw_boot_done'

/**
 * Boot-screen style loader shown on first paint. Auto-dismisses after a
 * short ramp animation; only renders once per session to avoid jank.
 */
export default function PageLoader() {
  const [done, setDone] = useState(false)
  const [pct, setPct] = useState(0)
  const [msgIndex, setMsgIndex] = useState(0)

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) {
      setDone(true)
      return
    }
    const start = Date.now()
    const target = 2200
    const id = setInterval(() => {
      const t = Math.min(1, (Date.now() - start) / target)
      const eased = 1 - Math.pow(1 - t, 3)
      const next = Math.round(eased * 100)
      setPct(next)
      setMsgIndex(Math.min(BOOT_MESSAGES.length - 1, Math.floor(eased * BOOT_MESSAGES.length)))
      if (t >= 1) {
        clearInterval(id)
        sessionStorage.setItem(SESSION_KEY, '1')
        setTimeout(() => setDone(true), 350)
      }
    }, 30)
    return () => clearInterval(id)
  }, [])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-[10000] bg-dark flex flex-col items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-0 carbon-fiber opacity-50" />
          <div className="absolute inset-0 hud-scanlines opacity-60" />
          <div className="absolute inset-0 boot-grid" />

          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: '100%' }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
            className="absolute left-0 right-0 h-40 bg-gradient-to-b from-transparent via-cyan/15 to-transparent pointer-events-none"
          />

          <div className="boot-bracket boot-bracket-tl" />
          <div className="boot-bracket boot-bracket-tr" />
          <div className="boot-bracket boot-bracket-bl" />
          <div className="boot-bracket boot-bracket-br" />

          <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-1.5 rounded-full border border-white/10 bg-black/40 font-racing text-[10px] tracking-[0.3em] text-cyan/80">
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(255,69,0,0.9)]"
            />
            SHOKHER//KERNEL
            <span className="text-gray-600">v3.7.1</span>
          </div>

          <div className="absolute bottom-6 left-6 hidden sm:flex flex-col gap-0.5 font-racing text-[9px] tracking-[0.2em] text-gray-500">
            <span>NODE-A: <span className="text-cyan">OK</span></span>
            <span>NODE-B: <span className="text-cyan">OK</span></span>
            <span>NODE-C: <span className="text-gold">SYNC</span></span>
          </div>
          <div className="absolute bottom-6 right-6 hidden sm:flex flex-col items-end gap-0.5 font-racing text-[9px] tracking-[0.2em] text-gray-500">
            <span>LAT <span className="text-cyan">23.81</span></span>
            <span>LNG <span className="text-cyan">90.41</span></span>
            <span>NET <span className="text-primary">SECURE</span></span>
          </div>

          <div className="relative flex flex-col items-center gap-6 px-6 max-w-md w-full">
            <div className="relative">
              <motion.div
                aria-hidden
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 -m-3 rounded-full border border-dashed border-cyan/30"
              />
              <motion.div
                aria-hidden
                animate={{ rotate: -360 }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 -m-6 rounded-full border border-dashed border-primary/20"
              />
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative w-24 h-24 rounded-2xl speedometer-ring overflow-hidden p-0.5"
              >
                <div className="w-full h-full bg-dark rounded-xl flex items-center justify-center relative">
                  <img
                    src="/logo.png"
                    alt="Shokher Bike Wala"
                    className="w-14 h-14 object-contain drop-shadow-[0_0_12px_rgba(255,69,0,0.7)]"
                  />
                </div>
              </motion.div>
            </div>

            <div className="text-center">
              <div className="font-display tracking-[0.5em] text-[10px] text-cyan/80 mb-2">
                SHOKHER BIKE WALA
              </div>
              <motion.div
                className="font-display font-bold text-2xl sm:text-3xl bg-gradient-to-r from-primary via-gold to-cyan bg-clip-text text-transparent"
                animate={{
                  textShadow: [
                    '0 0 0px rgba(255,69,0,0)',
                    '0 0 18px rgba(255,69,0,0.45)',
                    '0 0 0px rgba(255,69,0,0)',
                  ],
                }}
                transition={{ duration: 1.6, repeat: Infinity }}
              >
                BOOTING ENGINE
              </motion.div>
            </div>

            <div className="w-full">
              <div className="h-1 rounded-full bg-white/5 overflow-hidden relative">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary via-gold to-cyan"
                  style={{ width: `${pct}%` }}
                  transition={{ ease: 'linear' }}
                />
                <motion.div
                  aria-hidden
                  className="absolute inset-y-0 w-12 bg-gradient-to-r from-transparent via-white/40 to-transparent mix-blend-overlay"
                  animate={{ x: ['-50%', '500%'] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between font-racing text-[10px] tracking-widest text-gray-500">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={msgIndex}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.18 }}
                    className="text-cyan/80"
                  >
                    {BOOT_MESSAGES[msgIndex]}
                  </motion.span>
                </AnimatePresence>
                <span className="text-primary font-bold">{String(pct).padStart(3, '0')}%</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
