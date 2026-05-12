import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Shield, Truck, CreditCard, Headphones, Award, Package, Trophy } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { useEffect, useState } from 'react'

const features = [
  {
    icon: Shield,
    title: 'Genuine Products',
    description: '100% authentic bike accessories with manufacturer warranty.',
    color: 'text-primary',
    border: 'group-hover:border-primary/35',
    glow: 'group-hover:shadow-[0_18px_44px_-18px_rgba(255,106,26,0.45)]',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Quick, tracked delivery across Bangladesh.',
    color: 'text-cyan',
    border: 'group-hover:border-cyan/35',
    glow: 'group-hover:shadow-[0_18px_44px_-18px_rgba(0,183,229,0.45)]',
  },
  {
    icon: CreditCard,
    title: 'Secure Payment',
    description: 'Multiple safe payment options — pay your way.',
    color: 'text-gold',
    border: 'group-hover:border-gold/35',
    glow: 'group-hover:shadow-[0_18px_44px_-18px_rgba(224,165,0,0.45)]',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'WhatsApp + chat support whenever you need help.',
    color: 'text-emerald-500',
    border: 'group-hover:border-emerald-500/35',
    glow: 'group-hover:shadow-[0_18px_44px_-18px_rgba(16,185,129,0.45)]',
  },
  {
    icon: Award,
    title: 'Best Prices',
    description: 'Competitive pricing on every premium product.',
    color: 'text-violet-500',
    border: 'group-hover:border-violet-500/35',
    glow: 'group-hover:shadow-[0_18px_44px_-18px_rgba(139,92,246,0.45)]',
  },
  {
    icon: Package,
    title: 'Easy Returns',
    description: 'Hassle-free return + exchange within policy window.',
    color: 'text-pink-500',
    border: 'group-hover:border-pink-500/35',
    glow: 'group-hover:shadow-[0_18px_44px_-18px_rgba(236,72,153,0.45)]',
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
    const duration = 1800
    const stepTime = 18
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
    <div ref={ref} className="stat-hud">
      <div className="text-2xl sm:text-4xl md:text-5xl font-display font-black mb-1 tracking-tight">
        <span className="text-gradient-primary">{count.toLocaleString()}{suffix}</span>
      </div>
      <p className="text-fg-muted text-[11px] sm:text-sm font-racing tracking-[0.2em] uppercase">{label}</p>
    </div>
  )
}

export default function FeaturesSection() {
  return (
    <section className="relative py-14 sm:py-24 speed-lines-bg">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-primary/[0.06] rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-cyan/[0.05] rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="divider-glow mb-10 sm:mb-14 rounded-full" />

        {/* Counter HUD */}
        <AnimatedSection className="mb-16 sm:mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
            <Counter end={5000} suffix="+" label="Products Sold" />
            <Counter end={2500} suffix="+" label="Happy Riders" />
            <Counter end={150} suffix="+" label="Brands" />
            <Counter end={99} suffix="%" label="Satisfaction" />
          </div>
        </AnimatedSection>

        <AnimatedSection className="text-center mb-10 sm:mb-16">
          <span className="section-eyebrow mb-3 sm:mb-4">
            <Trophy className="w-3 h-3" />
            Why Riders Trust Us
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-display font-bold mt-3 mb-3 sm:mb-4">
            <span className="text-gradient-headline">Why Choose </span>
            <span className="text-gradient-primary">Us</span>
          </h2>
          <p className="text-fg-muted max-w-xl mx-auto font-racing tracking-wide">
            Premium accessories, real delivery, real support — every ride.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
          {features.map((feature, i) => (
            <AnimatedSection key={feature.title} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                className={`premium-card racing-card group p-4 sm:p-6 transition-shadow ${feature.glow} ${feature.border}`}
              >
                <motion.div
                  whileHover={{ rotate: 8, scale: 1.08 }}
                  transition={{ type: 'spring', stiffness: 250, damping: 15 }}
                  className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-primary/10 to-cyan/10 border border-primary/15 flex items-center justify-center mb-3 sm:mb-4"
                >
                  <feature.icon className={`w-5 h-5 sm:w-7 sm:h-7 ${feature.color}`} />
                </motion.div>
                <h3 className="text-fg font-bold text-sm sm:text-lg mb-1 sm:mb-2 group-hover:text-primary transition-colors font-racing">
                  {feature.title}
                </h3>
                <p className="text-fg-muted text-xs sm:text-sm leading-relaxed">
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
