import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronDown, Zap, Shield, Truck, Flame, ArrowRight, Star, Sparkles } from 'lucide-react'
import ParticleBackground from '@/components/ui/ParticleBackground'
import { useEffect, useRef, useState } from 'react'

const taglines = [
  'Your Ultimate Bike Accessories Destination',
  'Ride With Style, Ride With Safety',
  'Premium Gear For Every Rider',
]

export default function HeroSection() {
  const [taglineIndex, setTaglineIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] })
  const yShift = useTransform(scrollYProgress, [0, 1], [0, -120])
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  useEffect(() => {
    const currentTagline = taglines[taglineIndex]

    if (isTyping) {
      if (displayText.length < currentTagline.length) {
        const timeout = setTimeout(() => {
          setDisplayText(currentTagline.slice(0, displayText.length + 1))
        }, 50)
        return () => clearTimeout(timeout)
      } else {
        const timeout = setTimeout(() => setIsTyping(false), 2000)
        return () => clearTimeout(timeout)
      }
    } else {
      if (displayText.length > 0) {
        const timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1))
        }, 30)
        return () => clearTimeout(timeout)
      } else {
        setTaglineIndex((prev) => (prev + 1) % taglines.length)
        setIsTyping(true)
      }
    }
  }, [displayText, isTyping, taglineIndex])

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden"
    >
      {/* Layered backdrops */}
      <ParticleBackground />
      <div className="absolute inset-0 premium-mesh-bg z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-b from-bg/40 via-bg/20 to-bg z-[1]" />

      {/* Speed lines */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        {[18, 32, 48, 62, 78].map((top, i) => (
          <div
            key={top}
            className="absolute left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-speed-lines"
            style={{ top: `${top}%`, animationDelay: `${i * 0.4}s` }}
          />
        ))}
      </div>

      {/* Floating glow blobs */}
      <div className="absolute inset-0 z-[1]">
        <motion.div
          animate={{ y: [0, -22, 0], x: [0, 8, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 left-10 w-72 h-72 bg-primary/12 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 22, 0], x: [0, -12, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-cyan/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, -18, 0], x: [0, -10, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 w-72 h-72 bg-gold/8 rounded-full blur-3xl"
        />
      </div>

      {/* Checkered floor accent */}
      <div className="absolute bottom-0 left-0 right-0 h-20 z-[1] checkered-accent opacity-30" />

      <motion.div
        style={{ y: yShift, opacity: fade }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24 text-center"
      >
        {/* Animated logo with rotating gradient ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="mb-7"
        >
          <motion.div
            animate={{ rotate: [0, 4, -4, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-block"
          >
            <div className="premium-frame w-20 h-20 sm:w-28 sm:h-28 mx-auto mb-3 rounded-2xl flex items-center justify-center overflow-hidden relative p-1">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-bg-2/50 to-cyan/15 rounded-2xl" />
              <img
                src="/logo.png"
                alt="Shokher Bikewala"
                className="w-full h-full object-contain p-3 relative z-10 drop-shadow-[0_0_18px_rgba(255,106,26,0.45)]"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Brand chip */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mb-5"
        >
          <span className="chrome-chip">
            <Sparkles className="w-3.5 h-3.5" />
            Premium Bike Accessories
            <span className="dot-pulse" />
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25 }}
          className="text-[2.6rem] leading-[1.05] sm:text-6xl md:text-7xl lg:text-[5.5rem] font-display font-black mb-5 sm:mb-8 tracking-tight"
        >
          <span className="text-gradient-headline">SHOKHER</span>
          <br />
          <span className="text-gradient-fire">BIKE WALA</span>
        </motion.h1>

        {/* Animated typewriter tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="h-7 sm:h-10 mb-8 sm:mb-10"
        >
          <p className="text-sm sm:text-xl md:text-2xl text-cyan font-racing font-medium tracking-wide text-glow-cyan">
            {displayText}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="inline-block w-0.5 h-5 sm:h-6 bg-cyan ml-1 align-middle"
            />
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 px-2 sm:px-0"
        >
          <Link to="/products" className="w-full sm:w-auto">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn-premium w-full sm:w-auto"
            >
              <Flame className="w-4 h-4 sm:w-5 sm:h-5" />
              Explore Products
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.div>
          </Link>
          <Link to="/contact" className="w-full sm:w-auto">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn-ghost w-full sm:w-auto"
            >
              Contact Us
              <ArrowRight className="w-4 h-4 opacity-70" />
            </motion.div>
          </Link>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="grid grid-cols-3 gap-2 sm:gap-5 max-w-md sm:max-w-2xl mx-auto"
        >
          {[
            { icon: Shield, label: 'Certified Quality', tone: 'text-primary' },
            { icon: Truck, label: 'Fast Delivery', tone: 'text-cyan' },
            { icon: Zap, label: 'Best Prices', tone: 'text-gold' },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 + i * 0.1 }}
              whileHover={{ y: -4 }}
              className="premium-card p-3 sm:p-4 text-center cursor-default"
            >
              <item.icon className={`w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1.5 sm:mb-2 ${item.tone}`} />
              <span className="text-[10px] sm:text-xs text-fg-muted font-racing tracking-wider uppercase">{item.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust rating row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="mt-8 sm:mt-12 flex items-center justify-center gap-3 text-xs text-fg-muted font-racing"
        >
          <span className="rating-strip">
            <Star className="w-3 h-3 fill-current" />
            4.9/5
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline tracking-widest uppercase">2,500+ Happy Riders</span>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="scroll-cue">
          <span className="scroll-cue-tube" />
          <span className="text-[10px] text-fg-soft font-racing tracking-[0.25em] uppercase">Scroll</span>
          <ChevronDown className="w-4 h-4 text-fg-soft" />
        </div>
      </motion.div>
    </section>
  )
}
