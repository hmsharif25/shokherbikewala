import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ShoppingBag, ArrowRight, Star, Zap, Flame } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { useStore } from '@/context/StoreContext'

export default function FeaturedProducts() {
  const { products, categories } = useStore()
  const featured = products.filter((p) => p.featured)

  return (
    <section className="relative py-14 sm:py-24">
      {/* Ambient glow background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[28rem] h-[28rem] bg-primary/[0.06] rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-[28rem] h-[28rem] bg-cyan/[0.05] rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Animated divider on top */}
        <div className="divider-glow mb-10 sm:mb-14 rounded-full" />

        <AnimatedSection className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <span className="section-eyebrow cyan mb-3 sm:mb-4">
              <Zap className="w-3 h-3" />
              Hot Deals
              <span className="dot-pulse" />
            </span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-display font-bold mt-3">
              <span className="text-gradient-headline">Featured </span>
              <span className="text-gradient-primary">Products</span>
            </h2>
            <p className="text-fg-muted mt-2 sm:mt-3 text-sm sm:text-base font-racing tracking-wide max-w-xl">
              Handpicked premium gear for every rider — built to perform, styled to impress.
            </p>
          </div>
          <Link
            to="/shop"
            className="self-start sm:self-end inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/[0.08] border border-primary/25 text-primary hover:bg-primary/[0.14] hover:border-primary/40 font-racing tracking-wide group transition-all"
          >
            View All
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </AnimatedSection>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {featured.map((product, i) => {
            const category = categories.find((c) => c.id === product.category_id)
            const discountPct = product.discount_price
              ? Math.round(((product.price - product.discount_price) / product.price) * 100)
              : 0
            return (
              <AnimatedSection
                key={product.id}
                delay={i * 0.08}
                direction={i % 2 === 0 ? 'left' : 'right'}
              >
                <Link to={`/shop/${product.slug}`} className="block">
                  <motion.div
                    whileHover={{ y: -8 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                    className="premium-card racing-card group h-full flex flex-col"
                  >
                    <div className="relative h-40 sm:h-60 overflow-hidden rounded-t-[1.25rem]">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                      {/* Sweep highlight */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />

                      {discountPct > 0 && (
                        <motion.span
                          initial={{ scale: 0, rotate: -8 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: 'spring', stiffness: 250, damping: 15 }}
                          className="discount-ribbon"
                        >
                          <Flame className="w-3 h-3" />
                          {discountPct}% OFF
                        </motion.span>
                      )}

                      {category && (
                        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/55 backdrop-blur-md text-[10px] sm:text-xs text-white/90 font-racing tracking-wider uppercase border border-white/15">
                          {category.name}
                        </div>
                      )}
                    </div>

                    <div className="p-3 sm:p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-0.5 sm:gap-1 mb-1.5 sm:mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="w-2.5 sm:w-3.5 h-2.5 sm:h-3.5 fill-gold text-gold"
                          />
                        ))}
                        <span className="text-[10px] sm:text-xs text-fg-soft ml-1 font-racing">(4.8)</span>
                      </div>

                      <h3 className="text-fg font-bold text-sm sm:text-lg mb-1 sm:mb-2 group-hover:text-primary transition-colors line-clamp-1 font-racing">
                        {product.name}
                      </h3>

                      <p className="text-fg-muted text-xs sm:text-sm mb-2 sm:mb-4 line-clamp-1 sm:line-clamp-2 hidden sm:block">
                        {product.short_description || product.description.slice(0, 80) + '…'}
                      </p>

                      <div className="mt-auto flex items-center justify-between gap-2">
                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-0 sm:gap-2">
                          {product.discount_price ? (
                            <>
                              <span className="price-chip text-sm sm:text-lg">
                                ৳{product.discount_price.toLocaleString()}
                              </span>
                              <span className="text-[10px] sm:text-xs text-fg-soft line-through font-racing">
                                ৳{product.price.toLocaleString()}
                              </span>
                            </>
                          ) : (
                            <span className="price-chip text-sm sm:text-lg">
                              ৳{product.price.toLocaleString()}
                            </span>
                          )}
                        </div>

                        <motion.a
                          href={`https://wa.me/8801518934708?text=Hi! I'm interested in ${product.name} (৳${(product.discount_price || product.price).toLocaleString()})`}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.08, rotate: -4 }}
                          whileTap={{ scale: 0.92 }}
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-primary to-primary-600 text-white shadow-[0_8px_20px_-8px_rgba(255,106,26,0.6)] hover:shadow-[0_12px_28px_-8px_rgba(255,106,26,0.8)] transition-shadow"
                          aria-label="Order on WhatsApp"
                        >
                          <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                        </motion.a>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </AnimatedSection>
            )
          })}
        </div>
      </div>
    </section>
  )
}
