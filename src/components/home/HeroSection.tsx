import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronDown, Zap, Shield, Truck, Gauge, Flame } from 'lucide-react'
import ParticleBackground from '@/components/ui/ParticleBackground'
import { useEffect, useState } from 'react'

const taglines = [
  'Your Ultimate Bike Accessories Destination',
  'Ride With Style, Ride With Safety',
  'Premium Gear For Every Rider',
]

export default function HeroSection() {
  const [taglineIndex, setTaglineIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(true)

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
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
      <ParticleBackground />

      <div className="absolute inset-0 bg-gradient-to-b from-dark/80 via-dark/50 to-dark z-[1]" />

      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        {[20, 35, 50, 65, 80].map((top, i) => (
          <div
            key={top}
            className="absolute left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-speed-lines"
            style={{ top: `${top}%`, animationDelay: `${i * 0.4}s` }}
          />
        ))}
      </div>

      <div className="absolute inset-0 z-[1]">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gold/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-20 z-[1] checkered-accent opacity-20" />

      <div className="absolute inset-0 z-[1] opacity-[0.07] carbon-fiber" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-8"
        >
          <motion.div
            animate={{ rotate: [0, 3, -3, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-block"
          >
            <div className="w-20 h-20 sm:w-32 sm:h-32 mx-auto mb-4 sm:mb-6 rounded-2xl speedometer-ring flex items-center justify-center animate-neon-border overflow-hidden relative p-1">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-dark/80 to-cyan/10 rounded-2xl" />
              <img src="/logo.png" alt="Shokher Bike Wala" className="w-full h-full object-contain p-3 relative z-10 drop-shadow-[0_0_12px_rgba(255,69,0,0.3)]" />
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-4"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-racing tracking-widest uppercase">
            <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            Premium Bike Accessories
            <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-[2.5rem] leading-tight sm:text-6xl md:text-7xl lg:text-8xl font-display font-black mb-4 sm:mb-8"
        >
          <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            SHOKHER
          </span>
          <br />
          <motion.span
            className="bg-gradient-to-r from-primary via-primary-400 to-gold bg-clip-text text-transparent text-glow inline-block"
            animate={{ textShadow: ['0 0 20px rgba(255,69,0,0.3)', '0 0 40px rgba(255,69,0,0.6)', '0 0 20px rgba(255,69,0,0.3)'] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            BIKE WALA
          </motion.span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="h-7 sm:h-10 mb-6 sm:mb-10"
        >
          <p className="text-sm sm:text-xl md:text-2xl text-cyan font-racing font-light tracking-wide text-glow-cyan">
            {displayText}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="inline-block w-0.5 h-5 sm:h-6 bg-cyan ml-1 align-middle"
            />
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center mb-10 sm:mb-20 px-2 sm:px-0"
        >
          <Link to="/products" className="w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-primary to-primary-600 text-white font-bold rounded-xl text-sm sm:text-lg animate-pulse-glow hover:shadow-2xl hover:shadow-primary/40 transition-shadow flex items-center justify-center gap-2 font-racing tracking-wide"
            >
              <Flame className="w-5 h-5" />
              Explore Products
            </motion.button>
          </Link>
          <Link to="/contact" className="w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-4 border border-cyan/30 text-cyan font-bold rounded-xl text-sm sm:text-lg hover:bg-cyan/10 hover:border-cyan/60 transition-all flex items-center justify-center gap-2 font-racing tracking-wide"
            >
              <Gauge className="w-5 h-5" />
              Contact Us
            </motion.button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="grid grid-cols-3 gap-2 sm:gap-8 max-w-md sm:max-w-xl mx-auto"
        >
          {[
            { icon: Shield, label: 'Certified Quality', color: 'text-primary', glow: 'hover:shadow-primary/20' },
            { icon: Truck, label: 'Fast Delivery', color: 'text-cyan', glow: 'hover:shadow-cyan/20' },
            { icon: Zap, label: 'Best Prices', color: 'text-gold', glow: 'hover:shadow-gold/20' },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 + i * 0.15 }}
              whileHover={{ y: -4, scale: 1.05 }}
              className={`text-center p-3 sm:p-4 rounded-xl glass hud-border hover:shadow-lg ${item.glow} transition-all duration-300 cursor-default`}
            >
              <item.icon className={`w-6 h-6 sm:w-7 sm:h-7 mx-auto mb-1.5 sm:mb-2 ${item.color}`} />
              <span className="text-[10px] sm:text-xs text-gray-300 font-racing tracking-wide">{item.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-1"
        >
          <span className="text-[10px] text-gray-500 font-racing tracking-widest uppercase">Scroll</span>
          <ChevronDown className="w-5 h-5 text-gray-500" />
        </motion.div>
      </motion.div>
    </section>
  )
}
