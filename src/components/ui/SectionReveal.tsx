import { ReactNode, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface Props {
  children: ReactNode
  className?: string
  delay?: number
  brackets?: boolean
  /** Direction to slide in from. Defaults to 'up'. */
  from?: 'up' | 'down' | 'left' | 'right'
}

/**
 * Wraps a chunk of content in a scroll-triggered HUD-style reveal.
 */
export default function SectionReveal({
  children,
  className = '',
  delay = 0,
  brackets = false,
  from = 'up',
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null)
  const inView = useInView(ref, { once: true, margin: '-15% 0px' })

  const offsets: Record<NonNullable<Props['from']>, { x: number; y: number }> = {
    up: { x: 0, y: 32 },
    down: { x: 0, y: -32 },
    left: { x: -32, y: 0 },
    right: { x: 32, y: 0 },
  }
  const o = offsets[from]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: o.x, y: o.y }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: o.x, y: o.y }}
      transition={{ duration: 0.7, delay, ease: [0.4, 0, 0.2, 1] }}
      className={`relative ${className}`}
    >
      {brackets && (
        <>
          <span className="section-reveal-bracket section-reveal-bracket-tl" data-show={inView ? '1' : '0'} />
          <span className="section-reveal-bracket section-reveal-bracket-tr" data-show={inView ? '1' : '0'} />
          <span className="section-reveal-bracket section-reveal-bracket-bl" data-show={inView ? '1' : '0'} />
          <span className="section-reveal-bracket section-reveal-bracket-br" data-show={inView ? '1' : '0'} />
        </>
      )}
      {children}
    </motion.div>
  )
}
