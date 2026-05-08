import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Facebook, Instagram, MessageCircle, Music2, Mail, MapPin, Phone } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'

const socialLinks = [
  {
    name: 'WhatsApp',
    icon: MessageCircle,
    url: 'https://wa.me/8801518934708',
    color: 'hover:text-green-400 hover:shadow-green-400/20',
  },
  {
    name: 'Facebook',
    icon: Facebook,
    url: 'https://www.facebook.com/share/1CvH4aQ5kU/?mibextid=wwXIfr',
    color: 'hover:text-blue-400 hover:shadow-blue-400/20',
  },
  {
    name: 'TikTok',
    icon: Music2,
    url: 'https://www.tiktok.com/@shokherbikewala?_r=1&_t=ZS-964cHi86h1Q',
    color: 'hover:text-pink-400 hover:shadow-pink-400/20',
  },
  {
    name: 'Instagram',
    icon: Instagram,
    url: 'https://www.instagram.com/shokherbikewala?igsh=MWJsbW96aXphNjZsaA==',
    color: 'hover:text-purple-400 hover:shadow-purple-400/20',
  },
]

export default function Footer() {
  return (
    <footer className="relative bg-dark-50 border-t border-white/5">
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="racing-stripe-divider mb-10 sm:mb-12 rounded-full" />
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10">
          <AnimatedSection delay={0}>
            <div className="space-y-4">
              <Link to="/" className="flex items-center gap-3">
                <img src="/logo.png" alt="Shokher Bike Wala" className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-contain drop-shadow-[0_0_8px_rgba(255,69,0,0.3)]" />
                <span className="font-display text-sm sm:text-xl font-bold bg-gradient-to-r from-primary to-cyan bg-clip-text text-transparent">
                  Shokher Bike Wala
                </span>
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed">
                Your ultimate destination for premium bike accessories. Ride with style, ride with safety.
              </p>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.2, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-2 rounded-lg bg-white/5 text-gray-400 transition-all duration-300 hover:bg-white/10 ${social.color}`}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="space-y-4">
              <h3 className="font-display text-sm font-semibold text-primary uppercase tracking-wider">
                Quick Links
              </h3>
              <ul className="space-y-2">
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
                      className="text-gray-400 hover:text-primary transition-colors text-sm inline-flex items-center gap-1 group"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-primary transition-all duration-300" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="space-y-4">
              <h3 className="font-display text-sm font-semibold text-primary uppercase tracking-wider">
                Categories
              </h3>
              <ul className="space-y-2">
                {['Helmets', 'Gloves', 'Jackets', 'LED Lights', 'Phone Mounts', 'Exhaust Systems'].map(
                  (cat) => (
                    <li key={cat}>
                      <Link
                        to={`/products?category=${cat.toLowerCase().replace(' ', '-')}`}
                        className="text-gray-400 hover:text-cyan transition-colors text-sm inline-flex items-center gap-1 group"
                      >
                        <span className="w-0 group-hover:w-2 h-0.5 bg-cyan transition-all duration-300" />
                        {cat}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <div className="space-y-4">
              <h3 className="font-display text-sm font-semibold text-primary uppercase tracking-wider">
                Contact
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-gray-400 text-sm">
                  <Phone className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>+880 1518 934708</span>
                </li>
                <li className="flex items-start gap-3 text-gray-400 text-sm">
                  <Mail className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>info@shokherbikewala.com</span>
                </li>
                <li className="flex items-start gap-3 text-gray-400 text-sm">
                  <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Bangladesh</span>
                </li>
              </ul>
            </div>
          </AnimatedSection>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-xs">
              &copy; {new Date().getFullYear()} Shokher Bike Wala. All rights reserved.
            </p>
            <p className="text-gray-600 text-xs">
              Ride Safe, Ride Stylish
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
