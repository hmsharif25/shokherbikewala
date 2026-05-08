import { motion } from 'framer-motion'
import { Facebook, Instagram, MessageCircle, Music2, ExternalLink } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { useStore } from '@/context/StoreContext'

export default function BrandProfile() {
  const { brandSettings } = useStore()

  const socialLinks = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      url: brandSettings.whatsapp,
      color: 'from-green-500 to-green-600',
      hoverGlow: 'hover:shadow-green-500/30',
      handle: '+880 1518 934708',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: brandSettings.facebook,
      color: 'from-blue-500 to-blue-600',
      hoverGlow: 'hover:shadow-blue-500/30',
      handle: 'Shokher Bike Wala',
    },
    {
      name: 'TikTok',
      icon: Music2,
      url: brandSettings.tiktok,
      color: 'from-pink-500 to-rose-600',
      hoverGlow: 'hover:shadow-pink-500/30',
      handle: '@shokherbikewala',
    },
    {
      name: 'Instagram',
      icon: Instagram,
      url: brandSettings.instagram,
      color: 'from-purple-500 via-pink-500 to-orange-500',
      hoverGlow: 'hover:shadow-purple-500/30',
      handle: '@shokherbikewala',
    },
  ]
  return (
    <section className="relative py-14 sm:py-24 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-dark via-surface/50 to-dark" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan/30 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="racing-stripe-divider mb-10 sm:mb-14 rounded-full" />

        <AnimatedSection className="text-center mb-10 sm:mb-16">
          <motion.span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-racing tracking-widest mb-4 border border-primary/20 uppercase">
            Connect With Us
          </motion.span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-display font-bold mb-4">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Follow{' '}
            </span>
            <span className="bg-gradient-to-r from-primary to-gold bg-clip-text text-transparent text-glow">
              Shokher Bike Wala
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Stay updated with latest products, deals, and bike accessories reviews
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {socialLinks.map((social, i) => (
            <AnimatedSection key={social.name} delay={i * 0.1} direction="up">
              <motion.a
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`block p-4 sm:p-6 rounded-2xl glass racing-card group cursor-pointer transition-all duration-300 hover:shadow-2xl border border-white/5 hover:border-white/10 ${social.hoverGlow}`}
              >
                <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${social.color} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}>
                  <social.icon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                </div>
                <h3 className="text-white font-bold text-sm sm:text-lg mb-1 font-racing">{social.name}</h3>
                <p className="text-gray-400 text-xs sm:text-sm mb-2 sm:mb-3 truncate">{social.handle}</p>
                <div className="flex items-center gap-1 text-xs text-gray-500 group-hover:text-primary transition-colors">
                  <span>Visit</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </motion.a>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
