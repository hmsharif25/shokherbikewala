import { motion, useScroll, useTransform } from 'framer-motion'
import {
  ArrowUpRight,
  Instagram,
  Facebook,
  Music2,
  ShieldCheck,
  Sparkles,
  Youtube,
  Gauge,
  Gem,
  Crown,
  Target,
  CircleDot,
} from 'lucide-react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '@/context/StoreContext'

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
      Icon: Youtube,
      url: 'https://www.youtube.com/results?search_query=ShokherBikewala',
      platform: 'YouTube',
      handle: 'Rider drops',
      tone: 'is-youtube',
    },
  ]

  const featureCards = [
    { title: 'Premium Quality', detail: 'Elite-grade rider accessories', Icon: Gem },
    { title: 'High Performance', detail: 'Built for speed and control', Icon: Gauge },
    { title: 'Rider Focused', detail: 'Designed around real journeys', Icon: Target },
    { title: 'Trusted By Riders', detail: 'Curated for Bangladesh streets', Icon: ShieldCheck },
  ]

  return (
    <section
      ref={ref}
      className="v-live-hero relative min-h-[100dvh] flex items-center justify-center overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-32 lg:pb-24"
    >
      <div className="absolute inset-0 v-live-showroom" />
      <div className="absolute inset-0 v-live-aurora" />
      <div className="absolute inset-0 v-live-architecture" />
      <div className="absolute inset-x-0 bottom-0 h-[46%] v-live-floor" />
      <div className="absolute inset-0 v-live-light-streaks" />

      <motion.div
        style={{ scale: ringScale }}
        className="absolute inset-0 pointer-events-none flex items-center justify-end pr-[4vw]"
        aria-hidden
      >
        <div className="v-live-orbit v-live-orbit--xl" />
        <div className="v-live-orbit v-live-orbit--lg" />
        <div className="v-live-orbit v-live-orbit--md" />
      </motion.div>

      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className="v-live-particle"
            style={{
              left: `${4 + ((i * 11) % 92)}%`,
              top: `${12 + ((i * 17) % 72)}%`,
              animationDelay: `${i * 0.36}s`,
              animationDuration: `${5.5 + (i % 5) * 0.6}s`,
            }}
          />
        ))}
      </div>

      <motion.div
        animate={{ x: [-28, 34, -28], y: [8, -14, 8], opacity: [0.35, 0.72, 0.35] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[18%] right-[10%] w-[36rem] h-[28rem] rounded-full bg-primary/20 blur-3xl pointer-events-none"
      />

      <motion.div
        style={{ y: yShift, opacity: fade }}
        className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 w-full"
      >
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.92fr)]">
          <div className="text-left">
            <motion.div
              initial={{ opacity: 0, y: 14, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="inline-flex"
            >
              <span className="v-live-eyebrow">
                <span className="v-live-dot" />
                Ultra Premium Live Commerce UI
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 22, scale: 0.98, filter: 'blur(14px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.85, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8"
            >
              <div className="v-live-logo-mark" aria-label="SB logo">
                <span>SB</span>
              </div>
              <h1 className="v-live-title">
                <span>Shokher</span>
                <span>Bikewala</span>
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.32 }}
              className="mt-5"
            >
              <p className="v-live-tagline">BUILT FOR RIDERS</p>
              <p className="v-live-subtext">
                Premium motorcycle accessories engineered for riders who demand
                style, precision, and performance.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.44 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link to="/products" className="v-live-btn v-live-btn-primary">
                SHOP NOW
                <span><ArrowUpRight className="w-4 h-4" /></span>
              </Link>
              <Link to="/about" className="v-live-btn v-live-btn-ghost">
                EXPLORE BRAND
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.56 }}
              className="mt-8 flex flex-wrap gap-2.5"
            >
              {socialTiles.map(({ Icon, url, platform, handle, tone }, index) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${platform} — ${handle}`}
                  className="v-live-social"
                  style={{ animationDelay: `${index * -1.1}s` }}
                >
                  <span className={`v-live-social-icon ${tone}`}>
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="v-live-social-text">
                    <span>{platform}</span>
                    <small>{handle}</small>
                  </span>
                </a>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="relative min-h-[420px] lg:min-h-[560px]"
          >
            <div className="v-live-visual">
              <span className="v-live-visual-glass v-live-visual-glass--one" />
              <span className="v-live-visual-glass v-live-visual-glass--two" />
              <span className="v-live-visual-glass v-live-visual-glass--three" />

              <div className="v-live-core">
                <div className="v-live-helmet">
                  <span className="v-live-helmet-shell" />
                  <span className="v-live-helmet-visor" />
                  <span className="v-live-helmet-glow" />
                </div>
              </div>

              <div className="v-live-floating-panel v-live-floating-panel--top">
                <Crown className="w-4 h-4 text-primary" />
                <span>Luxury Gear</span>
              </div>
              <div className="v-live-floating-panel v-live-floating-panel--mid">
                <CircleDot className="w-4 h-4 text-primary" />
                <span>Halo System</span>
              </div>
              <div className="v-live-floating-panel v-live-floating-panel--bottom">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>Live Showroom</span>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.68 }}
          className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
        >
          {featureCards.map(({ title, detail, Icon }, index) => (
            <div
              key={title}
              className="v-live-feature"
              style={{ animationDelay: `${index * -0.8}s` }}
            >
              <span className="v-live-feature-icon">
                <Icon className="w-4 h-4" />
              </span>
              <span>
                <strong>{title}</strong>
                <small>{detail}</small>
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
