import { motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

interface Props {
  className?: string
  size?: 'sm' | 'md'
}

export default function ThemeToggle({ className = '', size = 'md' }: Props) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  const dim = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      whileTap={{ scale: 0.92 }}
      whileHover={{ y: -1 }}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={`relative inline-flex items-center justify-center p-2 rounded-lg border transition-colors text-fg-muted hover:text-primary border-line bg-surface-soft hover:bg-surface-hover ${className}`}
    >
      <motion.span
        key={theme}
        initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="inline-flex"
      >
        {isDark ? <Sun className={dim} /> : <Moon className={dim} />}
      </motion.span>
    </motion.button>
  )
}
