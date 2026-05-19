import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ChevronLeft, ChevronRight, ChefHat, Hand, Shirt, Lightbulb, Wrench, Smartphone, Compass, Headphones, Anchor } from 'lucide-react'
import VReveal from '@/components/ui/VReveal'
import { useStore } from '@/context/StoreContext'

function iconFor(slug: string) {
  const s = slug.toLowerCase()
  if (s.includes('helmet')) return ChefHat
  if (s.includes('glove')) return Hand
  if (s.includes('jacket')) return Shirt
  if (s.includes('light') || s.includes('led')) return Lightbulb
  if (s.includes('exhaust') || s.includes('part')) return Wrench
  if (s.includes('mount') || s.includes('phone')) return Smartphone
  if (s.includes('audio') || s.includes('headphone')) return Headphones
  if (s.includes('anchor') || s.includes('lock')) return Anchor
  return Compass
}

const AUTO_SLIDE_MS = 3500

export default function VCategoriesGrid() {
  const { categories, homeSections } = useStore()
  const visible = categories.slice(0, 10)
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const totalSlides = visible.length

  const goTo = useCallback((idx: number) => {
    setCurrent(((idx % totalSlides) + totalSlides) % totalSlides)
  }, [totalSlides])

  const next = useCallback(() => goTo(current + 1), [current, goTo])
  const prev = useCallback(() => goTo(current - 1), [current, goTo])

  useEffect(() => {
    if (paused || totalSlides <= 1) return
    timerRef.current = setInterval(next, AUTO_SLIDE_MS)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [paused, next, totalSlides])

  if (totalSlides === 0) return null

  const getVisibleIndices = () => {
    const indices: number[] = []
    for (let offset = -1; offset <= 1; offset++) {
      indices.push(((current + offset) % totalSlides + totalSlides) % totalSlides)
    }
    return indices
  }

  const visibleIndices = getVisibleIndices()

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

        {/* Carousel */}
        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Nav arrows */}
          {totalSlides > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute -left-2 sm:left-0 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full glass border border-white/10 text-white hover:bg-primary/20 hover:border-primary/30 transition-all shadow-lg"
                aria-label="Previous category"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                className="absolute -right-2 sm:right-0 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full glass border border-white/10 text-white hover:bg-primary/20 hover:border-primary/30 transition-all shadow-lg"
                aria-label="Next category"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* 3 cards visible on all screens */}
          <div className="px-8 sm:px-12 lg:px-16">
            <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:gap-6">
              {visibleIndices.map((idx, pos) => {
                const cat = visible[idx]
                return (
                  <AnimatePresence mode="wait" key={`slot-${pos}`}>
                    <motion.div
                      key={`${idx}-${current}`}
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{
                        opacity: pos === 1 ? 1 : 0.7,
                        scale: pos === 1 ? 1.05 : 0.95,
                        y: 0,
                      }}
                      exit={{ opacity: 0, scale: 0.9, y: -20 }}
                      transition={{ type: 'spring', stiffness: 250, damping: 25 }}
                    >
                      <CategoryCard cat={cat} featured={pos === 1} />
                    </motion.div>
                  </AnimatePresence>
                )
              })}
            </div>
          </div>

          {/* Dots */}
          {totalSlides > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              {visible.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`transition-all duration-300 rounded-full ${
                    i === current
                      ? 'w-8 h-2.5 bg-primary shadow-lg shadow-primary/40'
                      : 'w-2.5 h-2.5 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Go to category ${i + 1}`}
                />
              ))}
            </div>
          )}
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

function CategoryCard({ cat, featured }: { cat: { id: string; slug: string; name: string; image_url: string }; featured?: boolean }) {
  const Icon = iconFor(cat.slug)

  return (
    <Link
      to={`/products?category=${cat.slug}`}
      className={`sb-simple-card sb-neon-card sb-card-glow group flex flex-col items-center text-center p-5 sm:p-6 h-full block transition-all duration-300 ${
        featured ? 'ring-2 ring-primary/30 shadow-xl shadow-primary/10' : ''
      }`}
    >
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

      <h3 className="relative z-[1] font-headline font-bold text-fg text-sm sm:text-lg mb-1 tracking-wide uppercase">
        {cat.name}
      </h3>

      <p className="relative z-[1] text-fg-soft text-xs sm:text-sm leading-snug font-ui mb-3 line-clamp-2">
        {taglineFor(cat.slug)}
      </p>

      <div className="relative z-[1] mt-auto inline-flex items-center gap-1.5 text-primary text-xs font-ui font-bold uppercase tracking-[0.16em] group-hover:gap-2.5 transition-all">
        Explore
        <ArrowRight className="w-3.5 h-3.5" />
      </div>
    </Link>
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
