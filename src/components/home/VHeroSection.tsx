import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Instagram,
  Facebook,
  Music2,
  MessageCircle,
} from 'lucide-react'
import { useRef } from 'react'
import { useStore } from '@/context/StoreContext'

/**
 * Cinematic hero — image-less variant with proper branding.
 *
 * Hero now opens with a full brand lockup (logo glyph + SHOKHER /
 * BIKE WALA wordmark + tagline pill) so the brand identity reads
 * immediately. The original 4-feature chip capsule has been
 * removed entirely; trust signals live elsewhere on the page.
 *
 * Layout (all breakpoints): centered single column.
 *   brand lockup -> eyebrow -> oversized headline -> body ->
 *   CTA -> social row.
 *
 * Visual anchors (no imagery): three slowly-rotating concentric
 * orange orbital rings + drifting radial glow.
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

  const socialItems = [
    { icon: Instagram, url: brandSettings.instagram, label: 'Instagram' },
    { icon: Facebook, url: brandSettings.facebook, label: 'Facebook' },
    { icon: Music2, url: brandSettings.tiktok, label: 'TikTok' },
    { icon: MessageCircle, url: brandSettings.whatsapp, label: 'WhatsApp' },
  ]

  // Two-line wordmark — first word large, rest tracked-out below.
  // Falls back gracefully if a single-word brand name is configured.
  const brandTokens = (brandSettings.brand_name || 'Shokher Bike Wala').split(' ')
  const wordmarkTop = brandTokens[0] || 'SHOKHER'
  const wordmarkBottom = brandTokens.slice(1).join(' ') || 'BIKE WALA'
  const tagline =
    brandSettings.tagline || 'Your Ultimate Bike Accessories Destination'
  const logoSrc = brandSettings.logo_url || '/logo.png'

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
        {/* Brand lockup — logo + name + tagline pill */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 p-1.5 flex items-center justify-center">
              <span
                aria-hidden
                className="absolute -inset-1 rounded-2xl opacity-70 blur-md"
                style={{
                  background:
                    'radial-gradient(circle at center, rgba(255,122,31,0.45), transparent 70%)',
                }}
              />
              <img
                src={logoSrc}
                alt={brandSettings.brand_name || 'Shokher Bike Wala'}
                className="relative w-full h-full object-contain drop-shadow-[0_0_14px_rgba(255,90,0,0.55)]"
              />
            </div>

            <div className="flex flex-col leading-none text-left">
              <span className="font-headline text-lg sm:text-xl font-extrabold text-fg tracking-wide uppercase">
                {wordmarkTop}
              </span>
              <span className="font-headline text-[10px] sm:text-xs font-extrabold text-primary tracking-[0.42em] uppercase mt-1">
                {wordmarkBottom}
              </span>
            </div>
          </div>

          <span className="v-tagline-pill" aria-label={tagline}>
            <span className="v-tagline-pill-dot" />
            {tagline}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15 }}
          className="inline-flex mt-7"
        >
          <span className="v-eyebrow">Premium Motorcycle Accessories</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="v-headline mt-5 sm:mt-7 text-[3.75rem] xs:text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] xl:text-[11.5rem]"
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
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-fg-muted text-base sm:text-lg max-w-xl mx-auto leading-relaxed font-ui mt-7"
        >
          High performance accessories for those who live to ride. Built for
          speed, designed for dominance.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.52 }}
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

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="flex items-center gap-3 justify-center mt-8"
        >
          {socialItems.map((s) => (
            <a
              key={s.label}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="w-10 h-10 rounded-full flex items-center justify-center text-fg-soft hover:text-primary transition-colors border border-line/60 hover:border-primary/40 bg-bg/40"
            >
              <s.icon className="w-4 h-4" />
            </a>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
