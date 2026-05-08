import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { demoCategories, demoProducts } from '@/data/demo-data'

export default function CategoriesPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-24 pb-16 speed-lines-bg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-4">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Shop by{' '}
            </span>
            <span className="bg-gradient-to-r from-gold to-primary bg-clip-text text-transparent">
              Category
            </span>
          </h1>
          <p className="text-gray-400">Find the perfect accessories for your ride</p>
        </AnimatedSection>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {demoCategories.map((category, i) => {
            const productCount = demoProducts.filter(p => p.category_id === category.id).length
            return (
              <AnimatedSection key={category.id} delay={i * 0.1}>
                <Link to={`/products?category=${category.slug}`}>
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative rounded-2xl overflow-hidden h-40 sm:h-64 cursor-pointer"
                  >
                    <img
                      src={category.image_url}
                      alt={category.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-transparent group-hover:from-primary/80 transition-all duration-500" />

                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                      <h2 className="text-white font-display font-bold text-2xl mb-2">
                        {category.name}
                      </h2>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300 text-sm">{productCount} Products</span>
                        <div className="flex items-center gap-1 text-primary group-hover:text-white transition-colors font-medium">
                          <span className="text-sm">Browse</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>

                    <div className="absolute inset-0 border border-white/0 group-hover:border-primary/30 rounded-2xl transition-all duration-500" />
                  </motion.div>
                </Link>
              </AnimatedSection>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
