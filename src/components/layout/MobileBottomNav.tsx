import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ShoppingBag, Grid3X3, User, MessageCircle } from 'lucide-react'

const navItems = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Products', path: '/products', icon: ShoppingBag },
  { name: 'Categories', path: '/categories', icon: Grid3X3 },
  { name: 'About', path: '/about', icon: User },
  { name: 'Chat', path: 'https://wa.me/8801518934708', icon: MessageCircle, external: true },
]

export default function MobileBottomNav() {
  const location = useLocation()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-dark-50/95 backdrop-blur-xl border-t border-white/10" />
      <div className="relative flex items-center justify-around px-2 py-1.5 safe-area-bottom">
        {navItems.map((item) => {
          const isActive = !item.external && location.pathname === item.path
          const isChat = item.external

          if (isChat) {
            return (
              <motion.a
                key={item.name}
                href={item.path}
                target="_blank"
                rel="noopener noreferrer"
                whileTap={{ scale: 0.85 }}
                className="flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-colors"
              >
                <div className="relative p-1.5 rounded-xl bg-green-500/20">
                  <item.icon className="w-5 h-5 text-green-400" />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                </div>
                <span className="text-[10px] font-racing tracking-wide text-green-400">
                  {item.name}
                </span>
              </motion.a>
            )
          }

          return (
            <Link key={item.name} to={item.path}>
              <motion.div
                whileTap={{ scale: 0.85 }}
                className="flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-colors relative"
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-indicator"
                    className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-gradient-to-r from-primary to-gold rounded-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <div className={`p-1.5 rounded-xl transition-colors ${isActive ? 'bg-primary/15' : ''}`}>
                  <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-primary' : 'text-gray-500'}`} />
                </div>
                <span className={`text-[10px] font-racing tracking-wide transition-colors ${isActive ? 'text-primary' : 'text-gray-500'}`}>
                  {item.name}
                </span>
              </motion.div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
