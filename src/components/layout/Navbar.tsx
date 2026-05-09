import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ShoppingBag, Zap, User, LogOut, ShieldCheck } from 'lucide-react'
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
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
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
            ? 'glass-dark shadow-lg shadow-primary/10'
            : 'bg-gradient-to-b from-dark/90 to-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link to="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="flex items-center gap-2.5"
              >
                <div className="relative w-9 h-9 lg:w-11 lg:h-11 flex-shrink-0">
                  <img
                    src="/logo.png"
                    alt="Shokher Bike Wala"
                    className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(255,69,0,0.4)] brightness-110"
                  />
                </div>
                <div className="hidden sm:flex flex-col leading-none">
                  <span className="font-display text-sm lg:text-base font-bold bg-gradient-to-r from-primary via-primary-300 to-gold bg-clip-text text-transparent tracking-wide">
                    SHOKHER
                  </span>
                  <span className="font-display text-[10px] lg:text-xs font-semibold text-cyan/80 tracking-[0.2em]">
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
                        : 'text-gray-300 group-hover:text-white'
                    }`}
                  >
                    {link.name}
                  </span>
                  {location.pathname === link.path && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-primary via-gold to-cyan rounded-full shadow-[0_0_10px_rgba(255,69,0,0.6)]"
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
                className="relative p-2.5 text-gray-300 hover:text-primary transition-all duration-300 hover:bg-primary/10 rounded-lg group"
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-primary/20" />
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
                  <span className="text-xs text-gray-400 font-racing max-w-[150px] truncate">{user.name || user.email}</span>
                  <button
                    onClick={() => signOut()}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-white/5"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="hidden md:flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-300 hover:text-primary transition-colors font-racing tracking-wide"
                >
                  <User className="w-4 h-4" />
                  Sign In
                </Link>
              )}

              <ThemeToggle className="sm:hidden" size="sm" />

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                className="md:hidden p-2 text-gray-300 hover:text-primary transition-colors rounded-lg hover:bg-white/5"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {scrolled && (
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
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
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-[75vw] max-w-xs bg-dark-50/95 backdrop-blur-xl border-l border-primary/10 p-6 pt-20"
            >
              <div className="absolute top-6 left-6 right-6 flex items-center gap-3">
                <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
                <span className="font-display text-sm font-bold text-primary">SHOKHER BIKE WALA</span>
              </div>

              <div className="flex flex-col gap-1.5 mt-4">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <Link
                      to={link.path}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-racing tracking-wide font-medium transition-all ${
                        location.pathname === link.path
                          ? 'bg-primary/10 text-primary border border-primary/20'
                          : 'text-gray-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {location.pathname === link.path && (
                        <Zap className="w-4 h-4 text-primary" />
                      )}
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="absolute bottom-8 left-6 right-6">
                <div className="h-px bg-gradient-to-r from-primary/30 via-cyan/20 to-transparent mb-4" />
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
                      <span className="text-gray-400 text-xs font-racing truncate">{user.name || user.email}</span>
                      <button
                        onClick={() => signOut()}
                        className="text-xs text-red-400 hover:text-red-300 font-racing flex items-center gap-1"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link
                    to="/auth"
                    className="block w-full py-2.5 text-center rounded-xl bg-primary/10 text-primary text-sm font-racing border border-primary/20"
                  >
                    Sign In
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
