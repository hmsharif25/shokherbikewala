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
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.6, ease: 'easeOut' as const },
  }),
}

export default function VCategoriesGrid() {
  const { categories } = useStore()
  const visible = categories.slice(0, 5)

  return (
    <section className="relative py-20 sm:py-24 overflow-hidden">
      <div className="absolute inset-0 v-dot-field opacity-30 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <VReveal className="text-center mb-12 sm:mb-16">
          <span className="v-eyebrow-long mb-5 sm:mb-6 mx-auto justify-center">Featured Categories</span>
          <h2 className="v-headline text-3xl sm:text-5xl md:text-6xl mt-3 mb-4">
            GEAR UP. <em>RIDE BETTER.</em>
          </h2>
          <p className="text-fg-muted max-w-xl mx-auto font-ui text-base">
            Premium motorcycle accessories engineered for performance, safety
            and style. Choose from our top categories.
          </p>
        </VReveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
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
                  className="v-cat-card v-card-sheen group flex flex-col items-center text-center p-4 sm:p-6 h-full block"
                >
                  {/* Icon chip */}
                  <span className="absolute top-3 left-3 z-10 w-9 h-9 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <Icon className="w-4 h-4" />
                  </span>

                  <div className="relative z-[1] aspect-square w-full overflow-hidden mb-4 sm:mb-5">
                    <img
                      src={cat.image_url}
                      alt={cat.name}
                      loading="lazy"
                      className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110 drop-shadow-[0_15px_30px_rgba(255,90,0,0.25)]"
                    />
                  </div>

                  <h3 className="relative z-[1] font-headline font-bold text-fg text-sm sm:text-lg mb-1 tracking-wide uppercase">
                    {cat.name}
                  </h3>

                  {/* Tagline (synthetic) */}
                  <p className="relative z-[1] text-fg-soft text-xs sm:text-sm leading-snug font-ui mb-3 sm:mb-4 line-clamp-2">
                    {taglineFor(cat.slug)}
                  </p>

                  <div className="relative z-[1] mt-auto inline-flex items-center gap-1.5 text-primary text-xs sm:text-sm font-ui font-bold uppercase tracking-[0.2em] group-hover:gap-3 transition-all">
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
