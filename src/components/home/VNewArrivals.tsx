import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import VReveal from '@/components/ui/VReveal'
import { useStore } from '@/context/StoreContext'

export default function VNewArrivals() {
  const { products, categories, brandSettings } = useStore()
  const scroller = useRef<HTMLDivElement | null>(null)

  // Newest products by created_at, fallback to first 8.
  const sorted = [...products].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
  const items = (sorted.length ? sorted : products).slice(0, 8)

  const scroll = (dir: 'left' | 'right') => {
    const el = scroller.current
    if (!el) return
    const w = el.clientWidth * 0.85
    el.scrollBy({ left: dir === 'left' ? -w : w, behavior: 'smooth' })
  }

  return (
    <section className="relative py-20 sm:py-24 overflow-hidden">
      <div className="absolute inset-0 v-dot-field opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <VReveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-10 sm:mb-12">
          <div>
            <span className="v-eyebrow-long mb-4 sm:mb-5">Just Landed</span>
            <h2 className="v-headline text-3xl sm:text-5xl md:text-6xl mt-3">
              NEW <em>ARRIVALS</em>
            </h2>
            <p className="text-fg-muted font-ui text-sm sm:text-base max-w-md mt-2">
              Fresh drops from the world's leading rider brands.
            </p>
          </div>
          <div className="flex items-center gap-3 self-start sm:self-end">
            <button onClick={() => scroll('left')} aria-label="Scroll left" className="v-icon-btn">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => scroll('right')} aria-label="Scroll right" className="v-icon-btn">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </VReveal>

        <div
          ref={scroller}
          className="flex gap-4 sm:gap-5 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {items.map((p, i) => {
            const cat = categories.find((c) => c.id === p.category_id)
            const price = p.discount_price ?? p.price
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="flex-shrink-0 w-64 sm:w-72 snap-start"
              >
                <Link to={`/shop/${p.slug}`} className="v-product-card flex flex-col h-full">
                  <div className="relative aspect-square overflow-hidden rounded-t-[1.45rem] bg-bg-2">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      loading="lazy"
                      className="w-full h-full object-contain p-3 hover:scale-110 transition-transform duration-700 drop-shadow-[0_18px_30px_rgba(255,90,0,0.18)]"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-ui font-bold uppercase tracking-[0.2em] bg-bg/80 backdrop-blur-md border border-line text-primary">
                      New
                    </span>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <p className="text-fg-soft text-[10px] font-ui font-bold uppercase tracking-[0.2em] mb-1">
                      {cat?.name ?? 'Featured'}
                    </p>
                    <h3 className="font-headline font-bold text-fg text-sm sm:text-base line-clamp-1 mb-1">
                      {p.name}
                    </h3>
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-3 h-3 v-star-fill" />
                      <span className="text-[10px] text-fg-soft font-ui">
                        {(4.5 + ((i * 7) % 5) / 10).toFixed(1)}
                      </span>
                    </div>
                    <div className="mt-auto flex items-baseline justify-between">
                      <span className="font-headline font-bold text-primary text-lg">
                        ৳{price.toLocaleString()}
                      </span>
                      <a
                        href={`${brandSettings.whatsapp}?text=${encodeURIComponent(`Hi! I'm interested in ${p.name}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[10px] font-ui font-bold uppercase tracking-[0.18em] text-primary hover:underline"
                      >
                        Order
                      </a>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
