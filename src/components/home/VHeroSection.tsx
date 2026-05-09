import { motion, useScroll, useTransform } from 'framer-motion'
import {
  Facebook,
  Instagram,
  MessageCircle,
  Music2,
  Star,
} from 'lucide-react'
import { useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '@/context/StoreContext'

/**
 * Cinematic hero — full-width centered layout with gaming atmosphere.
 * Headline + CTA centered, with floating product cards orbiting as
 * glass panels on desktop. Mobile shows a horizontal scroll strip.
 */
export default function VHeroSection() {
  const { products, categories, brandSettings } = useStore()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [0, -40])
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.25])

  const orbitals = useMemo(() => {
    const preferredOrder = ['helmet', 'exhaust', 'glove', 'phone', 'jacket', 'light']
    const picks: typeof products = []
    for (const key of preferredOrder) {
      const cat = categories.find((c) => c.slug.toLowerCase().includes(key))
      if (!cat) continue
      const match = products.find(
        (p) => p.category_id === cat.id && !picks.some((q) => q.id === p.id)
      )
      if (match) picks.push(match)
      if (picks.length === 4) break
    }
    while (picks.length < 4 && products.length > picks.length) {
      const next = products.find((p) => !picks.some((q) => q.id === p.id))
      if (!next) break
      picks.push(next)
    }
    return picks.slice(0, 4)
  }, [products, categories])

  const stats = [
    { value: '500+', label: 'Products' },
    { value: '10K+', label: 'Riders' },
    { value: '4.9', label: 'Rating' },
    { value: '24/7', label: 'Support' },
  ]

  return (
    <section
      ref={ref}
      className="sb-cinematic-hero relative min-h-[100dvh] overflow-hidden pt-24 pb-12 sm:pt-28 sm:pb-16"
    >
      {/* Atmospheric background layers */}
      <div className="sb-hero-bg" />
      <div className="sb-hero-lines" />
      <div className="sb-hero-floor" aria-hidden="true" />
      <div
        className="absolute bottom-0 left-0 right-0 h-px z-20"
        style={{
          background: 'linear-gradient(90deg, transparent 5%, rgba(255,106,26,0.5) 30%, rgba(0,212,255,0.3) 50%, rgba(255,106,26,0.5) 70%, transparent 95%)',
        }}
        aria-hidden="true"
      />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[calc(100dvh-8rem)]"
      >
        <motion.h1
          initial={{ opacity: 0, y: 22, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.85, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="sb-cinematic-title items-center"
        >
          <span className="sb-cinematic-line">SHOKHER</span>
          <span className="sb-cinematic-line sb-cinematic-line-accent">BIKEWALA</span>
        </motion.h1>

        {/* Social links — premium animated cards */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.44 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-8"
        >
          {[
            { Icon: Facebook, url: brandSettings.facebook, label: 'Facebook', tag: 'Follow', color: '#1877F2', gradient: 'from-[#1877F2] to-[#0d5cbf]' },
            { Icon: Instagram, url: brandSettings.instagram, label: 'Instagram', tag: 'Follow', color: '#E4405F', gradient: 'from-[#E4405F] via-[#C13584] to-[#F77737]' },
            { Icon: Music2, url: brandSettings.tiktok, label: 'TikTok', tag: 'Watch', color: '#00f2ea', gradient: 'from-[#00f2ea] to-[#ff0050]' },
            { Icon: MessageCircle, url: brandSettings.whatsapp, label: 'WhatsApp', tag: 'Chat', color: '#25D366', gradient: 'from-[#25D366] to-[#128C7E]' },
          ].map(({ Icon, url, label, tag, color, gradient }, i) => (
            <motion.a
              key={label}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.97 }}
              className="group relative flex items-center gap-3 px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl bg-bg/40 backdrop-blur-md border border-line overflow-hidden transition-all duration-300"
              style={{ '--social-color': color } as React.CSSProperties}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = color
                e.currentTarget.style.boxShadow = `0 0 24px ${color}30, 0 0 48px ${color}15`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = ''
                e.currentTarget.style.boxShadow = ''
              }}
            >
              {/* Animated gradient sweep on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `linear-gradient(135deg, ${color}10, transparent 60%)`,
                }}
              />

              {/* Icon circle with gradient */}
              <div className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg transition-shadow duration-300`}
                style={{ boxShadow: `0 4px 12px ${color}30` }}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                {/* Shine effect */}
                <motion.div
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.25), transparent 50%)',
                  }}
                />
              </div>

              {/* Label + tag */}
              <div className="relative flex flex-col">
                <span className="text-[9px] sm:text-[10px] font-ui uppercase tracking-[0.18em] text-fg-soft/60">
                  {tag}
                </span>
                <span className="text-xs sm:text-sm font-bold text-fg tracking-wide group-hover:text-white transition-colors duration-300">
                  {label}
                </span>
              </div>

              {/* Animated border glow on hover */}
              <motion.div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none"
                style={{
                  boxShadow: `inset 0 0 0 1px ${color}40`,
                }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>
          ))}
        </motion.div>

        {/* Gaming stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-10 flex items-center gap-6 sm:gap-10"
        >
          {stats.map((stat, i) => (
            <div key={stat.label} className="text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 + i * 0.08 }}
                className="font-display font-bold text-xl sm:text-2xl text-primary"
                style={{ textShadow: '0 0 20px rgba(255,106,26,0.35)' }}
              >
                {stat.value}
              </motion.div>
              <div className="font-racing text-[10px] sm:text-xs tracking-[0.2em] uppercase text-fg-muted mt-0.5">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Floating product cards — desktop only */}
        <div className="hidden lg:block">
          {orbitals.map((p, i) => {
            const cat = categories.find((c) => c.id === p.category_id)
            const price = p.discount_price ?? p.price
            const positions = [
              { top: '12%', left: '0%' },
              { top: '18%', right: '0%' },
              { bottom: '20%', left: '2%' },
              { bottom: '24%', right: '2%' },
            ]
            const pos = positions[i]
            if (!pos) return null
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 18, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.7,
                  delay: 0.5 + i * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="sb-orbital"
                style={{ position: 'absolute', ...pos, animation: `sb-orbital-hover 7s ease-in-out infinite`, animationDelay: `${-i * 1.5}s` }}
              >
                <Link to={`/products/${p.slug}`} className="sb-orbital-card">
                  <div className="sb-orbital-thumb">
                    <img src={p.images[0]} alt={p.name} loading="lazy" decoding="async" />
                  </div>
                  <div className="sb-orbital-meta">
                    <p className="sb-orbital-cat">{cat?.name ?? 'Gear'}</p>
                    <p className="sb-orbital-price">৳{price.toLocaleString()}</p>
                    <div className="sb-orbital-rating">
                      <Star className="w-3 h-3" />
                      <span>{(4.5 + ((i * 7) % 5) / 10).toFixed(1)}</span>
                    </div>
                  </div>
                  <span className="sb-orbital-plus" aria-hidden="true">+</span>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Mobile product strip */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.75 }}
          className="sb-orbital-strip lg:hidden mt-8"
        >
          {orbitals.map((p, i) => {
            const cat = categories.find((c) => c.id === p.category_id)
            const price = p.discount_price ?? p.price
            return (
              <Link
                key={p.id}
                to={`/products/${p.slug}`}
                className="sb-orbital-card sb-orbital-card-strip"
              >
                <div className="sb-orbital-thumb">
                  <img src={p.images[0]} alt={p.name} loading="lazy" decoding="async" />
                </div>
                <div className="sb-orbital-meta">
                  <p className="sb-orbital-cat">{cat?.name ?? 'Gear'}</p>
                  <p className="sb-orbital-price">৳{price.toLocaleString()}</p>
                  <div className="sb-orbital-rating">
                    <Star className="w-3 h-3" />
                    <span>{(4.5 + ((i * 7) % 5) / 10).toFixed(1)}</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </motion.div>
      </motion.div>
    </section>
  )
}
