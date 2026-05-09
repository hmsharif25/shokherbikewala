import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, Search, Globe, Tag, Image } from 'lucide-react'
import { useStore } from '@/context/StoreContext'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { SEOSettings } from '@/types'

export default function SEOManage() {
  const { siteConfig, setSiteConfig } = useStore()
  const [seo, setSeo] = useState<SEOSettings>(siteConfig.seo)
  const [saved, setSaved] = useState(false)
  const [keywordInput, setKeywordInput] = useState('')

  const handleSave = () => {
    setSiteConfig({ ...siteConfig, seo })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const addKeyword = () => {
    const kw = keywordInput.trim()
    if (kw && !seo.siteKeywords.includes(kw)) {
      setSeo({ ...seo, siteKeywords: [...seo.siteKeywords, kw] })
      setKeywordInput('')
    }
  }

  const removeKeyword = (kw: string) => {
    setSeo({ ...seo, siteKeywords: seo.siteKeywords.filter((k) => k !== kw) })
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-fg mb-1">SEO Settings</h1>
          <p className="text-fg-muted text-sm">
            Manage meta tags, keywords, and search engine optimization
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
          {saved ? 'Saved!' : 'Save Changes'}
        </motion.button>
      </div>

      <AnimatedSection>
        <div className="p-6 rounded-xl glass space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-line">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-fg font-bold">General SEO</h2>
              <p className="text-fg-muted text-xs">Title, description, and OG image</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-fg-muted mb-1">Site Title</label>
              <input
                value={seo.siteTitle}
                onChange={(e) => setSeo({ ...seo, siteTitle: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-surface-soft border border-line text-fg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <p className="text-xs text-fg-soft mt-1">{seo.siteTitle.length}/60 characters</p>
            </div>
            <div>
              <label className="block text-sm text-fg-muted mb-1">Meta Description</label>
              <textarea
                value={seo.siteDescription}
                onChange={(e) => setSeo({ ...seo, siteDescription: e.target.value })}
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg bg-surface-soft border border-line text-fg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
              <p className="text-xs text-fg-soft mt-1">{seo.siteDescription.length}/160 characters</p>
            </div>
            <div>
              <label className="block text-sm text-fg-muted mb-1">OG Image URL</label>
              <div className="flex gap-2">
                <input
                  value={seo.ogImage}
                  onChange={(e) => setSeo({ ...seo, ogImage: e.target.value })}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-surface-soft border border-line text-fg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <div className="w-10 h-10 rounded-lg bg-surface-soft border border-line flex items-center justify-center flex-shrink-0">
                  <Image className="w-4 h-4 text-fg-soft" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <div className="p-6 rounded-xl glass space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-line">
            <div className="w-10 h-10 rounded-lg bg-cyan/10 flex items-center justify-center">
              <Tag className="w-5 h-5 text-cyan" />
            </div>
            <div>
              <h2 className="text-fg font-bold">Keywords</h2>
              <p className="text-fg-muted text-xs">Target keywords for search engines</p>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
              placeholder="Add a keyword..."
              className="flex-1 px-4 py-2.5 rounded-lg bg-surface-soft border border-line text-fg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={addKeyword}
              className="px-4 py-2.5 rounded-lg bg-cyan text-white text-sm font-medium"
            >
              Add
            </motion.button>
          </div>

          <div className="flex flex-wrap gap-2">
            {seo.siteKeywords.map((kw) => (
              <span
                key={kw}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium"
              >
                {kw}
                <button
                  onClick={() => removeKeyword(kw)}
                  className="hover:text-red-400 transition-colors"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.2}>
        <div className="p-6 rounded-xl glass space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-line">
            <div className="w-10 h-10 rounded-lg bg-green-400/10 flex items-center justify-center">
              <Search className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h2 className="text-fg font-bold">Search Console Verification</h2>
              <p className="text-fg-muted text-xs">Verification codes for Google and Bing</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-fg-muted mb-1">Google Verification Code</label>
              <input
                value={seo.googleVerification}
                onChange={(e) => setSeo({ ...seo, googleVerification: e.target.value })}
                placeholder="e.g. abc123..."
                className="w-full px-4 py-2.5 rounded-lg bg-surface-soft border border-line text-fg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm text-fg-muted mb-1">Bing Verification Code</label>
              <input
                value={seo.bingVerification}
                onChange={(e) => setSeo({ ...seo, bingVerification: e.target.value })}
                placeholder="e.g. xyz789..."
                className="w-full px-4 py-2.5 rounded-lg bg-surface-soft border border-line text-fg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  )
}
