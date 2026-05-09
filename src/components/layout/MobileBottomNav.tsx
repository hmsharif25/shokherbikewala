import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Menu,
  X,
  Home,
  ShoppingBag,
  Grid3X3,
  Search,
  User,
  ShieldCheck,
  ShoppingCart,
  Heart,
  MessageCircle,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

/**
 * Velocity mobile floating action button — replaces the multi-icon
 * dock with a single circular FAB that auto-hides on scroll-down,
 * reveals on scroll-up, and stays out of the way by default.
 *
 * Tapping the FAB opens a glass action sheet that hosts the full
 * navigation grid + a primary WhatsApp action.
 */
export default function MobileBottomNav() {
  const location = useLocation()
  const { user, isAdmin } = useAuth()

  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(false)
  const lastY = useRef(0)
  const idleTimer = useRef<number | null>(null)

  // Hide-on-scroll-down + reveal-on-scroll-up. Default hidden until
  // the user scrolls; auto-hide again after a short idle window.
  useEffect(() => {
    const armIdleHide = () => {
      if (idleTimer.current) window.clearTimeout(idleTimer.current)
      idleTimer.current = window.setTimeout(() => setVisible(false), 2400)
    }

    const onScroll = () => {
      const y = window.scrollY
      const delta = y - lastY.current

      if (y < 80) {
        // Near the top of the page: keep clutter to a minimum.
        setVisible(false)
      } else if (delta < -6) {
        // Scrolling up — show.
        setVisible(true)
        armIdleHide()
      } else if (delta > 6) {
        // Scrolling down — hide.
        setVisible(false)
        if (idleTimer.current) window.clearTimeout(idleTimer.current)
      }

      lastY.current = y
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (idleTimer.current) window.clearTimeout(idleTimer.current)
    }
  }, [])

  // Close the sheet on route change so it doesn't linger.
  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  // Lock body scroll while the sheet is open.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  const accountTile = isAdmin
    ? { name: 'Admin', path: '/admin', icon: ShieldCheck }
    : { name: user ? 'Account' : 'Sign In', path: '/auth', icon: User }

  return (
    <div className="md:hidden">
      {/* Floating menu FAB */}
      <button
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((v) => !v)}
        className={`v-fab ${visible || open ? 'show' : ''}`}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="inline-flex"
            >
              <X className="w-6 h-6" />
            </motion.span>
          ) : (
            <motion.span
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="inline-flex"
            >
              <Menu className="w-6 h-6" />
            </motion.span>
          )}
        </AnimatePresence>

      </button>

      {/* Action sheet */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="v-sheet-backdrop md:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.nav
              key="sheet"
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="v-sheet md:hidden"
              aria-label="Mobile navigation"
            >
              <div className="px-4 pt-5 pb-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-headline font-bold tracking-wider uppercase text-fg text-sm">
                    Quick Menu
                  </span>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close"
                    className="w-8 h-8 rounded-full bg-bg-2 flex items-center justify-center text-fg-muted hover:text-primary"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { name: 'Home', path: '/', icon: Home },
                    { name: 'Shop', path: '/products', icon: ShoppingBag },
                    { name: 'Categories', path: '/categories', icon: Grid3X3 },
                    { name: 'Search', path: '/products', icon: Search },
                    { name: 'Wishlist', path: '/products?fav=1', icon: Heart },
                    { name: 'Cart', path: '/checkout', icon: ShoppingCart },
                  ].map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className="v-sheet-tile"
                      onClick={() => setOpen(false)}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="text-[10px] font-ui font-bold uppercase tracking-wider">
                        {item.name}
                      </span>
                    </Link>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2.5 mt-2.5">
                  <Link
                    to={accountTile.path}
                    className="v-sheet-tile"
                    onClick={() => setOpen(false)}
                  >
                    <accountTile.icon className="w-5 h-5" />
                    <span className="text-[10px] font-ui font-bold uppercase tracking-wider">
                      {accountTile.name}
                    </span>
                  </Link>
                  <a
                    href="https://wa.me/8801518934708"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="v-sheet-tile primary"
                    onClick={() => setOpen(false)}
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-[10px] font-ui font-bold uppercase tracking-wider">
                      WhatsApp
                    </span>
                  </a>
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
