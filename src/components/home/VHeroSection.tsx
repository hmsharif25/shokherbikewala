import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Star,
  Plus,
  Shield,
  Globe,
  Lock,
  Award,
  Instagram,
  Facebook,
  Music2,
  MessageCircle,
} from 'lucide-react'
import { useRef } from 'react'
import { useStore } from '@/context/StoreContext'

const FEATURE_CHIPS = [
  { icon: Shield, label: 'Premium\nQuality' },
  { icon: Globe, label: 'Worldwide\nShipping' },
  { icon: Lock, label: 'Secure\nPayment' },
  { icon: Award, label: '2 Year\nWarranty' },
]

/**
 * Cinematic hero — modeled on the Velocity Customs reference layout.
 *
 * Structure (desktop):
 *   left column  — eyebrow, brand wordmark + tagline, italic Orbitron
 *                  headline, body copy, magnetic CTA, social row
 *   right column — bike on a curved orange neon showroom ring with
 *                  four floating glass product cards pinned around it
 *                  and a feature-chip strip in the bottom-right
 *
 * Mobile pares this down dramatically: just the brand block, headline,
 * one CTA, the bike on the ring, and a clean 4-up feature chip strip.
 * No duplicate stacked product cards on phones.
 */
export default function VHeroSection() {
  const { products, categories, brandSettings } = useStore()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const yShift = useTransform(scrollYProgress, [0, 1], [0, -80])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0.15])
  const ringScale = useTransform(scrollYProgress, [0, 1], [1, 1.05])

  // Pick four "pinned" products for the floating cards.
  const featured = products.filter((p) => p.featured && p.images?.[0])
  const pool = featured.length >= 4 ? featured : products
  const pinned = pool.slice(0, 4)

  // Brand-configured hero image; defaults to the Velocity-style white
  // sportbike that ships with the project (matches the reference).
  const heroImage = brandSettings.hero_image_url || '/brand/hero-bike.png'

  const brandName = brandSettings.brand_name || 'Shokher Bike Wala'

  // Defined once so the desktop bottom row and the mobile column
  // render the exact same set of social icons.
  const socialItems = [
    { icon: Instagram, url: brandSettings.instagram, label: 'Instagram' },
    { icon: Facebook, url: brandSettings.facebook, label: 'Facebook' },
    { icon: Music2, url: brandSettings.tiktok, label: 'TikTok' },
    { icon: MessageCircle, url: brandSettings.whatsapp, label: 'WhatsApp' },
  ]

  return (
    <section
      ref={ref}
      className="relative min-h-[100dvh] flex items-center overflow-hidden pt-24 pb-24 md:pt-28 md:pb-24"
    >
      {/* Ambient backdrop layers */}
      <div className="absolute inset-0 v-hero-halo" />

      {/* Soft animated orange glow behind the bike */}
      <motion.div
        animate={{ x: [0, 24, 0], opacity: [0.4, 0.65, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 right-0 w-[60%] h-[80%] -translate-y-1/2 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center right, rgba(255,122,31,0.18), transparent 65%)',
          filter: 'blur(40px)',
        }}
      />

      <motion.div
        style={{ y: yShift, opacity: fade }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
      >
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-4 items-center">
          {/* Left column: copy */}
          <div className="lg:col-span-5 relative z-20 space-y-5 sm:space-y-7 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="inline-flex"
            >
              <span className="v-eyebrow">Premium Motorcycle Accessories</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="v-headline text-[3.25rem] xs:text-6xl sm:text-7xl md:text-8xl lg:text-[7rem] xl:text-[7.75rem]"
            >
              RIDE
              <br />
              WITH
              <br />
              <em>POWER</em>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-fg-muted text-base sm:text-lg max-w-md mx-auto lg:mx-0 leading-relaxed font-ui"
            >
              High performance accessories for those who live to ride. Built for
              speed, designed for dominance.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.42 }}
              className="flex items-center justify-center lg:justify-start"
            >
              <span className="v-cta-wrap">
                <Link to="/products" className="v-pill-cta">
                  Shop Collection
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/25 ml-1">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              </span>
            </motion.div>

            {/* Social row — mobile only; desktop variant lives in the
                bottom row alongside the feature chips so they align. */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="lg:hidden flex items-center gap-3 justify-center pt-1"
            >
              {socialItems.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-fg-soft hover:text-primary transition-colors border border-line/60 hover:border-primary/40 bg-bg/40"
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </motion.div>
          </div>

          {/* Right column: bike on showroom ring + four floating cards */}
          <div className="lg:col-span-7 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
              className="relative aspect-[1.0] sm:aspect-[1.05] lg:aspect-[0.95] w-full lg:-mr-4 xl:-mr-6"
            >
              {/* Curved orange neon showroom ring */}
              <motion.div className="v-show-ring" style={{ scale: ringScale }} />

              {/* Bike — pulled larger; allowed to slightly overflow the box */}
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src={heroImage}
                  alt={`${brandName} — premium sportbike`}
                  className="relative z-[1] w-full h-full object-contain object-center scale-110 sm:scale-115 lg:scale-125 xl:scale-130 drop-shadow-[0_30px_60px_rgba(255,90,0,0.35)]"
                  loading="eager"
                />
              </div>

              {/* Floating product cards — desktop only, four positioned
                  to mirror the reference (TL/TR/ML/MR). */}
              <div className="absolute inset-0 hidden md:block pointer-events-none z-[2]">
                {pinned[0] && (
                  <FloatingProductCard
                    product={pinned[0]}
                    categoryName={categories.find((c) => c.id === pinned[0].category_id)?.name}
                    rating={4.9}
                    className="absolute v-pin-tl w-[12rem] xl:w-[13.5rem] v-float-anim"
                  />
                )}
                {pinned[1] && (
                  <FloatingProductCard
                    product={pinned[1]}
                    categoryName={categories.find((c) => c.id === pinned[1].category_id)?.name}
                    rating={4.8}
                    className="absolute v-pin-tr w-[12rem] xl:w-[13.5rem] v-float-anim delay-2"
                  />
                )}
                {pinned[2] && (
                  <FloatingProductCard
                    product={pinned[2]}
                    categoryName={categories.find((c) => c.id === pinned[2].category_id)?.name}
                    rating={4.7}
                    className="absolute v-pin-ml w-[12rem] xl:w-[13.5rem] v-float-anim delay-1"
                  />
                )}
                {pinned[3] && (
                  <FloatingProductCard
                    product={pinned[3]}
                    categoryName={categories.find((c) => c.id === pinned[3].category_id)?.name}
                    rating={4.9}
                    className="absolute v-pin-mr w-[12rem] xl:w-[13.5rem] v-float-anim"
                  />
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Desktop bottom row — social icons (left) and the compact
            feature-chip capsule (right) sit on the same line so they
            visually align with each other. */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="hidden lg:flex items-center justify-between mt-6"
        >
          <div className="flex items-center gap-3">
            {socialItems.map((s) => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-9 h-9 rounded-full flex items-center justify-center text-fg-soft hover:text-primary transition-colors border border-line/60 hover:border-primary/40 bg-bg/40"
              >
                <s.icon className="w-4 h-4" />
              </a>
            ))}
          </div>

          <div className="v-capsule rounded-2xl px-2.5 py-2 flex items-center gap-1">
            {FEATURE_CHIPS.map((c) => (
              <div
                key={c.label}
                className="flex flex-col items-center text-center w-[3.75rem] px-1"
              >
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center mb-1 border border-primary/20">
                  <c.icon className="w-3 h-3 text-primary" />
                </div>
                <span className="text-[9px] font-ui font-bold tracking-wider uppercase whitespace-pre-line leading-tight text-fg-muted">
                  {c.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Mobile feature chips — single clean row, no duplicate cards */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="md:hidden mt-6 v-capsule rounded-2xl px-2 py-3 grid grid-cols-4 gap-1"
        >
          {FEATURE_CHIPS.map((c) => (
            <div key={c.label} className="flex flex-col items-center text-center px-1">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-1 border border-primary/20">
                <c.icon className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="text-[9px] font-ui font-bold tracking-wider uppercase whitespace-pre-line leading-tight text-fg-muted">
                {c.label}
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}

interface FloatingProductCardProps {
  product: {
    id: string
    name: string
    price: number
    discount_price: number | null
    images: string[]
    slug: string
  }
  categoryName?: string
  rating: number
  className?: string
}

function FloatingProductCard({
  product,
  categoryName,
  rating,
  className,
}: FloatingProductCardProps) {
  const price = product.discount_price ?? product.price
  return (
    <Link
      to={`/products/${product.slug}`}
      className={`v-float-card group pointer-events-auto block p-3 ${className || ''}`}
    >
      <div className="flex items-center gap-3">
        <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 rounded-xl overflow-hidden bg-bg-2">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-fg font-ui font-bold uppercase tracking-wider text-[11px] truncate">
            {categoryName || 'Featured'}
          </p>
          <p className="text-primary font-headline font-bold text-base">
            ৳{price.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 mt-0.5">
            <Star className="w-2.5 h-2.5 v-star-fill" />
            <span className="text-[9px] text-fg-soft font-ui">{rating.toFixed(1)}</span>
          </div>
        </div>
        <button
          aria-label="Quick add"
          className="w-7 h-7 rounded-full bg-bg-2 hover:bg-primary hover:text-white text-primary flex items-center justify-center transition-colors flex-shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </Link>
  )
}
