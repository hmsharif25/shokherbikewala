import { motion } from 'framer-motion'
import { MessageCircle, Facebook, Instagram, Music2, Phone, Mail, MapPin, Send } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import PageTransition from '@/components/ui/PageTransition'
import { useState } from 'react'
import { submitInquiry } from '@/lib/db'
import { useStore } from '@/context/StoreContext'

const contactMethods = [
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    description: 'Chat with us directly',
    value: '+880 1518 934708',
    url: 'https://wa.me/8801518934708',
    color: 'from-green-500 to-green-600',
    hoverGlow: 'hover:shadow-green-500/30',
  },
  {
    icon: Facebook,
    title: 'Facebook',
    description: 'Follow our page',
    value: 'Shokher Bikewala',
    url: 'https://www.facebook.com/share/1CvH4aQ5kU/?mibextid=wwXIfr',
    color: 'from-blue-500 to-blue-600',
    hoverGlow: 'hover:shadow-blue-500/30',
  },
  {
    icon: Music2,
    title: 'TikTok',
    description: 'Watch our videos',
    value: '@shokherbikewala',
    url: 'https://www.tiktok.com/@shokherbikewala?_r=1&_t=ZS-964cHi86h1Q',
    color: 'from-pink-500 to-rose-600',
    hoverGlow: 'hover:shadow-pink-500/30',
  },
  {
    icon: Instagram,
    title: 'Instagram',
    description: 'See our gallery',
    value: '@shokherbikewala',
    url: 'https://www.instagram.com/shokherbikewala?igsh=MWJsbW96aXphNjZsaA==',
    color: 'from-purple-500 via-pink-500 to-orange-500',
    hoverGlow: 'hover:shadow-purple-500/30',
  },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const { addInquiry } = useStore()

  const handleWhatsAppSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      // Persist locally so it shows in the admin inquiries view immediately.
      addInquiry({
        id: Date.now(),
        customer_name: formData.name,
        phone: formData.phone,
        product_name: '',
        message: formData.message,
        status: 'new',
        created_at: new Date().toISOString(),
      })
      // And to Supabase when configured (silently best-effort).
      submitInquiry({
        customer_name: formData.name,
        phone: formData.phone,
        message: formData.message,
      })
    } catch {
      // ignore
    }
    const text = `Hi! I'm ${formData.name}.\nPhone: ${formData.phone}\n\n${formData.message}`
    window.open(`https://wa.me/8801518934708?text=${encodeURIComponent(text)}`, '_blank')
    setSubmitting(false)
  }

  return (
    <PageTransition className="v-shop-page min-h-screen pt-24 sm:pt-28 pb-20 md:pb-16 speed-lines-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-10 sm:mb-16">
          <motion.span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-cyan/10 text-cyan text-xs sm:text-sm font-racing tracking-widest mb-4 border border-cyan/20 uppercase">
            Get In Touch
          </motion.span>
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-display font-bold mb-4 sm:mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Contact{' '}
            </span>
            <span className="bg-gradient-to-r from-cyan to-primary bg-clip-text text-transparent">
              Us
            </span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-lg">
            Have a question? Need help choosing the right accessory? We&apos;re here to help!
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <AnimatedSection>
              <h2 className="text-2xl font-display font-bold text-white mb-6">Reach Us</h2>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contactMethods.map((method, i) => (
                <AnimatedSection key={method.title} delay={i * 0.1}>
                  <motion.a
                    href={method.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -5, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`block p-4 sm:p-5 rounded-2xl glass sb-neon-card sb-card-glow group cursor-pointer transition-all duration-300 hover:shadow-xl border border-white/5 hover:border-white/10 racing-card ${method.hoverGlow}`}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <method.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-white font-bold mb-1 font-racing">{method.title}</h3>
                    <p className="text-gray-500 text-xs mb-1">{method.description}</p>
                    <p className="text-gray-300 text-sm">{method.value}</p>
                  </motion.a>
                </AnimatedSection>
              ))}
            </div>

            <AnimatedSection delay={0.4}>
              <div className="p-5 sm:p-6 rounded-2xl glass mt-6 border border-white/5">
                <h3 className="text-white font-bold text-lg mb-4 font-racing">Quick Info</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-400">
                    <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>+880 1518 934708</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-400">
                    <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>info@shokherbikewala.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-400">
                    <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>Bangladesh</span>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>

          <AnimatedSection delay={0.2} direction="right">
            <div className="p-6 sm:p-8 rounded-2xl glass border border-white/5">
              <h2 className="text-xl sm:text-2xl font-display font-bold text-white mb-2">Send a Message</h2>
              <p className="text-gray-400 text-sm mb-6">
                Fill out the form and we&apos;ll reply via WhatsApp
              </p>

              <form onSubmit={handleWhatsAppSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="01XXXXXXXXX"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us what you need..."
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all resize-none"
                  />
                </div>
                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-green-500/30 transition-shadow disabled:opacity-60"
                >
                  <Send className="w-5 h-5" />
                  {submitting ? 'Sending...' : 'Send via WhatsApp'}
                </motion.button>
              </form>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </PageTransition>
  )
}
