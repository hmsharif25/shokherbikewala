import { motion } from 'framer-motion'
import { Facebook, Instagram, MessageCircle, Music2, ExternalLink } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'

const socialLinks = [
  {
    name: 'WhatsApp',
    icon: MessageCircle,
    url: 'https://wa.me/8801518934708',
    color: 'from-green-500 to-green-600',
    hoverGlow: 'hover:shadow-green-500/30',
    handle: '+880 1518 934708',
  },
  {
    name: 'Facebook',
    icon: Facebook,
    url: 'https://www.facebook.com/share/1CvH4aQ5kU/?mibextid=wwXIfr',
    color: 'from-blue-500 to-blue-600',
    hoverGlow: 'hover:shadow-blue-500/30',
    handle: 'Shokher Bike Wala',
  },
  {
    name: 'TikTok',
    icon: Music2,
    url: 'https://www.tiktok.com/@shokherbikewala?_r=1&_t=ZS-964cHi86h1Q',
    color: 'from-pink-500 to-rose-600',
    hoverGlow: 'hover:shadow-pink-500/30',
    handle: '@shokherbikewala',
  },
  {
    name: 'Instagram',
    icon: Instagram,
    url: 'https://www.instagram.com/shokherbikewala?igsh=MWJsbW96aXphNjZsaA==',
    color: 'from-purple-500 via-pink-500 to-orange-500',
    hoverGlow: 'hover:shadow-purple-500/30',
    handle: '@shokherbikewala',
  },
]

export default function BrandProfile() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-dark via-surface/50 to-dark" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan/30 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <motion.span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4 border border-primary/20">
            CONNECT WITH US
          </motion.span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-4">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {socialLinks.map((social, i) => (
            <AnimatedSection key={social.name} delay={i * 0.1} direction="up">
              <motion.a
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`block p-6 rounded-2xl glass group cursor-pointer transition-all duration-300 hover:shadow-2xl ${social.hoverGlow}`}
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${social.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <social.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg mb-1">{social.name}</h3>
                <p className="text-gray-400 text-sm mb-3">{social.handle}</p>
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
