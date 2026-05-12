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
  Moon,
  Sun,
  Sparkles,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { useCart } from '@/context/CartContext'

type MoreLink = {
  name: string
  path: string
  icon: typeof Home
  /** Tailwind text colour for the icon when the tile is idle. */
  accent: string
  /** CSS gradient string used as the icon backdrop. */
  gradient: string
}

const MORE_LINKS: MoreLink[] = [
  {
    name: 'Categories',
    path: '/categories',
    icon: Grid3X3,
    accent: 'text-orange-300',
    gradient: 'linear-gradient(135deg, rgba(255,122,31,0.22), rgba(255,90,0,0.06))',
  },
  {
    name: 'Search',
    path: '/products',
    icon: Search,
    accent: 'text-cyan-300',
    gradient: 'linear-gradient(135deg, rgba(34,211,238,0.22), rgba(6,182,212,0.05))',
  },
  {
    name: 'Track',
    path: '/track',
    icon: PackageSearch,
    accent: 'text-sky-300',
    gradient: 'linear-gradient(135deg, rgba(56,189,248,0.22), rgba(2,132,199,0.05))',
  },
  {
    name: 'About',
    path: '/about',
    icon: Info,
    accent: 'text-amber-300',
    gradient: 'linear-gradient(135deg, rgba(251,191,36,0.22), rgba(245,158,11,0.05))',
  },
  {
    name: 'Contact',
    path: '/contact',
    icon: Phone,
    accent: 'text-emerald-300',
    gradient: 'linear-gradient(135deg, rgba(52,211,153,0.22), rgba(16,185,129,0.05))',
  },
]

type TabItem = {
  name: string
  path: string
  icon: typeof Home
}

/**
 * Velocity mobile bottom nav — clean five-tab bar:
 * HOME / SHOP / CART / PROFILE / MORE. The active tab gets an
 * animated orange underline. Cart is promoted to a primary tab so
 * shoppers can always reach checkout in one tap, with a badge
 * showing the current item count.
 *
 * Tapping "More" opens a glass action sheet with all secondary
 * destinations (Categories, Search, Track, About, Contact). The
 * sheet is what replaces the previous burger menu in the top
 * navbar.
 */
