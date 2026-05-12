import { useEffect, useState } from 'react'

/**
 * Fixed HUD overlay with corner brackets, scanlines, vignette, and a top
 * status strip with live ticking telemetry. Pointer-events disabled so it
 * never intercepts clicks.
 */
export default function HUDOverlay() {
  const [time, setTime] = useState(() => new Date())
  const [fps, setFps] = useState(60)

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    const f = setInterval(() => {
      setFps(58 + Math.floor(Math.random() * 4))
    }, 1500)
    return () => {
      clearInterval(t)
      clearInterval(f)
    }
  }, [])

  const hh = String(time.getHours()).padStart(2, '0')
  const mm = String(time.getMinutes()).padStart(2, '0')
  const ss = String(time.getSeconds()).padStart(2, '0')

  return (
    <div className="hud-overlay pointer-events-none fixed inset-0 z-[40]">

      <div className="hud-vignette absolute inset-0" />

      <div className="hud-corner hud-corner-tl" />
      <div className="hud-corner hud-corner-tr" />
      <div className="hud-corner hud-corner-bl" />
      <div className="hud-corner hud-corner-br" />

      <div className="hud-status-strip">
        <span className="hud-dot" />
        <span>SBW//ONLINE</span>
        <span className="hud-sep">·</span>
        <span>FPS {fps}</span>
        <span className="hud-sep">·</span>
        <span>NITRO READY</span>
      </div>

      <div className="hud-telemetry">
        <span className="text-cyan/80">
          {hh}:{mm}
          <span className="text-gray-600">:{ss}</span>
        </span>
        <span className="hud-sep">·</span>
        <span>
          LAT <span className="text-cyan">23.81</span>
        </span>
        <span className="hud-sep">·</span>
        <span>
          LNG <span className="text-cyan">90.41</span>
        </span>
      </div>
    </div>
  )
}
