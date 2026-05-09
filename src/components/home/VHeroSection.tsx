import { motion, useScroll, useTransform } from 'framer-motion'
import {
  ChevronDown,
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


  return (
    <section
      ref={ref}
      className="sb-cinematic-hero relative min-h-[100dvh] overflow-x-clip overflow-y-visible pt-20 pb-8 sm:pt-28 sm:pb-16"
    >
      {/* Atmospheric background layers */}
      <div className="sb-hero-floor" aria-hidden="true" />
      <div className="sb-hex-pattern" />
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
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
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
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden">
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
                className="w-20 h-20 sm:w-22 sm:h-22 object-contain drop-shadow-[0_0_20px_rgba(255,106,26,0.4)]"
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
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="sb-cinematic-title items-center"
        >
          <motion.span
            className="sb-cinematic-line sb-flicker"
            animate={{ textShadow: [
              '0 0 8px rgba(255,106,26,0.3), 0 0 24px rgba(255,106,26,0.1)',
              '0 0 16px rgba(255,106,26,0.5), 0 0 40px rgba(255,106,26,0.2)',
              '0 0 8px rgba(255,106,26,0.3), 0 0 24px rgba(255,106,26,0.1)',
            ] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            SHOKHER
          </motion.span>
          <span className="sb-cinematic-line sb-cinematic-line-accent sb-shimmer-text">BIKEWALA</span>
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
              initial={{ opacity: 0, y: 30, scale: 0.85, rotateX: 15 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.5 + i * 0.12 }}
              whileHover={{ scale: 1.08, y: -5, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
              whileTap={{ scale: 0.95 }}
              className="sb-social-card group relative flex items-center gap-3 px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl bg-bg/40 backdrop-blur-md border border-line overflow-hidden transition-all duration-300"
              style={{ '--social-color': color, '--social-gradient-start': color + '20', '--social-gradient-end': color + '05' } as React.CSSProperties}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = color
                e.currentTarget.style.boxShadow = `0 0 24px ${color}35, 0 8px 32px ${color}20, 0 0 60px ${color}10`
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
                  background: `linear-gradient(135deg, ${color}15, ${color}08 40%, transparent 70%)`,
                }}
              />

              {/* Shine sweep animation */}
              <div className="sb-social-shine absolute inset-0 pointer-events-none" />

              {/* Icon circle with gradient + pulse */}
              <div className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg transition-all duration-300 group-hover:shadow-xl`}
                style={{ boxShadow: `0 4px 16px ${color}35` }}
              >
                <motion.div
                  className="absolute inset-0 rounded-xl"
                  style={{ background: `${color}`, opacity: 0 }}
                  animate={{ opacity: [0, 0.3, 0], scale: [1, 1.4, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.5, ease: 'easeInOut' }}
                />
                <Icon className="relative z-10 w-4 h-4 sm:w-5 sm:h-5 text-white" />
                <motion.div
                  className="absolute inset-0 rounded-xl pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.3), transparent 50%)',
                  }}
                />
              </div>

              {/* Label + tag */}
              <div className="relative flex flex-col">
                <span className="text-[9px] sm:text-[10px] font-ui uppercase tracking-[0.18em] text-fg-soft/60 group-hover:text-fg-soft transition-colors duration-300">
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

        {/* Animated scroll-down indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="mt-8 sm:mt-10 flex flex-col items-center gap-1"
        >
          <span className="text-[9px] font-ui uppercase tracking-[0.25em] text-fg-soft/50">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="w-5 h-5 text-primary/60" />
          </motion.div>
          <motion.div
            className="w-px h-8 bg-gradient-to-b from-primary/40 to-transparent"
            animate={{ scaleY: [0.5, 1, 0.5], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

      </motion.div>
    </section>
  )
}
