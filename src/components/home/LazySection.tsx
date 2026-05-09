import {
  Suspense,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'

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

  /*
   * `content-visibility: auto` lets the browser skip rendering this
   * section entirely when it is far offscreen. `contain-intrinsic-size`
   * tells the layout engine roughly how tall the section will be so
   * the scrollbar / page height stays stable while it's hidden.
   * Combined, these are typically a 30-50% scrolling perf win on long
   * pages without changing the visual output.
   */
  const skipPaint: CSSProperties = {
    contentVisibility: 'auto',
    containIntrinsicSize: `0 ${minHeight}`,
  }

  return (
    <div
      ref={ref}
      style={active ? skipPaint : { minHeight, ...skipPaint }}
    >
      {active ? <Suspense fallback={null}>{children}</Suspense> : null}
    </div>
  )
}
