import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import {
  ChevronDown,
  Facebook,
  Instagram,
  MessageCircle,
  Music2,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useStore } from '@/context/StoreContext'

function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mql = window.matchMedia('(hover: none) and (pointer: coarse)')
    const update = () => setIsTouch(mql.matches)
    update()
    mql.addEventListener?.('change', update)
    return () => mql.removeEventListener?.('change', update)
  }, [])
  return isTouch
}

export default function VHeroSection() {
  const { brandSettings } = useStore()
  const ref = useRef<HTMLElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const isTouch = useIsTouchDevice()
  const disableParallax = isTouch || !!prefersReducedMotion

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  })
  const yDesktop = useTransform(smoothProgress, [0, 1], [0, -40])
  const opacityDesktop = useTransform(smoothProgress, [0, 0.85], [1, 0.25])
  const yStatic = useTransform(scrollYProgress, () => 0)
  const opacityStatic = useTransform(scrollYProgress, () => 1)
  const y: MotionValue<number> = disableParallax ? yStatic : yDesktop
  const opacity: MotionValue<number> = disableParallax
    ? opacityStatic
    : opacityDesktop

  return (
    <section
      ref={ref}
      className="sb-cinematic-hero relative min-h-[100svh] overflow-x-clip overflow-y-visible pt-20 pb-8 sm:pt-28 sm:pb-16"
    >
      <div className="sb-hero-floor" aria-hidden="true" />

      <motion.div
        style={{
          y,
          opacity,
          willChange: disableParallax ? 'auto' : 'transform, opacity',
          ...(disableParallax
            ? null
            : { backfaceVisibility: 'hidden', transform: 'translateZ(0)' }),
        }}
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[calc(100svh-8rem)]"
      >
        {/* Brand logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative mb-6 sm:mb-8"
        >
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border border-primary/20">
            <div className="absolute inset-0 bg-bg/60 backdrop-blur-sm rounded-full" />
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src={brandSettings.logo_url || '/logo.png'}
                alt={brandSettings.brand_name}
                className="w-20 h-20 sm:w-22 sm:h-22 object-contain"
              />
            </div>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="sb-cinematic-title items-center"
        >
          <span className="sb-cinematic-line">
            SHOKHER
          </span>
          <span className="sb-cinematic-line sb-cinematic-line-accent">
            BIKEWALA
          </span>
        </motion.h1>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-8"
        >
          {[
            { Icon: Facebook, url: brandSettings.facebook, label: 'Facebook', tag: 'Follow', color: '#1877F2', gradient: 'from-[#1877F2] to-[#0d5cbf]' },
            { Icon: Instagram, url: brandSettings.instagram, label: 'Instagram', tag: 'Follow', color: '#E4405F', gradient: 'from-[#E4405F] via-[#C13584] to-[#F77737]' },
            { Icon: Music2, url: brandSettings.tiktok, label: 'TikTok', tag: 'Watch', color: '#00f2ea', gradient: 'from-[#00f2ea] to-[#ff0050]' },
            { Icon: MessageCircle, url: brandSettings.whatsapp, label: 'WhatsApp', tag: 'Chat', color: '#25D366', gradient: 'from-[#25D366] to-[#128C7E]' },
          ].map(({ Icon, url, label, tag, gradient }, i) => (
            <motion.a
              key={label}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 + i * 0.08 }}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="group relative flex items-center gap-3 px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl bg-bg/50 backdrop-blur-sm border border-line/40 overflow-hidden transition-colors duration-200 hover:border-line"
            >
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md`}>
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] sm:text-[10px] font-ui uppercase tracking-[0.18em] text-fg-soft/60">
                  {tag}
                </span>
                <span className="text-xs sm:text-sm font-bold text-fg tracking-wide">
                  {label}
                </span>
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-8 sm:mt-10 flex flex-col items-center gap-1"
        >
          <span className="text-[9px] font-ui uppercase tracking-[0.25em] text-fg-soft/50">Scroll</span>
          <ChevronDown className="w-5 h-5 text-primary/50" />
        </motion.div>

      </motion.div>
    </section>
  )
}
