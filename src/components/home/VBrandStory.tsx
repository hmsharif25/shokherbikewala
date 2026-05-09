import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Settings, Award, Sparkles, Gauge, CircleDot } from 'lucide-react'
import VReveal from '@/components/ui/VReveal'

const PILLARS = [
  { icon: Shield, label: 'Premium\nQuality' },
  { icon: Settings, label: 'Rider\nFocused' },
  { icon: Gauge, label: 'Fast\nDelivery' },
  { icon: Award, label: 'Trusted By\nRiders' },
]

/**
 * Brand showroom — "Engineered for Riders" section.
 *
 * Image-less variant. The previous design carried a stacked showroom
 * platform with a hero bike image on the right. Per design direction,
 * the imagery has been removed. The section now relies on a centered
 * single-column composition: eyebrow -> Orbitron headline -> body ->
 * CTA -> three-pillar capsule, set against an ambient orange floor
 * glow and a subtle motion-line backdrop.
 */
export default function VBrandStory() {
  return (
    <section className="v-premium-section v-showroom-section relative py-20 sm:py-28 overflow-hidden">
      {/* Floor reflection ring */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-32 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(255,122,31,0.18), transparent 60%)',
          filter: 'blur(36px)',
        }}
      />

      {/* Subtle motion-line backdrop */}
      <div className="absolute inset-0 v-motion-lines pointer-events-none opacity-30" />

      {/* Soft ambient orange glow above the headline */}
      <div
        className="absolute top-1/2 left-1/2 w-[70%] h-[60%] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(255,122,31,0.16), transparent 65%)',
          filter: 'blur(50px)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[0.95fr_1.05fr] gap-10 lg:gap-16 items-center">
        <div className="text-center lg:text-left space-y-7">
          <VReveal>
            <span className="v-eyebrow">Futuristic Biker Showroom</span>
          </VReveal>

          <VReveal delay={100}>
            <h2 className="v-headline text-5xl sm:text-7xl md:text-8xl">
              ENGINEERED
              <br />
              FOR <em>RIDERS</em>
            </h2>
          </VReveal>

          <VReveal delay={200}>
            <p className="text-fg-muted text-base sm:text-lg leading-relaxed font-ui max-w-xl mx-auto lg:mx-0">
              Precision performance. Premium quality. Built for those who live to
              ride. Every accessory is presented inside a white luxury garage with
              orange platform lighting, reflective glass, and layered depth.
            </p>
          </VReveal>

          <VReveal delay={280}>
            <div className="flex justify-center lg:justify-start">
              <Link to="/about" className="v-pill-cta">
                Explore Brand
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/25 ml-1">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>
          </VReveal>
        </div>

        <VReveal delay={160}>
          <div className="v-showroom-stage" aria-label="Futuristic motorcycle accessories showroom">
            <div className="v-showroom-ring" />
            <div className="v-showroom-platform">
              <div className="v-showroom-helmet">
                <span />
              </div>
              <div className="v-showroom-accessory v-showroom-accessory--one">
                <Sparkles className="w-4 h-4" />
                Helmet Grid
              </div>
              <div className="v-showroom-accessory v-showroom-accessory--two">
                <CircleDot className="w-4 h-4" />
                LED Platform
              </div>
              <div className="v-showroom-accessory v-showroom-accessory--three">
                <Gauge className="w-4 h-4" />
                Performance
              </div>
            </div>
          </div>
        </VReveal>

        <VReveal delay={360} className="lg:col-span-2">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {PILLARS.map((p) => (
              <div key={p.label} className="v-live-feature">
                <span className="v-live-feature-icon">
                  <p.icon className="w-5 h-5" />
                </span>
                <span>
                  <strong>{p.label.replace('\n', ' ')}</strong>
                  <small>Luxury rider promise</small>
                </span>
              </div>
            ))}
          </div>
        </VReveal>
      </div>
    </section>
  )
}
