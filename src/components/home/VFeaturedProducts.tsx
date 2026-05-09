import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, ArrowRight, Star, ChevronDown, Heart } from 'lucide-react'
import VReveal from '@/components/ui/VReveal'
import { useStore } from '@/context/StoreContext'

type SortBy = 'featured' | 'price-asc' | 'price-desc'

export default function VFeaturedProducts() {
  const { products, categories, brandSettings } = useStore()
  const [activeSlug, setActiveSlug] = useState<string>('all')
  const [sortBy, setSortBy] = useState<SortBy>('featured')
  const [sortOpen, setSortOpen] = useState(false)

  // Top 6 categories appear as filter pills
  const visibleCategories = useMemo(() => categories.slice(0, 6), [categories])

  const filtered = useMemo(() => {
    let pool = products.filter((p) => p.featured || p.in_stock)
    if (activeSlug !== 'all') {
      const cat = categories.find((c) => c.slug === activeSlug)
      if (cat) pool = pool.filter((p) => p.category_id === cat.id)
    }
    const priceOf = (p: typeof products[number]) => p.discount_price ?? p.price
    if (sortBy === 'price-asc') pool = [...pool].sort((a, b) => priceOf(a) - priceOf(b))
    else if (sortBy === 'price-desc') pool = [...pool].sort((a, b) => priceOf(b) - priceOf(a))
    else pool = [...pool].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    return pool.slice(0, 8)
  }, [products, categories, activeSlug, sortBy])

  return (
    <section className="sb-clean-section sb-clean-products relative py-16 sm:py-20 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-0 w-[28rem] h-[28rem] bg-primary/[0.05] rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-[28rem] h-[28rem] bg-primary/[0.04] rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <VReveal className="text-center mb-10 sm:mb-12">
          <span className="v-eyebrow-long mb-5 sm:mb-6 mx-auto justify-center">Premium Selection</span>
          <h2 className="v-headline text-3xl sm:text-5xl md:text-6xl mt-3 mb-4">
            FEATURED <em>PRODUCTS</em>
          </h2>
          <p className="text-fg-muted max-w-xl mx-auto font-ui text-base">
            Handpicked high-performance gear for riders who demand the best.
          </p>
        </VReveal>

        {/* Filter pills + sort */}
        <VReveal className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8 sm:mb-10">
          <div className="flex flex-wrap gap-2 sm:gap-3 -mx-1 sm:mx-0 overflow-x-auto pb-1 lg:pb-0 lg:overflow-visible scrollbar-hide">
            <button
              onClick={() => setActiveSlug('all')}
              className={`v-tab ${activeSlug === 'all' ? 'active' : ''}`}
            >
              All Products
            </button>
            {visibleCategories.map((c) => (
              <button
                key={c.slug}
                onClick={() => setActiveSlug(c.slug)}
                className={`v-tab ${activeSlug === c.slug ? 'active' : ''}`}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="relative self-start lg:self-auto">
            <button
              onClick={() => setSortOpen((v) => !v)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-line bg-bg/60 hover:border-primary/40 text-sm font-ui font-medium text-fg-muted hover:text-fg transition-colors"
            >
              Sort by:&nbsp;
              <span className="text-fg font-semibold">
                {sortBy === 'featured' ? 'Featured' : sortBy === 'price-asc' ? 'Price ↑' : 'Price ↓'}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {sortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-44 v-capsule rounded-xl p-1 z-30"
                >
                  {(['featured', 'price-asc', 'price-desc'] as SortBy[]).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setSortBy(opt)
                        setSortOpen(false)
                      }}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-ui transition-colors ${
                        sortBy === opt ? 'bg-primary/10 text-primary' : 'text-fg-muted hover:bg-bg-2 hover:text-fg'
                      }`}
                    >
                      {opt === 'featured' ? 'Featured' : opt === 'price-asc' ? 'Price: Low to High' : 'Price: High to Low'}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </VReveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((product, i) => {
              const cat = categories.find((c) => c.id === product.category_id)
              const price = product.discount_price ?? product.price
              const discountPct = product.discount_price
                ? Math.round(((product.price - product.discount_price) / product.price) * 100)
                : 0
              const rating = 4.5 + ((i * 7) % 5) / 10
              const reviewsCount = 60 + ((i * 13) % 90)
              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.45, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                  className="sb-product-card flex flex-col"
                >
                  <div className="relative aspect-square overflow-hidden rounded-t-[1.45rem]">
                    {discountPct > 0 && (
                      <span className="absolute top-3 left-3 z-10 v-discount-chip text-xs">
                        -{discountPct}%
                      </span>
                    )}
                    <button
                      aria-label={`Add ${product.name} to wishlist`}
                      className="absolute top-3 right-3 z-10 sb-wishlist-btn"
                    >
                      <Heart className="w-4 h-4" />
                    </button>

                    <Link to={`/products/${product.slug}`} className="block w-full h-full">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-contain transition-transform duration-700 hover:scale-110 p-2 sm:p-4 drop-shadow-[0_18px_30px_rgba(255,90,0,0.18)]"
                      />
                    </Link>
                  </div>

                  <div className="p-3 sm:p-4 flex flex-col flex-1">
                    <Link to={`/products/${product.slug}`} className="block mb-1">
                      <h3 className="font-headline font-bold text-fg text-sm sm:text-base leading-tight line-clamp-1 hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-fg-soft text-xs sm:text-sm font-ui line-clamp-1 mb-2 sm:mb-3">
                      {cat?.name ?? 'Premium Gear'}
                    </p>

                    <div className="flex items-center gap-1 mb-2 sm:mb-3">
                      <span className="v-stars">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
                              s <= Math.round(rating) ? 'v-star-fill' : 'v-star-empty'
                            }`}
                          />
                        ))}
                      </span>
                      <span className="text-[10px] sm:text-xs text-fg-soft font-ui">
                        {rating.toFixed(1)} ({reviewsCount})
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2 mb-3 sm:mb-4">
                      <span className="font-headline font-bold text-primary text-lg sm:text-xl">
                        ৳{price.toLocaleString()}
                      </span>
                      {product.discount_price && (
                        <span className="text-fg-soft text-xs sm:text-sm line-through font-ui">
                          ৳{product.price.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <div className="mt-auto flex items-center gap-2">
                      <button
                        aria-label="Quick view cart"
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-bg-2 border border-line text-fg-muted hover:text-primary hover:border-primary/40 flex items-center justify-center transition-colors flex-shrink-0"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                      <a
                        href={`${brandSettings.whatsapp}?text=${encodeURIComponent(`Hi! I'm interested in ${product.name} (৳${price.toLocaleString()})`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center text-xs sm:text-sm font-ui font-bold uppercase tracking-[0.18em] py-2.5 rounded-xl text-white bg-gradient-to-r from-[#ff7a1f] to-[#ff5a00] hover:shadow-[0_12px_28px_-8px_rgba(255,90,0,0.55)] transition-all hover:-translate-y-0.5"
                      >
Add to Cart
                      </a>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        <VReveal delay={300} className="text-center mt-10 sm:mt-14">
          <Link to="/products" className="v-pill-ghost">
            View All Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </VReveal>
      </div>
    </section>
  )
}
