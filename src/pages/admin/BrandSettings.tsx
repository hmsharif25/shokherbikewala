import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, Bike } from 'lucide-react'
import { demoBrandSettings } from '@/data/demo-data'
import AnimatedSection from '@/components/ui/AnimatedSection'

export default function BrandSettings() {
  const [settings, setSettings] = useState(demoBrandSettings)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-display font-bold text-white mb-1">Brand Settings</h1>
        <p className="text-gray-400 text-sm">Customize your store&apos;s brand identity</p>
      </div>

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
            <div>
              <label className="block text-sm text-gray-300 mb-1">Logo URL</label>
              <input
                value={settings.logo_url}
                onChange={e => setSettings({ ...settings, logo_url: e.target.value })}
                placeholder="https://..."
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Hero Image URL</label>
              <input
                value={settings.hero_image_url}
                onChange={e => setSettings({ ...settings, hero_image_url: e.target.value })}
                placeholder="https://..."
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
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

          <div className="flex items-center gap-4 pt-4 border-t border-white/5">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary to-primary-600 text-white font-medium rounded-lg text-sm"
            >
              <Save className="w-4 h-4" />
              Save Settings
            </motion.button>
            {saved && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="text-green-400 text-sm"
              >
                Settings saved!
              </motion.span>
            )}
          </div>
        </div>
      </AnimatedSection>
    </div>
  )
}
