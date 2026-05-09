import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Star, Plus, Shield, Globe, Lock, Award, Instagram, Facebook, Music2, MessageCircle } from 'lucide-react'
import { useRef } from 'react'
import { useStore } from '@/context/StoreContext'

const FEATURE_CHIPS = [
  { icon: Shield, label: 'Premium\nQuality' },
  { icon: Globe, label: 'Worldwide\nShipping' },
  { icon: Lock, label: 'Secure\nPayment' },
  { icon: Award, label: '2 Year\nWarranty' },
]

/**
 * Cinematic hero — based on the "RIDE WITH POWER" reference layout.
 *
 * Layout: full-bleed white/dark stage with a soft orange halo, large
 * italic Orbitron headline on the left, the brand's hero image on the
 * right, three floating glass product cards pinned over the bike, a
 * premium pill CTA, and a feature-chip strip in the bottom-right.
 */
export default function VHeroSection() {
  const { products, categories, brandSettings } = useStore()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const yShift = useTransform(scrollYProgress, [0, 1], [0, -80])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0.15])

  // Pick three "pinned" products for the floating cards.
  const featured = products.filter((p) => p.featured && p.images?.[0])
  const pinned = (featured.length >= 3 ? featured : products).slice(0, 3)

  // Pick one strong hero image — brand-configured if present, otherwise a
  // tasteful Unsplash sportbike shot (the data layer doesn't ship a bike).
  const heroImage =
    brandSettings.hero_image_url ||
    'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1600&q=80'

  return (
    <section
      ref={ref}
      className="relative min-h-[100dvh] flex items-center overflow-hidden pt-24 pb-32 md:pt-28 md:pb-24"
    >
      {/* Ambient backdrop */}
      <div className="absolute inset-0 v-hero-halo" />
      <div className="absolute inset-0 v-dot-field opacity-40 pointer-events-none" />

      {/* Soft orange light streaks behind bike */}
      <motion.div
        animate={{ x: [0, 20, 0], opacity: [0.4, 0.7, 0.4] }}
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
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          {/* Left column: copy */}
          <div className="lg:col-span-5 relative z-20 space-y-6 sm:space-y-8 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex"
            >
              <span className="v-eyebrow">Premium Motorcycle Accessories</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="v-headline text-[3.5rem] xs:text-6xl sm:text-7xl md:text-8xl lg:text-[7.5rem]"
            >
              RIDE
              <br />
              WITH
              <br />
              <em>POWER</em>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-fg-muted text-base sm:text-lg max-w-md mx-auto lg:mx-0 leading-relaxed font-ui"
            >
              High performance accessories for those who live to ride. Built for
              speed, designed for dominance.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center lg:items-start gap-3 sm:gap-4 justify-center lg:justify-start"
            >
              <Link to="/products" className="v-pill-cta">
                Shop Collection
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/25 ml-1">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
              <Link to="/categories" className="v-pill-ghost">
                Browse Categories
              </Link>
            </motion.div>

            {/* Social row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="flex items-center gap-3 justify-center lg:justify-start pt-2"
            >
              {[
                { icon: Instagram, url: brandSettings.instagram, label: 'Instagram' },
                { icon: Facebook, url: brandSettings.facebook, label: 'Facebook' },
                { icon: Music2, url: brandSettings.tiktok, label: 'TikTok' },
                { icon: MessageCircle, url: brandSettings.whatsapp, label: 'WhatsApp' },
              ].map((s) => (
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

          {/* Right column: bike + floating cards */}
          <div className="lg:col-span-7 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
              className="relative aspect-[1.1] sm:aspect-[1.25] w-full"
            >
              {/* Premium bike shot */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="relative w-full h-full rounded-[2rem] overflow-hidden"
                  style={{
                    background:
                      'radial-gradient(circle at 65% 60%, rgba(255,122,31,0.20), transparent 60%)',
                  }}
                >
                  <img
                    src={heroImage}
                    alt="Premium motorbike"
                    className="absolute inset-0 w-full h-full object-cover sm:object-contain object-center scale-110 sm:scale-100 drop-shadow-[0_30px_60px_rgba(255,90,0,0.35)]"
                    loading="eager"
                  />
                  {/* Soft light reflections */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-12 bg-gradient-to-r from-transparent via-primary/30 to-transparent blur-2xl" />
                </div>
              </div>

              {/* Floating product cards (desktop) */}
              <div className="absolute inset-0 hidden md:block pointer-events-none">
                {pinned[0] && (
                  <FloatingProductCard
                    product={pinned[0]}
                    categoryName={categories.find((c) => c.id === pinned[0].category_id)?.name}
                    rating={4.9}
                    className="absolute top-[8%] left-[2%] w-[14rem] v-float-anim"
                  />
                )}
                {pinned[1] && (
                  <FloatingProductCard
                    product={pinned[1]}
                    categoryName={categories.find((c) => c.id === pinned[1].category_id)?.name}
                    rating={4.7}
                    className="absolute bottom-[16%] left-[5%] w-[14rem] v-float-anim delay-1"
                  />
                )}
                {pinned[2] && (
                  <FloatingProductCard
                    product={pinned[2]}
                    categoryName={categories.find((c) => c.id === pinned[2].category_id)?.name}
                    rating={4.8}
                    className="absolute top-[14%] right-[2%] w-[14rem] v-float-anim delay-2"
                  />
                )}
              </div>

              {/* Mobile stacked floating cards (smaller) */}
              <div className="md:hidden mt-3 grid grid-cols-2 gap-2 px-2">
                {pinned.slice(0, 2).map((p, i) => (
                  <FloatingProductCard
                    key={p.id}
                    product={p}
                    categoryName={categories.find((c) => c.id === p.category_id)?.name}
                    rating={i === 0 ? 4.9 : 4.7}
                    compact
                    className="w-full"
                  />
                ))}
              </div>
            </motion.div>

            {/* Feature chips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.65 }}
              className="hidden md:flex absolute -bottom-12 right-0 v-capsule rounded-2xl px-3 py-3 gap-2"
            >
              {FEATURE_CHIPS.map((c) => (
                <div
                  key={c.label}
                  className="flex flex-col items-center text-center w-20 px-1"
                >
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center mb-1.5 border border-primary/20">
                    <c.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-[10px] font-ui font-bold tracking-wider uppercase whitespace-pre-line leading-tight text-fg-muted">
                    {c.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Mobile feature chips row */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="md:hidden mt-8 v-capsule rounded-2xl px-2 py-3 grid grid-cols-4 gap-1"
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
  product: { id: string; name: string; price: number; discount_price: number | null; images: string[]; slug: string }
  categoryName?: string
  rating: number
  compact?: boolean
  className?: string
}

function FloatingProductCard({ product, categoryName, rating, compact, className }: FloatingProductCardProps) {
  const price = product.discount_price ?? product.price
  return (
    <Link
      to={`/products/${product.slug}`}
      className={`v-float-card group pointer-events-auto block p-3 ${className || ''}`}
    >
      <div className="flex items-center gap-3">
        <div className="relative w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 rounded-xl overflow-hidden bg-bg-2">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-fg font-ui font-bold uppercase tracking-wider truncate ${compact ? 'text-[10px]' : 'text-[11px]'}`}>
            {categoryName || 'Featured'}
          </p>
          <p className={`text-primary font-headline font-bold ${compact ? 'text-sm' : 'text-base'}`}>
            ৳{price.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 mt-0.5">
            <Star className="w-2.5 h-2.5 v-star-fill" />
            <span className="text-[9px] text-fg-soft font-ui">{rating.toFixed(1)}</span>
          </div>
        </div>
        {!compact && (
          <button
            aria-label="Quick add"
            className="w-7 h-7 rounded-full bg-bg-2 hover:bg-primary hover:text-white text-primary flex items-center justify-center transition-colors flex-shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </Link>
  )
}
