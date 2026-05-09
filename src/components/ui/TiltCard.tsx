import { useRef, ReactNode, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

interface TiltCardProps {
  children: ReactNode
  className?: string
  intensity?: number
  glare?: boolean
}

export default function TiltCard({
  children,
  className = '',
  intensity = 10,
  glare = true,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0.5)
  const y = useMotionValue(0.5)

  const rotateX = useSpring(useTransform(y, [0, 1], [intensity, -intensity]), {
    stiffness: 150,
    damping: 20,
  })
  const rotateY = useSpring(useTransform(x, [0, 1], [-intensity, intensity]), {
    stiffness: 150,
    damping: 20,
  })
  const glareX = useTransform(x, [0, 1], [0, 100])
  const glareY = useTransform(y, [0, 1], [0, 100])
  const glareBg = useTransform(
    [glareX, glareY],
    ([gx, gy]: number[]) =>
      `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.12) 0%, transparent 60%)`
  )

  const handleMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = ref.current?.getBoundingClientRect()
      if (!rect) return
      x.set((e.clientX - rect.left) / rect.width)
      y.set((e.clientY - rect.top) / rect.height)
    },
    [x, y]
  )

  const handleLeave = useCallback(() => {
    x.set(0.5)
    y.set(0.5)
  }, [x, y])

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 800,
        transformStyle: 'preserve-3d',
      }}
      className={`sb-tilt-card ${className}`}
    >
      {children}
      {glare && (
        <motion.div
          className="sb-tilt-glare pointer-events-none"
          style={{ background: glareBg }}
        />
      )}
    </motion.div>
  )
}
