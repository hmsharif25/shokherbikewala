import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, Eye, Image, Type } from 'lucide-react'
import { useStore } from '@/context/StoreContext'
import AnimatedSection from '@/components/ui/AnimatedSection'
import ImageUpload from '@/components/ui/ImageUpload'

export default function HeroManage() {
  const { brandSettings, setBrandSettings } = useStore()
  const [settings, setSettings] = useState(brandSettings)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setBrandSettings(settings)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-display font-bold text-fg mb-1">Hero & Content</h1>
        <p className="text-gray-400 text-sm">Customize the homepage hero section and brand content</p>
      </div>

      <AnimatedSection>
        <div className="p-6 rounded-xl glass space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-white/5">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Type className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-fg font-bold">Brand Identity</h2>
              <p className="text-gray-400 text-xs">Name, tagline, and logo</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Brand Name</label>
              <input
                value={settings.brand_name}
                onChange={e => setSettings({ ...settings, brand_name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-bg-2/80 border border-line text-fg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Tagline</label>
              <input
                value={settings.tagline}
                onChange={e => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-bg-2/80 border border-line text-fg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <div className="p-6 rounded-xl glass space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-white/5">
            <div className="w-10 h-10 rounded-lg bg-cyan/10 flex items-center justify-center">
              <Image className="w-5 h-5 text-cyan" />
            </div>
            <div>
              <h2 className="text-fg font-bold">Media</h2>
              <p className="text-gray-400 text-xs">Logo and hero images</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.2}>
        <div className="p-6 rounded-xl glass space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-white/5">
            <div className="w-10 h-10 rounded-lg bg-green-400/10 flex items-center justify-center">
              <Eye className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h2 className="text-fg font-bold">Social Links</h2>
              <p className="text-gray-400 text-xs">WhatsApp, Facebook, TikTok, Instagram</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">WhatsApp</label>
              <input
                value={settings.whatsapp}
                onChange={e => setSettings({ ...settings, whatsapp: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-bg-2/80 border border-line text-fg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Facebook</label>
              <input
                value={settings.facebook}
                onChange={e => setSettings({ ...settings, facebook: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-bg-2/80 border border-line text-fg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">TikTok</label>
              <input
                value={settings.tiktok}
                onChange={e => setSettings({ ...settings, tiktok: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-bg-2/80 border border-line text-fg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Instagram</label>
              <input
                value={settings.instagram}
                onChange={e => setSettings({ ...settings, instagram: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-bg-2/80 border border-line text-fg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
        </div>
      </AnimatedSection>

      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary to-primary-600 text-white font-medium rounded-lg text-sm"
        >
          <Save className="w-4 h-4" />
          Save All Changes
        </motion.button>
        {saved && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-green-400 text-sm"
          >
            Changes saved!
          </motion.span>
        )}
      </div>
    </div>
  )
}
