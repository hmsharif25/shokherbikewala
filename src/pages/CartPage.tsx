import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from 'lucide-react'
import PageTransition from '@/components/ui/PageTransition'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { useCart } from '@/context/CartContext'

export default function CartPage() {
  const navigate = useNavigate()
  const {
    items,
    selectedQty,
    selectedItems,
    selectedTotal,
    incrementQty,
    decrementQty,
    updateQty,
    removeItem,
    toggleSelected,
    setAllSelected,
    clearCart,
  } = useCart()

  const allSelected = items.length > 0 && items.every((i) => i.selected)
  const noneSelected = items.length > 0 && items.every((i) => !i.selected)

  const handleCheckout = () => {
    if (selectedItems.length === 0) return
    navigate('/checkout')
  }

  if (items.length === 0) {
    return (
      <PageTransition className="min-h-screen pt-4 sm:pt-24 pb-24 md:pb-16">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <AnimatedSection>
            <div className="rounded-2xl glass border border-line p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl font-display font-bold text-fg mb-2">
                Your cart is empty
              </h1>
              <p className="text-fg-muted text-sm mb-6">
                Browse our collection and add the gear you love. You can pick
                what to checkout from here later.
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Browse products
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition className="min-h-screen pt-4 sm:pt-24 pb-32 md:pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mb-5 sm:mb-8 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-fg-muted hover:text-primary transition-colors text-sm mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue shopping
            </Link>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-fg">
              Your Cart
            </h1>
            <p className="text-fg-soft text-sm mt-1">
              {items.length} item{items.length === 1 ? '' : 's'} —
              tick the ones you want and tap "Checkout selected".
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (confirm('Empty your cart?')) clearCart()
            }}
            className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-fg-muted hover:text-red-400 hover:bg-red-500/10 border border-line hover:border-red-500/30 transition-colors flex-shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear cart
          </button>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,360px] gap-6 lg:gap-8">
          {/* Items list */}
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl glass border border-line px-4 py-3">
              <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = !allSelected && !noneSelected
                  }}
                  onChange={(e) => setAllSelected(e.target.checked)}
                  className="v-checkbox"
                />
                <span className="text-sm font-medium text-fg">
                  {allSelected
                    ? 'All selected'
                    : noneSelected
                      ? 'None selected'
                      : 'Some selected'}
                </span>
              </label>
              <span className="text-xs text-fg-soft">
                {selectedQty} item{selectedQty === 1 ? '' : 's'} chosen
              </span>
            </div>

            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                  className={`relative rounded-2xl glass border p-3 sm:p-4 transition-colors ${
                    item.selected
                      ? 'border-primary/40'
                      : 'border-line opacity-70'
                  }`}
                >
                  <div className="flex items-stretch gap-3 sm:gap-4">
                    <label className="flex items-start pt-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.selected}
                        onChange={() => toggleSelected(item.id)}
                        className="v-checkbox"
                      />
                    </label>

                    <Link
                      to={`/shop/${item.slug}`}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border border-line bg-surface-soft flex-shrink-0"
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full grid place-items-center text-fg-soft">
                          <ShoppingBag className="w-6 h-6" />
                        </div>
                      )}
                    </Link>

                    <div className="flex-1 min-w-0 flex flex-col">
                      <Link
                        to={`/shop/${item.slug}`}
                        className="text-fg font-semibold text-sm sm:text-base leading-snug line-clamp-2 hover:text-primary"
                      >
                        {item.name}
                      </Link>
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-primary font-bold text-sm sm:text-base">
                          ৳{item.price.toLocaleString()}
                        </span>
                        {item.original_price > item.price && (
                          <span className="text-fg-soft text-xs line-through">
                            ৳{item.original_price.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <div className="mt-auto pt-2 flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-stretch h-9 rounded-xl border border-line bg-surface-soft overflow-hidden">
                          <button
                            type="button"
                            onClick={() => decrementQty(item.id)}
                            className="w-9 grid place-items-center text-fg-muted hover:text-primary"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <input
                            type="number"
                            min={1}
                            max={99}
                            value={item.qty}
                            onChange={(e) =>
                              updateQty(
                                item.id,
                                Number(e.target.value) || 1,
                              )
                            }
                            className="w-10 bg-transparent text-center text-fg font-semibold focus:outline-none text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => incrementQty(item.id)}
                            className="w-9 grid place-items-center text-fg-muted hover:text-primary"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs sm:text-sm text-fg-muted">
                            Subtotal
                          </span>
                          <span className="text-fg font-bold text-sm sm:text-base">
                            ৳{(item.price * item.qty).toLocaleString()}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="p-2 rounded-lg text-fg-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            aria-label={`Remove ${item.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <AnimatedSection direction="right" className="lg:sticky lg:top-24 h-max">
            <div className="rounded-2xl glass border border-line p-5 space-y-4">
              <h2 className="text-sm font-semibold text-fg-muted uppercase tracking-wider">
                Order summary
              </h2>

              <div className="space-y-1.5 text-sm">
                <Row
                  label={`Items (${selectedQty})`}
                  value={`৳${selectedTotal.toLocaleString()}`}
                />
                <Row label="Delivery" value="Confirmed at checkout" />
                <div className="pt-2 mt-2 border-t border-line">
                  <Row
                    label="Total"
                    value={`৳${selectedTotal.toLocaleString()}`}
                    bold
                  />
                </div>
              </div>

              <motion.button
                type="button"
                disabled={selectedItems.length === 0}
                onClick={handleCheckout}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full min-h-[52px] inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-primary to-primary-600 text-white font-bold rounded-xl shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Checkout selected
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <p className="text-[11px] text-fg-soft text-center">
                Cash on Delivery — confirm by phone or WhatsApp after submit.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </PageTransition>
  )
}

function Row({
  label,
  value,
  bold,
}: {
  label: string
  value: string
  bold?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-fg-soft">{label}</span>
      <span className={bold ? 'text-fg font-bold text-base' : 'text-fg'}>
        {value}
      </span>
    </div>
  )
}
