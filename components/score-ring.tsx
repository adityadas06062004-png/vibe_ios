'use client'

import { useEffect, useState } from 'react'

export function ScoreRing({
  score,
  size = 200,
  stroke = 14,
  label = 'STYLE SCORE',
  delay = 200,
}: {
  score: number
  size?: number
  stroke?: number
  label?: string
  delay?: number
}) {
  const [progress, setProgress] = useState(0)
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  useEffect(() => {
    const t = setTimeout(() => setProgress(score), delay)
    return () => clearTimeout(t)
  }, [score, delay])

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.88 0.11 92)" />
            <stop offset="100%" stopColor="oklch(0.68 0.17 305)" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="oklch(1 0 0 / 8%)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: 'stroke-dashoffset 1.4s cubic-bezier(0.16,1,0.3,1)',
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-5xl font-semibold tabular-nums text-gradient-gold">
          {Math.round(progress)}
        </span>
        <span className="mt-1 text-[10px] font-medium tracking-[0.25em] text-muted-foreground">
          {label}
        </span>
      </div>
    </div>
  )
}
