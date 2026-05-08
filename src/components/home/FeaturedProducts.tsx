import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ShoppingBag, ArrowRight, Star, Tag, Zap } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { demoProducts, demoCategories } from '@/data/demo-data'

export default function FeaturedProducts() {
  const featured = demoProducts.filter((p) => p.featured)

  return (
    <section className="relative py-14 sm:py-24">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-cyan/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Racing stripe divider top */}
        <div className="racing-stripe-divider mb-10 sm:mb-14 rounded-full" />

        <AnimatedSection className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-14 gap-4">
          <div>
            <motion.span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-cyan/10 text-cyan text-xs sm:text-sm font-racing tracking-widest mb-4 border border-cyan/20 uppercase">
              <Zap className="w-3 h-3" />
              Hot Deals
            </motion.span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-display font-bold">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Featured{' '}
              </span>
              <span className="bg-gradient-to-r from-cyan to-primary bg-clip-text text-transparent">
                Products
              </span>
            </h2>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-400 font-semibold group transition-colors"
          >
            View All
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </AnimatedSection>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {featured.map((product, i) => {
            const category = demoCategories.find((c) => c.id === product.category_id)
            return (
              <AnimatedSection
                key={product.id}
                delay={i * 0.1}
                direction={i % 2 === 0 ? 'left' : 'right'}
              >
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative rounded-2xl overflow-hidden glass racing-card hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 border border-white/5 hover:border-primary/20"
                >
                  <div className="relative h-40 sm:h-60 overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-50 via-transparent to-transparent" />

                    {product.discount_price && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-3 left-3 px-3 py-1 bg-primary rounded-full text-xs font-bold text-white flex items-center gap-1"
                      >
                        <Tag className="w-3 h-3" />
                        {Math.round(((product.price - product.discount_price) / product.price) * 100)}% OFF
                      </motion.div>
                    )}

                    {category && (
                      <div className="absolute top-3 right-3 px-3 py-1 glass rounded-full text-xs text-gray-300">
                        {category.name}
                      </div>
                    )}
                  </div>

                  <div className="p-3 sm:p-5">
                    <div className="flex items-center gap-0.5 sm:gap-1 mb-1 sm:mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="w-2.5 sm:w-3.5 h-2.5 sm:h-3.5 fill-gold text-gold"
                        />
                      ))}
                      <span className="text-[10px] sm:text-xs text-gray-500 ml-1">(4.8)</span>
                    </div>

                    <h3 className="text-white font-bold text-sm sm:text-lg mb-1 sm:mb-2 group-hover:text-primary transition-colors line-clamp-1 font-racing">
                      {product.name}
                    </h3>

                    <p className="text-gray-400 text-xs sm:text-sm mb-2 sm:mb-4 line-clamp-1 sm:line-clamp-2 hidden sm:block">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-0 sm:gap-2">
                        {product.discount_price ? (
                          <>
                            <span className="text-sm sm:text-xl font-display font-bold text-primary">
                              ৳{product.discount_price.toLocaleString()}
                            </span>
                            <span className="text-[10px] sm:text-sm text-gray-500 line-through">
                              ৳{product.price.toLocaleString()}
                            </span>
                          </>
                        ) : (
                          <span className="text-sm sm:text-xl font-display font-bold text-primary">
                            ৳{product.price.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <motion.a
                        href={`https://wa.me/8801518934708?text=Hi! I'm interested in ${product.name} (৳${(product.discount_price || product.price).toLocaleString()})`}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
                      >
                        <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                      </motion.a>
                    </div>
                  </div>
                </motion.div>
              </AnimatedSection>
            )
          })}
        </div>
      </div>
    </section>
  )
}
