import { useTheme } from '@/context/ThemeContext'

export default function GamingBackdrop() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div aria-hidden className="sb-site-backdrop pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className={isDark ? 'sb-backdrop-base is-dark' : 'sb-backdrop-base'} />
      <div className="sb-backdrop-grid" />
    </div>
  )
}
