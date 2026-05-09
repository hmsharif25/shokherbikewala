import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '@/context/ThemeContext'

export default function GamingBackdrop() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(pointer: coarse)').matches) return
    const onMove = (e: MouseEvent) => {
      setTilt({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      })
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div aria-hidden className="sb-site-backdrop pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className={isDark ? 'sb-backdrop-base is-dark' : 'sb-backdrop-base'} />
      <div className="sb-backdrop-grid" />
      <motion.div
        animate={{ x: tilt.x * 18, y: tilt.y * 14 }}
        transition={{ type: 'spring', stiffness: 55, damping: 18 }}
        className="sb-backdrop-orb sb-backdrop-orb--one"
      />
      <motion.div
        animate={{ x: -tilt.x * 16, y: -tilt.y * 12 }}
        transition={{ type: 'spring', stiffness: 55, damping: 18 }}
        className="sb-backdrop-orb sb-backdrop-orb--two"
      />
    </div>
  )
}
