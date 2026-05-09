import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ReactNode } from 'react'

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
}

export default function AnimatedSection({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}: AnimatedSectionProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const directionOffset = {
    up: { y: 60, x: 0, rotateX: 8 },
    down: { y: -60, x: 0, rotateX: -8 },
    left: { x: 60, y: 0, rotateY: -6 },
    right: { x: -60, y: 0, rotateY: 6 },
    none: { x: 0, y: 0, rotateX: 0, rotateY: 0 },
  }

  const offset = directionOffset[direction]

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        scale: 0.93,
        ...offset,
      }}
      animate={
        inView
          ? { opacity: 1, x: 0, y: 0, scale: 1, rotateX: 0, rotateY: 0 }
          : { opacity: 0, scale: 0.93, ...offset }
      }
      transition={{
        type: 'spring',
        stiffness: 120,
        damping: 20,
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
