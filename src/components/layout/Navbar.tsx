import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu,
  X,
  ShoppingBag,
  User,
  LogOut,
  ShieldCheck,
  Search,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useStore } from '@/context/StoreContext'
import ThemeToggle from '@/components/ui/ThemeToggle'

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Shop', path: '/products' },
  { name: 'Categories', path: '/categories' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
]

/**
 * Velocity navbar — floating glass capsule with logo, center menu,
 * pill search, profile/cart actions and animated active indicator.
 * Mirrors the reference image design.
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [search, setSearch] = useState('')
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAdmin, signOut } = useAuth()
  const { products } = useStore()

  // Show a small badge on cart matching favourite items in localStorage (best-effort).
  const cartCount = products.filter((p) => p.featured).length // visual placeholder

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMobileOpen(false), [location])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!search.trim()) return
    navigate(`/products?q=${encodeURIComponent(search.trim())}`)
  }

  return (
    <>
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'pt-2' : 'pt-3 sm:pt-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="v-capsule v-live-nav rounded-full pl-3 pr-2 sm:pl-5 sm:pr-3 py-1.5 sm:py-2 flex items-center gap-3 sm:gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20 p-1 flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="Shokher Bike Wala"
                  width={40}
                  height={40}
                  decoding="async"
                  fetchPriority="high"
                  className="w-full h-full object-contain drop-shadow-[0_0_12px_rgba(255,90,0,0.45)]"
                />
              </div>
              <div className="hidden sm:flex flex-col leading-none">
                <span className="font-headline text-[13px] lg:text-sm font-bold text-fg tracking-wide">
                  SHOKHER
                </span>
                <span className="font-headline text-[9px] lg:text-[10px] font-bold text-primary tracking-[0.32em]">
                  BIKE WALA
                </span>
              </div>
            </Link>

            {/* Center menu — desktop only */}
            <div className="hidden lg:flex items-center justify-center flex-1">
              {navLinks.map((link) => {
                const active = location.pathname === link.path
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="relative px-3.5 py-2 text-[12px] font-ui font-bold uppercase tracking-[0.18em]"
                  >
                    <span
                      className={`relative z-10 transition-colors ${
                        active ? 'text-primary' : 'text-fg-muted hover:text-fg'
                      }`}
                    >
                      {link.name}
                    </span>
                    {active && (
                      <motion.span
                        layoutId="v-nav-pill"
                        className="absolute inset-0 rounded-full bg-primary/10 border border-primary/30"
                        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                      />
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Search — md+ */}
            <form
              onSubmit={onSearchSubmit}
              className="hidden md:flex items-center v-nav-search rounded-full px-4 py-1.5 w-56 lg:w-64 transition-all"
            >
              <Search className="w-4 h-4 text-fg-soft mr-2 flex-shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="flex-1 bg-transparent text-sm font-ui placeholder:text-fg-soft text-fg outline-none"
                aria-label="Search"
              />
            </form>

            <div className="flex items-center gap-1.5 sm:gap-2 ml-auto lg:ml-0">
              {/* Theme toggle is the only icon shown on mobile —
                  every other navigation entry has been moved to the
                  bottom nav + "More" sheet. From sm+ the desktop
                  action group reappears. */}
              <ThemeToggle />

              {user ? (
                <Link
                  to={isAdmin ? '/admin' : '/auth'}
                  aria-label="Profile"
                  className="hidden sm:inline-flex v-icon-btn"
                >
                  {isAdmin ? <ShieldCheck className="w-4 h-4 text-primary" /> : <User className="w-4 h-4" />}
                </Link>
              ) : (
                <Link
                  to="/auth"
                  aria-label="Sign in"
                  className="hidden sm:inline-flex v-icon-btn"
                >
                  <User className="w-4 h-4" />
                </Link>
              )}

              <Link
                to="/checkout"
                aria-label="Cart"
                className="hidden sm:inline-flex v-icon-btn relative"
              >
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="v-badge-dot">{cartCount}</span>
                )}
              </Link>

              {user && (
                <button
                  onClick={() => signOut()}
                  aria-label="Sign out"
                  className="hidden lg:inline-flex v-icon-btn hover:text-red-500 hover:border-red-500/30"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}

              {/* Tablet-only burger (sm to lg). Mobile uses the
                  bottom-nav "More" sheet instead. */}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                className="hidden sm:inline-flex lg:hidden v-icon-btn"
              >
                {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile slide-in menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-bg/70 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="absolute right-3 top-3 bottom-3 w-[78vw] max-w-xs v-capsule v-premium-drawer rounded-3xl p-5 pt-16 overflow-hidden"
            >
              <div className="absolute top-4 left-5 right-5 flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20 p-1">
                  <img
                    src="/logo.png"
                    alt="Logo"
                    width={36}
                    height={36}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="font-headline text-xs font-bold text-fg">SHOKHER</span>
                  <span className="font-headline text-[9px] text-primary tracking-[0.32em]">BIKE WALA</span>
                </div>
              </div>

              <form
                onSubmit={onSearchSubmit}
                className="flex items-center bg-bg-2/70 border border-line rounded-full px-4 py-2 mb-5"
              >
                <Search className="w-4 h-4 text-fg-soft mr-2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="flex-1 bg-transparent text-sm font-ui placeholder:text-fg-soft text-fg outline-none"
                  aria-label="Search"
                />
              </form>

              <div className="flex flex-col gap-1">
                {navLinks.map((link, i) => {
                  const active = location.pathname === link.path
                  return (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                    >
                      <Link
                        to={link.path}
                        className={`flex items-center justify-between px-4 py-3 rounded-2xl text-base font-headline tracking-wider uppercase transition-all border ${
                          active
                            ? 'bg-primary/10 text-primary border-primary/30'
                            : 'text-fg-muted hover:text-fg hover:bg-primary/[0.06] border-transparent hover:border-primary/15'
                        }`}
                      >
                        {link.name}
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            active ? 'bg-primary' : 'bg-line'
                          }`}
                        />
                      </Link>
                    </motion.div>
                  )
                })}
              </div>

              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
                <ThemeToggle />
                {user ? (
                  <button
                    onClick={() => signOut()}
                    className="flex items-center gap-1.5 text-xs font-ui font-bold uppercase tracking-wider text-fg-muted hover:text-red-500"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                ) : (
                  <Link
                    to="/auth"
                    className="flex items-center gap-1.5 text-xs font-ui font-bold uppercase tracking-wider text-fg-muted hover:text-primary"
                  >
                    <User className="w-4 h-4" /> Sign In
                  </Link>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
