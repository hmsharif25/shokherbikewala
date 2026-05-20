import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, Bike, RotateCcw, AlertCircle } from 'lucide-react'
import { useStore } from '@/context/StoreContext'
import AnimatedSection from '@/components/ui/AnimatedSection'
import ImageUpload from '@/components/ui/ImageUpload'
import { saveBrandSettingsRemote } from '@/lib/db'

export default function BrandSettings() {
  const store = useStore()
  const [settings, setSettings] = useState(store.brandSettings)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    const res = await saveBrandSettingsRemote(settings)
    setSaving(false)
    if (res.error) {
      setError(res.error)
      return
    }
    const next = { ...settings, id: res.id ?? settings.id }
    store.setBrandSettings(next)
    setSettings(next)
    setSaved(true)
    setTimeout(() => setSaved(false), 2200)
  }

  const handleReset = () => {
    if (confirm('Reset all data to defaults? This will clear all your changes.')) {
      store.resetAll()
      setSettings(store.brandSettings)
      window.location.reload()
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="v-admin-page-header">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-fg mb-1">Brand Settings</h1>
          <p className="text-fg-soft text-sm">Customize your store&apos;s brand identity, logo, and social links</p>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span><span className="font-semibold">Save failed:</span> {error}</span>
        </div>
      )}

      <AnimatedSection>
        <div className="p-6 rounded-xl glass space-y-6">
          <div className="flex items-center gap-4 pb-4 border-b border-white/5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center">
              <Bike className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">{settings.brand_name}</h2>
              <p className="text-gray-400 text-sm">{settings.tagline}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Brand Name</label>
              <input
                value={settings.brand_name}
                onChange={e => setSettings({ ...settings, brand_name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Tagline</label>
              <input
                value={settings.tagline}
                onChange={e => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <ImageUpload
              label="Logo"
              folder="brand"
              value={settings.logo_url}
              onChange={(v) => setSettings({ ...settings, logo_url: typeof v === 'string' ? v : v[0] || '' })}
            />
            <ImageUpload
              label="Hero image"
              folder="brand"
              value={settings.hero_image_url}
              onChange={(v) => setSettings({ ...settings, hero_image_url: typeof v === 'string' ? v : v[0] || '' })}
            />
          </div>

          <div className="pt-4 border-t border-white/5">
            <h3 className="text-white font-semibold mb-4">Social Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">WhatsApp</label>
                <input
                  value={settings.whatsapp}
                  onChange={e => setSettings({ ...settings, whatsapp: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Facebook</label>
                <input
                  value={settings.facebook}
                  onChange={e => setSettings({ ...settings, facebook: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">TikTok</label>
                <input
                  value={settings.tiktok}
                  onChange={e => setSettings({ ...settings, tiktok: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Instagram</label>
                <input
                  value={settings.instagram}
                  onChange={e => setSettings({ ...settings, instagram: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/5">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={saving}
              className="v-admin-save-btn"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Settings'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleReset}
              className="flex items-center gap-2 px-5 py-2.5 border border-red-500/30 text-red-400 hover:bg-red-500/10 font-medium rounded-lg text-sm transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset All Data
            </motion.button>
            {saved && !saving && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="text-green-400 text-sm"
              >
                Saved to Supabase.
              </motion.span>
            )}
          </div>
        </div>
      </AnimatedSection>
    </div>
  )
}
