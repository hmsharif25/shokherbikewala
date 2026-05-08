import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Shield, Truck, CreditCard, Headphones, Award, Package } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { useEffect, useState } from 'react'

const features = [
  {
    icon: Shield,
    title: 'Genuine Products',
    description: '100% authentic bike accessories with warranty',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Quick delivery across Bangladesh',
    color: 'text-cyan',
    bg: 'bg-cyan/10',
  },
  {
    icon: CreditCard,
    title: 'Secure Payment',
    description: 'Multiple safe payment options available',
    color: 'text-gold',
    bg: 'bg-gold/10',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'WhatsApp support anytime you need',
    color: 'text-green-400',
    bg: 'bg-green-400/10',
  },
  {
    icon: Award,
    title: 'Best Prices',
    description: 'Competitive prices on all products',
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
  },
  {
    icon: Package,
    title: 'Easy Returns',
    description: 'Hassle-free return and exchange policy',
    color: 'text-pink-400',
    bg: 'bg-pink-400/10',
  },
]

interface CounterProps {
  end: number
  suffix?: string
  label: string
}

function Counter({ end, suffix = '', label }: CounterProps) {
  const [count, setCount] = useState(0)
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.5 })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 2000
    const stepTime = 20
    const steps = duration / stepTime
    const increment = end / steps

    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, stepTime)

    return () => clearInterval(timer)
  }, [inView, end])

  return (
    <div ref={ref} className="text-center">
      <div className="text-2xl sm:text-4xl md:text-5xl font-display font-black text-white mb-1">
        {count.toLocaleString()}
        <span className="text-primary">{suffix}</span>
      </div>
      <p className="text-gray-400 text-sm">{label}</p>
    </div>
  )
}

export default function FeaturesSection() {
  return (
    <section className="relative py-14 sm:py-24 speed-lines-bg">
      <div className="absolute inset-0">
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-cyan/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="racing-stripe-divider mb-10 sm:mb-14 rounded-full" />

        <AnimatedSection className="mb-16 sm:mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 py-8 sm:py-12 px-4 sm:px-8 rounded-2xl glass-premium tachometer-glow hud-border">
            <Counter end={5000} suffix="+" label="Products Sold" />
            <Counter end={2500} suffix="+" label="Happy Riders" />
            <Counter end={150} suffix="+" label="Brands" />
            <Counter end={99} suffix="%" label="Satisfaction" />
          </div>
        </AnimatedSection>

        <AnimatedSection className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-display font-bold mb-4">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Why Choose{' '}
            </span>
            <span className="bg-gradient-to-r from-primary to-cyan bg-clip-text text-transparent">
              Us
            </span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            We provide the best riding experience with premium accessories
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
          {features.map((feature, i) => (
            <AnimatedSection key={feature.title} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                className="p-4 sm:p-6 rounded-2xl glass racing-card group hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 border border-white/5 hover:border-primary/15"
              >
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl ${feature.bg} flex items-center justify-center mb-3 sm:mb-4`}
                >
                  <feature.icon className={`w-5 h-5 sm:w-7 sm:h-7 ${feature.color}`} />
                </motion.div>
                <h3 className="text-white font-bold text-sm sm:text-lg mb-1 sm:mb-2 group-hover:text-primary transition-colors font-racing">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
