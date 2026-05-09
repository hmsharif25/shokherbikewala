import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'
import VReveal from '@/components/ui/VReveal'
import { useStore } from '@/context/StoreContext'

/**
 * Premium FAQ accordion section. Single-open behaviour with a
 * smooth Framer Motion height/opacity reveal. Plus icon rotates
 * to a minus on open. Six common rider questions cover delivery,
 * returns, payment, warranty, sizing, and contact.
 */
const FAQS: { q: string; a: string }[] = [
  {
    q: 'How long does delivery take?',
    a: 'We deliver across Bangladesh within 2–4 business days. For Dhaka city, same-day or next-day delivery is available on selected items. International orders typically arrive in 7–14 days.',
  },
  {
    q: 'Are all products original and authentic?',
    a: '100%. We source only from authorised brand distributors and verify every item before dispatch. Each premium product ships with a manufacturer warranty card and authenticity sticker.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'Cash on Delivery, bKash, Nagad, Rocket, all major credit/debit cards, and bank transfer. International riders can also pay via PayPal — just contact us on WhatsApp.',
  },
  {
    q: 'Do you offer warranty on helmets and exhausts?',
    a: 'Yes — every premium helmet ships with a 2-year manufacturer warranty, and our exhaust systems carry a 1-year warranty against defects. Full coverage details are listed on each product page.',
  },
  {
    q: 'How do I choose the right helmet size?',
    a: 'Measure the circumference of your head 1 inch above your eyebrows. Match the result to the size chart on the helmet page. Still unsure? Ping us on WhatsApp with your measurement and we\'ll recommend the right fit.',
  },
  {
    q: 'How can I contact customer support?',
    a: 'WhatsApp is fastest — we reply within minutes during business hours (10am–10pm BD time). You can also DM us on Instagram, Facebook, or TikTok. All links are at the bottom of the page.',
  },
]

export default function VFAQ() {
  const { homeSections } = useStore()
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="sb-clean-section sb-faq-section relative py-20 sm:py-28 overflow-hidden">
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <VReveal className="text-center mb-12 sm:mb-14">
          <span className="v-eyebrow-long mb-5 sm:mb-6 mx-auto justify-center">
            Got Questions?
          </span>
          <h2 className="v-headline text-3xl sm:text-5xl md:text-6xl mt-3 mb-4">
            {homeSections.faq.heading}
          </h2>
          <p className="text-fg-muted max-w-xl mx-auto font-ui text-base">
            {homeSections.faq.subheading}
          </p>
        </VReveal>

        <div className="space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = open === i
            return (
              <VReveal key={faq.q} delay={60 * i}>
                <div className={`sb-faq-card sb-card-glow ${isOpen ? 'is-open' : ''}`}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="sb-faq-trigger"
                  >
                    <span className="sb-faq-q">{faq.q}</span>
                    <span className="sb-faq-icon">
                      <Plus className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="sb-faq-a">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </VReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
