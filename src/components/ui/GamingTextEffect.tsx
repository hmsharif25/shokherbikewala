import { useEffect, useState, useRef, ReactNode } from 'react'
import { motion, useInView } from 'framer-motion'

/* ── Animated counter (counts from 0 to target) ── */
interface CounterProps {
  end: number
  suffix?: string
  prefix?: string
  duration?: number
  className?: string
}

export function AnimatedCounter({
  end,
  suffix = '',
  prefix = '',
  duration = 2,
  className = '',
}: CounterProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = end / (duration * 60)
    const tick = () => {
      start += step
      if (start >= end) {
        setCount(end)
        return
      }
      setCount(Math.floor(start))
      requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, end, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {count}
      {suffix}
    </span>
  )
}

/* ── Typewriter text ── */
interface TypewriterProps {
  text: string
  speed?: number
  className?: string
  cursor?: boolean
}

export function TypewriterText({
  text,
  speed = 60,
  className = '',
  cursor = true,
}: TypewriterProps) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-20px' })

  useEffect(() => {
    if (!inView) return
    let i = 0
    const iv = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(iv)
        setDone(true)
      }
    }, speed)
    return () => clearInterval(iv)
  }, [inView, text, speed])

  return (
    <span ref={ref} className={className}>
      {displayed}
      {cursor && <span className={`sb-typewriter-cursor ${done ? 'sb-blink' : ''}`}>|</span>}
    </span>
  )
}

/* ── Staggered letter reveal ── */
interface LetterRevealProps {
  text: string
  className?: string
  delay?: number
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'div' | 'p'
}

export function LetterReveal({
  text,
  className = '',
  delay = 0,
  as: Tag = 'span',
}: LetterRevealProps) {
  return (
    <Tag className={`inline-flex flex-wrap ${className}`}>
      {text.split('').map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{
            duration: 0.4,
            delay: delay + i * 0.03,
            ease: [0.22, 1, 0.36, 1],
          }}
          className={char === ' ' ? 'w-[0.3em]' : ''}
        >
          {char}
        </motion.span>
      ))}
    </Tag>
  )
}

/* ── Gradient shimmer text ── */
interface ShimmerTextProps {
  children: ReactNode
  className?: string
}

export function ShimmerText({ children, className = '' }: ShimmerTextProps) {
  return (
    <span className={`sb-shimmer-text ${className}`}>
      {children}
    </span>
  )
}
