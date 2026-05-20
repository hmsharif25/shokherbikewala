import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Save,
  Truck,
  CreditCard,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Banknote,
  Smartphone,
  Package,
} from 'lucide-react'
import { useStore } from '@/context/StoreContext'
import { DeliveryPaymentConfig, PaymentMethod } from '@/types'
import { saveDeliveryPaymentRemote } from '@/lib/db'
import AnimatedSection from '@/components/ui/AnimatedSection'

const TYPE_META: Record<string, { icon: typeof CreditCard; label: string }> = {
  cod: { icon: Package, label: 'Cash on Delivery' },
  mobile: { icon: Smartphone, label: 'Mobile Banking' },
  bank: { icon: Banknote, label: 'Bank Transfer' },
}

export default function DeliveryPaymentManage() {
  const { deliveryPayment, setDeliveryPayment } = useStore()
  const [config, setConfig] = useState<DeliveryPaymentConfig>(deliveryPayment)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const handleSave = async () => {
    setSaving(true)
    setSaveError(null)
    setDeliveryPayment(config)
    const { error } = await saveDeliveryPaymentRemote(config)
    setSaving(false)
    if (error) {
      setSaveError(error)
      setTimeout(() => setSaveError(null), 5000)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  const updateMethod = (id: string, updates: Partial<PaymentMethod>) => {
    setConfig(prev => ({
      ...prev,
      paymentMethods: prev.paymentMethods.map(m =>
        m.id === id ? { ...m, ...updates } : m,
      ),
    }))
  }

  const addMethod = () => {
    const newMethod: PaymentMethod = {
      id: `pm_${Date.now()}`,
      name: '',
      type: 'mobile',
      enabled: true,
      details: '',
    }
    setConfig(prev => ({
      ...prev,
      paymentMethods: [...prev.paymentMethods, newMethod],
    }))
  }

  const removeMethod = (id: string) => {
    setConfig(prev => ({
      ...prev,
      paymentMethods: prev.paymentMethods.filter(m => m.id !== id),
    }))
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-fg mb-1">Delivery & Payments</h1>
          <p className="text-gray-400 text-sm">
            Configure delivery charges and payment methods for checkout.
          </p>
        </div>
        <motion.button
          onClick={handleSave}
          whileTap={{ scale: 0.97 }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
            saved
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-primary text-white hover:shadow-[0_0_20px_rgba(255,106,26,0.4)]'
          }`}
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </motion.button>
      </div>

      {saveError && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          Save failed: {saveError}
        </div>
      )}

      {/* Delivery Charge */}
      <AnimatedSection delay={0.05}>
        <div className="rounded-xl glass border border-white/10 p-5 space-y-5">
          <h2 className="text-lg font-display font-bold text-fg flex items-center gap-2">
            <Truck className="w-5 h-5 text-primary" />
            Delivery Charge
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Charge Amount (৳)</label>
              <input
                type="number"
                min={0}
                value={config.deliveryCharge}
                onChange={e => setConfig(prev => ({ ...prev, deliveryCharge: Number(e.target.value) || 0 }))}
                className="w-full px-3 py-2 rounded-lg bg-bg-2/80 border border-line text-fg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="120"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Free Delivery Minimum (৳)</label>
              <input
                type="number"
                min={0}
                value={config.freeDeliveryMin}
                onChange={e => setConfig(prev => ({ ...prev, freeDeliveryMin: Number(e.target.value) || 0 }))}
                className="w-full px-3 py-2 rounded-lg bg-bg-2/80 border border-line text-fg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="5000"
              />
              <p className="text-[11px] text-gray-500 mt-1">
                Orders above this amount get free delivery. Set 0 to disable.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Area Label</label>
              <input
                value={config.deliveryChargeLabel}
                onChange={e => setConfig(prev => ({ ...prev, deliveryChargeLabel: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-bg-2/80 border border-line text-fg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Dhaka"
              />
              <p className="text-[11px] text-gray-500 mt-1">
                e.g. "Dhaka" — shown as "Inside Dhaka" or "Outside Dhaka"
              </p>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-2">Charge Applies To</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setConfig(prev => ({ ...prev, deliveryChargeMode: 'inside' }))}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                    config.deliveryChargeMode === 'inside'
                      ? 'bg-primary/15 border-primary/40 text-primary'
                      : 'bg-bg-2/80 border-line text-fg-muted hover:border-primary/20'
                  }`}
                >
                  # Inside
                </button>
                <button
                  type="button"
                  onClick={() => setConfig(prev => ({ ...prev, deliveryChargeMode: 'outside' }))}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                    config.deliveryChargeMode === 'outside'
                      ? 'bg-primary/15 border-primary/40 text-primary'
                      : 'bg-bg-2/80 border-line text-fg-muted hover:border-primary/20'
                  }`}
                >
                  # Outside
                </button>
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                "# Inside" = charge for inside {config.deliveryChargeLabel || 'area'}.
                "# Outside" = charge for outside {config.deliveryChargeLabel || 'area'}.
              </p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Payment Methods */}
      <AnimatedSection delay={0.1}>
        <div className="rounded-xl glass border border-white/10 p-5 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-display font-bold text-fg flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Payment Methods
            </h2>
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={addMethod}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Method
            </motion.button>
          </div>

          <div className="space-y-4">
            {config.paymentMethods.map((method) => {
              const meta = TYPE_META[method.type]
              const Icon = meta?.icon ?? CreditCard
              return (
                <div
                  key={method.id}
                  className={`rounded-xl border p-4 transition-all ${
                    method.enabled
                      ? 'bg-white/5 border-white/10'
                      : 'bg-white/[0.02] border-white/5 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-primary" />
                      <span className="font-headline font-bold text-fg text-sm uppercase tracking-wider">
                        {method.name || 'New Method'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateMethod(method.id, { enabled: !method.enabled })}
                        className="text-fg-muted hover:text-primary transition-colors"
                        title={method.enabled ? 'Disable' : 'Enable'}
                      >
                        {method.enabled ? (
                          <ToggleRight className="w-6 h-6 text-green-400" />
                        ) : (
                          <ToggleLeft className="w-6 h-6 text-gray-500" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeMethod(method.id)}
                        className="text-fg-muted hover:text-red-400 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Name</label>
                      <input
                        value={method.name}
                        onChange={e => updateMethod(method.id, { name: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-bg-2/80 border border-line text-fg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="bKash"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Type</label>
                      <select
                        value={method.type}
                        onChange={e => updateMethod(method.id, { type: e.target.value as PaymentMethod['type'] })}
                        className="w-full px-3 py-2 rounded-lg bg-bg-2/80 border border-line text-fg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        <option value="cod">Cash on Delivery</option>
                        <option value="mobile">Mobile Banking</option>
                        <option value="bank">Bank Transfer</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">
                      Details / Instructions
                    </label>
                    <textarea
                      value={method.details}
                      onChange={e => updateMethod(method.id, { details: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg bg-bg-2/80 border border-line text-fg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                      placeholder="e.g. Send to: 01XXXXXXXXX (Personal)"
                    />
                  </div>
                </div>
              )
            })}

            {config.paymentMethods.length === 0 && (
              <p className="text-center text-gray-500 text-sm py-6">
                No payment methods added. Click "Add Method" to get started.
              </p>
            )}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.15}>
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 text-center">
          <p className="text-gray-400 text-xs">
            Changes take effect immediately on checkout after saving.
          </p>
        </div>
      </AnimatedSection>
    </div>
  )
}
