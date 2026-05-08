/**
 * Fixed HUD overlay with corner brackets, scanlines, vignette, and a top
 * status strip. Pointer-events disabled so it never intercepts clicks.
 */
export default function HUDOverlay() {
  return (
    <div className="hud-overlay pointer-events-none fixed inset-0 z-[40]">
      <div className="hud-scanlines absolute inset-0" />
      <div className="hud-vignette absolute inset-0" />

      <div className="hud-corner hud-corner-tl" />
      <div className="hud-corner hud-corner-tr" />
      <div className="hud-corner hud-corner-bl" />
      <div className="hud-corner hud-corner-br" />

      <div className="hud-status-strip">
        <span className="hud-dot" />
        <span>SBW//ONLINE</span>
        <span className="hud-sep">·</span>
        <span>FPS 60</span>
        <span className="hud-sep">·</span>
        <span>NITRO READY</span>
      </div>
    </div>
  )
}
