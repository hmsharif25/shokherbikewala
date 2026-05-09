import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ChefHat, Hand, Shirt, Lightbulb, Wrench, Smartphone, Compass, Headphones, Anchor } from 'lucide-react'
import VReveal from '@/components/ui/VReveal'
import { useStore } from '@/context/StoreContext'

/**
 * Map a category slug to a Lucide icon. Falls back to Compass.
 * Keeps icon system independent of CMS data.
 */
function iconFor(slug: string) {
  const s = slug.toLowerCase()
  if (s.includes('helmet')) return ChefHat // closest match for "helmet" silhouette
  if (s.includes('glove')) return Hand
  if (s.includes('jacket')) return Shirt
  if (s.includes('light') || s.includes('led')) return Lightbulb
  if (s.includes('exhaust') || s.includes('part')) return Wrench
  if (s.includes('mount') || s.includes('phone')) return Smartphone
  if (s.includes('audio') || s.includes('headphone')) return Headphones
  if (s.includes('anchor') || s.includes('lock')) return Anchor
  return Compass
}

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.92 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: 0.1 * i, duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
}

export default function VCategoriesGrid() {
  const { categories, homeSections } = useStore()
  const visible = categories.slice(0, 5)

  return (
    <section className="sb-clean-section sb-clean-categories relative py-16 sm:py-20 overflow-hidden">
      <div className="absolute inset-0 v-dot-field opacity-30 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <VReveal className="text-center mb-12 sm:mb-16">
          <span className="v-eyebrow-long mb-5 sm:mb-6 mx-auto justify-center">Featured Categories</span>
          <h2 className="v-headline text-3xl sm:text-5xl md:text-6xl mt-3 mb-4">
            {homeSections.categories.heading}
          </h2>
          <p className="text-fg-muted max-w-xl mx-auto font-ui text-base">
            {homeSections.categories.subheading}
          </p>
        </VReveal>

        <div className="sb-simple-grid sb-category-scroll grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {visible.map((cat, i) => {
            const Icon = iconFor(cat.slug)
            return (
              <motion.div
                key={cat.id}
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-50px' }}
                variants={cardVariants}
              >
                <Link
                  to={`/products?category=${cat.slug}`}
                  className="sb-simple-card sb-neon-card sb-card-glow group flex flex-col items-center text-center p-4 sm:p-5 h-full block"
                >
                  {/* Icon chip */}
                  <span className="sb-mini-icon absolute top-3 left-3 z-10">
                    <Icon className="w-4 h-4" />
                  </span>

                  <div className="relative z-[1] aspect-square w-full overflow-hidden mb-3 sm:mb-4">
                    <img
                      src={cat.image_url}
                      alt={cat.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105 drop-shadow-[0_14px_24px_rgba(255,90,0,0.16)]"
                    />
                  </div>

                  <h3 className="relative z-[1] font-headline font-bold text-fg text-sm sm:text-base mb-1 tracking-wide uppercase">
                    {cat.name}
                  </h3>

                  {/* Tagline (synthetic) */}
                  <p className="relative z-[1] text-fg-soft text-xs sm:text-sm leading-snug font-ui mb-3 line-clamp-2">
                    {taglineFor(cat.slug)}
                  </p>

                  <div className="relative z-[1] mt-auto inline-flex items-center gap-1.5 text-primary text-xs font-ui font-bold uppercase tracking-[0.16em] group-hover:gap-2.5 transition-all">
                    Explore
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        <VReveal delay={300} className="text-center mt-12">
          <Link to="/categories" className="v-pill-cta">
            View All Categories
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/25 ml-1">
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </VReveal>
      </div>
    </section>
  )
}

function taglineFor(slug: string) {
  const s = slug.toLowerCase()
  if (s.includes('helmet')) return 'High-performance helmets for ultimate safety and style.'
  if (s.includes('glove')) return 'Engineered for grip, comfort and maximum protection.'
  if (s.includes('jacket')) return 'Stylish, durable jackets built for every ride.'
  if (s.includes('light') || s.includes('led')) return 'High-intensity lights for maximum visibility.'
  if (s.includes('exhaust')) return 'Boost performance with premium exhaust systems.'
  if (s.includes('mount') || s.includes('phone')) return 'Anti-vibration mounts that hold tight at speed.'
  if (s.includes('part')) return 'Premium parts engineered for serious riders.'
  return 'Premium gear engineered for every kind of ride.'
}
