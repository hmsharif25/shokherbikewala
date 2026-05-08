import { useEffect, useRef, useState } from 'react'

const TRAIL_COUNT = 12

/**
 * Glowing crosshair cursor with a particle trail and click bursts. Desktop
 * only — disabled on touch devices and on narrow viewports.
 */
export default function GamingCursor() {
  const [enabled, setEnabled] = useState(false)
  const dotRef = useRef<HTMLDivElement | null>(null)
  const ringRef = useRef<HTMLDivElement | null>(null)
  const trailRefs = useRef<Array<HTMLDivElement | null>>([])
  const burstHostRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const isCoarse = window.matchMedia('(pointer: coarse)').matches
    if (isCoarse || window.innerWidth < 768) return
    setEnabled(true)

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let ringX = mouseX
    let ringY = mouseY
    const trail: Array<{ x: number; y: number }> = Array.from(
      { length: TRAIL_COUNT },
      () => ({ x: mouseX, y: mouseY }),
    )
    let raf = 0

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX}px, ${mouseY}px)`
      }
    }

    const isInteractive = (el: EventTarget | null): boolean => {
      let node = el as HTMLElement | null
      let depth = 0
      while (node && depth < 4) {
        const tag = node.tagName
        if (
          tag === 'A' ||
          tag === 'BUTTON' ||
          tag === 'INPUT' ||
          tag === 'TEXTAREA' ||
          tag === 'SELECT' ||
          node.getAttribute?.('role') === 'button' ||
          node.classList?.contains('cursor-pointer')
        ) {
          return true
        }
        node = node.parentElement
        depth++
      }
      return false
    }

    const onOver = (e: MouseEvent) => {
      if (!ringRef.current) return
      ringRef.current.classList.toggle('gaming-cursor-hover', isInteractive(e.target))
    }

    const spawnBurst = (x: number, y: number) => {
      const host = burstHostRef.current
      if (!host) return
      const N = 10
      for (let i = 0; i < N; i++) {
        const p = document.createElement('span')
        p.className = 'gaming-cursor-spark'
        const angle = (Math.PI * 2 * i) / N + (Math.random() - 0.5) * 0.6
        const dist = 28 + Math.random() * 22
        const dx = Math.cos(angle) * dist
        const dy = Math.sin(angle) * dist
        p.style.setProperty('--dx', `${dx}px`)
        p.style.setProperty('--dy', `${dy}px`)
        p.style.left = `${x}px`
        p.style.top = `${y}px`
        host.appendChild(p)
        p.addEventListener('animationend', () => p.remove(), { once: true })
      }
    }

    const onDown = (e: MouseEvent) => {
      ringRef.current?.classList.add('gaming-cursor-active')
      spawnBurst(e.clientX, e.clientY)
    }
    const onUp = () => ringRef.current?.classList.remove('gaming-cursor-active')

    const tick = () => {
      ringX += (mouseX - ringX) * 0.18
      ringY += (mouseY - ringY) * 0.18
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX}px, ${ringY}px)`
      }
      let prevX = mouseX
      let prevY = mouseY
      for (let i = 0; i < TRAIL_COUNT; i++) {
        const node = trailRefs.current[i]
        const t = trail[i]
        t.x += (prevX - t.x) * 0.32
        t.y += (prevY - t.y) * 0.32
        if (node) {
          node.style.transform = `translate(${t.x}px, ${t.y}px)`
        }
        prevX = t.x
        prevY = t.y
      }
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onOver)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      cancelAnimationFrame(raf)
    }
  }, [])

  if (!enabled) return null

  return (
    <>
      {Array.from({ length: TRAIL_COUNT }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            trailRefs.current[i] = el
          }}
          className="gaming-cursor-trail pointer-events-none fixed top-0 left-0 z-[9998]"
          style={{
            opacity: 1 - i / TRAIL_COUNT,
            width: `${Math.max(2, 8 - i * 0.5)}px`,
            height: `${Math.max(2, 8 - i * 0.5)}px`,
          }}
        />
      ))}

      <div
        ref={ringRef}
        className="gaming-cursor-ring pointer-events-none fixed top-0 left-0 z-[9999]"
      />
      <div
        ref={dotRef}
        className="gaming-cursor-dot pointer-events-none fixed top-0 left-0 z-[9999]"
      />

      <div
        ref={burstHostRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[9997]"
      />
    </>
  )
}
