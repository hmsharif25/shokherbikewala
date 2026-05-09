import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, FileText, Phone, Mail, MapPin } from 'lucide-react'
import { useStore } from '@/context/StoreContext'
import { PageContent } from '@/types'
import AnimatedSection from '@/components/ui/AnimatedSection'

export default function PagesManage() {
  const { siteConfig, setSiteConfig } = useStore()
  const [pages, setPages] = useState<PageContent>(siteConfig.pages)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSiteConfig({ ...siteConfig, pages })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-fg mb-1">Page Content</h1>
          <p className="text-fg-muted text-sm">Edit About and Contact page content</p>
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
          {saved ? 'Saved!' : 'Save Changes'}
        </motion.button>
      </div>

      <AnimatedSection>
        <div className="p-6 rounded-xl glass space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-line">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-fg font-bold">About Page</h2>
              <p className="text-fg-muted text-xs">Heading, description, mission, and vision</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-fg-muted mb-1">Heading</label>
              <input
                value={pages.aboutHeading}
                onChange={(e) => setPages({ ...pages, aboutHeading: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-surface-soft border border-line text-fg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm text-fg-muted mb-1">Description</label>
              <textarea
                value={pages.aboutDescription}
                onChange={(e) => setPages({ ...pages, aboutDescription: e.target.value })}
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg bg-surface-soft border border-line text-fg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm text-fg-muted mb-1">Our Story / Mission</label>
              <textarea
                value={pages.aboutMission}
                onChange={(e) => setPages({ ...pages, aboutMission: e.target.value })}
                rows={4}
                className="w-full px-4 py-2.5 rounded-lg bg-surface-soft border border-line text-fg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm text-fg-muted mb-1">Vision / Extended Story</label>
              <textarea
                value={pages.aboutVision}
                onChange={(e) => setPages({ ...pages, aboutVision: e.target.value })}
                rows={4}
                className="w-full px-4 py-2.5 rounded-lg bg-surface-soft border border-line text-fg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <div className="p-6 rounded-xl glass space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-line">
            <div className="w-10 h-10 rounded-lg bg-cyan/10 flex items-center justify-center">
              <Phone className="w-5 h-5 text-cyan" />
            </div>
            <div>
              <h2 className="text-fg font-bold">Contact Page</h2>
              <p className="text-fg-muted text-xs">Contact information and page content</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-fg-muted mb-1">Heading</label>
              <input
                value={pages.contactHeading}
                onChange={(e) => setPages({ ...pages, contactHeading: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-surface-soft border border-line text-fg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm text-fg-muted mb-1">Description</label>
              <textarea
                value={pages.contactDescription}
                onChange={(e) => setPages({ ...pages, contactDescription: e.target.value })}
                rows={2}
                className="w-full px-4 py-2.5 rounded-lg bg-surface-soft border border-line text-fg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-1.5 text-sm text-fg-muted mb-1">
                  <Mail className="w-3.5 h-3.5" /> Email
                </label>
                <input
                  value={pages.contactEmail}
                  onChange={(e) => setPages({ ...pages, contactEmail: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-surface-soft border border-line text-fg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-sm text-fg-muted mb-1">
                  <Phone className="w-3.5 h-3.5" /> Phone
                </label>
                <input
                  value={pages.contactPhone}
                  onChange={(e) => setPages({ ...pages, contactPhone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-surface-soft border border-line text-fg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-sm text-fg-muted mb-1">
                <MapPin className="w-3.5 h-3.5" /> Address
              </label>
              <input
                value={pages.contactAddress}
                onChange={(e) => setPages({ ...pages, contactAddress: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-surface-soft border border-line text-fg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  )
}
