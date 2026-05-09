import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Settings, Award } from 'lucide-react'
import VReveal from '@/components/ui/VReveal'

const PILLARS = [
  { icon: Shield, label: 'Premium\nQuality' },
  { icon: Settings, label: 'Performance\nFocused' },
  { icon: Award, label: 'Rider\nApproved' },
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
    <section className="relative py-20 sm:py-28 overflow-hidden">
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

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-7">
        <VReveal>
          <span className="v-eyebrow">Premium Motorcycle Accessories</span>
        </VReveal>

        <VReveal delay={100}>
          <h2 className="v-headline text-5xl sm:text-7xl md:text-8xl">
            ENGINEERED
            <br />
            FOR <em>RIDERS</em>
          </h2>
        </VReveal>

        <VReveal delay={200}>
          <p className="text-fg-muted text-base sm:text-lg leading-relaxed font-ui max-w-xl mx-auto">
            Precision performance. Premium quality. Built for those who live to
            ride. Every piece of gear is curated, tested, and approved by
            riders who push the limits.
          </p>
        </VReveal>

        <VReveal delay={280}>
          <div className="flex justify-center">
            <Link to="/about" className="v-pill-cta">
              Explore Collection
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/25 ml-1">
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>
        </VReveal>

        <VReveal delay={360}>
          <div className="flex justify-center">
            <div className="v-capsule rounded-2xl px-3 py-3 inline-flex gap-2 mt-4">
              {PILLARS.map((p) => (
                <div
                  key={p.label}
                  className="flex flex-col items-center text-center w-24 px-1"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-1.5 border border-primary/20">
                    <p.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-[10px] font-ui font-bold tracking-wider uppercase whitespace-pre-line leading-tight text-fg-muted">
                    {p.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </VReveal>
      </div>
    </section>
  )
}
