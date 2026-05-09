import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  CheckCircle2,
  MapPin,
  MessageCircle,
  Minus,
  Phone,
  Plus,
  ShoppingBag,
  StickyNote,
  Truck,
  User,
} from 'lucide-react'
import PageTransition from '@/components/ui/PageTransition'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { useStore } from '@/context/StoreContext'
import { submitInquiry } from '@/lib/db'

interface FormState {
  name: string
  phone: string
  address: string
  qty: number
  notes: string
}

const empty: FormState = {
  name: '',
  phone: '',
  address: '',
  qty: 1,
  notes: '',
}

export default function CheckoutPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { products, brandSettings, addInquiry } = useStore()

  const slug = searchParams.get('product') || ''
  const product = useMemo(
    () => products.find((p) => p.slug === slug) || null,
    [products, slug],
  )

  const [form, setForm] = useState<FormState>(empty)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug && products.length > 0) {
      navigate('/products', { replace: true })
    }
  }, [slug, products.length, navigate])

  const unitPrice = product
    ? product.discount_price ?? product.price
    : 0
  const total = unitPrice * Math.max(1, form.qty)
  const phoneDigits = (brandSettings.whatsapp || '').replace(/[^0-9]/g, '')

  const buildMessage = (): string => {
    const lines = [
      `Hi! I want to order:`,
      product ? `• ${product.name} × ${form.qty}` : '',
      product ? `• Unit: BDT ${unitPrice.toLocaleString()}` : '',
      product ? `• Total: BDT ${total.toLocaleString()}` : '',
      ``,
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `Address: ${form.address}`,
    ]
    if (form.notes.trim()) {
      lines.push(`Notes: ${form.notes.trim()}`)
    }
    return lines.filter(Boolean).join('\n')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product) return
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      setError('Please fill in name, phone, and address.')
      return
    }
    setError(null)
    setSubmitting(true)

    const message = buildMessage()

    try {
      addInquiry({
        id: Date.now(),
        customer_name: form.name.trim(),
        phone: form.phone.trim(),
        product_name: `${product.name} × ${form.qty}`,
        message,
        status: 'new',
        created_at: new Date().toISOString(),
      })

      const { error: remoteErr } = await submitInquiry({
        customer_name: form.name.trim(),
        phone: form.phone.trim(),
        product_name: `${product.name} × ${form.qty}`,
        message,
      })

      if (remoteErr) {
        // Non-fatal — local copy is saved; admin will still see it on this device.
        console.warn('[checkout] remote submit failed:', remoteErr)
      }

      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  if (!product) {
    return (
      <PageTransition className="min-h-screen pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 text-center py-20">
          <ShoppingBag className="w-16 h-16 mx-auto text-fg-soft mb-4" />
          <h1 className="text-2xl font-display font-bold text-fg mb-2">
            Product not selected
          </h1>
          <p className="text-fg-muted mb-6">
            Pick a product first and tap Buy Now to checkout.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Browse products
          </Link>
        </div>
      </PageTransition>
    )
  }

  if (success) {
    const waText = encodeURIComponent(buildMessage())
    return (
      <PageTransition className="min-h-screen pt-20 sm:pt-24 pb-20 md:pb-16">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <AnimatedSection>
            <div className="rounded-2xl glass border border-line p-6 sm:p-8 text-center">
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center"
              >
                <CheckCircle2 className="w-9 h-9 text-primary" />
              </motion.div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-fg mb-2">
                Order placed
              </h1>
              <p className="text-fg-muted text-sm sm:text-base">
                Thanks {form.name.split(' ')[0]}! We received your order request
                and will confirm shortly on WhatsApp / phone.
              </p>

              <div className="mt-6 text-left rounded-xl bg-surface-soft border border-line p-4 text-sm space-y-1.5">
                <div className="flex justify-between gap-4">
                  <span className="text-fg-soft">Item</span>
                  <span className="text-fg font-medium text-right">
                    {product.name} × {form.qty}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-fg-soft">Total</span>
                  <span className="text-primary font-bold">
                    BDT {total.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-fg-soft">Phone</span>
                  <span className="text-fg">{form.phone}</span>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                {phoneDigits && (
                  <motion.a
                    whileTap={{ scale: 0.97 }}
                    href={`https://wa.me/${phoneDigits}?text=${waText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-h-[48px] inline-flex items-center justify-center gap-2 px-5 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Confirm on WhatsApp
                  </motion.a>
                )}
                <Link to="/products" className="flex-1">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    className="w-full min-h-[48px] inline-flex items-center justify-center gap-2 px-5 py-3 border border-line text-fg font-semibold rounded-xl hover:border-primary/60 hover:text-primary"
                  >
                    Continue shopping
                  </motion.button>
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition className="min-h-screen pt-20 sm:pt-24 pb-24 md:pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mb-5 sm:mb-8">
          <Link
            to={`/products/${product.slug}`}
            className="inline-flex items-center gap-2 text-fg-muted hover:text-primary transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to product
          </Link>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,360px] gap-6 lg:gap-8">
          {/* Form */}
          <AnimatedSection direction="left">
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl glass border border-line p-5 sm:p-7 space-y-5"
              noValidate
            >
              <div>
                <h1 className="text-xl sm:text-2xl font-display font-bold text-fg">
                  Checkout
                </h1>
                <p className="text-fg-soft text-sm mt-1">
                  Cash on Delivery — confirm by phone or WhatsApp after submit.
                </p>
              </div>

              <Field
                label="Full name"
                icon={<User className="w-4 h-4" />}
                required
              >
                <input
                  type="text"
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Mohammed Hossain"
                  className={inputCls}
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  label="Phone number"
                  icon={<Phone className="w-4 h-4" />}
                  required
                >
                  <input
                    type="tel"
                    required
                    inputMode="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="01XXXXXXXXX"
                    className={inputCls}
                  />
                </Field>

                <Field label="Quantity" icon={<ShoppingBag className="w-4 h-4" />}>
                  <div className="flex items-stretch h-[48px] rounded-xl border border-line bg-surface-soft overflow-hidden">
                    <button
                      type="button"
                      onClick={() =>
                        setForm({ ...form, qty: Math.max(1, form.qty - 1) })
                      }
                      className="w-12 grid place-items-center text-fg-muted hover:text-primary"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={99}
                      value={form.qty}
                      onChange={(e) => {
                        const n = Math.max(1, Math.min(99, Number(e.target.value) || 1))
                        setForm({ ...form, qty: n })
                      }}
                      className="flex-1 bg-transparent text-center text-fg font-semibold focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setForm({ ...form, qty: Math.min(99, form.qty + 1) })
                      }
                      className="w-12 grid place-items-center text-fg-muted hover:text-primary"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </Field>
              </div>

              <Field
                label="Delivery address"
                icon={<MapPin className="w-4 h-4" />}
                required
              >
                <textarea
                  required
                  rows={3}
                  autoComplete="street-address"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="House, road, area, city"
                  className={`${inputCls} min-h-[88px] resize-none`}
                />
              </Field>

              <Field label="Notes (optional)" icon={<StickyNote className="w-4 h-4" />}>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Color preference, delivery time, etc."
                  className={`${inputCls} min-h-[68px] resize-none`}
                />
              </Field>

              {error && (
                <p className="text-sm text-red-500" role="alert">
                  {error}
                </p>
              )}

              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full min-h-[52px] inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary hover:bg-primary-600 text-white font-bold rounded-xl shadow-lg shadow-primary/25 disabled:opacity-60 transition-all"
              >
                <Truck className="w-5 h-5" />
                {submitting ? 'Placing order…' : `Place order · BDT ${total.toLocaleString()}`}
              </motion.button>

              <p className="text-[11px] text-fg-soft text-center">
                By placing this order you agree to be contacted on the phone
                number you provided.
              </p>
            </form>
          </AnimatedSection>

          {/* Order summary */}
          <AnimatedSection direction="right" className="lg:sticky lg:top-24 h-max">
            <div className="rounded-2xl glass border border-line p-5 space-y-4">
              <h2 className="text-sm font-semibold text-fg-muted uppercase tracking-wider">
                Order summary
              </h2>

              <div className="flex gap-3">
                <div className="w-20 h-20 rounded-xl overflow-hidden border border-line bg-surface-soft flex-shrink-0">
                  {product.images[0] && (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    to={`/products/${product.slug}`}
                    className="text-fg font-semibold text-sm leading-snug line-clamp-2 hover:text-primary"
                  >
                    {product.name}
                  </Link>
                  <div className="mt-1 text-xs text-fg-soft">
                    Qty {form.qty}
                  </div>
                  <div className="mt-1 text-primary font-bold">
                    BDT {unitPrice.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="border-t border-line pt-3 space-y-1.5 text-sm">
                <Row label="Subtotal" value={`BDT ${(unitPrice * form.qty).toLocaleString()}`} />
                <Row label="Delivery" value="To be confirmed" />
                <Row
                  label="Total"
                  value={`BDT ${total.toLocaleString()}`}
                  bold
                />
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </PageTransition>
  )
}

const inputCls =
  'w-full min-h-[48px] px-4 py-3 rounded-xl bg-surface-soft border border-line text-fg placeholder-fg-soft focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all'

function Field({
  label,
  icon,
  required,
  children,
}: {
  label: string
  icon?: React.ReactNode
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="flex items-center gap-1.5 text-sm font-medium text-fg-muted mb-1.5">
        {icon}
        {label}
        {required && <span className="text-primary">*</span>}
      </span>
      {children}
    </label>
  )
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-fg-soft">{label}</span>
      <span className={bold ? 'text-fg font-bold text-base' : 'text-fg'}>
        {value}
      </span>
    </div>
  )
}
