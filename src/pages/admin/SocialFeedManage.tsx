import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, Instagram, Music2, Facebook, Youtube, Type, Hash } from 'lucide-react'
import { useStore } from '@/context/StoreContext'
import { SocialFeedConfig } from '@/types'
import { saveSocialFeedRemote } from '@/lib/db'
import AnimatedSection from '@/components/ui/AnimatedSection'
import ImageUpload from '@/components/ui/ImageUpload'

const PLATFORM_META = [
  { platform: 'Instagram', icon: Instagram, color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/20' },
  { platform: 'TikTok', icon: Music2, color: 'text-white', bg: 'bg-zinc-700/30 border-zinc-500/20' },
  { platform: 'Facebook', icon: Facebook, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  { platform: 'YouTube', icon: Youtube, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
]

export default function SocialFeedManage() {
  const { socialFeed, setSocialFeed } = useStore()
  const [config, setConfig] = useState<SocialFeedConfig>(socialFeed)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const handlePlatformChange = (index: number, field: 'handle' | 'followers', value: string) => {
    setConfig(prev => ({
      ...prev,
      platforms: prev.platforms.map((p, i) => i === index ? { ...p, [field]: value } : p),
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    setSaveError(null)
    setSocialFeed(config)
    const { error } = await saveSocialFeedRemote(config)
    setSaving(false)
    if (error) {
      setSaveError(error)
      setTimeout(() => setSaveError(null), 5000)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-fg mb-1">Rider Social Feed</h1>
          <p className="text-gray-400 text-sm">
            Edit social media handles, follower counts, and content for the homepage social section.
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

      {/* Platform Cards */}
      <AnimatedSection delay={0.05}>
        <div className="rounded-xl glass border border-white/10 p-5 space-y-5">
          <h2 className="text-lg font-display font-bold text-fg flex items-center gap-2">
            <Hash className="w-5 h-5 text-primary" />
            Platform Stats
          </h2>

          <div className="space-y-4">
            {config.platforms.map((p, i) => {
              const meta = PLATFORM_META.find(m => m.platform === p.platform)
              const Icon = meta?.icon ?? Instagram
              return (
                <div key={p.platform} className={`rounded-xl border p-4 ${meta?.bg ?? 'bg-white/5 border-white/10'}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <Icon className={`w-5 h-5 ${meta?.color ?? 'text-fg'}`} />
                    <span className="font-headline font-bold text-fg text-sm uppercase tracking-wider">
                      {p.platform}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Handle</label>
                      <input
                        value={p.handle}
                        onChange={e => handlePlatformChange(i, 'handle', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-bg-2/80 border border-line text-fg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="@username"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Follower Count</label>
                      <input
                        value={p.followers}
                        onChange={e => handlePlatformChange(i, 'followers', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-bg-2/80 border border-line text-fg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="125K+"
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </AnimatedSection>

      {/* Facebook Reviews */}
      <AnimatedSection delay={0.1}>
        <div className="rounded-xl glass border border-white/10 p-5 space-y-4">
          <h2 className="text-lg font-display font-bold text-fg flex items-center gap-2">
            <Facebook className="w-5 h-5 text-blue-400" />
            Facebook Reviews
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Rating (e.g. 4.9)</label>
              <input
                value={config.facebookRating}
                onChange={e => setConfig(prev => ({ ...prev, facebookRating: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-bg-2/80 border border-line text-fg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="4.9"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Review Count</label>
              <input
                value={config.facebookReviewCount}
                onChange={e => setConfig(prev => ({ ...prev, facebookReviewCount: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-bg-2/80 border border-line text-fg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="1,204"
              />
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* TikTok Cover */}
      <AnimatedSection delay={0.15}>
        <div className="rounded-xl glass border border-white/10 p-5 space-y-4">
          <h2 className="text-lg font-display font-bold text-fg flex items-center gap-2">
            <Music2 className="w-5 h-5 text-white" />
            TikTok Cover Image
          </h2>
          <ImageUpload
            value={config.tiktokCoverImage}
            onChange={v => setConfig(prev => ({ ...prev, tiktokCoverImage: v as string }))}
            folder="social-feed"
            label="Upload or paste TikTok cover image"
            hint="Recommended: 9:14 portrait ratio (e.g. 720×1120)"
          />
        </div>
      </AnimatedSection>

      {/* YouTube Content */}
      <AnimatedSection delay={0.2}>
        <div className="rounded-xl glass border border-white/10 p-5 space-y-4">
          <h2 className="text-lg font-display font-bold text-fg flex items-center gap-2">
            <Type className="w-5 h-5 text-red-400" />
            YouTube Section Content
          </h2>
          <ImageUpload
            value={config.youtubeCoverImage}
            onChange={v => setConfig(prev => ({ ...prev, youtubeCoverImage: v as string }))}
            folder="social-feed"
            label="YouTube Cover Image"
            hint="Recommended: 16:9 landscape ratio (e.g. 1280×720)"
          />
          <div>
            <label className="block text-xs text-gray-400 mb-1">Title</label>
            <input
              value={config.youtubeTitle}
              onChange={e => setConfig(prev => ({ ...prev, youtubeTitle: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg bg-bg-2/80 border border-line text-fg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 font-bold"
              placeholder="Cinematic Gear Drops"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Description</label>
            <textarea
              value={config.youtubeDescription}
              onChange={e => setConfig(prev => ({ ...prev, youtubeDescription: e.target.value }))}
              rows={2}
              className="w-full px-3 py-2 rounded-lg bg-bg-2/80 border border-line text-fg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              placeholder="Premium product films..."
            />
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.25}>
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 text-center">
          <p className="text-gray-400 text-xs">
            Changes take effect immediately on the homepage after saving.
          </p>
        </div>
      </AnimatedSection>
    </div>
  )
}
