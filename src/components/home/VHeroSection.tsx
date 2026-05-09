import { motion, useScroll, useTransform } from 'framer-motion'
import {
  ArrowRight,
  Globe,
  Lock,
  ShieldCheck,
  ShoppingBag,
  Star,
} from 'lucide-react'
import { useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '@/context/StoreContext'

/**
 * Cinematic hero modeled on the "RIDE WITH POWER" reference.
 *
 * Layout: split composition. The headline + CTA live on the left,
 * a luxe sport-bike showroom plate sits on the right with floating
 * product cards orbiting it (helmet, exhaust, gloves, wheels).
 * Mobile collapses to a stacked layout where the bike sits below
 * the headline and the product cards become a horizontal scroll
 * strip — keeping the cinematic feel without sacrificing reach.
 */
export default function VHeroSection() {
  const { products, categories } = useStore()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [0, -40])
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.25])

  // Pick four "orbital" products around the bike. We prefer
  // featured items from distinct categories so the cluster reads
  // like a real lookbook (helmet / exhaust / gloves / wheels).
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

  // The hero centerpiece must be a sport bike — never a helmet
  // crop from the catalog. We hardcode a reliable Unsplash photo
  // (Ducati-style superbike on white) so the cinematic stage always
  // reads as a "motorcycle showroom" regardless of demo data shape.
  const heroBike =
    'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1400&q=85'

  const trustChips = [
    { Icon: ShieldCheck, label: 'Premium\nQuality' },
    { Icon: Globe, label: 'Worldwide\nShipping' },
    { Icon: Lock, label: 'Secure\nPayment' },
    { Icon: Star, label: '2 Year\nWarranty' },
  ]

  // 4 orbital slots (TL, TR, BL, BR) tuned for desktop.
  // Mobile uses a horizontal scroller instead.
  const slots = [
    { className: 'sb-orbital sb-orbital-tl' },
    { className: 'sb-orbital sb-orbital-tr' },
    { className: 'sb-orbital sb-orbital-bl' },
    { className: 'sb-orbital sb-orbital-br' },
  ] as const

  return (
    <section
      ref={ref}
      className="sb-cinematic-hero relative min-h-[100dvh] overflow-hidden pt-24 pb-12 sm:pt-28 sm:pb-16"
    >
      {/* Atmospheric background layers */}
      <div className="sb-hero-bg" />
      <div className="sb-hero-lines" />
      <div className="sb-hero-floor" aria-hidden="true" />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1.4fr] gap-10 lg:gap-12 items-center">
          {/* ====================== LEFT — Copy ====================== */}
          <div className="relative text-center lg:text-left order-2 lg:order-1">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="sb-eyebrow-bar mx-auto lg:mx-0"
            >
              <span className="sb-eyebrow-bar-line" />
              Premium Motorcycle Accessories
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 22, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.85, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="sb-cinematic-title"
            >
              <span className="sb-cinematic-line">RIDE</span>
              <span className="sb-cinematic-line sb-cinematic-line-mid">WITH</span>
              <span className="sb-cinematic-line sb-cinematic-line-accent">POWER</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.32 }}
              className="sb-cinematic-copy"
            >
              High performance accessories for those who live to ride. Built for
              speed, designed for dominance.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.44 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mt-7"
            >
              <Link to="/products" className="sb-cta-primary group">
                <ShoppingBag className="w-4 h-4" />
                Shop Collection
                <span className="sb-cta-pin">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </motion.div>

            {/* Trust strip — desktop sits below CTA */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="sb-trust-cluster"
            >
              {trustChips.map(({ Icon, label }) => (
                <div key={label} className="sb-trust-cell">
                  <span className="sb-trust-ico">
                    <Icon className="w-3.5 h-3.5" />
                  </span>
                  <span className="sb-trust-label">{label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ====================== RIGHT — Stage ====================== */}
          <div className="relative order-1 lg:order-2">
            <div className="sb-bike-stage">
              {/* Ambient orange glow halo */}
              <span className="sb-stage-glow" aria-hidden="true" />
              <span className="sb-stage-ring" aria-hidden="true" />

              {/* The hero bike */}
              <motion.img
                initial={{ opacity: 0, scale: 0.94, x: 18 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
                src={heroBike}
                alt="Premium sport motorcycle"
                className="sb-bike-img"
                loading="eager"
                fetchPriority="high"
              />

              {/* Floating orbital product cards (desktop) */}
              {orbitals.map((p, i) => {
                const cat = categories.find((c) => c.id === p.category_id)
                const price = p.discount_price ?? p.price
                const rating = (4.5 + ((i * 7) % 5) / 10).toFixed(1)
                const slot = slots[i]
                if (!slot) return null
                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 18, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      duration: 0.7,
                      delay: 0.4 + i * 0.12,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className={slot.className}
                  >
                    <Link to={`/products/${p.slug}`} className="sb-orbital-card">
                      <div className="sb-orbital-thumb">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <div className="sb-orbital-meta">
                        <p className="sb-orbital-cat">{cat?.name ?? 'Gear'}</p>
                        <p className="sb-orbital-price">৳{price.toLocaleString()}</p>
                        <div className="sb-orbital-rating">
                          <Star className="w-3 h-3" />
                          <span>{rating}</span>
                        </div>
                      </div>
                      <span className="sb-orbital-plus" aria-hidden="true">+</span>
                    </Link>
                  </motion.div>
                )
              })}
            </div>

            {/* Mobile orbital strip — horizontally scrollable below bike */}
            <div className="sb-orbital-strip lg:hidden">
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
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
