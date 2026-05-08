import { ReactNode } from 'react'

interface GlitchTextProps {
  children: string
  className?: string
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'div'
}

/**
 * Cyber-glitch text. Uses two pseudo layers (cyan/orange) that desync
 * on hover for an RGB-shift effect. Plain readable text by default.
 */
export default function GlitchText({
  children,
  className = '',
  as: Tag = 'span',
}: GlitchTextProps): ReactNode {
  return (
    <Tag className={`glitch-text ${className}`} data-text={children}>
      {children}
    </Tag>
  )
}
