import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ShoppingBag, Zap, User, LogOut, ShieldCheck, Sparkles } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import ThemeToggle from '@/components/ui/ThemeToggle'

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Products', path: '/products' },
  { name: 'Categories', path: '/categories' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { user, isAdmin, signOut } = useAuth()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'glass-dark shadow-lg shadow-primary/10 border-b border-line'
            : 'bg-gradient-to-b from-bg/80 via-bg/20 to-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 lg:h-20">
            <Link to="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="flex items-center gap-2.5"
              >
                <div className="relative w-9 h-9 lg:w-11 lg:h-11 flex-shrink-0 rounded-lg bg-gradient-to-br from-primary/15 to-cyan/10 p-1.5 border border-primary/20">
                  <img
                    src="/logo.png"
                    alt="Shokher Bike Wala"
                    className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(255,106,26,0.45)]"
                  />
                </div>
                <div className="hidden sm:flex flex-col leading-none">
                  <span className="font-display text-sm lg:text-base font-bold text-gradient-fire tracking-wide">
                    SHOKHER
                  </span>
                  <span className="font-display text-[10px] lg:text-xs font-semibold text-cyan/85 tracking-[0.22em]">
                    BIKE WALA
                  </span>
                </div>
              </motion.div>
            </Link>

            <div className="hidden md:flex items-center gap-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative px-4 py-2 text-sm font-medium group"
                >
                  <span
                    className={`relative z-10 transition-colors duration-300 font-racing tracking-wide ${
                      location.pathname === link.path
                        ? 'text-primary'
                        : 'text-fg-muted group-hover:text-fg'
                    }`}
                  >
                    {link.name}
                  </span>
                  {location.pathname === link.path && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-0.5 left-2 right-2 h-0.5 bg-gradient-to-r from-primary via-gold to-cyan rounded-full shadow-[0_0_10px_rgba(255,106,26,0.6)]"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <ThemeToggle className="hidden sm:inline-flex" />

              <Link
                to="/products"
                className="relative p-2.5 text-fg-muted hover:text-primary transition-all duration-300 hover:bg-primary/10 rounded-lg group"
                aria-label="Browse products"
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-primary/30" />
              </Link>

              {user ? (
                <div className="hidden md:flex items-center gap-2">
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-primary/15 to-gold/10 border border-primary/30 text-primary text-xs font-racing tracking-wide hover:from-primary/25 hover:to-gold/20 transition-all"
                      title="Admin panel"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Admin
                    </Link>
                  )}
                  <span className="text-xs text-fg-soft font-racing max-w-[150px] truncate">{user.name || user.email}</span>
                  <button
                    onClick={() => signOut()}
                    className="p-2 text-fg-soft hover:text-red-500 transition-colors rounded-lg hover:bg-red-500/10"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-fg-muted hover:text-primary transition-colors font-racing tracking-wide"
                >
                  <User className="w-4 h-4" />
                  Sign In
                </Link>
              )}

              <ThemeToggle className="sm:hidden" size="sm" />

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                className="md:hidden p-2 text-fg-muted hover:text-primary transition-colors rounded-lg hover:bg-primary/10 border border-transparent hover:border-primary/20"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {scrolled && (
          <div className="absolute bottom-0 left-0 right-0 divider-glow" />
        )}
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 md:hidden"
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
              className="absolute right-0 top-0 bottom-0 w-[80vw] max-w-xs bg-bg-2/96 backdrop-blur-2xl border-l border-primary/15 p-6 pt-20 shadow-[-12px_0_44px_-14px_rgba(255,106,26,0.32)] overflow-hidden"
            >
              <div className="absolute inset-0 premium-mesh-bg opacity-25 pointer-events-none" />

              <div className="absolute top-5 left-5 right-5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/15 to-cyan/10 p-1 border border-primary/20">
                  <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="font-display text-sm font-bold text-gradient-fire">SHOKHER BIKE WALA</span>
                  <span className="font-racing text-[10px] text-fg-soft tracking-[0.2em] uppercase">Premium Gear</span>
                </div>
              </div>

              <div className="relative flex flex-col gap-1.5 mt-2">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Link
                      to={link.path}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-racing tracking-wide font-medium transition-all border ${
                        location.pathname === link.path
                          ? 'bg-gradient-to-r from-primary/20 to-primary/5 text-primary border-primary/30 shadow-[0_8px_18px_-8px_rgba(255,106,26,0.35)]'
                          : 'text-fg-muted hover:text-fg hover:bg-primary/[0.06] border-transparent hover:border-primary/15'
                      }`}
                    >
                      {location.pathname === link.path ? (
                        <Zap className="w-4 h-4 text-primary fill-primary/30" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-fg-soft/40" />
                      )}
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="absolute bottom-8 left-6 right-6">
                <div className="divider-glow mb-4" />
                {user ? (
                  <div className="space-y-3">
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary/15 to-gold/10 border border-primary/30 text-primary text-sm font-racing tracking-wide"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Admin Panel
                      </Link>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-fg-soft text-xs font-racing truncate">{user.name || user.email}</span>
                      <button
                        onClick={() => signOut()}
                        className="text-xs text-red-500 hover:text-red-400 font-racing flex items-center gap-1"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link to="/auth" className="block">
                    <span className="btn-premium w-full text-sm">
                      <Sparkles className="w-4 h-4" />
                      Sign In
                    </span>
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
