import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'
import VReveal from '@/components/ui/VReveal'
import { useStore } from '@/context/StoreContext'

export default function VTestimonials() {
  const { testimonials, homeSections } = useStore()
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    if (testimonials.length === 0) return
    const i = setInterval(() => setIdx((v) => (v + 1) % testimonials.length), 6000)
    return () => clearInterval(i)
  }, [testimonials.length])

  if (!testimonials.length) return null
  const t = testimonials[idx]
  const initials = t.name
    .split(' ')
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <section className="relative py-20 sm:py-24 overflow-hidden">
      <div className="absolute inset-0 v-dot-field opacity-30 pointer-events-none" />


      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <VReveal className="text-center mb-10 sm:mb-14">
          <span className="v-eyebrow-long mb-4 mx-auto justify-center">Riders Speak</span>
          <h2 className="v-headline text-3xl sm:text-5xl md:text-6xl mt-3 mb-3">
            {homeSections.testimonials.heading}
          </h2>
          <p className="text-fg-muted max-w-xl mx-auto font-ui text-base">
            {homeSections.testimonials.subheading}
          </p>
        </VReveal>

        <VReveal>
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 100, scale: 0.92, rotateY: -8 }}
                animate={{ opacity: 1, x: 0, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, x: -100, scale: 0.92, rotateY: 8 }}
                transition={{ type: 'spring', stiffness: 180, damping: 22 }}
                className="v-capsule sb-electricity rounded-3xl p-6 sm:p-12 text-center relative"
              >
                <Quote className="absolute top-6 left-6 w-10 h-10 text-primary/20" />
                <Quote className="absolute bottom-6 right-6 w-10 h-10 text-primary/20 rotate-180" />

                <div className="relative w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-br from-[#ff7a1f] to-[#ff5a00] flex items-center justify-center text-white font-headline font-bold text-xl shadow-[0_18px_40px_-12px_rgba(255,90,0,0.55)]">
                  {initials || 'R'}
                </div>

                <div className="flex justify-center gap-1 mb-5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`w-5 h-5 ${s <= t.rating ? 'v-star-fill' : 'v-star-empty'}`} />
                  ))}
                </div>

                <p className="text-fg text-lg sm:text-2xl leading-relaxed mb-6 font-ui italic">
                  &ldquo;{t.text}&rdquo;
                </p>

                <p className="font-headline font-bold text-fg text-base sm:text-lg">{t.name}</p>
                <p className="text-fg-soft text-xs font-ui uppercase tracking-[0.25em] mt-1">
                  Verified Rider
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-center gap-3 mt-6 sm:mt-8">
              <button
                onClick={() => setIdx((v) => (v - 1 + testimonials.length) % testimonials.length)}
                aria-label="Previous testimonial"
                className="v-icon-btn"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  aria-label={`Show testimonial ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === idx ? 'w-8 bg-gradient-to-r from-[#ff7a1f] to-[#ff5a00]' : 'w-2 bg-line'
                  }`}
                />
              ))}
              <button
                onClick={() => setIdx((v) => (v + 1) % testimonials.length)}
                aria-label="Next testimonial"
                className="v-icon-btn"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </VReveal>
      </div>
    </section>
  )
}
