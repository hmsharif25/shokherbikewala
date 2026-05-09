import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Shield,
  Globe,
  Lock,
  Award,
  Instagram,
  Facebook,
  Music2,
  MessageCircle,
} from 'lucide-react'
import { useRef } from 'react'
import { useStore } from '@/context/StoreContext'

const FEATURE_CHIPS = [
  { icon: Shield, label: 'Premium\nQuality' },
  { icon: Globe, label: 'Worldwide\nShipping' },
  { icon: Lock, label: 'Secure\nPayment' },
  { icon: Award, label: '2 Year\nWarranty' },
]

/**
 * Cinematic hero — image-less variant.
 *
 * The previous design rendered a hero bike on a curved orange showroom
 * ring with four floating product cards pinned around it. Per design
 * direction, the bike and floating cards have been removed. The hero
 * now relies on bold typography, animated ambient glows, and a set of
 * concentric orbital rings as the visual anchor.
 *
 * Layout (all breakpoints): centered single column.
 *   eyebrow -> brand wordmark (italic Orbitron) -> body -> CTA ->
 *   social row -> feature-chip capsule.
 */
export default function VHeroSection() {
  const { brandSettings } = useStore()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const yShift = useTransform(scrollYProgress, [0, 1], [0, -80])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0.15])
  const ringScale = useTransform(scrollYProgress, [0, 1], [1, 1.05])

  // Defined once so the desktop bottom row and the mobile column
  // render the exact same set of social icons.
  const socialItems = [
    { icon: Instagram, url: brandSettings.instagram, label: 'Instagram' },
    { icon: Facebook, url: brandSettings.facebook, label: 'Facebook' },
    { icon: Music2, url: brandSettings.tiktok, label: 'TikTok' },
    { icon: MessageCircle, url: brandSettings.whatsapp, label: 'WhatsApp' },
  ]

  return (
    <section
      ref={ref}
      className="relative min-h-[100dvh] flex items-center overflow-hidden pt-24 pb-20 md:pt-28 md:pb-24"
    >
      {/* Ambient backdrop layers */}
      <div className="absolute inset-0 v-hero-halo" />

      {/* Concentric orbital rings (no images) */}
      <motion.div
        style={{ scale: ringScale }}
        className="absolute inset-0 pointer-events-none flex items-center justify-center"
        aria-hidden
      >
        <div className="v-orbital-ring v-orbital-ring--xl" />
        <div className="v-orbital-ring v-orbital-ring--lg" />
        <div className="v-orbital-ring v-orbital-ring--md" />
      </motion.div>

      {/* Soft animated orange glow drifting across the section */}
      <motion.div
        animate={{ x: [-30, 30, -30], opacity: [0.35, 0.6, 0.35] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/2 w-[80%] h-[60%] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(255,122,31,0.2), transparent 65%)',
          filter: 'blur(60px)',
        }}
      />

      <motion.div
        style={{ y: yShift, opacity: fade }}
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="inline-flex"
        >
          <span className="v-eyebrow">Premium Motorcycle Accessories</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="v-headline mt-6 sm:mt-8 text-[3.75rem] xs:text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] xl:text-[11.5rem]"
        >
          RIDE
          <br />
          WITH
          <br />
          <em>POWER</em>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-fg-muted text-base sm:text-lg max-w-xl mx-auto leading-relaxed font-ui mt-7"
        >
          High performance accessories for those who live to ride. Built for
          speed, designed for dominance.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.42 }}
          className="flex items-center justify-center mt-8"
        >
          <span className="v-cta-wrap">
            <Link to="/products" className="v-pill-cta">
              Shop Collection
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/25 ml-1">
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </span>
        </motion.div>

        {/* Social row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="flex items-center gap-3 justify-center mt-8"
        >
          {socialItems.map((s) => (
            <a
              key={s.label}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="w-9 h-9 rounded-full flex items-center justify-center text-fg-soft hover:text-primary transition-colors border border-line/60 hover:border-primary/40 bg-bg/40"
            >
              <s.icon className="w-4 h-4" />
            </a>
          ))}
        </motion.div>

        {/* Desktop feature chip capsule */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="hidden md:inline-flex v-capsule rounded-2xl px-2.5 py-2 gap-1 mt-8"
        >
          {FEATURE_CHIPS.map((c) => (
            <div
              key={c.label}
              className="flex flex-col items-center text-center w-[3.75rem] px-1"
            >
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center mb-1 border border-primary/20">
                <c.icon className="w-3 h-3 text-primary" />
              </div>
              <span className="text-[9px] font-ui font-bold tracking-wider uppercase whitespace-pre-line leading-tight text-fg-muted">
                {c.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Mobile feature chips */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="md:hidden mt-7 v-capsule rounded-2xl px-2 py-3 grid grid-cols-4 gap-1"
        >
          {FEATURE_CHIPS.map((c) => (
            <div key={c.label} className="flex flex-col items-center text-center px-1">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-1 border border-primary/20">
                <c.icon className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="text-[9px] font-ui font-bold tracking-wider uppercase whitespace-pre-line leading-tight text-fg-muted">
                {c.label}
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
