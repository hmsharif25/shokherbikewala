import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, Plus, Trash2, Shield, Link2, FileText } from 'lucide-react'
import { useStore } from '@/context/StoreContext'
import { FooterConfig } from '@/types'
import AnimatedSection from '@/components/ui/AnimatedSection'

type LinkItem = { name: string; path: string }
type BadgeItem = { title: string; sub: string }

function LinkEditor({
  title,
  items,
  onChange,
}: {
  title: string
  items: LinkItem[]
  onChange: (items: LinkItem[]) => void
}) {
  const add = () => onChange([...items, { name: '', path: '/' }])
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i))
  const update = (i: number, field: keyof LinkItem, value: string) =>
    onChange(items.map((item, idx) => (idx === i ? { ...item, [field]: value } : item)))

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-fg font-semibold text-sm">{title}</h3>
        <button
          onClick={add}
          className="inline-flex items-center gap-1 text-xs text-cyan hover:text-primary transition-colors"
        >
          <Plus className="w-3 h-3" /> Add
        </button>
      </div>
      {items.map((item, i) => (
        <div key={i} className="flex gap-2 items-center">
          <input
            value={item.name}
            onChange={(e) => update(i, 'name', e.target.value)}
            placeholder="Label"
            className="flex-1 px-3 py-2 rounded-lg bg-surface-soft border border-line text-fg text-xs focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <input
            value={item.path}
            onChange={(e) => update(i, 'path', e.target.value)}
            placeholder="/path"
            className="flex-1 px-3 py-2 rounded-lg bg-surface-soft border border-line text-fg text-xs focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button onClick={() => remove(i)} className="text-fg-soft hover:text-red-400">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  )
}

export default function FooterManage() {
  const { siteConfig, setSiteConfig } = useStore()
  const [footer, setFooter] = useState<FooterConfig>(siteConfig.footer)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSiteConfig({ ...siteConfig, footer })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const updateBadge = (i: number, field: keyof BadgeItem, value: string) =>
    setFooter({
      ...footer,
      trustBadges: footer.trustBadges.map((b, idx) =>
        idx === i ? { ...b, [field]: value } : b,
      ),
    })

  const addBadge = () =>
    setFooter({
      ...footer,
      trustBadges: [...footer.trustBadges, { title: '', sub: '' }],
    })

  const removeBadge = (i: number) =>
    setFooter({
      ...footer,
      trustBadges: footer.trustBadges.filter((_, idx) => idx !== i),
    })

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-fg mb-1">Footer Settings</h1>
          <p className="text-fg-muted text-sm">Manage footer links, trust badges, and copyright</p>
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
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-fg font-bold">Trust Badges</h2>
              <p className="text-fg-muted text-xs">Badges shown above footer links</p>
            </div>
          </div>

          {footer.trustBadges.map((badge, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                value={badge.title}
                onChange={(e) => updateBadge(i, 'title', e.target.value)}
                placeholder="Title"
                className="flex-1 px-3 py-2 rounded-lg bg-surface-soft border border-line text-fg text-xs focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <input
                value={badge.sub}
                onChange={(e) => updateBadge(i, 'sub', e.target.value)}
                placeholder="Subtitle"
                className="flex-1 px-3 py-2 rounded-lg bg-surface-soft border border-line text-fg text-xs focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button onClick={() => removeBadge(i)} className="text-fg-soft hover:text-red-400">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          <button
            onClick={addBadge}
            className="inline-flex items-center gap-1 text-xs text-cyan hover:text-primary transition-colors"
          >
            <Plus className="w-3 h-3" /> Add Badge
          </button>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <div className="p-6 rounded-xl glass space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-line">
            <div className="w-10 h-10 rounded-lg bg-cyan/10 flex items-center justify-center">
              <Link2 className="w-5 h-5 text-cyan" />
            </div>
            <div>
              <h2 className="text-fg font-bold">Footer Links</h2>
              <p className="text-fg-muted text-xs">Shop, company, and support links</p>
            </div>
          </div>

          <LinkEditor
            title="Shop Links"
            items={footer.shopLinks}
            onChange={(shopLinks) => setFooter({ ...footer, shopLinks })}
          />

          <div className="border-t border-line pt-4">
            <LinkEditor
              title="Company Links"
              items={footer.companyLinks}
              onChange={(companyLinks) => setFooter({ ...footer, companyLinks })}
            />
          </div>

          <div className="border-t border-line pt-4">
            <LinkEditor
              title="Support Links"
              items={footer.supportLinks}
              onChange={(supportLinks) => setFooter({ ...footer, supportLinks })}
            />
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.2}>
        <div className="p-6 rounded-xl glass space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-line">
            <div className="w-10 h-10 rounded-lg bg-green-400/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h2 className="text-fg font-bold">General</h2>
              <p className="text-fg-muted text-xs">Copyright text and newsletter toggle</p>
            </div>
          </div>

          <div>
            <label className="block text-sm text-fg-muted mb-1">Copyright Text</label>
            <input
              value={footer.copyrightText}
              onChange={(e) => setFooter({ ...footer, copyrightText: e.target.value })}
              placeholder="Use {year} for current year"
              className="w-full px-4 py-2.5 rounded-lg bg-surface-soft border border-line text-fg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <p className="text-xs text-fg-soft mt-1">Use &#123;year&#125; to insert the current year</p>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={footer.newsletterEnabled}
              onChange={(e) => setFooter({ ...footer, newsletterEnabled: e.target.checked })}
              className="w-4 h-4 rounded accent-primary"
            />
            <span className="text-fg text-sm">Show newsletter signup form</span>
          </label>
        </div>
      </AnimatedSection>
    </div>
  )
}
