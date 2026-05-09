import { useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingCart, ArrowRight, Star, Heart, ChevronLeft, ChevronRight } from 'lucide-react'
import VReveal from '@/components/ui/VReveal'
import { useStore } from '@/context/StoreContext'

export default function VFeaturedProducts() {
  const { products, categories, brandSettings, homeSections } = useStore()
  const scrollRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(() => {
    const pool = [...products.filter((p) => p.featured || p.in_stock)]
      .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    return pool.slice(0, 8)
  }, [products])

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = scrollRef.current.clientWidth * 0.7
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' })
  }

  return (
    <section className="sb-clean-section sb-clean-products relative py-16 sm:py-20 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-0 w-[28rem] h-[28rem] bg-primary/[0.05] rounded-full blur-3xl sb-ambient-orb" />
        <div className="absolute bottom-1/4 left-0 w-[28rem] h-[28rem] bg-primary/[0.04] rounded-full blur-3xl sb-ambient-orb" style={{ animationDelay: '-4s' }} />
      </div>
      <div className="sb-scanline-overlay" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <VReveal className="text-center mb-10 sm:mb-12">
          <span className="v-eyebrow-long mb-5 sm:mb-6 mx-auto justify-center">Premium Selection</span>
          <h2 className="v-headline text-3xl sm:text-5xl md:text-6xl mt-3 mb-4">
            {homeSections.featuredProducts.heading}
          </h2>
          <p className="text-fg-muted max-w-xl mx-auto font-ui text-base">
            {homeSections.featuredProducts.subheading}
          </p>
        </VReveal>

        {/* Carousel navigation buttons */}
        <div className="hidden sm:flex justify-end gap-2 mb-4">
          <button
            onClick={() => scroll('left')}
            className="w-10 h-10 rounded-full border border-line bg-bg/60 text-fg-muted hover:text-primary hover:border-primary/40 hover:shadow-[0_0_14px_rgba(255,106,26,0.3)] flex items-center justify-center transition-all"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-10 h-10 rounded-full border border-line bg-bg/60 text-fg-muted hover:text-primary hover:border-primary/40 hover:shadow-[0_0_14px_rgba(255,106,26,0.3)] flex items-center justify-center transition-all"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
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
                  initial={{ opacity: 0, y: 45, scale: 0.9, rotateY: -6 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1, rotateY: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ type: 'spring', stiffness: 140, damping: 18, delay: i * 0.07 }}
                  whileHover={{ y: -10, scale: 1.03, transition: { type: 'spring', stiffness: 300, damping: 15 } }}
                  className="sb-product-card sb-neon-card flex flex-col flex-shrink-0 w-[70vw] sm:w-[45vw] md:w-[30vw] lg:w-[22vw] snap-start"
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
