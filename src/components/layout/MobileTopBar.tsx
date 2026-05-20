import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  ShoppingBag,
  Sun,
  Moon,
  X,
  ArrowRight,
  TrendingUp,
} from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useTheme } from '@/context/ThemeContext'
import { useStore } from '@/context/StoreContext'

const POPULAR_QUERIES = [
  'Helmet',
  'Gloves',
  'Jacket',
  'LED Light',
  'Riding Boots',
  'Backpack',
]

/**
 * Mobile-only sticky top app bar.
 *
 * Visible on screens below `md` (where the desktop floating
 * navbar capsule is hidden via `max-sm:!hidden`). Provides the
 * primary "always-visible" actions every modern e-commerce mobile
 * UI expects:
 *
 *   - Logo + brand wordmark (taps through to home)
 *   - Theme toggle
 *   - Search button (opens a full-screen search overlay)
 *   - Cart icon with item-count badge
 *
 * Auto-hides while scrolling down and reappears when scrolling up
 * so it never crowds the hero on the home page.
 */
export default function MobileTopBar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { totalQty: cartCount } = useCart()
  const { theme, toggleTheme } = useTheme()
  const { products } = useStore()

  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)

  // Track scroll direction so the bar tucks away while reading,
  // matching the Navbar's behaviour for visual consistency.
  useEffect(() => {
    let lastY = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 8)
      if (y > 80 && y > lastY + 4) setHidden(true)
      else if (y < lastY - 4) setHidden(false)
      lastY = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the overlay automatically on route change so it doesn't
  // stay open after navigating to a result.
  useEffect(() => {
    setSearchOpen(false)
  }, [location.pathname, location.search])

  // Lock background scroll while the overlay is open and focus the
  // input the moment it appears.
  useEffect(() => {
    if (!searchOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const t = window.setTimeout(() => inputRef.current?.focus(), 50)
    return () => {
      document.body.style.overflow = prev
      window.clearTimeout(t)
    }
  }, [searchOpen])

  const submitSearch = (raw: string) => {
    const trimmed = raw.trim()
    if (!trimmed) return
    navigate(`/shop?q=${encodeURIComponent(trimmed)}`)
    setSearchOpen(false)
    setQuery('')
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submitSearch(query)
  }

  // Live preview matches against the product catalogue while
  // typing so the user sees concrete suggestions instead of
  // having to commit to a full search.
  const suggestions =
    query.trim().length > 0
      ? products
          .filter((p) =>
            p.name.toLowerCase().includes(query.trim().toLowerCase()),
          )
          .slice(0, 5)
      : []

  return (
    <>
      <motion.header
        aria-label="Mobile site header"
        initial={{ y: -40, opacity: 0 }}
        animate={{
          y: hidden ? -100 : 0,
          opacity: hidden ? 0 : 1,
        }}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        className={`md:hidden fixed inset-x-0 top-0 z-[55] pt-[max(0.5rem,env(safe-area-inset-top,0.5rem))] px-3 transition-[padding] duration-300 ${
          scrolled ? 'pb-1' : 'pb-2'
        }`}
      >
        <div className="v-mobile-topbar flex items-center gap-2 pl-2 pr-1.5 py-1.5 rounded-2xl">
          <Link
            to="/"
            aria-label="Shokher Bikewala home"
            className="flex items-center gap-2 min-w-0 flex-shrink-0"
          >
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/25 p-1 flex items-center justify-center shadow-[0_0_14px_rgba(255,106,26,0.18)]">
              <img
                src="/logo.png"
                alt=""
                width={36}
                height={36}
                decoding="async"
                fetchPriority="high"
                className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(255,90,0,0.45)]"
              />
            </div>
            <div className="flex flex-col leading-none min-w-0">
              <span className="font-headline text-[12px] font-bold text-fg tracking-wide truncate">
                SHOKHER
              </span>
              <span className="font-headline text-[8.5px] font-bold text-primary tracking-[0.32em] truncate">
                BIKE WALA
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-1 ml-auto">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="v-mobile-topbar-btn"
            >
              {theme === 'dark' ? (
                <Moon className="w-[18px] h-[18px] text-primary" strokeWidth={2.2} />
              ) : (
                <Sun className="w-[18px] h-[18px] text-amber-500" strokeWidth={2.2} />
              )}
            </button>

            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search products"
              className="v-mobile-topbar-btn"
            >
              <Search className="w-[18px] h-[18px]" strokeWidth={2.2} />
            </button>

            <Link
              to="/cart"
              aria-label={`Cart${cartCount > 0 ? ` (${cartCount} items)` : ''}`}
              className="v-mobile-topbar-btn relative"
            >
              <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={2.2} />
              {cartCount > 0 && (
                <span className="v-cart-pill" aria-hidden>
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            key="m-search-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Search products"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="md:hidden fixed inset-0 z-[80] v-mobile-search-overlay"
          >
            <div className="flex flex-col h-full">
              <div className="px-3 pt-[max(0.75rem,env(safe-area-inset-top,0.75rem))] pb-3">
                <form
                  onSubmit={onSubmit}
                  className="v-mobile-search-bar flex items-center gap-2 rounded-2xl pl-3 pr-1.5 py-2"
                >
                  <Search className="w-4 h-4 text-fg-soft flex-shrink-0" strokeWidth={2.2} />
                  <input
                    ref={inputRef}
                    type="search"
                    inputMode="search"
                    autoComplete="off"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search helmets, gloves, jackets..."
                    className="flex-1 bg-transparent text-sm font-ui placeholder:text-fg-soft text-fg outline-none"
                    aria-label="Search input"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => {
                        setQuery('')
                        inputRef.current?.focus()
                      }}
                      aria-label="Clear search"
                      className="w-7 h-7 rounded-full text-fg-soft hover:text-fg flex items-center justify-center"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    aria-label="Close search"
                    className="ml-1 px-3 py-1 text-[12px] font-ui font-semibold uppercase tracking-[0.16em] text-fg-muted hover:text-primary"
                  >
                    Cancel
                  </button>
                </form>
              </div>

              <div className="flex-1 overflow-y-auto px-3 pb-6">
                {suggestions.length > 0 ? (
                  <div>
                    <h3 className="text-[10px] font-ui font-semibold uppercase tracking-[0.18em] text-fg-soft mb-2 px-1">
                      Matching products
                    </h3>
                    <ul className="space-y-2">
                      {suggestions.map((p) => (
                        <li key={p.id}>
                          <Link
                            to={`/shop/${p.slug}`}
                            className="v-mobile-search-result"
                          >
                            <div className="w-12 h-12 rounded-xl bg-bg-2 border border-line/40 overflow-hidden flex-shrink-0">
                              {p.images?.[0] && (
                                <img
                                  src={p.images[0]}
                                  alt=""
                                  loading="lazy"
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-headline text-sm font-semibold text-fg truncate">
                                {p.name}
                              </div>
                              <div className="text-[11px] text-fg-soft">
                                ৳
                                {(
                                  p.discount_price ?? p.price
                                ).toLocaleString()}
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-fg-soft" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      onClick={() => submitSearch(query)}
                      className="mt-4 w-full v-mobile-search-cta"
                    >
                      Show all results for "{query.trim()}"
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-[10px] font-ui font-semibold uppercase tracking-[0.18em] text-fg-soft mb-2 px-1 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5" />
                      Popular searches
                    </h3>
                    <ul className="flex flex-wrap gap-2 px-1">
                      {POPULAR_QUERIES.map((q) => (
                        <li key={q}>
                          <button
                            type="button"
                            onClick={() => submitSearch(q)}
                            className="v-mobile-search-chip"
                          >
                            {q}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
