import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Facebook,
  Instagram,
  Music2,
  MessageCircle,
  Mail,
  MapPin,
  Phone,
  Globe,
  ArrowRight,
  Shield,
  Truck,
  Award,
  RotateCcw,
  ChevronRight,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useStore } from '@/context/StoreContext'

const TRUST_BADGES = [
  { icon: Shield, title: 'Premium Quality', sub: 'Engineered for performance & safety' },
  { icon: Truck, title: 'Free Shipping', sub: 'Free shipping on orders over ৳5000' },
  { icon: Award, title: '2 Year Warranty', sub: 'Quality guaranteed with extended care' },
  { icon: RotateCcw, title: 'Easy Returns', sub: 'Hassle-free returns within 7 days' },
]

const SHOP_LINKS = [
  { name: 'Helmets', path: '/products?category=helmets' },
  { name: 'Gloves', path: '/products?category=gloves' },
  { name: 'Riding Jackets', path: '/products?category=jackets' },
  { name: 'LED Lights', path: '/products?category=led-lights' },
  { name: 'Exhaust Systems', path: '/products?category=exhaust-systems' },
  { name: 'All Accessories', path: '/products' },
]

const COMPANY_LINKS = [
  { name: 'About Us', path: '/about' },
  { name: 'Our Story', path: '/about' },
  { name: 'Brands', path: '/categories' },
  { name: 'Blog', path: '/about' },
  { name: 'Contact Us', path: '/contact' },
]

const SUPPORT_LINKS = [
  { name: 'Shipping Information', path: '/contact' },
  { name: 'Returns & Exchanges', path: '/contact' },
  { name: 'Warranty Policy', path: '/contact' },
  { name: 'FAQ', path: '/' },
  { name: 'Track Your Order', path: '/track' },
  { name: 'Size Guide', path: '/contact' },
]

