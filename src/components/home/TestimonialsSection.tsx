import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'

const testimonials = [
  {
    id: 1,
    name: 'Rafiq Ahmed',
    rating: 5,
    text: 'Amazing quality helmet! The finish is premium and feels very safe. Delivery was super fast too. Will definitely order again from Shokher Bike Wala.',
    product: 'Steelbird SBA-21 GT',
  },
  {
    id: 2,
    name: 'Tanvir Hassan',
    rating: 5,
    text: 'Best gloves I have ever used. Perfect grip and very comfortable for long rides. The touchscreen feature works flawlessly.',
    product: 'Riding Leather Gloves Pro',
  },
  {
    id: 3,
    name: 'Kamal Hossain',
    rating: 5,
    text: 'The LED light kit completely transformed my bike! Easy to install and the colors are vibrant. Great customer service via WhatsApp.',
    product: 'LED Strip Light Kit',
  },
  {
    id: 4,
    name: 'Shakib Rahman',
    rating: 4,
    text: 'Ordered the phone mount and jacket together. Both products are excellent quality. The jacket fits perfectly and looks stylish.',
    product: 'Windproof Racing Jacket',
  },
]

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length)
  const next = () => setCurrent((c) => (c + 1) % testimonials.length)

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-dark via-surface/30 to-dark" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <motion.span className="inline-block px-4 py-1.5 rounded-full bg-gold/10 text-gold text-sm font-semibold mb-4 border border-gold/20">
            TESTIMONIALS
          </motion.span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-4">
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
                className="p-8 md:p-12 rounded-2xl glass text-center"
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

                <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-8 italic">
                  &ldquo;{testimonials[current].text}&rdquo;
                </p>

                <div>
                  <p className="text-white font-bold text-lg">
                    {testimonials[current].name}
                  </p>
                  <p className="text-primary text-sm">
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
