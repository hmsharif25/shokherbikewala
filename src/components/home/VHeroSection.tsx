import { motion, useScroll, useTransform } from 'framer-motion'
import {
  ArrowUpRight,
  Facebook,
  Instagram,
  Music2,
  ShieldCheck,
  ShoppingBag,
  Youtube,
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
  const y = useTransform(scrollYProgress, [0, 1], [0, -36])
  const opacity = useTransform(scrollYProgress, [0, 0.78], [1, 0.2])

  const socials = [
    { Icon: Instagram, url: brandSettings.instagram, label: 'Instagram' },
    { Icon: Facebook, url: brandSettings.facebook, label: 'Facebook' },
    { Icon: Music2, url: brandSettings.tiktok, label: 'TikTok' },
    { Icon: Youtube, url: 'https://www.youtube.com/results?search_query=Shokher%20Bikewala', label: 'YouTube' },
  ]

  return (
    <section ref={ref} className="sb-simple-hero relative min-h-[100dvh] overflow-hidden pt-28 pb-16 sm:pt-32">
      <div className="sb-hero-bg" />
      <div className="sb-hero-lines" />

      <motion.div style={{ y, opacity }} className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 min-h-[calc(100dvh-11rem)] flex items-center justify-center text-center">
        <div className="w-full max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="sb-brand-card mx-auto"
          >
            <div className="sb-logo-ring mx-auto" aria-label="Shokher Bikewala logo">
              <img src="/logo.png" alt="Shokher Bikewala" className="w-20 h-20 sm:w-24 sm:h-24 object-contain" />
            </div>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12 }}
              className="sb-kicker"
            >
              Premium Motorcycle Accessories
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 18, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.72, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="sb-hero-title"
            >
              Shokher Bikewala
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.58, delay: 0.28 }}
              className="sb-tagline"
            >
              BUILT FOR RIDERS
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.58, delay: 0.36 }}
              className="sb-hero-copy"
            >
              Clean, premium bike gear shopping with a light gaming feel — fast, minimal, animated, and made for riders.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.58, delay: 0.44 }}
              className="sb-social-row"
            >
              {socials.map(({ Icon, url, label }) => (
                <a key={label} href={url} target="_blank" rel="noopener noreferrer" aria-label={label} className="sb-social-pill">
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </a>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.58, delay: 0.52 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8"
            >
              <Link to="/products" className="sb-primary-btn">
                <ShoppingBag className="w-4 h-4" />
                Shop Now
              </Link>
              <Link to="/about" className="sb-secondary-btn">
                Explore Brand
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.62 }}
            className="sb-trust-strip"
          >
            {['Premium Quality', 'Fast Delivery', 'Rider Focused'].map((item) => (
              <span key={item}>
                <ShieldCheck className="w-4 h-4" />
                {item}
              </span>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
