import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  ShoppingBag,
  User,
  ShieldCheck,
  Menu,
  X,
  Grid3X3,
  Search,
  ShoppingCart,
  MessageCircle,
  Info,
  Phone,
  PackageSearch,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

type TabItem = {
  name: string
  path: string
  icon: typeof Home
}

/**
 * Velocity mobile bottom nav — clean four-tab bar:
 * HOME / SHOP / PROFILE / MORE. The active tab gets an animated
 * orange underline.
 *
 * Tapping "More" opens a glass action sheet with all secondary
 * destinations (Categories, Search, Cart, About, Contact, Track,
 * WhatsApp). The sheet is what replaces the previous burger menu in
 * the top navbar.
 */
export default function MobileBottomNav() {
  const location = useLocation()
  const { user, isAdmin } = useAuth()
  const [moreOpen, setMoreOpen] = useState(false)

  // Lock body scroll while the More sheet is open.
  useEffect(() => {
    if (!moreOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [moreOpen])

  // Close the sheet on route change so it doesn't linger.
  useEffect(() => {
    setMoreOpen(false)
  }, [location.pathname])

  const profileItem: TabItem = isAdmin
    ? { name: 'Admin', path: '/admin', icon: ShieldCheck }
    : { name: 'Profile', path: user ? '/auth' : '/auth', icon: User }

  const tabs: TabItem[] = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Shop', path: '/products', icon: ShoppingBag },
    profileItem,
  ]

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path.split('?')[0])
  }

  const moreActive = moreOpen

  return (
    <>
      <nav
        aria-label="Mobile navigation"
        className="md:hidden fixed inset-x-0 bottom-0 z-[60] v-tabbar"
      >
        <ul className="grid grid-cols-4 px-1 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom,0.5rem))]">
          {tabs.map((item) => {
            const active = isActive(item.path)
            const Icon = item.icon
            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  aria-current={active ? 'page' : undefined}
                  className="relative flex flex-col items-center justify-center gap-1 py-1.5"
                >
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className="flex flex-col items-center gap-0.5"
                  >
                    <Icon
                      className={`w-5 h-5 transition-colors ${
                        active ? 'text-primary' : 'text-fg-soft'
                      }`}
                      strokeWidth={active ? 2.5 : 2}
                    />
                    <span
                      className={`text-[10px] font-ui font-semibold tracking-wider uppercase transition-colors ${
                        active ? 'text-primary' : 'text-fg-soft'
                      }`}
                    >
                      {item.name}
                    </span>
                  </motion.div>
                  {active && (
                    <motion.span
                      layoutId="v-tab-indicator"
                      className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-7 h-[3px] rounded-full bg-gradient-to-r from-[#ff7a1f] to-[#ff5a00]"
                      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                    />
                  )}
                </Link>
              </li>
            )
          })}
          <li>
            <button
              type="button"
              aria-label="More"
              aria-expanded={moreOpen}
              onClick={() => setMoreOpen((v) => !v)}
              className="relative flex flex-col items-center justify-center gap-1 py-1.5 w-full"
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                animate={{ rotate: moreOpen ? 90 : 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center justify-center"
              >
                {moreOpen ? (
                  <X className="w-5 h-5 text-primary" strokeWidth={2.5} />
                ) : (
                  <Menu
                    className={`w-5 h-5 ${
                      moreActive ? 'text-primary' : 'text-fg-soft'
                    }`}
                  />
                )}
              </motion.div>
              <span
                className={`text-[10px] font-ui font-semibold tracking-wider uppercase ${
                  moreActive ? 'text-primary' : 'text-fg-soft'
                }`}
              >
                More
              </span>
              {moreActive && (
                <motion.span
                  layoutId="v-tab-indicator"
                  className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-7 h-[3px] rounded-full bg-gradient-to-r from-[#ff7a1f] to-[#ff5a00]"
                  transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                />
              )}
            </button>
          </li>
        </ul>
      </nav>

      {/* "More" action sheet — full secondary navigation. Replaces
          both the old wishlist tab and the desktop-only top-bar
          icons (cart / search / categories) on mobile. */}
      <AnimatePresence>
        {moreOpen && (
          <>
            <motion.button
              key="v-more-backdrop"
              aria-label="Close menu"
              onClick={() => setMoreOpen(false)}
              className="md:hidden v-sheet-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.div
              key="v-more-sheet"
              role="dialog"
              aria-label="More menu"
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden v-sheet"
              style={{
                bottom:
                  'calc(4.5rem + env(safe-area-inset-bottom, 0.5rem))',
              }}
            >
              <div className="px-4 pt-4 pb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-headline font-bold tracking-wider uppercase text-fg text-sm">
                    Quick Actions
                  </span>
                  <button
                    type="button"
                    onClick={() => setMoreOpen(false)}
                    aria-label="Close"
                    className="w-8 h-8 rounded-full bg-bg-2 flex items-center justify-center text-fg-muted hover:text-primary"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { name: 'Categories', path: '/categories', icon: Grid3X3 },
                    { name: 'Search', path: '/products', icon: Search },
                    { name: 'Cart', path: '/checkout', icon: ShoppingCart },
                    { name: 'About', path: '/about', icon: Info },
                    { name: 'Contact', path: '/contact', icon: Phone },
                    { name: 'Track', path: '/track', icon: PackageSearch },
                  ].map((m) => (
                    <Link
                      key={m.name}
                      to={m.path}
                      className="v-sheet-tile"
                      onClick={() => setMoreOpen(false)}
                    >
                      <m.icon className="w-5 h-5" />
                      <span className="text-[10px] font-ui font-bold uppercase tracking-wider">
                        {m.name}
                      </span>
                    </Link>
                  ))}
                </div>
                <a
                  href="https://wa.me/8801518934708"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="v-sheet-tile primary mt-2.5 flex-row gap-2"
                  onClick={() => setMoreOpen(false)}
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-[11px] font-ui font-bold uppercase tracking-wider">
                    Chat on WhatsApp
                  </span>
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
