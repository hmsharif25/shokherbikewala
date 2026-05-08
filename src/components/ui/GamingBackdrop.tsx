import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

/**
 * Site-wide animated backdrop:
 *  - perspective grid that scrolls toward the viewer
 *  - parallax mouse-follow blobs
 *  - ambient drift "sparks"
 *
 * Sits at z-0 below all content. Touch devices fall back to the static layers.
 */
export default function GamingBackdrop() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const isCoarse = window.matchMedia('(pointer: coarse)').matches
    if (isCoarse) return
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2
      setTilt({ x, y })
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div aria-hidden className="gaming-backdrop pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,69,0,0.08),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,229,255,0.08),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,215,0,0.05),transparent_60%)]" />

      <div className="absolute inset-x-0 bottom-0 h-[55vh] perspective-grid">
        <div className="perspective-grid-lines" />
      </div>

      <motion.div
        animate={{ x: tilt.x * 24, y: tilt.y * 18 }}
        transition={{ type: 'spring', stiffness: 60, damping: 18 }}
        className="absolute -top-16 -left-16 w-[55vmin] h-[55vmin] rounded-full bg-primary/[0.07] blur-3xl"
      />
      <motion.div
        animate={{ x: -tilt.x * 28, y: -tilt.y * 22 }}
        transition={{ type: 'spring', stiffness: 50, damping: 16 }}
        className="absolute -bottom-20 -right-16 w-[60vmin] h-[60vmin] rounded-full bg-cyan/[0.07] blur-3xl"
      />
      <motion.div
        animate={{ x: tilt.x * 16, y: -tilt.y * 16 }}
        transition={{ type: 'spring', stiffness: 60, damping: 20 }}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[40vmin] h-[40vmin] rounded-full bg-gold/[0.05] blur-3xl"
      />

      <div className="absolute inset-0">
        {Array.from({ length: 14 }).map((_, i) => (
          <span
            key={i}
            className="ambient-spark"
            style={{
              left: `${(i * 73) % 100}%`,
              top: `${(i * 37) % 100}%`,
              animationDelay: `${(i % 7) * 1.1}s`,
              animationDuration: `${10 + (i % 5)}s`,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 hud-scanlines opacity-20" />
    </div>
  )
}
