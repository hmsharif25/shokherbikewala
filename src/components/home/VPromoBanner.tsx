import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Truck, Shield, Award } from 'lucide-react'
import VReveal from '@/components/ui/VReveal'
import { useStore } from '@/context/StoreContext'

const TRUST_BADGES = [
  { icon: Truck, title: 'Free Shipping', sub: 'On orders over ৳5000' },
  { icon: Shield, title: '2 Year Warranty', sub: 'Quality guaranteed' },
  { icon: Award, title: 'Premium Quality', sub: '100% Original Gear' },
]

const PILLARS = [
  { label: 'Premium\nQuality' },
  { label: 'Performance\nFocused' },
  { label: 'Secure\nPayment' },
]

/**
 * Promotional speed-banner — "Premium Riding Gear UP TO 40% OFF".
 * White stage with diagonal motion lines and floating gear images.
 */
export default function VPromoBanner() {
  const { products } = useStore()

  // Pick three icon products to float over the bike (helmet, glove, exhaust shaped)
  const helmet = products.find((p) => p.images?.[0] && p.name.toLowerCase().includes('helm')) || products[0]
  const glove = products.find((p) => p.images?.[0] && p.name.toLowerCase().includes('glove')) || products[1]
  const exhaust = products.find((p) => p.images?.[0] && p.name.toLowerCase().includes('exhaust')) || products[2]

  const heroBike =
    'https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=1600&q=80'

  return (
    <section className="relative py-14 sm:py-20 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <VReveal>
          <div className="relative rounded-[2rem] overflow-hidden v-capsule px-6 sm:px-10 lg:px-14 py-10 sm:py-14">
            {/* Motion line backdrop */}
            <div className="absolute inset-0 v-motion-lines pointer-events-none" />
            <div
              className="absolute inset-0 pointer-events-none opacity-50"
              style={{
                background:
                  'radial-gradient(ellipse at right, rgba(255,122,31,0.18), transparent 65%)',
              }}
            />

            {/* Top trust strip */}
            <div className="hidden md:flex absolute top-6 right-8 gap-6">
              {TRUST_BADGES.map((b) => (
                <div key={b.title} className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                    <b.icon className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-ui font-bold uppercase tracking-wider text-fg">
                      {b.title}
                    </p>
                    <p className="text-[10px] text-fg-soft font-ui">{b.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative grid lg:grid-cols-12 gap-8 items-center mt-8 md:mt-12 lg:mt-0">
              <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
                <h2 className="v-headline text-4xl sm:text-6xl md:text-7xl">
                  PREMIUM
                  <br />
                  <em>RIDING GEAR</em>
                </h2>

                <p className="text-fg-muted font-ui text-base max-w-md mx-auto lg:mx-0">
                  Top performance accessories for riders who demand more.
                </p>

                <div className="flex items-end gap-4 justify-center lg:justify-start">
                  <div>
                    <p className="font-ui font-bold text-fg-muted tracking-[0.3em] text-xs uppercase mb-1">
                      Up To
                    </p>
                    <div className="flex items-baseline">
                      <span className="v-headline text-7xl sm:text-8xl">
                        <em>40%</em>
                      </span>
                      <span className="font-headline text-3xl sm:text-4xl font-bold text-fg ml-2">
                        OFF
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 justify-center lg:justify-start">
                  {PILLARS.map((p) => (
                    <div
                      key={p.label}
                      className="px-3 py-1.5 rounded-full border border-line bg-bg/60 text-[10px] font-ui font-bold uppercase tracking-wider text-fg-muted whitespace-pre-line text-center"
                    >
                      {p.label.replace('\n', ' ')}
                    </div>
                  ))}
                </div>

                <Link to="/products" className="v-pill-cta">
                  Shop Collection
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/25 ml-1">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              </div>

              <div className="lg:col-span-7 relative">
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="relative aspect-[1.3] w-full"
                >
                  <img
                    src={heroBike}
                    alt="Promotional bike"
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-contain drop-shadow-[0_30px_60px_rgba(255,90,0,0.35)]"
                  />

                  {helmet && (
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute -top-2 left-[18%] w-20 h-20 sm:w-28 sm:h-28 rounded-2xl bg-bg/80 backdrop-blur-md border border-line/60 p-2 shadow-[0_18px_40px_-12px_rgba(255,90,0,0.35)] hidden sm:block"
                    >
                      <img src={helmet.images[0]} alt={helmet.name} className="w-full h-full object-contain" />
                    </motion.div>
                  )}
                  {glove && (
                    <motion.div
                      animate={{ y: [0, 10, 0] }}
                      transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                      className="absolute top-1/4 right-0 w-16 h-16 sm:w-24 sm:h-24 rounded-2xl bg-bg/80 backdrop-blur-md border border-line/60 p-2 shadow-[0_18px_40px_-12px_rgba(255,90,0,0.35)] hidden sm:block"
                    >
                      <img src={glove.images[0]} alt={glove.name} className="w-full h-full object-contain" />
                    </motion.div>
                  )}
                  {exhaust && (
                    <motion.div
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                      className="absolute bottom-1/4 right-[8%] w-16 h-16 sm:w-24 sm:h-24 rounded-2xl bg-bg/80 backdrop-blur-md border border-line/60 p-2 shadow-[0_18px_40px_-12px_rgba(255,90,0,0.35)] hidden sm:block"
                    >
                      <img src={exhaust.images[0]} alt={exhaust.name} className="w-full h-full object-contain" />
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </VReveal>
      </div>
    </section>
  )
}
