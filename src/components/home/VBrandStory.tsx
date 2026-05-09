import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Settings, Award } from 'lucide-react'
import VReveal from '@/components/ui/VReveal'
import { useStore } from '@/context/StoreContext'

const PILLARS = [
  { icon: Shield, label: 'Premium\nQuality' },
  { icon: Settings, label: 'Performance\nFocused' },
  { icon: Award, label: 'Rider\nApproved' },
]

/**
 * Brand showroom — "Engineered for Riders" section.
 *
 * Mirrors the second reference: italic Orbitron headline on the left
 * with a glassy pillar strip, hero shot on the right with ambient
 * orange light behind it.
 */
export default function VBrandStory() {
  const { brandSettings } = useStore()
  const showroom =
    brandSettings.hero_image_url ||
    'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1600&q=80'

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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        <div className="lg:col-span-5 space-y-7 text-center lg:text-left">
          <VReveal>
            <span className="v-eyebrow">Premium Motorcycle Accessories</span>
          </VReveal>

          <VReveal delay={100}>
            <h2 className="v-headline text-4xl sm:text-6xl md:text-7xl">
              ENGINEERED
              <br />
              FOR <em>RIDERS</em>
            </h2>
          </VReveal>

          <VReveal delay={200}>
            <p className="text-fg-muted text-base sm:text-lg leading-relaxed font-ui max-w-md mx-auto lg:mx-0">
              Precision performance. Premium quality. Built for those who live
              to ride. Every piece of gear is curated, tested, and approved by
              riders who push the limits.
            </p>
          </VReveal>

          <VReveal delay={280}>
            <Link to="/about" className="v-pill-cta">
              Explore Collection
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/25">
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </VReveal>

          <VReveal delay={360}>
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
          </VReveal>
        </div>

        <div className="lg:col-span-7 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-[1.15] w-full"
          >
            {/* Showroom platform */}
            <div className="absolute inset-x-[5%] bottom-[6%] h-[52%] rounded-[2rem] bg-gradient-to-tr from-bg-2 to-bg border border-line/60 shadow-[0_24px_50px_-20px_rgba(17,24,39,0.18)] overflow-hidden">
              {/* Neon ring */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[80%] h-3 rounded-full border-2 border-primary/40 shadow-[0_0_30px_rgba(255,122,31,0.45)]" />
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[60%] h-2 rounded-full border-2 border-primary/60 shadow-[0_0_20px_rgba(255,122,31,0.6)]" />
            </div>

            {/* Bike */}
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src={showroom}
                alt="Showroom"
                loading="lazy"
                className="relative z-[1] w-[88%] h-[80%] object-contain drop-shadow-[0_30px_60px_rgba(255,90,0,0.35)]"
              />
            </div>

            {/* Side gear glow */}
            <div className="absolute top-[10%] left-[5%] w-20 h-44 rounded-2xl border border-primary/20 bg-bg/40 backdrop-blur-md hidden md:flex flex-col items-center justify-center gap-2 p-2">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <p className="text-[10px] font-ui font-bold uppercase tracking-wider text-fg-muted text-center leading-tight">
                Tested
                <br />
                Gear
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
