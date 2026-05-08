import { useEffect, useRef, useState } from 'react'

/**
 * Glowing crosshair cursor with a comet trail. Desktop only — disabled on
 * touch devices and on mobile via media query in CSS.
 */
export default function GamingCursor() {
  const [enabled, setEnabled] = useState(false)
  const dotRef = useRef<HTMLDivElement | null>(null)
  const ringRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const isCoarse = window.matchMedia('(pointer: coarse)').matches
    if (isCoarse || window.innerWidth < 768) return
    setEnabled(true)

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let ringX = mouseX
    let ringY = mouseY
    let raf = 0

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX}px, ${mouseY}px)`
      }
    }
    const onDown = () => ringRef.current?.classList.add('gaming-cursor-active')
    const onUp = () => ringRef.current?.classList.remove('gaming-cursor-active')

    const tick = () => {
      ringX += (mouseX - ringX) * 0.18
      ringY += (mouseY - ringY) * 0.18
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX}px, ${ringY}px)`
      }
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      cancelAnimationFrame(raf)
    }
  }, [])

  if (!enabled) return null

  return (
    <>
      <div
        ref={ringRef}
        className="gaming-cursor-ring pointer-events-none fixed top-0 left-0 z-[9999]"
      />
      <div
        ref={dotRef}
        className="gaming-cursor-dot pointer-events-none fixed top-0 left-0 z-[9999]"
      />
    </>
  )
}
