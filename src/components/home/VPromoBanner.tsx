import { Link } from 'react-router-dom'
import { ArrowRight, Truck, Shield, Award } from 'lucide-react'
import VReveal from '@/components/ui/VReveal'
import { useStore } from '@/context/StoreContext'

const TRUST_BADGES = [
  { icon: Truck, title: 'Free Shipping', sub: 'On orders over ৳5000' },
  { icon: Shield, title: '2 Year Warranty', sub: 'Quality guaranteed' },
  { icon: Award, title: 'Premium Quality', sub: '100% Original Gear' },
]

const PILLARS = [
  { label: 'Premium\nQuality' },
  { label: 'Performance\nFocused' },
  { label: 'Secure\nPayment' },
]

/**
 * Promotional banner — "Premium Riding Gear UP TO 40% OFF".
 *
 * Image-less variant. The previous design carried a hero bike image
 * with three floating product chips. Per design direction, all
 * imagery has been removed. The banner is now a centered typographic
 * showcase: trust strip -> headline -> sub copy -> oversized 40% OFF
 * treatment -> pillar pills -> CTA, on a glass capsule with motion-
 * line backdrop and an orange ambient glow.
 */
export default function VPromoBanner() {
  const { homeSections } = useStore()

  return (
    <section className="v-premium-section v-newsletter-showcase relative py-14 sm:py-20 overflow-x-clip overflow-y-visible">

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <VReveal>
          <div className="relative rounded-[2rem] overflow-hidden v-capsule px-6 sm:px-10 lg:px-14 py-12 sm:py-16 text-center">
            {/* Motion line backdrop */}
            <div className="absolute inset-0 v-motion-lines pointer-events-none" />
            <div
              className="absolute inset-0 pointer-events-none opacity-50"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(255,122,31,0.18), transparent 65%)',
              }}
            />

            {/* Top trust strip — centered */}
            <div className="relative hidden md:flex justify-center flex-wrap gap-x-8 gap-y-3 mb-10">
              {TRUST_BADGES.map((b) => (
                <div key={b.title} className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                    <b.icon className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-ui font-bold uppercase tracking-wider text-fg">
                      {b.title}
                    </p>
                    <p className="text-[10px] text-fg-soft font-ui">{b.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative space-y-7 max-w-3xl mx-auto">
              <span className="sb-eyebrow-bar mx-auto justify-center">
                <span className="sb-eyebrow-bar-line" />
                Limited Time Offer
              </span>

              <h2 className="sb-cinematic-title sb-cinematic-title-md">
                {homeSections.promoBanner.heading}
              </h2>

              <p className="text-fg-muted font-ui text-base max-w-md mx-auto">
                {homeSections.promoBanner.subheading}
              </p>

              {/* Oversized 40% OFF as the focal visual */}
              <div className="flex flex-col items-center justify-center pt-2">
                <p className="font-ui font-bold text-fg-muted tracking-[0.3em] text-xs uppercase mb-1">
                  Up To
                </p>
                <div className="flex items-baseline justify-center">
                  <span className="v-headline text-7xl sm:text-9xl md:text-[10rem] leading-none sb-shimmer-text sb-flicker">
                    <em>40%</em>
                  </span>
                  <span className="font-headline text-3xl sm:text-5xl font-bold text-fg ml-2">
                    OFF
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 justify-center">
                {PILLARS.map((p) => (
                  <div
                    key={p.label}
                    className="px-3 py-1.5 rounded-full border border-line bg-bg/60 text-[10px] font-ui font-bold uppercase tracking-wider text-fg-muted whitespace-pre-line text-center"
                  >
                    {p.label.replace('\n', ' ')}
                  </div>
                ))}
              </div>

              <div className="flex justify-center pt-2">
                <Link to="/shop" className="sb-cta-primary group">
                  Shop Collection
                  <span className="sb-cta-pin">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </VReveal>
      </div>
    </section>
  )
}
