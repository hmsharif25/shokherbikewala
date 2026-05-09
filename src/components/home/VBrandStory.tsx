import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Award,
  Gauge,
  ShieldCheck,
} from 'lucide-react'
import VReveal from '@/components/ui/VReveal'

/**
 * "Engineered for Riders" — luxury showroom section that mirrors
 * the second reference image. A side-by-side composition: oversized
 * cinematic headline + CTA on the left, a glowing showroom plate
 * with a hero bike on the right. A trust pillar capsule sits below
 * the headline ("Premium Quality / Performance Focused / Rider
 * Approved"), echoing Apple/Porsche/Tesla product showrooms.
 */
const PILLARS = [
  { icon: ShieldCheck, label: 'Premium\nQuality' },
  { icon: Gauge, label: 'Performance\nFocused' },
  { icon: Award, label: 'Rider\nApproved' },
]

const SHOWROOM_BIKE =
  'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1400&q=85'

export default function VBrandStory() {
  return (
    <section className="sb-clean-section sb-showroom-section relative py-20 sm:py-28 overflow-hidden">
      <div className="sb-showroom-grid pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.25fr] gap-10 lg:gap-14 items-center">
          {/* ============== LEFT — Copy + pillars ============== */}
          <VReveal className="text-center lg:text-left">
            <span className="sb-eyebrow-bar mx-auto lg:mx-0">
              <span className="sb-eyebrow-bar-line" />
              Premium Motorcycle Accessories
            </span>

            <h2 className="sb-cinematic-title sb-cinematic-title-md mt-4 mb-6">
              <span className="sb-cinematic-line">ENGINEERED</span>
              <span className="sb-cinematic-line sb-cinematic-line-mid">FOR</span>
              <span className="sb-cinematic-line sb-cinematic-line-accent">RIDERS</span>
            </h2>

            <p className="text-fg-muted text-base sm:text-lg leading-relaxed font-ui max-w-xl mx-auto lg:mx-0">
              Precision performance. Premium quality.
              <br />
              Built for those who live to ride.
            </p>

            <Link
              to="/products"
              className="sb-cta-primary group mt-7 inline-flex"
            >
              Explore Collection
              <span className="sb-cta-pin">
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            <div className="sb-pillar-capsule">
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

          {/* ============== RIGHT — Showroom plate ============== */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 18 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="sb-showroom-plate"
            >
              {/* Showroom interior accents */}
              <span className="sb-showroom-led sb-led-top" aria-hidden="true" />
              <span className="sb-showroom-led sb-led-bottom" aria-hidden="true" />
              <span className="sb-showroom-floor" aria-hidden="true" />
              <span className="sb-showroom-podium" aria-hidden="true" />

              <img
                src={SHOWROOM_BIKE}
                alt="Premium showroom bike"
                className="sb-showroom-bike"
                loading="lazy"
                decoding="async"
              />

              {/* Floating chip */}
              <span className="sb-showroom-chip">
                <span className="sb-chip-dot" />
                Rider Approved
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
