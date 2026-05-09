import { motion } from 'framer-motion'
import { Instagram, Music2, Facebook, Youtube, Star, Play, Heart, MessageSquare, Share2 } from 'lucide-react'
import VReveal from '@/components/ui/VReveal'
import { useStore } from '@/context/StoreContext'

const FOLLOWER_COUNTS = [
  { icon: Instagram, label: 'Instagram Followers', count: '125K+' },
  { icon: Music2, label: 'TikTok Followers', count: '65K+' },
  { icon: Facebook, label: 'Facebook Fans', count: '45K+' },
  { icon: Youtube, label: 'YouTube Viewers', count: '18K+' },
]

/**
 * Community + social showcase. Mirrors the "Stay Connected With Velocity"
 * reference: 4-column grid with Instagram tiles, TikTok video, Facebook
 * reviews, and follower stats strip below.
 */
export default function VCommunity() {
  const { products, brandSettings, testimonials } = useStore()

  // 9 product images for the IG tile grid (recycle if needed).
  const igImages: string[] = []
  for (let i = 0; i < 9; i++) {
    const p = products[i % products.length]
    if (p?.images?.[0]) igImages.push(p.images[0])
  }
  while (igImages.length < 9) igImages.push(igImages[0] || '')

  const tiktokCover =
    'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80'

  return (
    <section className="v-premium-section v-community-section relative py-20 sm:py-24 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <VReveal className="text-center mb-10 sm:mb-14">
          <span className="v-eyebrow-long mb-4 sm:mb-5 mx-auto justify-center">Creator Community</span>
          <h2 className="v-headline text-3xl sm:text-5xl md:text-6xl mt-3 mb-4">
            RIDER <em>SOCIAL FEED</em>
          </h2>
          <p className="text-fg-muted max-w-xl mx-auto font-ui text-base">
            Instagram reels, TikTok motion, YouTube-style drops, and rider reviews
            presented as a premium creator economy showcase.
          </p>
        </VReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
          {/* Instagram tile grid */}
          <SocialCard
            handle="@shokherbikewala"
            platform="Instagram"
            ctaLabel="Follow"
            url={brandSettings.instagram}
            iconBg="from-pink-500 via-orange-500 to-yellow-400"
            Icon={Instagram}
          >
            <div className="grid grid-cols-3 gap-1.5">
              {igImages.map((src, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.04 }}
                  className="relative aspect-square rounded-lg overflow-hidden bg-bg-2"
                >
                  <img src={src} alt={`Post ${i}`} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                  {i === 1 && (
                    <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Play className="w-5 h-5 text-white fill-white" />
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
            <p className="text-xs text-fg-soft text-center mt-3 font-ui">
              View More on Instagram
            </p>
          </SocialCard>

          {/* TikTok video */}
          <SocialCard
            handle="@shokherbikewala"
            platform="TikTok"
            ctaLabel="Follow"
            url={brandSettings.tiktok}
            iconBg="from-black via-zinc-900 to-zinc-700"
            Icon={Music2}
          >
            <div className="relative aspect-[9/14] rounded-2xl overflow-hidden bg-bg-2">
              <img src={tiktokCover} alt="TikTok cover" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                <span className="font-headline text-white font-bold tracking-wider text-sm">
                  SHOKHER
                </span>
              </div>
              <div className="absolute bottom-3 right-3 flex flex-col gap-3 text-white">
                <Stat icon={Heart} count="12.5K" />
                <Stat icon={MessageSquare} count="256" />
                <Stat icon={Share2} count="892" />
              </div>
            </div>
            <p className="text-xs text-fg-soft text-center mt-3 font-ui">
              Discover more on TikTok
            </p>
          </SocialCard>

          {/* Facebook reviews */}
          <SocialCard
            handle="Shokher Bike Wala"
            platform="Facebook"
            ctaLabel="Like Page"
            url={brandSettings.facebook}
            iconBg="from-blue-500 to-blue-700"
            Icon={Facebook}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl font-headline font-bold text-fg">4.9</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 v-star-fill" />
                ))}
              </div>
              <span className="text-xs text-fg-soft font-ui">(1,204 reviews)</span>
            </div>
            <ul className="space-y-2.5 max-h-72 overflow-hidden">
              {testimonials.slice(0, 3).map((t) => (
                <li key={t.id} className="flex gap-3">
                  <div className="w-9 h-9 flex-shrink-0 rounded-full bg-gradient-to-br from-primary to-primary-700 text-white font-headline font-bold flex items-center justify-center text-xs">
                    {t.name
                      .split(' ')
                      .map((s) => s[0])
                      .filter(Boolean)
                      .slice(0, 2)
                      .join('')
                      .toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-fg font-ui font-bold text-xs sm:text-sm">{t.name}</p>
                      <div className="flex">
                        {Array.from({ length: t.rating }).map((_, idx) => (
                          <Star key={idx} className="w-3 h-3 v-star-fill" />
                        ))}
                      </div>
                    </div>
                    <p className="text-fg-soft text-[11px] line-clamp-2 font-ui">{t.text}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="text-xs text-fg-soft text-center mt-3 font-ui">View More Reviews</p>
          </SocialCard>

          <SocialCard
            handle="ShokherBikewala"
            platform="YouTube"
            ctaLabel="Watch"
            url="https://www.youtube.com/results?search_query=ShokherBikewala"
            iconBg="from-red-600 to-black"
            Icon={Youtube}
          >
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-bg-2 mb-3">
              <img src={tiktokCover} alt="YouTube rider drop" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-black/20 to-primary/30" />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="w-14 h-14 rounded-full bg-white/90 text-red-600 flex items-center justify-center shadow-2xl">
                  <Play className="w-6 h-6 fill-current ml-0.5" />
                </span>
              </span>
            </div>
            <p className="text-fg font-headline font-bold text-base sm:text-lg mb-1">
              Cinematic Gear Drops
            </p>
            <p className="text-fg-soft text-xs font-ui leading-relaxed">
              Premium product films, setup previews, and future rider lifestyle stories.
            </p>
          </SocialCard>
        </div>

        {/* Follower stats */}
        <VReveal delay={200} className="mt-8 sm:mt-10">
          <div className="v-capsule rounded-2xl px-3 py-4 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {FOLLOWER_COUNTS.map((c) => (
              <div key={c.label} className="flex items-center gap-3 px-2">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary flex-shrink-0">
                  <c.icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-headline font-bold text-fg text-base sm:text-xl leading-tight">
                    {c.count}
                  </p>
                  <p className="text-[10px] sm:text-xs text-fg-soft font-ui uppercase tracking-wider truncate">
                    {c.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </VReveal>
      </div>
    </section>
  )
}

interface SocialCardProps {
  handle: string
  platform: string
  ctaLabel: string
  url: string
  iconBg: string
  Icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}

function SocialCard({ handle, platform, ctaLabel, url, iconBg, Icon, children }: SocialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="v-capsule rounded-2xl p-4 sm:p-5 flex flex-col"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${iconBg} flex items-center justify-center text-white shadow-md`}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <p className="font-headline font-bold text-fg text-sm uppercase tracking-wider">
              {platform}
            </p>
            <p className="text-[11px] text-fg-soft font-ui truncate max-w-[10rem]">{handle}</p>
          </div>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-ui font-bold uppercase tracking-[0.18em] px-3 py-1.5 rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition-colors whitespace-nowrap"
        >
          {ctaLabel}
        </a>
      </div>
      <div className="flex-1">{children}</div>
    </motion.div>
  )
}

function Stat({ icon: I, count }: { icon: React.ComponentType<{ className?: string }>; count: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
        <I className="w-4 h-4" />
      </span>
      <span className="text-[10px] font-ui font-bold">{count}</span>
    </div>
  )
}
