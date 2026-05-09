import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, ArrowRight, Star, Heart } from 'lucide-react'
import VReveal from '@/components/ui/VReveal'
import { useStore } from '@/context/StoreContext'

export default function VFeaturedProducts() {
  const { products, categories, brandSettings } = useStore()

  const filtered = useMemo(() => {
    const pool = [...products.filter((p) => p.featured || p.in_stock)]
      .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    return pool.slice(0, 8)
  }, [products])

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
