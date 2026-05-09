import { motion } from 'framer-motion'
import {
  Headphones,
  Package,
  ShieldCheck,
  Truck,
  Wrench,
  Zap,
} from 'lucide-react'
import VReveal from '@/components/ui/VReveal'
import { useStore } from '@/context/StoreContext'

/**
 * "Engineered for Riders" — centered gaming-style section with
 * feature grid replacing the showroom bike image.
 */
const FEATURES = [
  { icon: Zap, title: 'High Performance', desc: 'Race-grade materials built for speed' },
  { icon: ShieldCheck, title: 'Safety Certified', desc: 'DOT & ECE approved protection' },
  { icon: Truck, title: 'Fast Delivery', desc: 'Nationwide shipping within 48h' },
  { icon: Wrench, title: 'Easy Install', desc: 'Plug-and-play accessories' },
  { icon: Headphones, title: '24/7 Support', desc: 'Expert rider assistance anytime' },
  { icon: Package, title: 'Easy Returns', desc: '30-day hassle-free returns' },
]

export default function VBrandStory() {
  const { homeSections } = useStore()

  return (
    <section className="sb-clean-section sb-showroom-section relative py-20 sm:py-28 overflow-x-clip overflow-y-visible">
      <div className="sb-showroom-grid pointer-events-none" aria-hidden="true" />
      <div className="sb-hex-pattern" />
      <div className="sb-scanline-overlay" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered headline */}
        <VReveal className="text-center max-w-3xl mx-auto mb-14">
          <span className="sb-eyebrow-bar mx-auto">
            <span className="sb-eyebrow-bar-line" />
            Premium Motorcycle Accessories
          </span>

          <h2 className="sb-cinematic-title sb-cinematic-title-md mt-4 mb-6 items-center">
            {homeSections.brandStory.heading}
          </h2>

          <p className="text-fg-muted text-base sm:text-lg leading-relaxed font-ui max-w-xl mx-auto">
            {homeSections.brandStory.subheading}
          </p>
        </VReveal>

        {/* Feature grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 max-w-4xl mx-auto mb-12">
          {FEATURES.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6, scale: 1.03, transition: { duration: 0.25 } }}
              className="sb-trust-cell sb-neon-card sb-card-glow flex-row gap-3 sm:flex-col sm:gap-2 p-4 sm:p-5"
            >
              <span className="sb-pillar-ico flex-shrink-0">
                <feat.icon className="w-4 h-4" />
              </span>
              <div className="sm:text-center">
                <div className="font-headline font-bold text-fg text-xs sm:text-sm uppercase tracking-[0.12em]">
                  {feat.title}
                </div>
                <div className="text-fg-muted text-xs font-ui mt-0.5 hidden sm:block">
                  {feat.desc}
                </div>
              </div>
            </motion.div>
          ))}
        </div>


      </div>
    </section>
  )
}
