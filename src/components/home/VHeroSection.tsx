import { motion, useScroll, useTransform } from 'framer-motion'
import {
  Instagram,
  Facebook,
  Music2,
  MessageCircle,
} from 'lucide-react'
import { useRef } from 'react'
import { useStore } from '@/context/StoreContext'

/**
 * Brand-led hero — image-less, headline-less.
 *
 * The hero now contains pure brand identity only. The eyebrow,
 * sub-copy and "Shop Collection" CTA were removed at the user's
 * request so the hero reads as a clean brand stamp:
 *
 *   logo glyph -> wordmark -> tagline pill -> social row
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
  const yShift = useTransform(scrollYProgress, [0, 1], [0, -60])
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
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-32 lg:pb-24"
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
        className="relative z-10 max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 w-full text-center"
      >
        {/* Oversized logo glyph */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto relative w-24 h-24 sm:w-28 sm:h-28 lg:w-36 lg:h-36 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 p-3 flex items-center justify-center"
        >
          <span
            aria-hidden
            className="absolute -inset-2 rounded-[2rem] opacity-70 blur-lg"
            style={{
              background:
                'radial-gradient(circle at center, rgba(255,122,31,0.55), transparent 70%)',
            }}
          />
          <img
            src={logoSrc}
            alt={brandSettings.brand_name || 'Shokher Bike Wala'}
            width={144}
            height={144}
            decoding="async"
            fetchPriority="high"
            className="relative w-full h-full object-contain drop-shadow-[0_0_22px_rgba(255,90,0,0.55)]"
          />
        </motion.div>

        {/* Wordmark — large, headline-sized */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-6 sm:mt-8 flex flex-col items-center leading-none"
        >
          <span className="font-headline text-[2.5rem] xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-fg uppercase tracking-tight">
            {wordmarkTop}
          </span>
          <span className="font-headline text-[0.78rem] sm:text-base md:text-lg font-extrabold text-primary tracking-[0.5em] uppercase mt-3">
            {wordmarkBottom}
          </span>
        </motion.div>

        {/* Tagline pill */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 flex justify-center"
        >
          <span className="v-tagline-pill" aria-label={tagline}>
            <span className="v-tagline-pill-dot" />
            {tagline}
          </span>
        </motion.div>

        {/* Social row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.45 }}
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
