import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight, Quote, MessageSquare } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { useStore } from '@/context/StoreContext'

export default function TestimonialsSection() {
  const { testimonials } = useStore()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (testimonials.length === 0) return
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length)
    }, 5500)
    return () => clearInterval(interval)
  }, [testimonials.length])

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length)
  const next = () => setCurrent((c) => (c + 1) % testimonials.length)

  if (testimonials.length === 0) return null

  const t = testimonials[current]
  const initials = t.name
    .split(' ')
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <section className="relative py-14 sm:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-bg via-bg-2 to-bg" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="absolute inset-0 premium-mesh-bg opacity-[0.35]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="divider-glow mb-10 sm:mb-14 rounded-full" />

        <AnimatedSection className="text-center mb-10 sm:mb-14">
          <span className="section-eyebrow gold mb-3 sm:mb-4">
            <MessageSquare className="w-3 h-3" />
            Testimonials
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-display font-bold mt-3 mb-3 sm:mb-4">
            <span className="text-gradient-headline">What Riders </span>
            <span className="text-gradient-primary">Say</span>
          </h2>
          <p className="text-fg-muted max-w-xl mx-auto font-racing tracking-wide">
            Real stories from the riders who roll with us.
          </p>
        </AnimatedSection>

        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 60, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -60, scale: 0.96 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="premium-card hud-border tachometer-glow p-6 sm:p-10 md:p-14 text-center relative"
              >
                {/* Big watermark quote */}
                <Quote className="absolute top-4 left-4 sm:top-6 sm:left-6 w-10 h-10 sm:w-14 sm:h-14 text-primary/20" />
                <Quote className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 w-10 h-10 sm:w-14 sm:h-14 text-cyan/20 rotate-180" />

                {/* Avatar */}
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="relative mx-auto mb-5 sm:mb-6"
                >
                  <div className="absolute inset-0 -m-1 rounded-full bg-gradient-to-tr from-primary via-gold to-cyan animate-pulse-glow" />
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-gradient-to-br from-primary to-primary-700 flex items-center justify-center text-white font-display font-black text-lg sm:text-xl border-2 border-bg shadow-lg">
                    {initials || 'R'}
                  </div>
                </motion.div>

                {/* Stars */}
                <div className="flex items-center justify-center gap-1 mb-5 sm:mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.div
                      key={star}
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.18 + star * 0.06, type: 'spring', stiffness: 250 }}
                    >
                      <Star
                        className={`w-4 h-4 sm:w-5 sm:h-5 ${
                          star <= t.rating ? 'fill-gold text-gold' : 'text-fg-soft/40'
                        }`}
                      />
                    </motion.div>
                  ))}
                </div>

                <p className="text-fg text-base sm:text-xl md:text-2xl leading-relaxed mb-6 sm:mb-8 italic font-racing tracking-wide">
                  &ldquo;{t.text}&rdquo;
                </p>

                <div>
                  <p className="text-fg font-display font-bold text-lg sm:text-xl">{t.name}</p>
                  <p className="text-primary text-xs sm:text-sm font-racing tracking-[0.2em] uppercase mt-1">
                    Purchased: {t.product}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-center gap-4 mt-7 sm:mt-9">
              <motion.button
                whileHover={{ scale: 1.1, x: -2 }}
                whileTap={{ scale: 0.9 }}
                onClick={prev}
                className="p-3 rounded-full glass border border-line hover:border-primary/40 text-fg-muted hover:text-primary transition-all"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>

              <div className="flex items-center gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    aria-label={`Go to testimonial ${i + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === current
                        ? 'bg-gradient-to-r from-primary to-gold w-8 shadow-[0_0_10px_rgba(255,106,26,0.5)]'
                        : 'bg-fg-soft/30 hover:bg-fg-soft/60 w-2'
                    }`}
                  />
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.1, x: 2 }}
                whileTap={{ scale: 0.9 }}
                onClick={next}
                className="p-3 rounded-full glass border border-line hover:border-primary/40 text-fg-muted hover:text-primary transition-all"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
