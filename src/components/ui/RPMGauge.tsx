import { motion } from 'framer-motion'

interface RPMGaugeProps {
  className?: string
}

/**
 * Animated SVG tachometer. Decorative — the needle sweeps from 0 to 9k
 * RPM in a continuous loop with a colored arc that mimics a real gauge.
 */
export default function RPMGauge({ className = '' }: RPMGaugeProps) {
  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <defs>
          <linearGradient id="rpm-arc" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00D4FF" />
            <stop offset="50%" stopColor="#FFD700" />
            <stop offset="100%" stopColor="#FF4500" />
          </linearGradient>
          <filter id="rpm-glow">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* outer ring */}
        <circle cx="100" cy="100" r="92" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
        {/* main arc 240deg sweep */}
        <path
          d="M 32 138 A 80 80 0 1 1 168 138"
          fill="none"
          stroke="url(#rpm-arc)"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.85"
          filter="url(#rpm-glow)"
        />

        {/* tick marks */}
        {Array.from({ length: 11 }).map((_, i) => {
          const angle = -210 + (i * 240) / 10
          const rad = (angle * Math.PI) / 180
          const x1 = 100 + Math.cos(rad) * 70
          const y1 = 100 + Math.sin(rad) * 70
          const x2 = 100 + Math.cos(rad) * (i % 2 === 0 ? 60 : 64)
          const y2 = 100 + Math.sin(rad) * (i % 2 === 0 ? 60 : 64)
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={i >= 8 ? '#FF4500' : 'rgba(255,255,255,0.4)'}
              strokeWidth={i % 2 === 0 ? 2 : 1}
            />
          )
        })}

        {/* center hub */}
        <circle cx="100" cy="100" r="10" fill="#0a0a0a" stroke="#FF4500" strokeWidth="1.5" />
        <circle cx="100" cy="100" r="3" fill="#FF4500" />

        {/* needle */}
        <motion.g
          style={{ originX: '100px', originY: '100px' }}
          animate={{ rotate: [-110, 30, -90, 60, -110] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <line
            x1="100"
            y1="100"
            x2="100"
            y2="36"
            stroke="#FF4500"
            strokeWidth="2.5"
            strokeLinecap="round"
            filter="url(#rpm-glow)"
          />
          <circle cx="100" cy="36" r="3" fill="#FFD700" />
        </motion.g>

        {/* labels */}
        <text x="100" y="128" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontFamily="Orbitron" fontWeight="600" fontSize="10" letterSpacing="2">
          RPM
        </text>
        <text x="100" y="152" textAnchor="middle" fill="#FF4500" fontFamily="Orbitron" fontWeight="700" fontSize="14">
          x1000
        </text>
      </svg>
    </div>
  )
}
