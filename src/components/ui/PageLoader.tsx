import { useStore } from '@/context/StoreContext'
import { useTheme } from '@/context/ThemeContext'

/**
 * Simple loader — visible until Supabase data has loaded.
 * Shows brand logo + a subtle spinner; dismisses once remoteLoaded is true.
 */
export default function PageLoader() {
  const { remoteLoaded } = useStore()
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  if (remoteLoaded) return null

  return (
    <div
      className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center ${
        isDark ? 'bg-[#0a0a0e]' : 'bg-white'
      }`}
    >
      <div className="flex flex-col items-center gap-5">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
          <div
            className={`absolute inset-0 rounded-full border-2 border-t-primary ${
              isDark ? 'border-white/10' : 'border-black/10'
            } animate-spin`}
            style={{ animationDuration: '0.8s' }}
          />
          <img
            src="/logo.png"
            alt="Shokher Bikewala"
            className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
          />
        </div>
        <div className={`text-sm font-medium tracking-wide ${isDark ? 'text-white/50' : 'text-fg-soft'}`}>
          Loading...
        </div>
      </div>
    </div>
  )
}
