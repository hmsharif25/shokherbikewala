import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ShoppingBag, Grid3X3, User, MessageCircle, ShieldCheck, Search } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

type NavItem = {
  name: string
  path: string
  icon: typeof Home
  external?: boolean
  primary?: boolean
}

const baseNavItems: NavItem[] = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Shop', path: '/products', icon: ShoppingBag },
  { name: 'Search', path: '/products', icon: Search, primary: true },
  { name: 'Browse', path: '/categories', icon: Grid3X3 },
]

/**
 * Velocity floating mobile dock — pill-shaped glass bar that floats
 * above the safe area with an emphasised primary action in the middle.
 */
export default function MobileBottomNav() {
  const location = useLocation()
  const { user, isAdmin } = useAuth()

  const accountItem: NavItem = isAdmin
    ? { name: 'Admin', path: '/admin', icon: ShieldCheck }
    : { name: user ? 'Account' : 'Sign In', path: '/auth', icon: User }

  const items: NavItem[] = [...baseNavItems, accountItem]

  return (
    <div className="md:hidden">
      <div className="v-mobile-dock">
        <ul className="relative flex items-center justify-around px-2 py-2">
          {items.map((item) => {
            const isActive = location.pathname === item.path && !item.primary
            const Icon = item.icon

            if (item.primary) {
              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    aria-label={item.name}
                    className="relative -mt-7 inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-[#ff7a1f] to-[#ff5a00] text-white shadow-[0_18px_40px_-12px_rgba(255,90,0,0.55)] border-4 border-bg"
                  >
                    <Icon className="w-5 h-5" />
                  </Link>
                </li>
              )
            }

            return (
              <li key={item.name}>
                <Link to={item.path} aria-label={item.name}>
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className="flex flex-col items-center gap-0.5 px-2 py-1.5 relative"
                  >
                    {isActive && (
                      <motion.span
                        layoutId="v-mobile-dot"
                        className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-[#ff7a1f] to-[#ff5a00]"
                        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                      />
                    )}
                    <Icon
                      className={`w-5 h-5 transition-colors ${
                        isActive ? 'text-primary' : 'text-fg-soft'
                      }`}
                    />
                    <span
                      className={`text-[9px] font-ui font-bold tracking-wider uppercase transition-colors ${
                        isActive ? 'text-primary' : 'text-fg-soft'
                      }`}
                    >
                      {item.name}
                    </span>
                  </motion.div>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Floating WhatsApp action above the dock for one-tap chat. */}
      <a
        href="https://wa.me/8801518934708"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed right-4 bottom-[calc(5.5rem+env(safe-area-inset-bottom,0px))] z-[55] w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white flex items-center justify-center shadow-[0_18px_40px_-12px_rgba(34,197,94,0.55)] active:scale-95 transition-transform"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full animate-ping" />
      </a>
    </div>
  )
}
