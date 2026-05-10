import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, ShoppingBag, Star, Tag, X } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import PageTransition from '@/components/ui/PageTransition'
import { useStore } from '@/context/StoreContext'
import { useSearchParams, Link } from 'react-router-dom'

export default function ProductsPage() {
  const { products, categories, brandSettings } = useStore()
  const [searchParams] = useSearchParams()
  const categorySlug = searchParams.get('category')
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    categorySlug ? categories.find(c => c.slug === categorySlug)?.id || null : null
  )
  const [showFilters, setShowFilters] = useState(false)

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      const matchCategory = !selectedCategory || p.category_id === selectedCategory
      return matchSearch && matchCategory
    })
  }, [search, selectedCategory, products])

  return (
    <PageTransition className="v-shop-page min-h-screen pt-4 sm:pt-28 pb-20 md:pb-16 speed-lines-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-display font-bold mb-3 sm:mb-4">
            <span className="bg-gradient-to-r from-slate-950 to-slate-600 bg-clip-text text-transparent">
              Premium{' '}
            </span>
            <span className="bg-gradient-to-r from-primary to-amber-400 bg-clip-text text-transparent">
              Loadouts
            </span>
          </h1>
          <p className="text-fg-muted text-sm sm:text-base font-racing tracking-wide">Browse our complete cinematic collection of premium bike accessories</p>
        </AnimatedSection>

        <AnimatedSection delay={0.1} className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl glass text-fg placeholder:text-fg-soft focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                showFilters ? 'bg-primary text-white' : 'glass text-fg-muted hover:text-primary'
              }`}
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </button>
          </div>
        </AnimatedSection>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8"
          >
            <div className="p-6 rounded-xl glass">
              <h3 className="text-fg font-semibold mb-4">Categories</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    !selectedCategory
                      ? 'bg-primary text-white'
                      : 'bg-bg/70 text-fg-muted hover:text-primary hover:bg-primary/10'
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-primary text-white'
                        : 'bg-bg/70 text-fg-muted hover:text-primary hover:bg-primary/10'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {selectedCategory && (
          <div className="mb-6 flex items-center gap-2">
            <span className="text-fg-muted text-sm">Filtered by:</span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
              {categories.find(c => c.id === selectedCategory)?.name}
              <button onClick={() => setSelectedCategory(null)}>
                <X className="w-3 h-3" />
              </button>
            </span>
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
          {filteredProducts.map((product, i) => {
            const category = categories.find((c) => c.id === product.category_id)
            return (
              <AnimatedSection key={product.id} delay={i * 0.05}>
                <Link to={`/products/${product.slug}`}>
                  <motion.div
                    whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.25 } }}
                    whileTap={{ scale: 0.98 }}
                    className="group v-product-card sb-neon-card flex flex-col h-full"
                  >
                    <div className="relative h-36 sm:h-52 overflow-hidden bg-bg-2">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-contain p-3 group-hover:scale-110 transition-transform duration-700 drop-shadow-[0_18px_30px_rgba(255,90,0,0.18)]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent" />
                      {product.discount_price && (
                        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-primary rounded-full text-[10px] sm:text-xs font-bold text-white flex items-center gap-0.5 sm:gap-1">
                          <Tag className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          {Math.round(((product.price - product.discount_price) / product.price) * 100)}% OFF
                        </div>
                      )}
                      {category && (
                        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 px-1.5 sm:px-2 py-0.5 sm:py-1 glass rounded-full text-[10px] sm:text-xs text-fg-muted hidden sm:block">
                          {category.name}
                        </div>
                      )}
                    </div>

                    <div className="p-2.5 sm:p-4">
                      <div className="flex items-center gap-0.5 mb-1 sm:mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="w-2.5 sm:w-3 h-2.5 sm:h-3 fill-gold text-gold" />
                        ))}
                      </div>
                      <h3 className="text-fg font-bold text-xs sm:text-base mb-0.5 sm:mb-1 group-hover:text-primary transition-colors line-clamp-1 font-racing">
                        {product.name}
                      </h3>
                      <p className="text-fg-muted text-[10px] sm:text-sm mb-2 sm:mb-3 line-clamp-1 sm:line-clamp-2 hidden sm:block">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          {product.discount_price ? (
                            <div className="flex flex-col sm:flex-row sm:items-center gap-0 sm:gap-2">
                              <span className="text-sm sm:text-lg font-display font-bold text-primary">
                                ৳{product.discount_price.toLocaleString()}
                              </span>
                              <span className="text-[10px] sm:text-xs text-fg-soft line-through">
                                ৳{product.price.toLocaleString()}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm sm:text-lg font-display font-bold text-primary">
                              ৳{product.price.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <motion.a
                          href={`${brandSettings.whatsapp}?text=Hi! I'm interested in ${product.name}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 sm:p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
                        >
                          <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </motion.a>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </AnimatedSection>
            )
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No products found</p>
            <button
              onClick={() => { setSearch(''); setSelectedCategory(null) }}
              className="mt-4 text-primary hover:text-primary-400 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </PageTransition>
  )
}
