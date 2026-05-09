import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Award,
  Gauge,
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
 * feature grid and trust pillars replacing the showroom bike image.
 */
const PILLARS = [
  { icon: ShieldCheck, label: 'Premium\nQuality' },
  { icon: Gauge, label: 'Performance\nFocused' },
  { icon: Award, label: 'Rider\nApproved' },
]

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
    <section className="sb-clean-section sb-showroom-section relative py-20 sm:py-28 overflow-hidden">
      <div className="sb-showroom-grid pointer-events-none" aria-hidden="true" />

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
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="sb-trust-cell flex-row gap-3 sm:flex-col sm:gap-2 p-4 sm:p-5"
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

        {/* CTA + Pillars */}
        <VReveal className="text-center">
          <Link
            to="/products"
            className="sb-cta-primary group inline-flex"
          >
            Explore Collection
            <span className="sb-cta-pin">
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <div className="sb-pillar-capsule mx-auto mt-8">
            {PILLARS.map((pillar) => (
              <div key={pillar.label} className="sb-pillar-cell">
                <span className="sb-pillar-ico">
                  <pillar.icon className="w-4 h-4" />
                </span>
                <span className="sb-pillar-label">{pillar.label}</span>
              </div>
            ))}
          </div>
        </VReveal>
      </div>
    </section>
  )
}