export default function Footer() {
  const { brandSettings } = useStore()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const onSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setSubscribed(true)
    setEmail('')
    setTimeout(() => setSubscribed(false), 3500)
  }

  const socials = [
    { Icon: Instagram, url: brandSettings.instagram, label: 'Instagram' },
    { Icon: Facebook, url: brandSettings.facebook, label: 'Facebook' },
    { Icon: Music2, url: brandSettings.tiktok, label: 'TikTok' },
    { Icon: MessageCircle, url: brandSettings.whatsapp, label: 'WhatsApp' },
  ]

  return (
    <footer className="relative bg-bg-2/40 border-t border-line pt-12 sm:pt-16 pb-28 md:pb-12 overflow-hidden">
      <div className="absolute inset-0 v-dot-field opacity-20 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-12 sm:mb-16">
          {TRUST_BADGES.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="v-capsule rounded-2xl px-3 py-4 flex items-center gap-3"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary flex-shrink-0">
                <b.icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="font-headline font-bold text-fg text-xs sm:text-sm uppercase tracking-wider">
                  {b.title}
                </p>
                <p className="text-fg-soft text-[10px] sm:text-xs font-ui leading-tight mt-0.5 line-clamp-2">
                  {b.sub}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12">
          {/* Brand column */}
          <div className="col-span-2 lg:col-span-4 space-y-5">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20 p-1.5 flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="Shokher Bike Wala"
                  className="w-full h-full object-contain drop-shadow-[0_0_12px_rgba(255,90,0,0.45)]"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-headline text-lg font-bold text-fg tracking-wide">
                  SHOKHER
                </span>
                <span className="font-headline text-xs font-bold text-primary tracking-[0.32em]">
                  BIKE WALA
                </span>
              </div>
            </Link>
            <p className="text-fg-muted text-sm font-ui leading-relaxed max-w-xs">
              Premium motorcycle accessories engineered for riders who demand
              performance, style, and uncompromising quality.
            </p>
            <div className="flex items-center gap-2.5">
              {socials.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full border border-line bg-bg/60 text-fg-muted hover:text-primary hover:border-primary/40 flex items-center justify-center transition-all"
                >
                  <s.Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Shop links */}
          <div className="col-span-1 lg:col-span-2">
            <h4 className="font-headline font-bold text-fg text-xs uppercase tracking-[0.25em] mb-4 flex items-center gap-2">
              Shop
              <span className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent" />
            </h4>
            <ul className="space-y-2.5">
              {SHOP_LINKS.map((l) => (
                <li key={l.path + l.name}>
                  <Link
                    to={l.path}
                    className="group inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-primary font-ui transition-colors"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all text-primary" />
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="col-span-1 lg:col-span-2">
            <h4 className="font-headline font-bold text-fg text-xs uppercase tracking-[0.25em] mb-4 flex items-center gap-2">
              Company
              <span className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent" />
            </h4>
            <ul className="space-y-2.5">
              {COMPANY_LINKS.map((l) => (
                <li key={l.path + l.name}>
                  <Link
                    to={l.path}
                    className="group inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-primary font-ui transition-colors"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all text-primary" />
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer service */}
          <div className="col-span-1 lg:col-span-2">
            <h4 className="font-headline font-bold text-fg text-xs uppercase tracking-[0.25em] mb-4 flex items-center gap-2">
              Support
              <span className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent" />
            </h4>
            <ul className="space-y-2.5">
              {SUPPORT_LINKS.map((l) => (
                <li key={l.path + l.name}>
                  <Link
                    to={l.path}
                    className="group inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-primary font-ui transition-colors"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all text-primary" />
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact us */}
          <div className="col-span-2 lg:col-span-2 space-y-4">
            <h4 className="font-headline font-bold text-fg text-xs uppercase tracking-[0.25em] flex items-center gap-2">
              Contact Us
              <span className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent" />
            </h4>
            <ul className="space-y-3 text-sm font-ui">
              <li className="flex gap-3 items-start text-fg-muted">
                <span className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary flex-shrink-0">
                  <MapPin className="w-3.5 h-3.5" />
                </span>
                <span>
                  Dhaka, Bangladesh
                  <br />
                  <span className="text-fg-soft text-xs">Free local pickup available</span>
                </span>
              </li>
              <li className="flex gap-3 items-start text-fg-muted">
                <span className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary flex-shrink-0">
                  <Phone className="w-3.5 h-3.5" />
                </span>
                <span>
                  +880 1518 934708
                  <br />
                  <span className="text-fg-soft text-xs">Mon–Sat: 10am – 9pm</span>
                </span>
              </li>
              <li className="flex gap-3 items-start text-fg-muted">
                <span className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary flex-shrink-0">
                  <Mail className="w-3.5 h-3.5" />
                </span>
                <span className="break-all">hello@shokherbikewala.com</span>
              </li>
              <li className="flex gap-3 items-start text-fg-muted">
                <span className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary flex-shrink-0">
                  <Globe className="w-3.5 h-3.5" />
                </span>
                <span className="break-all">www.shokherbikewala.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter strip */}
        <div className="mt-12 sm:mt-16 v-capsule rounded-3xl px-5 sm:px-8 py-6 sm:py-7 grid lg:grid-cols-12 gap-4 sm:gap-6 items-center">
          <div className="lg:col-span-5 flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <p className="font-headline font-bold text-fg text-base sm:text-lg uppercase tracking-wider">
                Stay Ahead. Stay Inspired.
              </p>
              <p className="text-fg-soft text-xs sm:text-sm font-ui">
                Subscribe for exclusive offers, new arrivals, and rider-only updates.
              </p>
            </div>
          </div>

          <form onSubmit={onSubscribe} className="lg:col-span-7 flex gap-2 w-full">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 bg-bg/80 border border-line rounded-full px-4 sm:px-5 py-3 text-sm font-ui placeholder:text-fg-soft text-fg outline-none focus:border-primary/50 transition-colors"
            />
            <button type="submit" className="v-pill-cta whitespace-nowrap">
              {subscribed ? 'Subscribed!' : 'Subscribe'}
              {!subscribed && (
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/25">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Divider with logo */}
        <div className="relative mt-12 mb-6 flex items-center">
          <span className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          <span className="mx-4 w-7 h-7 rounded-full bg-gradient-to-br from-[#ff7a1f] to-[#ff5a00] flex items-center justify-center text-white text-[10px] font-headline font-bold">
            S
          </span>
          <span className="flex-1 h-px bg-gradient-to-r from-primary/30 via-transparent to-transparent" />
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs font-ui">
          <p className="text-fg-soft">
            © {new Date().getFullYear()} Shokher Bike Wala. All rights reserved.
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            {['VISA', 'Mastercard', 'bKash', 'Nagad', 'COD'].map((p) => (
              <span
                key={p}
                className="px-2.5 py-1 rounded-md border border-line bg-bg/60 text-fg-soft text-[10px] font-ui font-bold uppercase tracking-wider"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
