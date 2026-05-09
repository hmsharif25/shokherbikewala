import { motion, useScroll, useTransform } from 'framer-motion'
import {
  ArrowUpRight,
  Instagram,
  Facebook,
  Music2,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '@/context/StoreContext'

/**
 * Hero — premium brand identity moment.
 *
 * Built around three blocks that match the rest of the site's
 * design system but give the brand its own "showroom plaque" feel:
 *
 *   1. Chrome-arrow eyebrow ("v-eyebrow-long") — same primitive as
 *      the Categories / Featured Products section headers.
 *   2. A glass brand lockup card with chrome corner brackets,
 *      animated gradient border, soft orange halo, and the logo
 *      glyph + Orbitron wordmark + EST badge inside.
 *   3. A kinetic Orbitron tagline strip with pulsing chrome dot
 *      separators (replaces the old "tagline pill").
 *   4. Premium social tiles — each platform is a glass capsule
 *      with a gradient platform glyph + name + handle + chevron,
 *      so social reads as four "follow cards", not four bare
 *      circular icons.
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

  // Two-line wordmark — first word large, rest tracked-out below.
  // Falls back gracefully if a single-word brand name is configured.
  const brandTokens = (brandSettings.brand_name || 'Shokher Bike Wala').split(' ')
  const wordmarkTop = brandTokens[0] || 'SHOKHER'
  const wordmarkBottom = brandTokens.slice(1).join(' ') || 'BIKE WALA'
  const tagline =
    brandSettings.tagline || 'Your Ultimate Bike Accessories Destination'
  const logoSrc = brandSettings.logo_url || '/logo.png'

  // Kinetic tagline — split on spaces and reinsert dot dividers between
  // every 2-3 words so the tagline reads as a chrome call-out instead
  // of a flat sentence. Keeps original brand tagline intact.
  const taglineSegments = (() => {
    const words = tagline.split(/\s+/).filter(Boolean)
    const segs: string[] = []
    for (let i = 0; i < words.length; i += 2) {
      segs.push(words.slice(i, i + 2).join(' '))
    }
    return segs.length ? segs : [tagline]
  })()

  const socialTiles = [
    {
      Icon: Instagram,
      url: brandSettings.instagram,
      platform: 'Instagram',
      handle: '@shokherbikewala',
      tone: 'is-instagram',
    },
    {
      Icon: Music2,
      url: brandSettings.tiktok,
      platform: 'TikTok',
      handle: '@shokherbikewala',
      tone: 'is-tiktok',
    },
    {
      Icon: Facebook,
      url: brandSettings.facebook,
      platform: 'Facebook',
      handle: 'Shokher Bike Wala',
      tone: 'is-facebook',
    },
    {
      Icon: MessageCircle,
      url: brandSettings.whatsapp,
      platform: 'WhatsApp',
      handle: 'Chat with us',
      tone: 'is-whatsapp',
    },
  ]

  const heroMetrics = [
    { value: '100+', label: 'Premium Drops', Icon: Sparkles },
    { value: '24/7', label: 'Rider Support', Icon: MessageCircle },
    { value: 'GT', label: 'Gaming Grade UI', Icon: Zap },
    { value: 'COD', label: 'Safe Checkout', Icon: ShieldCheck },
  ]

  return (
    <section
      ref={ref}
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-32 lg:pb-24"
    >
      {/* Ambient backdrop layers */}
      <div className="absolute inset-0 v-hero-halo" />
      <div className="absolute inset-0 v-gaming-hero-grid pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 v-gaming-floor pointer-events-none" />

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

      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {Array.from({ length: 10 }).map((_, i) => (
          <span
            key={i}
            className="v-hero-particle"
            style={{
              left: `${8 + ((i * 13) % 86)}%`,
              animationDelay: `${i * 0.48}s`,
              animationDuration: `${4.2 + (i % 4) * 0.45}s`,
            }}
          />
        ))}
      </div>

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
        {/* Eyebrow — same chrome-arrow primitive as other sections */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="inline-flex"
        >
          <span className="v-eyebrow-long mx-auto justify-center">
            Premium Motorcycle Accessories
          </span>
        </motion.div>

        {/* Brand lockup — glass card with chrome corners */}
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.75, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="mt-7 sm:mt-9 inline-flex"
        >
          <div className="v-brand-lockup">
            <span className="v-brand-lockup-corner tl" aria-hidden />
            <span className="v-brand-lockup-corner tr" aria-hidden />
            <span className="v-brand-lockup-corner bl" aria-hidden />
            <span className="v-brand-lockup-corner br" aria-hidden />

            <div className="v-brand-lockup-logo">
              <img
                src={logoSrc}
                alt={brandSettings.brand_name || 'Shokher Bike Wala'}
                width={80}
                height={80}
                decoding="async"
                fetchPriority="high"
                className="relative w-full h-full object-contain drop-shadow-[0_0_18px_rgba(255,90,0,0.55)]"
              />
            </div>

            <div className="v-brand-lockup-name">
              <span className="top">{wordmarkTop}</span>
              <span className="bottom">{wordmarkBottom}</span>
            </div>

            <div className="v-brand-lockup-sep" aria-hidden />
            <div className="v-brand-lockup-est">
              <span className="label">Est.</span>
              <span className="value">2025</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-7 flex flex-wrap justify-center gap-3"
        >
          <Link to="/products" className="v-pill-cta v-hero-cta-primary">
            Enter Shop Arena
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/25 ml-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </Link>
          <Link to="/categories" className="v-hero-cta-ghost">
            View Gear Portfolio
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.62 }}
          className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3"
        >
          {heroMetrics.map(({ value, label, Icon }) => (
            <div key={label} className="v-hero-metric">
              <Icon className="w-4 h-4 text-primary" />
              <span className="value">{value}</span>
              <span className="label">{label}</span>
            </div>
          ))}
        </motion.div>

        {/* Kinetic tagline strip with chrome dot separators */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.42 }}
          className="mt-7 sm:mt-9 flex justify-center"
        >
          <div
            className="v-hero-kinetic"
            role="text"
            aria-label={tagline}
          >
            {taglineSegments.map((seg, i, arr) => (
              <span key={i} className="contents">
                <span className={i === Math.floor(arr.length / 2) ? '' : ''}>
                  {seg}
                </span>
                {i < arr.length - 1 && (
                  <span className="v-hero-kinetic-dot" aria-hidden />
                )}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Premium social tiles — replaces the row of plain icons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-9 sm:mt-12 flex flex-wrap items-center gap-2.5 sm:gap-3 justify-center"
        >
          {socialTiles.map(({ Icon, url, platform, handle, tone }) => (
            <a
              key={platform}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${platform} — ${handle}`}
              className="v-social-tile"
            >
              <span className={`v-social-tile-icon ${tone}`}>
                <Icon className="w-4 h-4" />
              </span>
              <span className="v-social-tile-meta">
                <span className="platform">{platform}</span>
                <span className="handle">{handle}</span>
              </span>
              <span className="v-social-tile-arrow" aria-hidden>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </a>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
