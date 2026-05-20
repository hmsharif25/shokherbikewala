import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Grid3X3 } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { useStore } from '@/context/StoreContext'

export default function CategoriesSection() {
  const { categories: demoCategories } = useStore()
  return (
    <section className="relative py-14 sm:py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-bg via-bg-2 to-bg" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="divider-glow mb-10 sm:mb-14 rounded-full" />

        <AnimatedSection className="text-center mb-10 sm:mb-16">
          <span className="section-eyebrow gold mb-3 sm:mb-4">
            <Grid3X3 className="w-3 h-3" />
            Browse By Type
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-display font-bold mt-3 mb-3 sm:mb-4">
            <span className="text-gradient-headline">Shop by </span>
            <span className="text-gradient-primary">Category</span>
          </h2>
          <p className="text-fg-muted max-w-xl mx-auto font-racing tracking-wide">
            Find the perfect accessories for your ride
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5 lg:gap-6">
          {demoCategories.map((category, i) => (
            <AnimatedSection key={category.id} delay={i * 0.08}>
              <Link to={`/shop?category=${category.slug}`}>
                <motion.div
                  whileHover={{ y: -6 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                  className="tile-premium group relative h-40 sm:h-56 md:h-64"
                >
                  <img
                    src={category.image_url}
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="tile-overlay absolute inset-0" />

                  {/* HUD corner brackets */}
                  <span className="hud-corner absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="hud-corner absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="hud-corner absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="hud-corner absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6">
                    <span className="text-[10px] sm:text-xs text-white/70 font-racing tracking-[0.25em] uppercase mb-1">
                      Category
                    </span>
                    <h3 className="text-white font-display font-bold text-base sm:text-xl md:text-2xl mb-1 text-glow drop-shadow-md">
                      {category.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-sm text-white/85 group-hover:text-white transition-colors font-racing tracking-wide">
                      <span>Explore</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
