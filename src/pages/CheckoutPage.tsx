import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  Copy,
  CreditCard,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShoppingBag,
  StickyNote,
  Truck,
  Upload,
  User,
  X,
} from 'lucide-react'
import PageTransition from '@/components/ui/PageTransition'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { useStore } from '@/context/StoreContext'
import { useCart, CartItem } from '@/context/CartContext'
import { submitInquiry } from '@/lib/db'
import { uploadImage } from '@/lib/storage'

interface FormState {
  name: string
  phone: string
  email: string
  address: string
  city: string
  area: string
  notes: string
  trxId: string
}

const empty: FormState = {
  name: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  area: '',
  notes: '',
  trxId: '',
}

const STORAGE_KEY = 'sbw_checkout_form_v1'

interface CheckoutLine {
  id: string
  name: string
  slug: string
  image: string
  price: number
  qty: number
}

export default function CheckoutPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { products, brandSettings, addInquiry, deliveryPayment } = useStore()
  const { selectedItems, clearSelected } = useCart()

  const directSlug = searchParams.get('product') || ''
  const directProduct = useMemo(
    () => (directSlug ? products.find((p) => p.slug === directSlug) || null : null),
    [products, directSlug],
  )

  const lines: CheckoutLine[] = useMemo(() => {
    if (directProduct) {
      const unit = directProduct.discount_price ?? directProduct.price
      return [
        {
          id: directProduct.id,
          name: directProduct.name,
          slug: directProduct.slug,
          image: directProduct.images[0] ?? '',
          price: unit,
          qty: 1,
        },
      ]
    }
    return selectedItems.map((i: CartItem) => ({
      id: i.id,
      name: i.name,
      slug: i.slug,
      image: i.image,
      price: i.price,
      qty: i.qty,
    }))
  }, [directProduct, selectedItems])

  const subtotal = useMemo(
    () => lines.reduce((sum, l) => sum + l.price * l.qty, 0),
    [lines],
  )

  const deliveryCharge = useMemo(() => {
    if (deliveryPayment.freeDeliveryMin > 0 && subtotal >= deliveryPayment.freeDeliveryMin) return 0
    return deliveryPayment.deliveryCharge
  }, [subtotal, deliveryPayment])

  const total = subtotal + deliveryCharge
  const totalQty = useMemo(
    () => lines.reduce((sum, l) => sum + l.qty, 0),
    [lines],
  )

  const [form, setForm] = useState<FormState>(() => {
    if (typeof window === 'undefined') return empty
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) return empty
      const saved = JSON.parse(raw) as Partial<FormState>
      return { ...empty, ...saved }
    } catch {
      return empty
    }
  })
  const enabledMethods = useMemo(
    () => deliveryPayment.paymentMethods.filter(m => m.enabled),
    [deliveryPayment],
  )
  const [selectedPayment, setSelectedPayment] = useState<string>(() =>
    enabledMethods.length > 0 ? enabledMethods[0].name : '',
  )
  const selectedMethod = useMemo(
    () => enabledMethods.find(m => m.name === selectedPayment),
    [enabledMethods, selectedPayment],
  )
  const showPaymentFields = selectedMethod && selectedMethod.type !== 'cod'

  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null)
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null)
  const [uploadingScreenshot, setUploadingScreenshot] = useState(false)
  const screenshotInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    try {
      const { trxId: _trx, ...rest } = form
      void _trx
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rest))
    } catch {
      // ignore
    }
  }, [form])

  useEffect(() => {
    if (lines.length === 0 && products.length > 0 && !success) {
      navigate('/shop', { replace: true })
    }
  }, [lines.length, products.length, navigate, success])

  const handleCopy = async (text: string, fieldId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(fieldId)
      setTimeout(() => setCopiedField(null), 2000)
    } catch {
      // Fallback for older browsers
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopiedField(fieldId)
      setTimeout(() => setCopiedField(null), 2000)
    }
  }

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 8 * 1024 * 1024) {
      setError('Screenshot must be under 8MB')
      return
    }
    setPaymentScreenshot(file)
    const reader = new FileReader()
    reader.onload = () => setScreenshotPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const removeScreenshot = () => {
    setPaymentScreenshot(null)
    setScreenshotPreview(null)
    if (screenshotInputRef.current) screenshotInputRef.current.value = ''
  }

  const phoneDigits = (brandSettings.whatsapp || '').replace(/[^0-9]/g, '')

  const buildMessage = (screenshotUrl?: string): string => {
    const out: string[] = []
    out.push(`Hi! I want to buy:`)
    lines.forEach((l, idx) => {
      out.push(
        `${idx + 1}. ${l.name} × ${l.qty} — ৳${(l.price * l.qty).toLocaleString()}`,
      )
    })
    out.push('')
    if (deliveryCharge > 0) out.push(`Delivery: ৳${deliveryCharge.toLocaleString()}`)
    out.push(`Total: ৳${total.toLocaleString()} (${totalQty} item${totalQty === 1 ? '' : 's'})`)
    if (selectedPayment) out.push(`Payment: ${selectedPayment}`)
    if (form.trxId.trim()) out.push(`TRX ID: ${form.trxId.trim()}`)
    if (screenshotUrl) out.push(`Payment screenshot: ${screenshotUrl}`)
    out.push('')
    out.push(`— Customer info —`)
    out.push(`Name: ${form.name}`)
    out.push(`Phone: ${form.phone}`)
    if (form.email.trim()) out.push(`Email: ${form.email.trim()}`)
    out.push(`Address: ${form.address}`)
    if (form.city.trim()) out.push(`City: ${form.city.trim()}`)
    if (form.area.trim()) out.push(`Area / Thana: ${form.area.trim()}`)
    if (form.notes.trim()) out.push(`Notes: ${form.notes.trim()}`)
    return out.join('\n')
  }

  const buildProductSummary = (): string => {
    if (lines.length === 0) return ''
    if (lines.length === 1) return `${lines[0].name} × ${lines[0].qty}`
    return `${lines[0].name} × ${lines[0].qty} (+${lines.length - 1} more)`
  }

  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (lines.length === 0) {
      setError('Your cart is empty.')
      return
    }
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      setError('Please fill in name, phone, and full address.')
      return
    }
    setError(null)
    setSubmitting(true)

    try {
      let uploadedUrl: string | undefined

      if (paymentScreenshot) {
        setUploadingScreenshot(true)
        try {
          const result = await uploadImage(paymentScreenshot, { folder: 'payment-proofs' })
          uploadedUrl = result.url
          setScreenshotUrl(result.url)
        } catch (err) {
          console.warn('[checkout] screenshot upload failed:', err)
        } finally {
          setUploadingScreenshot(false)
        }
      }

      const message = buildMessage(uploadedUrl)
      const productSummary = buildProductSummary()

      addInquiry({
        id: Date.now(),
        customer_name: form.name.trim(),
        phone: form.phone.trim(),
        product_name: productSummary,
        message,
        status: 'new',
        created_at: new Date().toISOString(),
      })

      const { error: remoteErr } = await submitInquiry({
        customer_name: form.name.trim(),
        phone: form.phone.trim(),
        product_name: productSummary,
        message,
      })

      if (remoteErr) {
        console.warn('[checkout] remote submit failed:', remoteErr)
      }

      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  if (lines.length === 0 && !success) {
    return (
      <PageTransition className="v-shop-page min-h-screen pt-4 sm:pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 text-center py-20">
          <ShoppingBag className="w-16 h-16 mx-auto text-fg-soft mb-4" />
          <h1 className="text-2xl font-display font-bold text-fg mb-2">
            Nothing to checkout
          </h1>
          <p className="text-fg-muted mb-6">
            Your cart is empty — pick some items first.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Browse products
          </Link>
        </div>
      </PageTransition>
    )
  }

  const waText = encodeURIComponent(buildMessage(screenshotUrl ?? undefined))
  const waHref = phoneDigits ? `https://wa.me/${phoneDigits}?text=${waText}` : '#'

  const handleClosePopup = () => {
    setSuccess(false)
    if (!directProduct) clearSelected()
    navigate('/shop')
  }

  /** Parse payment details string into copyable lines */
  const parsePaymentDetails = (details: string): { label: string; value: string }[] => {
    const result: { label: string; value: string }[] = []
    const lines = details.split('\n').map(l => l.trim()).filter(Boolean)
    for (const line of lines) {
      const colonIdx = line.indexOf(':')
      if (colonIdx > 0) {
        result.push({
          label: line.slice(0, colonIdx).trim(),
          value: line.slice(colonIdx + 1).trim(),
        })
      } else {
        result.push({ label: '', value: line })
      }
    }
    return result
  }

  return (
    <PageTransition className="min-h-screen pt-4 sm:pt-24 pb-32 md:pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mb-5 sm:mb-8">
          <Link
            to={directProduct ? `/shop/${directProduct.slug}` : '/cart'}
            className="inline-flex items-center gap-2 text-fg-muted hover:text-primary transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            {directProduct ? 'Back to product' : 'Back to cart'}
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
                  Confirm by phone or WhatsApp after placing your order.
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

                <Field
                  label="Email (optional)"
                  icon={<Mail className="w-4 h-4" />}
                >
                  <input
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className={inputCls}
                  />
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
                  placeholder="House, road, area, landmark"
                  className={`${inputCls} min-h-[88px] resize-none`}
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="City" icon={<MapPin className="w-4 h-4" />}>
                  <input
                    type="text"
                    autoComplete="address-level2"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="Dhaka"
                    className={inputCls}
                  />
                </Field>

                <Field label="Area / Thana" icon={<MapPin className="w-4 h-4" />}>
                  <input
                    type="text"
                    value={form.area}
                    onChange={(e) => setForm({ ...form, area: e.target.value })}
                    placeholder="Dhanmondi"
                    className={inputCls}
                  />
                </Field>
              </div>

              {/* Payment Method Selection */}
              {enabledMethods.length > 0 && (
                <Field label="Payment method" icon={<CreditCard className="w-4 h-4" />} required>
                  <div className="space-y-2">
                    {enabledMethods.map((m) => (
                      <label
                        key={m.id}
                        className={`block rounded-xl border cursor-pointer transition-all ${
                          selectedPayment === m.name
                            ? 'border-primary/40 bg-primary/5'
                            : 'border-line bg-surface-soft hover:border-primary/20'
                        }`}
                      >
                        <div className="flex items-start gap-3 p-3">
                          <input
                            type="radio"
                            name="payment"
                            value={m.name}
                            checked={selectedPayment === m.name}
                            onChange={() => {
                              setSelectedPayment(m.name)
                              setForm(prev => ({ ...prev, trxId: '' }))
                              removeScreenshot()
                            }}
                            className="mt-0.5 accent-primary"
                          />
                          <div className="min-w-0 flex-1">
                            <span className="text-fg font-medium text-sm">{m.name}</span>
                            {m.type === 'cod' && m.details && (
                              <p className="text-fg-soft text-xs mt-0.5">{m.details}</p>
                            )}
                          </div>
                        </div>

                        {/* Payment details with copy buttons for non-COD */}
                        {selectedPayment === m.name && m.type !== 'cod' && m.details && (
                          <div className="px-3 pb-3 pt-0">
                            <div className="rounded-lg bg-bg/60 border border-line/50 p-3 space-y-2">
                              {parsePaymentDetails(m.details).map((item, idx) => {
                                const copyId = `${m.id}-${idx}`
                                return (
                                  <div key={idx} className="flex items-center justify-between gap-2">
                                    <div className="min-w-0 flex-1">
                                      {item.label && (
                                        <span className="text-fg-soft text-xs">{item.label}: </span>
                                      )}
                                      <span className="text-fg text-sm font-medium">{item.value}</span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        handleCopy(item.value, copyId)
                                      }}
                                      className={`flex-shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                                        copiedField === copyId
                                          ? 'bg-green-500/10 text-green-500'
                                          : 'bg-primary/10 text-primary hover:bg-primary/20'
                                      }`}
                                    >
                                      {copiedField === copyId ? (
                                        <>
                                          <CheckCircle2 className="w-3 h-3" />
                                          Copied
                                        </>
                                      ) : (
                                        <>
                                          <Copy className="w-3 h-3" />
                                          Copy
                                        </>
                                      )}
                                    </button>
                                  </div>
                                )
                              })}
                            </div>

                            <p className="text-[11px] text-fg-soft mt-2">
                              Send ৳{total.toLocaleString()} to the above {m.type === 'mobile' ? 'number' : 'account'} and enter your transaction details below.
                            </p>
                          </div>
                        )}
                      </label>
                    ))}
                  </div>
                </Field>
              )}

              {/* TRX ID & Screenshot — only for non-COD */}
              {showPaymentFields && (
                <div className="space-y-4 rounded-xl border border-dashed border-primary/30 bg-primary/[0.03] p-4">
                  <Field
                    label="Transaction ID (TRX ID)"
                    icon={<CreditCard className="w-4 h-4" />}
                  >
                    <input
                      type="text"
                      value={form.trxId}
                      onChange={(e) => setForm({ ...form, trxId: e.target.value })}
                      placeholder="e.g. ABC123XYZ"
                      className={inputCls}
                    />
                    <p className="text-[11px] text-fg-soft mt-1">
                      Optional — enter after completing payment
                    </p>
                  </Field>

                  <Field
                    label="Payment screenshot (optional)"
                    icon={<Camera className="w-4 h-4" />}
                  >
                    {screenshotPreview ? (
                      <div className="relative">
                        <img
                          src={screenshotPreview}
                          alt="Payment screenshot"
                          className="w-full max-h-48 object-contain rounded-xl border border-line bg-surface-soft"
                        />
                        <button
                          type="button"
                          onClick={removeScreenshot}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-bg/90 border border-line text-fg-muted hover:text-red-500 grid place-items-center"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => screenshotInputRef.current?.click()}
                        className="w-full min-h-[80px] flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line bg-surface-soft hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer"
                      >
                        <Upload className="w-5 h-5 text-fg-soft" />
                        <span className="text-xs text-fg-soft">
                          Tap to upload screenshot
                        </span>
                      </button>
                    )}
                    <input
                      ref={screenshotInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleScreenshotChange}
                      className="hidden"
                    />
                  </Field>
                </div>
              )}

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
                disabled={submitting || uploadingScreenshot}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full min-h-[52px] inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-primary to-primary-600 text-white font-bold rounded-xl shadow-lg shadow-primary/25 disabled:opacity-60 transition-all"
              >
                <Truck className="w-5 h-5" />
                {uploadingScreenshot
                  ? 'Uploading screenshot…'
                  : submitting
                    ? 'Placing order…'
                    : `Place order · ৳${total.toLocaleString()}`}
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

              <div className="space-y-3 max-h-[360px] overflow-auto pr-1">
                {lines.map((l) => (
                  <div key={l.id} className="flex gap-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-line bg-surface-soft flex-shrink-0">
                      {l.image && (
                        <img
                          src={l.image}
                          alt={l.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/shop/${l.slug}`}
                        className="text-fg font-semibold text-sm leading-snug line-clamp-2 hover:text-primary"
                      >
                        {l.name}
                      </Link>
                      <div className="mt-1 text-xs text-fg-soft">
                        Qty {l.qty}
                      </div>
                      <div className="mt-1 text-primary font-bold text-sm">
                        ৳{(l.price * l.qty).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-line pt-3 space-y-1.5 text-sm">
                <Row label={`Subtotal (${totalQty})`} value={`৳${subtotal.toLocaleString()}`} />
                <Row
                  label={`Delivery${deliveryCharge === 0 ? ' (Free)' : ''}`}
                  value={deliveryCharge > 0 ? `৳${deliveryCharge.toLocaleString()}` : 'Free'}
                />
                {selectedPayment && <Row label="Payment" value={selectedPayment} />}
                <Row
                  label="Total"
                  value={`৳${total.toLocaleString()}`}
                  bold
                />
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Order-confirmed popup with WhatsApp deep-link */}
      <AnimatePresence>
        {success && (
          <motion.div
            key="success-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={handleClosePopup}
          >
            <motion.div
              key="success-card"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: 'spring', stiffness: 250, damping: 22 }}
              role="dialog"
              aria-label="Order placed"
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-2xl glass border border-line p-6 sm:p-7 text-center"
            >
              <button
                type="button"
                onClick={handleClosePopup}
                aria-label="Close"
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-bg-2 border border-line text-fg-muted hover:text-fg hover:border-primary/40 grid place-items-center"
              >
                <X className="w-4 h-4" />
              </button>

              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 220, damping: 18 }}
                className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center"
              >
                <CheckCircle2 className="w-9 h-9 text-primary" />
              </motion.div>

              <h2 className="text-2xl font-display font-bold text-fg mb-1">
                Order placed
              </h2>
              <p className="text-fg-muted text-sm mb-5">
                Thanks {form.name.split(' ')[0]}! Tap the button below — your
                order details and delivery address are already typed for you.
                Just hit Send on WhatsApp.
              </p>

              <div className="rounded-xl bg-surface-soft border border-line p-4 text-left text-sm space-y-1.5 mb-5">
                <div className="flex justify-between gap-4">
                  <span className="text-fg-soft">Items</span>
                  <span className="text-fg font-medium">{totalQty}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-fg-soft">Total</span>
                  <span className="text-primary font-bold">
                    ৳{total.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-fg-soft">Payment</span>
                  <span className="text-fg">{selectedPayment || 'N/A'}</span>
                </div>
                {form.trxId.trim() && (
                  <div className="flex justify-between gap-4">
                    <span className="text-fg-soft">TRX ID</span>
                    <span className="text-fg font-mono text-xs">{form.trxId.trim()}</span>
                  </div>
                )}
                <div className="flex justify-between gap-4">
                  <span className="text-fg-soft">Phone</span>
                  <span className="text-fg">{form.phone}</span>
                </div>
              </div>

              {phoneDigits ? (
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2.5 px-5 py-3.5 bg-gradient-to-r from-[#18a558] via-[#25d366] to-[#128c7e] text-white font-bold rounded-xl shadow-lg shadow-green-500/30"
                >
                  <MessageCircle className="w-5 h-5" />
                  Send order on WhatsApp
                </motion.a>
              ) : (
                <p className="text-sm text-fg-soft">
                  Order saved. Our team will call you shortly.
                </p>
              )}

              <button
                type="button"
                onClick={handleClosePopup}
                className="block w-full mt-3 text-fg-soft text-xs hover:text-fg transition-colors"
              >
                Continue shopping
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
