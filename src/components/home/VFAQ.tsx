import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import VReveal from '@/components/ui/VReveal'

const FAQS = [
  {
    q: 'Do you ship across Bangladesh?',
    a: 'Yes — we ship to all 64 districts. Dhaka and Chittagong orders typically arrive within 24–48 hours, the rest of the country in 3–5 working days. Free shipping kicks in on orders over ৳5,000.',
  },
  {
    q: 'Are your products original and warrantied?',
    a: 'Every product is 100% original gear sourced directly from authorised distributors. Major items like helmets, exhausts, and electronics carry up to a 2-year warranty against manufacturing defects.',
  },
  {
    q: 'Can I return or exchange a product?',
    a: 'Absolutely. Unused items can be exchanged or returned within 7 days of delivery, no questions asked. Helmets and gloves must arrive in their original packaging with all accessories.',
  },
  {
    q: 'How do I order via WhatsApp?',
    a: 'Tap any product, hit the WhatsApp button, and you’ll be taken to a pre-filled chat. Confirm your address and payment method with our team and we’ll dispatch the same day for in-stock items.',
  },
  {
    q: 'What payment methods do you support?',
    a: 'We support cash on delivery, bKash, Nagad, Rocket, and direct bank transfer. Online card payments are coming soon — drop us a WhatsApp if you need it now.',
  },
  {
    q: 'Do you offer fitting or installation help?',
    a: 'Yes. Visit our Dhaka workshop and our riders will help you fit any helmet, jacket, or accessory. Performance parts like exhausts can be installed by appointment.',
  },
]

export default function VFAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="relative py-20 sm:py-24 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-primary/[0.05] rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <VReveal className="text-center mb-10 sm:mb-14">
          <span className="v-eyebrow-long mb-4 mx-auto justify-center">Need Answers</span>
          <h2 className="v-headline text-3xl sm:text-5xl md:text-6xl mt-3 mb-3">
            Frequently <em>Asked</em>
          </h2>
          <p className="text-fg-muted max-w-xl mx-auto font-ui text-base">
            Quick answers to the questions our riders ask the most.
          </p>
        </VReveal>

        <ul className="space-y-3 sm:space-y-4">
          {FAQS.map((item, i) => {
            const isOpen = open === i
            return (
              <VReveal key={item.q} delay={i * 60}>
                <motion.li
                  layout
                  className={`v-capsule rounded-2xl overflow-hidden transition-colors ${
                    isOpen ? 'border-primary/40 shadow-[0_18px_40px_-18px_rgba(255,90,0,0.3)]' : ''
                  }`}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-5 sm:px-7 py-4 sm:py-5 text-left"
                  >
                    <span className="font-headline font-bold text-fg text-sm sm:text-base">
                      {item.q}
                    </span>
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                        isOpen
                          ? 'bg-gradient-to-br from-[#ff7a1f] to-[#ff5a00] text-white'
                          : 'bg-bg-2 text-fg-muted border border-line'
                      }`}
                    >
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 sm:px-7 pb-5 sm:pb-6 text-fg-muted text-sm sm:text-base font-ui leading-relaxed">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.li>
              </VReveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
