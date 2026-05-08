import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { demoCategories } from '@/data/demo-data'

export default function CategoriesSection() {
  return (
    <section className="relative py-14 sm:py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-dark via-surface/30 to-dark" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="racing-stripe-divider mb-10 sm:mb-14 rounded-full" />

        <AnimatedSection className="text-center mb-10 sm:mb-16">
          <motion.span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gold/10 text-gold text-xs sm:text-sm font-racing tracking-widest mb-4 border border-gold/20 uppercase">
            Browse By Type
          </motion.span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-display font-bold mb-4">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Shop by{' '}
            </span>
            <span className="bg-gradient-to-r from-gold to-primary bg-clip-text text-transparent">
              Category
            </span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Find the perfect accessories for your ride
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5 lg:gap-6">
          {demoCategories.map((category, i) => (
            <AnimatedSection key={category.id} delay={i * 0.08}>
              <Link to={`/products?category=${category.slug}`}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative group rounded-2xl overflow-hidden cursor-pointer h-40 sm:h-52 md:h-60 racing-card border border-white/5 hover:border-primary/20"
                >
                  <img
                    src={category.image_url}
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-transparent group-hover:from-primary/80 group-hover:via-dark/40 transition-all duration-500" />

                  <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6">
                    <motion.h3
                      className="text-white font-display font-bold text-sm sm:text-lg md:text-xl mb-1 text-glow"
                    >
                      {category.name}
                    </motion.h3>
                    <div className="flex items-center gap-1 text-sm text-gray-300 group-hover:text-white transition-colors">
                      <span>Explore</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  <div className="absolute inset-0 border border-white/5 group-hover:border-primary/40 rounded-2xl transition-all duration-500" />
                </motion.div>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
