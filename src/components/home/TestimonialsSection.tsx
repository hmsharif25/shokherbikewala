import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { useStore } from '@/context/StoreContext'

export default function TestimonialsSection() {
  const { testimonials } = useStore()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (testimonials.length === 0) return
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length)
  const next = () => setCurrent((c) => (c + 1) % testimonials.length)

  if (testimonials.length === 0) return null

  return (
    <section className="relative py-14 sm:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-dark via-surface/30 to-dark" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="racing-stripe-divider mb-10 sm:mb-14 rounded-full" />

        <AnimatedSection className="text-center mb-10 sm:mb-16">
          <motion.span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gold/10 text-gold text-xs sm:text-sm font-racing tracking-widest mb-4 border border-gold/20 uppercase">
            Testimonials
          </motion.span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-display font-bold mb-4">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              What Riders{' '}
            </span>
            <span className="bg-gradient-to-r from-gold to-primary bg-clip-text text-transparent">
              Say
            </span>
          </h2>
        </AnimatedSection>

        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
                className="p-6 sm:p-8 md:p-12 rounded-2xl glass-premium tachometer-glow text-center hud-border border border-white/5"
              >
                <Quote className="w-10 h-10 text-primary/30 mx-auto mb-6" />

                <div className="flex items-center justify-center gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.div
                      key={star}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: star * 0.1 }}
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= testimonials[current].rating
                            ? 'fill-gold text-gold'
                            : 'text-gray-600'
                        }`}
                      />
                    </motion.div>
                  ))}
                </div>

                <p className="text-gray-300 text-base sm:text-lg md:text-xl leading-relaxed mb-8 italic">
                  &ldquo;{testimonials[current].text}&rdquo;
                </p>

                <div>
                  <p className="text-white font-bold text-lg font-racing">
                    {testimonials[current].name}
                  </p>
                  <p className="text-primary text-xs sm:text-sm font-racing tracking-wide">
                    Purchased: {testimonials[current].product}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-center gap-4 mt-8">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={prev}
                className="p-3 rounded-full glass text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>

              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      i === current
                        ? 'bg-primary w-8'
                        : 'bg-gray-600 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={next}
                className="p-3 rounded-full glass text-gray-400 hover:text-white hover:bg-white/10 transition-all"
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
