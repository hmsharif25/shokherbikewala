import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Save,
  Eye,
  EyeOff,
  Sparkles,
  Grid3X3,
  Package,
  Award,
  Tag,
  Users,
  MessageSquareQuote,
  HelpCircle,
  GripVertical,
  Pencil,
} from 'lucide-react'
import { useStore } from '@/context/StoreContext'
import { HomeSections, SectionConfig } from '@/types'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { saveHomeSectionsRemote } from '@/lib/db'

type SectionKey = keyof HomeSections

interface SectionMeta {
  key: SectionKey
  label: string
  icon: typeof Sparkles
  color: string
  description: string
}

const SECTION_META: SectionMeta[] = [
  { key: 'hero', label: 'Hero Section', icon: Sparkles, color: 'text-primary', description: 'Main brand headline and social links' },
  { key: 'categories', label: 'Categories Grid', icon: Grid3X3, color: 'text-cyan', description: 'Product category cards' },
  { key: 'featuredProducts', label: 'Featured Products', icon: Package, color: 'text-green-400', description: 'Top product carousel' },
  { key: 'brandStory', label: 'Engineered for Riders', icon: Award, color: 'text-yellow-400', description: 'Features and trust pillars' },
  { key: 'promoBanner', label: 'Promo Banner', icon: Tag, color: 'text-red-400', description: 'Promotional offer section' },
  { key: 'community', label: 'Community / Social', icon: Users, color: 'text-purple-400', description: 'Social media showcase' },
  { key: 'testimonials', label: 'Testimonials', icon: MessageSquareQuote, color: 'text-blue-400', description: 'Customer reviews carousel' },
  { key: 'faq', label: 'FAQ', icon: HelpCircle, color: 'text-orange-400', description: 'Frequently asked questions' },
]

export default function HomeSectionsManage() {
  const { homeSections, setHomeSections } = useStore()
  const [sections, setSections] = useState<HomeSections>(homeSections)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [editing, setEditing] = useState<SectionKey | null>(null)

  const handleToggle = (key: SectionKey) => {
    setSections(prev => ({
      ...prev,
      [key]: { ...prev[key], visible: !prev[key].visible },
    }))
  }

  const handleFieldChange = (key: SectionKey, field: keyof SectionConfig, value: string | boolean) => {
    setSections(prev => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    setSaveError(null)
    setHomeSections(sections)
    const { error } = await saveHomeSectionsRemote(sections)
    setSaving(false)
    if (error) {
      setSaveError(error)
      setTimeout(() => setSaveError(null), 5000)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  const visibleCount = Object.values(sections).filter(s => s.visible).length
  const totalCount = SECTION_META.length

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="v-admin-page-header">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-fg mb-1">Homepage Sections</h1>
          <p className="text-fg-soft text-sm">
            Toggle visibility and edit content for each section &middot;{' '}
            <span className="text-primary font-medium">{visibleCount}/{totalCount} visible</span>
          </p>
        </div>
        <motion.button
          onClick={handleSave}
          whileTap={{ scale: 0.97 }}
          disabled={saving}
          className="v-admin-save-btn"
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

      {SECTION_META.map((meta, i) => {
        const config = sections[meta.key]
        const isEditing = editing === meta.key
        const Icon = meta.icon

        return (
          <AnimatedSection key={meta.key} delay={i * 0.04}>
            <div
              className={`rounded-xl border transition-all ${
                config.visible
                  ? 'glass border-white/10'
                  : 'bg-white/[0.02] border-white/5 opacity-60'
              }`}
            >
              {/* Section header row */}
              <div className="flex items-center gap-4 p-5">
                <div className="text-gray-500 cursor-grab">
                  <GripVertical className="w-4 h-4" />
                </div>

                <div className={`w-10 h-10 rounded-lg ${config.visible ? 'bg-white/5' : 'bg-white/[0.02]'} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${meta.color}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-sm">{meta.label}</h3>
                  <p className="text-gray-500 text-xs truncate">{meta.description}</p>
                </div>

                <button
                  onClick={() => setEditing(isEditing ? null : meta.key)}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                    isEditing
                      ? 'bg-primary/20 text-primary'
                      : 'bg-white/5 text-gray-400 hover:text-fg hover:bg-bg-2'
                  }`}
                  title="Edit content"
                >
                  <Pencil className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleToggle(meta.key)}
                  className={`w-14 h-8 rounded-full relative transition-colors ${
                    config.visible
                      ? 'bg-primary/30 border border-primary/50'
                      : 'bg-white/5 border border-white/10'
                  }`}
                  title={config.visible ? 'Hide section' : 'Show section'}
                >
                  <motion.div
                    animate={{ x: config.visible ? 24 : 4 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className={`w-6 h-6 rounded-full absolute top-0.5 flex items-center justify-center ${
                      config.visible
                        ? 'bg-primary shadow-[0_0_10px_rgba(255,106,26,0.4)]'
                        : 'bg-gray-600'
                    }`}
                  >
                    {config.visible
                      ? <Eye className="w-3 h-3 text-white" />
                      : <EyeOff className="w-3 h-3 text-gray-400" />
                    }
                  </motion.div>
                </button>
              </div>

              {/* Editable fields */}
              {isEditing && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="border-t border-white/5 px-5 pb-5 pt-4 space-y-4"
                >
                  <div>
                    <label className="block text-sm text-gray-300 mb-1.5">Heading</label>
                    <input
                      value={config.heading}
                      onChange={e => handleFieldChange(meta.key, 'heading', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg bg-bg-2/80 border border-line text-fg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 font-bold tracking-wide"
                      placeholder="Section heading..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1.5">Subheading</label>
                    <textarea
                      value={config.subheading}
                      onChange={e => handleFieldChange(meta.key, 'subheading', e.target.value)}
                      rows={2}
                      className="w-full px-4 py-2.5 rounded-lg bg-bg-2/80 border border-line text-fg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                      placeholder="Section subheading..."
                    />
                  </div>
                </motion.div>
              )}
            </div>
          </AnimatedSection>
        )
      })}

      <AnimatedSection delay={0.4}>
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 text-center">
          <p className="text-gray-400 text-xs">
            Changes take effect immediately on the homepage after saving.
          </p>
        </div>
      </AnimatedSection>
    </div>
  )
}
