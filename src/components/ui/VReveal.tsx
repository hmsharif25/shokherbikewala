import { useEffect, useRef, useState, ReactNode } from 'react'

interface VRevealProps {
  children: ReactNode
  delay?: number
  className?: string
  as?: 'div' | 'section' | 'article' | 'header'
  once?: boolean
}

/**
 * Lightweight scroll-reveal: adds the `.in` class when the element
 * enters the viewport. Pairs with the `.v-reveal` utility in index.css.
 */
export default function VReveal({
  children,
  delay = 0,
  className = '',
  as = 'div',
  once = true,
}: VRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setRevealed(true)
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setTimeout(() => setRevealed(true), delay)
            if (once) obs.disconnect()
          } else if (!once) {
            setRevealed(false)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    obs.observe(node)
    return () => obs.disconnect()
  }, [delay, once])

  const Tag = as as 'div'
  return (
    <Tag
      ref={ref}
      className={`v-reveal ${revealed ? 'in' : ''} ${className}`}
    >
      {children}
    </Tag>
  )
}
