import type { ReactElement, SVGProps } from 'react'

export type Pose = {
  id: string
  name: string
  tag: string
  best: string[] // outfit vibes this pose flatters
  Guide: (props: SVGProps<SVGSVGElement>) => ReactElement
}

const base = {
  viewBox: '0 0 100 220',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 3.2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

// Simple, elegant single-line figure guides. Drawn at low opacity over the
// live camera so the user can align their body to the pose.
export const POSES: Pose[] = [
  {
    id: 'natural',
    name: 'Natural Stand',
    tag: 'Everyday',
    best: ['Smart Casual', 'Elevated Street'],
    Guide: (p) => (
      <svg {...base} {...p}>
        <circle cx="50" cy="26" r="12" />
        <path d="M50 38 L50 120" />
        <path d="M34 54 L66 54" />
        <path d="M34 54 L28 100" />
        <path d="M66 54 L72 100" />
        <path d="M42 120 L40 206" />
        <path d="M58 120 L60 206" />
      </svg>
    ),
  },
  {
    id: 'hip',
    name: 'Hand on Hip',
    tag: 'Confident',
    best: ['Quiet Luxury', 'Evening Glamour'],
    Guide: (p) => (
      <svg {...base} {...p}>
        <circle cx="50" cy="26" r="12" />
        <path d="M50 38 L50 120" />
        <path d="M34 54 L66 54" />
        <path d="M34 54 L29 102" />
        <path d="M66 54 L80 82 L58 116" />
        <path d="M42 120 L38 206" />
        <path d="M58 120 L62 206" />
      </svg>
    ),
  },
  {
    id: 'walk',
    name: 'Walking',
    tag: 'Editorial',
    best: ['Elevated Street', 'Smart Casual'],
    Guide: (p) => (
      <svg {...base} {...p}>
        <circle cx="52" cy="26" r="12" />
        <path d="M52 38 L50 118" />
        <path d="M36 54 L68 54" />
        <path d="M36 54 L30 96" />
        <path d="M68 54 L76 94" />
        <path d="M46 118 L34 206" />
        <path d="M58 118 L72 196" />
      </svg>
    ),
  },
  {
    id: 'lean',
    name: 'Relaxed Lean',
    tag: 'Casual',
    best: ['Smart Casual', 'Quiet Luxury'],
    Guide: (p) => (
      <svg {...base} {...p}>
        <circle cx="44" cy="28" r="12" />
        <path d="M46 40 L54 120" />
        <path d="M32 56 L60 52" />
        <path d="M32 56 L26 102" />
        <path d="M60 52 L70 98" />
        <path d="M48 120 L40 206" />
        <path d="M60 120 L66 206" />
      </svg>
    ),
  },
  {
    id: 'crossed',
    name: 'Arms Crossed',
    tag: 'Bold',
    best: ['Elevated Street', 'Evening Glamour'],
    Guide: (p) => (
      <svg {...base} {...p}>
        <circle cx="50" cy="26" r="12" />
        <path d="M50 38 L50 120" />
        <path d="M32 56 L68 56" />
        <path d="M32 58 L64 78" />
        <path d="M68 58 L36 78" />
        <path d="M42 120 L40 206" />
        <path d="M58 120 L60 206" />
      </svg>
    ),
  },
  {
    id: 'glance',
    name: 'Back Glance',
    tag: 'Elegant',
    best: ['Evening Glamour', 'Quiet Luxury'],
    Guide: (p) => (
      <svg {...base} {...p}>
        <circle cx="56" cy="26" r="12" />
        <path d="M52 38 L52 120" />
        <path d="M38 54 L66 54" />
        <path d="M38 54 L34 100" />
        <path d="M66 54 L72 100" />
        <path d="M44 120 L44 206" />
        <path d="M60 120 L58 206" />
      </svg>
    ),
  },
]
