import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, ShoppingBag, Star, Tag, X } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { demoProducts, demoCategories } from '@/data/demo-data'
import { useSearchParams } from 'react-router-dom'

export default function ProductsPage() {
  const [searchParams] = useSearchParams()
  const categorySlug = searchParams.get('category')
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    categorySlug ? demoCategories.find(c => c.slug === categorySlug)?.id || null : null
  )
  const [showFilters, setShowFilters] = useState(false)

  const filteredProducts = useMemo(() => {
    return demoProducts.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      const matchCategory = !selectedCategory || p.category_id === selectedCategory
      return matchSearch && matchCategory
    })
  }, [search, selectedCategory])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-24 pb-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-4">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              All{' '}
            </span>
            <span className="bg-gradient-to-r from-primary to-cyan bg-clip-text text-transparent">
              Products
            </span>
          </h1>
          <p className="text-gray-400">Browse our complete collection of premium bike accessories</p>
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
                className="w-full pl-12 pr-4 py-3 rounded-xl glass text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                showFilters ? 'bg-primary text-white' : 'glass text-gray-300 hover:text-white'
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
              <h3 className="text-white font-semibold mb-4">Categories</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    !selectedCategory
                      ? 'bg-primary text-white'
                      : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  All
                </button>
                {demoCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-primary text-white'
                        : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
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
            <span className="text-gray-400 text-sm">Filtered by:</span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
              {demoCategories.find(c => c.id === selectedCategory)?.name}
              <button onClick={() => setSelectedCategory(null)}>
                <X className="w-3 h-3" />
              </button>
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, i) => {
            const category = demoCategories.find((c) => c.id === product.category_id)
            return (
              <AnimatedSection key={product.id} delay={i * 0.05}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="group rounded-2xl overflow-hidden glass hover:shadow-xl hover:shadow-primary/10 transition-all duration-500"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-50 via-transparent to-transparent" />
                    {product.discount_price && (
                      <div className="absolute top-3 left-3 px-2 py-1 bg-primary rounded-full text-xs font-bold text-white flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {Math.round(((product.price - product.discount_price) / product.price) * 100)}% OFF
                      </div>
                    )}
                    {category && (
                      <div className="absolute top-3 right-3 px-2 py-1 glass rounded-full text-xs text-gray-300">
                        {category.name}
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-3 h-3 fill-gold text-gold" />
                      ))}
                    </div>
                    <h3 className="text-white font-bold mb-1 group-hover:text-primary transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        {product.discount_price ? (
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-display font-bold text-primary">
                              ৳{product.discount_price.toLocaleString()}
                            </span>
                            <span className="text-xs text-gray-500 line-through">
                              ৳{product.price.toLocaleString()}
                            </span>
                          </div>
                        ) : (
                          <span className="text-lg font-display font-bold text-primary">
                            ৳{product.price.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <motion.a
                        href={`https://wa.me/8801518934708?text=Hi! I'm interested in ${product.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </motion.a>
                    </div>
                  </div>
                </motion.div>
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
    </motion.div>
  )
}