export default function MobileBottomNav() {
  const location = useLocation()
  const { user, isAdmin } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { totalQty: cartCount } = useCart()
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
    : { name: 'Profile', path: user ? '/profile' : '/auth', icon: User }

  const tabs: TabItem[] = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Shop', path: '/products', icon: ShoppingBag },
    { name: 'Cart', path: '/cart', icon: ShoppingCart },
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
        className="md:hidden fixed inset-x-0 bottom-0 z-[60] v-tabbar-safari-fix"
        style={{ transform: 'translate3d(0,0,0)' }}
      >
        <div className="mx-3 mb-[max(0.5rem,env(safe-area-inset-bottom,0.5rem))] v-tabbar rounded-[1.7rem]">
        <ul className="grid grid-cols-5 px-1 pt-2 pb-2">
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
                    className="v-mobile-nav-action flex flex-col items-center gap-0.5 relative"
                  >
                    <span className="relative">
                      <Icon
                        className={`w-5 h-5 transition-colors ${
                          active ? 'text-primary' : 'text-fg-soft'
                        }`}
                        strokeWidth={active ? 2.5 : 2}
                      />
                      {item.name === 'Cart' && cartCount > 0 && (
                        <span className="v-cart-pill" aria-hidden>
                          {cartCount > 99 ? '99+' : cartCount}
                        </span>
                      )}
                    </span>
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
              aria-label={`More${cartCount > 0 ? ` (${cartCount} in cart)` : ''}`}
              aria-expanded={moreOpen}
              onClick={() => setMoreOpen((v) => !v)}
              className="relative flex flex-col items-center justify-center gap-1 py-1.5 w-full"
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                animate={{ rotate: moreOpen ? 90 : 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="v-mobile-nav-action flex items-center justify-center relative"
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
        </div>
      </nav>

      {/* "More" action sheet — redesigned premium drawer with a
          gradient header, animated tiles, and a built-in theme
          toggle. Replaces the simple grid that lived here before. */}
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
              initial={{ opacity: 0, y: 30, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="md:hidden v-sheet v-more-sheet"
            >
              {/* Header strip with brand gradient + theme toggle */}
              <div className="v-more-header relative px-4 pt-4 pb-3 overflow-hidden">
                <div className="v-more-header-glow absolute inset-0 pointer-events-none" />
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="v-more-badge">
                      <Sparkles className="w-3.5 h-3.5" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-[10px] font-ui font-semibold uppercase tracking-[0.18em] text-fg-soft">
                        Quick Menu
                      </div>
                      <div className="font-headline font-bold text-fg text-base leading-tight truncate">
                        Shokher Bikewala
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ThemeToggleButton theme={theme} onToggle={toggleTheme} />
                    <button
                      type="button"
                      onClick={() => setMoreOpen(false)}
                      aria-label="Close menu"
                      className="w-9 h-9 rounded-full bg-bg-2/80 border border-line/60 flex items-center justify-center text-fg-muted hover:text-primary hover:border-primary/40 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="px-4 pb-4 pt-1">
                <div className="grid grid-cols-3 gap-2.5">
                  {MORE_LINKS.map((m, i) => (
                    <motion.div
                      key={m.name}
                      initial={{ opacity: 0, y: 12, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        type: 'spring',
                        stiffness: 260,
                        damping: 22,
                        delay: i * 0.04,
                      }}
                    >
                      <Link
                        to={m.path}
                        className="v-more-tile group relative"
                        onClick={() => setMoreOpen(false)}
                      >
                        <span
                          className="v-more-tile-icon relative"
                          style={{ background: m.gradient }}
                        >
                          <m.icon
                            className={`w-5 h-5 ${m.accent} transition-transform duration-200 group-hover:scale-110`}
                            strokeWidth={2.1}
                          />
                        </span>
                        <span className="text-[10.5px] font-ui font-bold uppercase tracking-[0.12em] text-fg">
                          {m.name}
                        </span>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <motion.a
                  href="https://wa.me/8801518934708"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="v-more-cta mt-3"
                  onClick={() => setMoreOpen(false)}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 240,
                    damping: 22,
                    delay: MORE_LINKS.length * 0.04 + 0.05,
                  }}
                >
                  <span className="v-more-cta-icon">
                    <MessageCircle className="w-5 h-5" strokeWidth={2.2} />
                  </span>
                  <span className="flex flex-col items-start leading-tight">
                    <span className="text-[10px] font-ui font-semibold uppercase tracking-[0.18em] text-white/80">
                      Need help?
                    </span>
                    <span className="text-sm font-headline font-bold tracking-wide">
                      Chat on WhatsApp
                    </span>
                  </span>
                  <span className="v-more-cta-pulse" aria-hidden />
                </motion.a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

function ThemeToggleButton({
  theme,
  onToggle,
}: {
  theme: 'light' | 'dark'
  onToggle: () => void
}) {
  const isDark = theme === 'dark'
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className="v-more-theme-toggle"
      data-state={isDark ? 'dark' : 'light'}
    >
      <span className="v-more-theme-track" aria-hidden>
        <Sun className="v-more-theme-sun w-3.5 h-3.5" />
        <Moon className="v-more-theme-moon w-3.5 h-3.5" />
      </span>
      <motion.span
        className="v-more-theme-thumb"
        layout
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      >
        {isDark ? (
          <Moon className="w-3.5 h-3.5 text-primary" strokeWidth={2.4} />
        ) : (
          <Sun className="w-3.5 h-3.5 text-amber-500" strokeWidth={2.4} />
        )}
      </motion.span>
    </button>
  )
}
