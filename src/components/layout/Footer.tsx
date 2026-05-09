import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Facebook, Instagram, MessageCircle, Music2, Mail, MapPin, Phone, Sparkles, ChevronRight } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { useStore } from '@/context/StoreContext'

export default function Footer() {
  const { brandSettings, categories } = useStore()

  const socialLinks = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      url: brandSettings.whatsapp,
      tone: 'hover:text-green-500 hover:border-green-500/45 hover:shadow-green-500/30',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: brandSettings.facebook,
      tone: 'hover:text-blue-500 hover:border-blue-500/45 hover:shadow-blue-500/30',
    },
    {
      name: 'TikTok',
      icon: Music2,
      url: brandSettings.tiktok,
      tone: 'hover:text-pink-500 hover:border-pink-500/45 hover:shadow-pink-500/30',
    },
    {
      name: 'Instagram',
      icon: Instagram,
      url: brandSettings.instagram,
      tone: 'hover:text-purple-500 hover:border-purple-500/45 hover:shadow-purple-500/30',
    },
  ]

  return (
    <footer className="relative bg-bg-2 border-t border-line carbon-fiber pb-20 md:pb-0 overflow-hidden">
      <div className="absolute inset-0 footer-brand-band pointer-events-none" />
      <div className="absolute top-0 left-0 w-full divider-glow" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-10 sm:pb-14">
        {/* Top brand band */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 sm:mb-14 pb-8 sm:pb-10 border-b border-line">
          <div className="flex items-center gap-4">
            <div className="premium-frame w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center p-1">
              <img
                src="/logo.png"
                alt="Shokher Bike Wala"
                className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(255,106,26,0.4)]"
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-display text-base sm:text-xl font-bold text-gradient-fire">
                SHOKHER BIKE WALA
              </span>
              <span className="font-racing text-xs text-fg-soft tracking-[0.25em] uppercase">
                Premium Accessories • Bangladesh
              </span>
            </div>
          </div>

          <a
            href={brandSettings.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-premium text-sm w-full md:w-auto"
          >
            <Sparkles className="w-4 h-4" />
            Order on WhatsApp
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          <AnimatedSection delay={0}>
            <div className="space-y-4">
              <h3 className="font-display text-xs font-semibold text-primary uppercase tracking-[0.25em]">
                About
              </h3>
              <p className="text-fg-muted text-sm leading-relaxed">
                Your ultimate destination for premium bike accessories. Ride with style, ride with safety.
              </p>
              <div className="flex flex-wrap gap-2.5 pt-1">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.12, y: -2 }}
                    whileTap={{ scale: 0.92 }}
                    aria-label={social.name}
                    className={`p-2.5 rounded-xl bg-bg/50 text-fg-muted border border-line transition-all duration-300 hover:bg-bg ${social.tone}`}
                  >
                    <social.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.a>
                ))}
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="space-y-4">
              <h3 className="font-display text-xs font-semibold text-primary uppercase tracking-[0.25em]">
                Quick Links
              </h3>
              <ul className="space-y-2.5">
                {[
                  { name: 'Home', path: '/' },
                  { name: 'Products', path: '/products' },
                  { name: 'Categories', path: '/categories' },
                  { name: 'About Us', path: '/about' },
                  { name: 'Contact', path: '/contact' },
                ].map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-fg-muted hover:text-primary transition-colors text-sm font-racing tracking-wide inline-flex items-center gap-1.5 group"
                    >
                      <span className="w-0 group-hover:w-2.5 h-0.5 bg-gradient-to-r from-primary to-primary/40 transition-all duration-300 rounded-full" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="space-y-4">
              <h3 className="font-display text-xs font-semibold text-cyan uppercase tracking-[0.25em]">
                Categories
              </h3>
              <ul className="space-y-2.5">
                {categories.slice(0, 6).map((cat) => (
                  <li key={cat.id}>
                    <Link
                      to={`/products?category=${cat.slug}`}
                      className="text-fg-muted hover:text-cyan transition-colors text-sm font-racing tracking-wide inline-flex items-center gap-1.5 group"
                    >
                      <span className="w-0 group-hover:w-2.5 h-0.5 bg-gradient-to-r from-cyan to-cyan/40 transition-all duration-300 rounded-full" />
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <div className="space-y-4">
              <h3 className="font-display text-xs font-semibold text-gold uppercase tracking-[0.25em]">
                Contact
              </h3>
              <ul className="space-y-3.5">
                <li className="flex items-start gap-3 text-fg-muted text-sm">
                  <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20 flex-shrink-0 mt-0.5">
                    <Phone className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="font-racing tracking-wide">+880 1518 934708</span>
                </li>
                <li className="flex items-start gap-3 text-fg-muted text-sm">
                  <div className="p-1.5 rounded-lg bg-cyan/10 border border-cyan/20 flex-shrink-0 mt-0.5">
                    <Mail className="w-3.5 h-3.5 text-cyan" />
                  </div>
                  <span className="font-racing tracking-wide break-all">info@shokherbikewala.com</span>
                </li>
                <li className="flex items-start gap-3 text-fg-muted text-sm">
                  <div className="p-1.5 rounded-lg bg-gold/10 border border-gold/20 flex-shrink-0 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-gold" />
                  </div>
                  <span className="font-racing tracking-wide">Bangladesh</span>
                </li>
              </ul>
            </div>
          </AnimatedSection>
        </div>

        <div className="mt-10 sm:mt-14 pt-6 sm:pt-8 border-t border-line">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-fg-soft text-xs font-racing tracking-wide">
              &copy; {new Date().getFullYear()} Shokher Bike Wala. All rights reserved.
            </p>
            <p className="text-fg-soft text-xs font-racing tracking-[0.25em] uppercase">
              Ride Safe • Ride Stylish
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
