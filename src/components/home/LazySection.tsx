import { Suspense, useEffect, useRef, useState, type ReactNode } from 'react'

interface LazySectionProps {
  /** Min height reserved while the chunk hasn't been mounted yet. Prevents layout shift. */
  minHeight?: string
  /**
   * Margin around the viewport used by IntersectionObserver. Lets us
   * start loading just before the section scrolls into view so the
   * user doesn't see a fallback.
   */
  rootMargin?: string
  children: ReactNode
}

/**
 * Mounts its children only when the user is about to scroll the
 * section into view. Pairs with React.lazy() — the dynamic import
 * for the child component doesn't even start until the placeholder
 * intersects the viewport (with `rootMargin` providing a head
 * start).
 *
 * Used on the homepage to defer every below-the-fold section.
 */
export default function LazySection({
  minHeight = '60vh',
  rootMargin = '300px',
  children,
}: LazySectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (active) return
    const node = ref.current
    if (!node) return

    if (typeof IntersectionObserver === 'undefined') {
      setActive(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(true)
            observer.disconnect()
            break
          }
        }
      },
      { rootMargin }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [active, rootMargin])

  return (
    <div ref={ref} style={!active ? { minHeight } : undefined}>
      {active ? <Suspense fallback={null}>{children}</Suspense> : null}
    </div>
  )
}
