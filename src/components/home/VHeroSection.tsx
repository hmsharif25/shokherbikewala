import { motion, useScroll, useTransform } from 'framer-motion'
import {
  Facebook,
  Instagram,
  MessageCircle,
  Music2,
} from 'lucide-react'
import { useRef } from 'react'
import { useStore } from '@/context/StoreContext'

export default function VHeroSection() {
  const { brandSettings } = useStore()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [0, -40])
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.25])

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
        {/* Premium brand icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6, filter: 'blur(12px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="relative mb-6 sm:mb-8"
        >
          {/* Outer rotating ring */}
          <motion.div
            className="absolute inset-[-18px] sm:inset-[-24px] rounded-full border border-primary/20"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(255,106,26,0.6)]" />
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,183,229,0.6)]" />
          </motion.div>

          {/* Counter-rotating inner ring */}
          <motion.div
            className="absolute inset-[-8px] sm:inset-[-12px] rounded-full border border-white/[0.06]"
            animate={{ rotate: -360 }}
            transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
          >
            <span className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary/60" />
          </motion.div>

          {/* Pulsing glow behind */}
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              boxShadow: [
                '0 0 30px rgba(255,106,26,0.15), 0 0 60px rgba(255,106,26,0.08)',
                '0 0 50px rgba(255,106,26,0.25), 0 0 100px rgba(255,106,26,0.12)',
                '0 0 30px rgba(255,106,26,0.15), 0 0 60px rgba(255,106,26,0.08)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Main icon container */}
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden">
            {/* Glass background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-full" />

            {/* Gradient accent ring */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'conic-gradient(from 0deg, rgba(255,106,26,0.3), transparent 25%, rgba(0,183,229,0.2) 50%, transparent 75%, rgba(255,106,26,0.3))',
                mask: 'radial-gradient(circle, transparent 60%, black 62%, black 100%)',
                WebkitMask: 'radial-gradient(circle, transparent 60%, black 62%, black 100%)',
              }}
            />

            {/* Brand logo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src={brandSettings.logo_url || '/logo.png'}
                alt={brandSettings.brand_name}
                className="w-16 h-16 sm:w-22 sm:h-22 object-contain drop-shadow-[0_0_16px_rgba(255,106,26,0.35)]"
              />
            </div>

            {/* Shine sweep */}
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 45%, rgba(255,255,255,0.05) 50%, transparent 55%)',
              }}
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear', repeatDelay: 3 }}
            />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 22, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
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


      </motion.div>
    </section>
  )
}
