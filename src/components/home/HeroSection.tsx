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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <ParticleBackground />

      <div className="absolute inset-0 bg-gradient-to-b from-dark/80 via-dark/60 to-dark z-[1]" />

      {/* Animated speed lines */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-speed-lines" style={{ animationDelay: '0s' }} />
        <div className="absolute top-[40%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan/20 to-transparent animate-speed-lines" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-[60%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/20 to-transparent animate-speed-lines" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[80%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-speed-lines" style={{ animationDelay: '0.3s' }} />
      </div>

      <div className="absolute inset-0 z-[1]">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gold/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Checkered flag accent */}
      <div className="absolute bottom-0 left-0 right-0 h-16 z-[1] checkered-accent opacity-30" />

      <div className="absolute inset-0 z-[1] opacity-10">
        <div
          className="absolute inset-0 speed-lines-bg"
          style={{
            backgroundImage: `linear-gradient(rgba(255,69,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,69,0,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-6"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-block"
          >
            <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-6 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center animate-neon-border border border-primary/20 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-cyan/10" />
              <img src="/logo.png" alt="Shokher Bike Wala" className="w-full h-full object-contain p-2 relative z-10" />
            </div>
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-black mb-8"
        >
          <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
            SHOKHER
          </span>
          <br />
          <span className="bg-gradient-to-r from-primary via-primary-400 to-gold bg-clip-text text-transparent text-glow">
            BIKE WALA
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="h-8 mb-10"
        >
          <p className="text-lg sm:text-xl md:text-2xl text-cyan font-light tracking-wide text-glow-cyan">
            {displayText}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="inline-block w-0.5 h-6 bg-cyan ml-1 align-middle"
            />
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-5 justify-center mb-20"
        >
          <Link to="/products">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 bg-gradient-to-r from-primary to-primary-600 text-white font-bold rounded-xl text-lg animate-pulse-glow hover:shadow-2xl hover:shadow-primary/40 transition-shadow flex items-center gap-2"
            >
              <Flame className="w-5 h-5" />
              Explore Products
            </motion.button>
          </Link>
          <Link to="/contact">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 border border-cyan/30 text-cyan font-bold rounded-xl text-lg hover:bg-cyan/10 hover:border-cyan/60 transition-all flex items-center gap-2"
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
          className="grid grid-cols-3 gap-8 max-w-xl mx-auto"
        >
          {[
            { icon: Shield, label: 'Certified Quality', color: 'text-primary' },
            { icon: Truck, label: 'Fast Delivery', color: 'text-cyan' },
            { icon: Zap, label: 'Best Prices', color: 'text-gold' },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 + i * 0.15 }}
              className="text-center p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/5 hover:border-primary/20 transition-all"
            >
              <item.icon className={`w-7 h-7 mx-auto mb-2 ${item.color}`} />
              <span className="text-xs text-gray-300 font-medium">{item.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown className="w-6 h-6 text-gray-500" />
        </motion.div>
      </motion.div>
    </section>
  )
}
