import { motion } from 'framer-motion'
import { MessageCircle, Phone } from 'lucide-react'
import { useStore } from '@/context/StoreContext'

export default function FloatingWhatsApp() {
  const { brandSettings } = useStore()

  return (
    <motion.a
      href={brandSettings.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 hidden md:flex items-center gap-3 group"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 1.2, type: 'spring', stiffness: 180, damping: 18 }}
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.97 }}
    >
      {/* Outer glow ring */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        animate={{
          boxShadow: [
            '0 0 15px rgba(37,211,102,0.2), 0 0 30px rgba(37,211,102,0.1)',
            '0 0 25px rgba(37,211,102,0.35), 0 0 50px rgba(37,211,102,0.15)',
            '0 0 15px rgba(37,211,102,0.2), 0 0 30px rgba(37,211,102,0.1)',
          ],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Main container */}
      <div className="relative flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#111]/90 backdrop-blur-xl border border-[#25D366]/30 overflow-hidden">
        {/* Animated gradient sweep */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(37,211,102,0.08), transparent)',
          }}
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
        />

        {/* Icon with pulse ring */}
        <div className="relative">
          <motion.div
            className="absolute inset-0 rounded-full bg-[#25D366]/20"
            animate={{ scale: [1, 1.8, 1.8], opacity: [0.6, 0, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center shadow-[0_0_16px_rgba(37,211,102,0.4)]">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Text content */}
        <div className="flex flex-col">
          <span className="text-[10px] font-ui uppercase tracking-[0.15em] text-[#25D366]/70">
            Chat with us
          </span>
          <span className="text-sm font-bold text-white tracking-wide">
            WhatsApp
          </span>
        </div>

        {/* Arrow indicator */}
        <motion.div
          animate={{ x: [0, 4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="ml-1"
        >
          <Phone className="w-4 h-4 text-[#25D366]" />
        </motion.div>

        {/* Online indicator */}
        <span className="absolute top-2 right-2 flex items-center gap-1">
          <span className="w-2 h-2 bg-[#25D366] rounded-full animate-pulse" />
        </span>
      </div>
    </motion.a>
  )
}
