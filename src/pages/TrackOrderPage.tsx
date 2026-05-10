import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  Phone,
  Search,
  Package,
  MessageCircle,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react'
import PageTransition from '@/components/ui/PageTransition'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { Inquiry } from '@/types'
import { loadInquiriesByPhone } from '@/lib/db'
import { useStore } from '@/context/StoreContext'
import { isSupabaseConfigured } from '@/lib/supabase'

const statusMeta: Record<
  Inquiry['status'],
  { label: string; color: string; icon: typeof Clock; description: string }
> = {
  new: {
    label: 'Order Received',
    color: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    icon: AlertCircle,
    description: 'We received your order. We will contact you shortly to confirm.',
  },
  contacted: {
    label: 'In Progress',
    color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
    icon: Clock,
    description: 'We have contacted you and your order is being prepared.',
  },
  completed: {
    label: 'Delivered',
    color: 'text-green-400 bg-green-500/10 border-green-500/30',
    icon: CheckCircle2,
    description: 'Your order has been delivered. Thank you for shopping with us!',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'text-red-400 bg-red-500/10 border-red-500/30',
    icon: XCircle,
    description: 'This order has been cancelled.',
  },
}

const stepOrder: Inquiry['status'][] = ['new', 'contacted', 'completed']

export default function TrackOrderPage() {
  const { inquiries: localInquiries, brandSettings } = useStore()
  const [phone, setPhone] = useState('')
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Inquiry[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    const cleaned = phone.replace(/[^0-9]/g, '')
    if (cleaned.length < 6) {
      setError('Please enter your full phone number')
      return
    }
    setError(null)
    setLoading(true)
    setSearched(true)

    let found: Inquiry[] = []
    if (isSupabaseConfigured()) {
      found = await loadInquiriesByPhone(phone)
    }

    // Always also search local cache so demo / offline users see something useful
    const lastDigits = cleaned.slice(-10)
    const local = localInquiries.filter((i) =>
      i.phone.replace(/[^0-9]/g, '').includes(lastDigits),
    )
    const merged = [...found]
    local.forEach((l) => {
      if (!merged.some((m) => m.id === l.id)) merged.push(l)
    })
    merged.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    setResults(merged)
    setLoading(false)
  }

  const phoneDigits = (brandSettings.whatsapp || '').replace(/[^0-9]/g, '')

  return (
    <PageTransition className="min-h-screen pt-4 sm:pt-24 pb-24 md:pb-16 bg-bg">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <AnimatedSection className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-fg-muted hover:text-primary transition-colors text-sm font-racing"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </AnimatedSection>

        <AnimatedSection className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-cyan/15 border border-primary/30 flex items-center justify-center">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-fg">
                <span className="text-gradient-fire">Track Your Order</span>
              </h1>
              <p className="text-fg-muted text-sm">
                Enter the phone number you used during checkout
              </p>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <form
            onSubmit={handleSearch}
            className="rounded-2xl glass border border-line p-5 sm:p-6 space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-fg-muted mb-1.5 font-racing">
                Phone number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-fg-soft" />
                <input
                  type="tel"
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-bg-2 border border-line text-fg placeholder-fg-soft focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500" role="alert">
                {error}
              </p>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-gradient-to-r from-primary to-primary-600 text-white font-bold rounded-xl shadow-lg shadow-primary/25 disabled:opacity-60 transition-all font-racing tracking-wide flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Searching…
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Track Orders
                </>
              )}
            </motion.button>
          </form>
        </AnimatedSection>

        <AnimatePresence mode="wait">
          {searched && !loading && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              {results.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-line p-8 text-center">
                  <Package className="w-12 h-12 mx-auto text-fg-soft/40 mb-3" />
                  <h3 className="text-fg font-semibold mb-1">No orders found</h3>
                  <p className="text-fg-muted text-sm">
                    We couldn&apos;t find any orders with that phone number.
                  </p>
                  {phoneDigits && (
                    <a
                      href={`https://wa.me/${phoneDigits}?text=${encodeURIComponent(
                        `Hi, I need help tracking my order. My phone: ${phone}`,
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-medium hover:bg-green-500/20 transition-all"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Ask on WhatsApp
                    </a>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-fg-muted font-racing">
                    Found <span className="text-primary font-bold">{results.length}</span>{' '}
                    order{results.length === 1 ? '' : 's'}
                  </p>
                  {results.map((inq, idx) => {
                    const meta = statusMeta[inq.status]
                    const Icon = meta.icon
                    const stepIdx = stepOrder.indexOf(inq.status)
                    const isCancelled = inq.status === 'cancelled'
                    return (
                      <motion.div
                        key={inq.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="rounded-2xl glass border border-line p-5"
                      >
                        <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                          <div>
                            <div className="text-fg font-semibold text-sm">
                              {inq.product_name}
                            </div>
                            <div className="text-fg-soft text-xs mt-0.5">
                              {new Date(inq.created_at).toLocaleString()}
                            </div>
                          </div>
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${meta.color}`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            {meta.label}
                          </span>
                        </div>

                        <p className="text-fg-muted text-sm mb-4">{meta.description}</p>

                        {!isCancelled && (
                          <div className="flex items-center gap-1 mb-4">
                            {stepOrder.map((step, i) => {
                              const reached = i <= stepIdx
                              return (
                                <div key={step} className="flex-1 flex items-center gap-1">
                                  <div
                                    className={`flex-1 h-1 rounded-full ${
                                      reached
                                        ? 'bg-gradient-to-r from-primary to-gold'
                                        : 'bg-bg-2'
                                    }`}
                                  />
                                  {i < stepOrder.length - 1 && (
                                    <div
                                      className={`w-2 h-2 rounded-full ${
                                        reached ? 'bg-primary' : 'bg-bg-2 border border-line'
                                      }`}
                                    />
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        )}

                        <details className="text-sm">
                          <summary className="cursor-pointer text-fg-muted hover:text-primary font-racing">
                            Order details
                          </summary>
                          <pre className="mt-2 p-3 rounded-lg bg-bg-2 border border-line text-fg-muted text-xs whitespace-pre-wrap font-mono">
                            {inq.message}
                          </pre>
                        </details>

                        {phoneDigits && !isCancelled && (
                          <a
                            href={`https://wa.me/${phoneDigits}?text=${encodeURIComponent(
                              `Hi, I want to ask about my order:\n${inq.product_name}\nPhone: ${inq.phone}`,
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-medium hover:bg-green-500/20 transition-all"
                          >
                            <MessageCircle className="w-4 h-4" />
                            Contact on WhatsApp
                          </a>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  )
}
