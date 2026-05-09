import { motion } from 'framer-motion'
import { Facebook, Instagram, MessageCircle, Music2, ExternalLink, Globe } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { useStore } from '@/context/StoreContext'

export default function BrandProfile() {
  const { brandSettings } = useStore()

  const socialLinks = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      url: brandSettings.whatsapp,
      grad: 'linear-gradient(135deg,#25D366,#128C7E)',
      iconBg: 'from-green-500 to-emerald-600',
      handle: '+880 1518 934708',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: brandSettings.facebook,
      grad: 'linear-gradient(135deg,#1877F2,#0E5FCF)',
      iconBg: 'from-blue-500 to-blue-700',
      handle: 'Shokher Bike Wala',
    },
    {
      name: 'TikTok',
      icon: Music2,
      url: brandSettings.tiktok,
      grad: 'linear-gradient(135deg,#FE2C55,#25F4EE)',
      iconBg: 'from-pink-500 to-rose-600',
      handle: '@shokherbikewala',
    },
    {
      name: 'Instagram',
      icon: Instagram,
      url: brandSettings.instagram,
      grad: 'linear-gradient(135deg,#FD1D1D,#833AB4,#FCB045)',
      iconBg: 'from-purple-500 via-pink-500 to-orange-500',
      handle: '@shokherbikewala',
    },
  ]
  return (
    <section className="relative py-14 sm:py-24 overflow-hidden">
      <div className="absolute inset-0 footer-brand-band" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan/30 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="divider-glow mb-10 sm:mb-14 rounded-full" />

        <AnimatedSection className="text-center mb-10 sm:mb-14">
          <span className="section-eyebrow mb-3 sm:mb-4">
            <Globe className="w-3 h-3" />
            Connect With Us
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-display font-bold mt-3 mb-3 sm:mb-4">
            <span className="text-gradient-headline">Follow </span>
            <span className="text-gradient-fire">Shokher Bike Wala</span>
          </h2>
          <p className="text-fg-muted max-w-2xl mx-auto text-sm sm:text-base font-racing tracking-wide">
            Latest products, deals, and bike accessory reviews — straight to your feed.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {socialLinks.map((social, i) => (
            <AnimatedSection key={social.name} delay={i * 0.1} direction="up">
              <motion.a
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -8 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                style={{ ['--social-grad' as string]: social.grad }}
                className="social-card premium-card racing-card group block p-4 sm:p-6 cursor-pointer"
              >
                <div
                  className={`w-11 h-11 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${social.iconBg} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-lg`}
                >
                  <social.icon className="w-5 h-5 sm:w-7 sm:h-7 text-white drop-shadow" />
                </div>
                <h3 className="text-fg font-bold text-sm sm:text-lg mb-1 font-racing">{social.name}</h3>
                <p className="text-fg-muted text-xs sm:text-sm mb-2 sm:mb-3 truncate">{social.handle}</p>
                <div className="flex items-center gap-1.5 text-xs text-fg-soft group-hover:text-primary transition-colors font-racing tracking-wider uppercase">
                  <span>Visit</span>
                  <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </motion.a>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
