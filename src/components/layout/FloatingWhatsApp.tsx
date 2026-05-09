import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { useStore } from '@/context/StoreContext'

export default function FloatingWhatsApp() {
  const { brandSettings } = useStore()

  return (
    <motion.a
      href={brandSettings.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 hidden md:block"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.2, type: 'spring', stiffness: 200, damping: 16 }}
      whileHover={{ scale: 1.1, y: -3 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Pulsing glow ring */}
      <motion.div
        className="absolute inset-[-6px] rounded-2xl"
        animate={{
          boxShadow: [
            '0 0 12px rgba(255,106,26,0.15), 0 0 24px rgba(255,106,26,0.08)',
            '0 0 20px rgba(255,106,26,0.25), 0 0 40px rgba(255,106,26,0.12)',
            '0 0 12px rgba(255,106,26,0.15), 0 0 24px rgba(255,106,26,0.08)',
          ],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Outer pulse ring */}
      <motion.div
        className="absolute inset-0 rounded-2xl border border-primary/30"
        animate={{ scale: [1, 1.15, 1.15], opacity: [0.5, 0, 0] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      />

      {/* Main button */}
      <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-bg/80 backdrop-blur-xl border border-primary/20 shadow-lg overflow-hidden">
        {/* Background gradient */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(circle at center, rgba(255,106,26,0.25), transparent 70%)',
          }}
        />

        {/* WhatsApp icon */}
        <MessageCircle className="relative w-6 h-6 text-primary" />

        {/* Online dot */}
        <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-bg shadow-[0_0_6px_rgba(34,197,94,0.5)]" />
      </div>
    </motion.a>
  )
}
