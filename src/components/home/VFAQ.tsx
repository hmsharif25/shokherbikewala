import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'
import VReveal from '@/components/ui/VReveal'
import { useStore } from '@/context/StoreContext'

export default function VFAQ() {
  const { homeSections, siteConfig } = useStore()
  const [open, setOpen] = useState<number | null>(0)
  const faqs = siteConfig.faqItems

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
          {faqs.map((faq, i) => {
            const isOpen = open === i
            return (
              <VReveal key={faq.id} delay={60 * i}>
                <div className={`sb-faq-card sb-card-glow ${isOpen ? 'is-open' : ''}`}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="sb-faq-trigger"
                  >
                    <span className="sb-faq-q">{faq.question}</span>
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
                        <p className="sb-faq-a">{faq.answer}</p>
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
