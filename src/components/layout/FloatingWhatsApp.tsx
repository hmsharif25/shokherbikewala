import { AnimatePresence, motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useStore } from '@/context/StoreContext'

/**
 * Floating WhatsApp button visible on every public page.
 *
 * Visibility rules requested by the user:
 *   - Always visible on desktop and mobile.
 *   - On the home page (`/`), hidden while the hero section is in
 *     view; appears once the user has scrolled past the hero.
 *   - On every other public page, always visible.
 *   - Never rendered on the admin panel — handled by the parent
 *     layout (`PublicLayout` only) so this component doesn't need
 *     its own admin check.
 *
 * The button sits above the mobile bottom-nav on small screens and
 * in the corner on larger screens.
 */
export default function FloatingWhatsApp() {
  const { brandSettings } = useStore()
  const location = useLocation()
  const isHome = location.pathname === '/'
  const [pastHero, setPastHero] = useState(!isHome)

  useEffect(() => {
    if (!isHome) {
      setPastHero(true)
      return
    }
    setPastHero(false)
    const onScroll = () => {
      // Use a fraction of the small viewport height so the button
      // appears just before the user fully exits the hero, but
      // doesn't pop in too early on very tall screens.
      const threshold = window.innerHeight * 0.7
      setPastHero(window.scrollY > threshold)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])

  const visible = !isHome || pastHero

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          key="floating-whatsapp"
          href={brandSettings.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="fixed right-4 sm:right-6 z-[55] bottom-[calc(5.25rem+env(safe-area-inset-bottom,0.5rem))] md:bottom-6"
          initial={{ scale: 0, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.6, opacity: 0, y: 12 }}
          transition={{ type: 'spring', stiffness: 220, damping: 18 }}
          whileHover={{ scale: 1.08, y: -2 }}
          whileTap={{ scale: 0.94 }}
        >
          {/* Pulsing glow ring */}
          <motion.div
            className="absolute inset-[-6px] rounded-2xl pointer-events-none"
            animate={{
              boxShadow: [
                '0 0 12px rgba(34,197,94,0.18), 0 0 24px rgba(34,197,94,0.10)',
                '0 0 22px rgba(34,197,94,0.32), 0 0 44px rgba(34,197,94,0.16)',
                '0 0 12px rgba(34,197,94,0.18), 0 0 24px rgba(34,197,94,0.10)',
              ],
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Outer pulse ring */}
          <motion.div
            className="absolute inset-0 rounded-2xl border border-green-500/35 pointer-events-none"
            animate={{ scale: [1, 1.18, 1.18], opacity: [0.55, 0, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />

          {/* Main button */}
          <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-bg/85 backdrop-blur-xl border border-green-500/25 shadow-lg overflow-hidden">
            {/* Background gradient */}
            <div
              className="absolute inset-0 opacity-40"
              style={{
                background:
                  'radial-gradient(circle at center, rgba(34,197,94,0.35), transparent 70%)',
              }}
            />

            {/* WhatsApp icon */}
            <MessageCircle className="relative w-6 h-6 text-green-500" strokeWidth={2.2} />

            {/* Online dot */}
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-bg shadow-[0_0_6px_rgba(34,197,94,0.6)]" />
          </div>
        </motion.a>
      )}
    </AnimatePresence>
  )
}
