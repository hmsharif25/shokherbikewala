import { MessageCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useStore } from '@/context/StoreContext'

/**
 * Floating WhatsApp button visible on every public page.
 *
 * Visibility rules:
 *   - On the home page, hidden while the hero is in view.
 *   - On every other public page, always visible.
 *   - Never rendered on admin (handled by PublicLayout).
 */
export default function FloatingWhatsApp() {
  const { brandSettings } = useStore()
  const location = useLocation()
  const isHome = location.pathname === '/'
  const isProductDetail = location.pathname.startsWith('/shop/')
  const [pastHero, setPastHero] = useState(!isHome)

  useEffect(() => {
    if (!isHome) {
      setPastHero(true)
      return
    }
    setPastHero(false)
    const onScroll = () => {
      const threshold = window.innerHeight * 0.7
      setPastHero(window.scrollY > threshold)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])

  const visible = !isHome || pastHero
  if (!visible) return null

  return (
    <a
      href={brandSettings.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className={`fixed right-4 sm:right-6 z-[55] md:bottom-6 transition-transform hover:scale-105 active:scale-95 ${
        isProductDetail
          ? 'bottom-[calc(9.25rem+env(safe-area-inset-bottom,0.5rem))]'
          : 'bottom-[calc(5.25rem+env(safe-area-inset-bottom,0.5rem))]'
      }`}
    >
      <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-green-500 shadow-lg">
        <MessageCircle className="w-6 h-6 text-white" strokeWidth={2.2} />
        <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-white border-2 border-green-500" />
      </div>
    </a>
  )
}
