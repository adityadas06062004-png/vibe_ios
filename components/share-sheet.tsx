'use client'

import { Camera, Check, Copy, Link2, Send, X } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import type { ScanResult } from '@/components/app-context'
import { ScoreRing } from '@/components/score-ring'

export function ShareSheet({
  result,
  onClose,
}: {
  result: ScanResult
  onClose: () => void
}) {
  const [copied, setCopied] = useState(false)

  async function share() {
    const text = `My outfit just scored ${result.score}/100 on Vibe ✨ (${result.vibe})`
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: 'Vibe Style Score', text })
        return
      } catch {
        /* user dismissed */
      }
    }
    copy()
  }

  function copy() {
    try {
      navigator.clipboard?.writeText(
        `My outfit scored ${result.score}/100 on Vibe — rate yours!`,
      )
    } catch {
      /* ignore */
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button
        type="button"
        aria-label="Close share"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-up"
      />
      <div className="animate-pop relative z-10 w-full max-w-[420px] rounded-t-[2rem] border-t border-white/10 bg-card p-5 pb-[max(env(safe-area-inset-bottom),20px)]">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/20" />
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold">Share your score</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid size-8 place-items-center rounded-full bg-white/8"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Shareable card preview */}
        <div className="relative mt-4 overflow-hidden rounded-3xl border border-white/10">
          <Image
            src={result.image || '/placeholder.svg'}
            alt="Your look"
            width={420}
            height={280}
            className="h-44 w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
            <div>
              <p className="text-[10px] tracking-[0.25em] text-primary">
                VIBE · AI STYLE
              </p>
              <p className="font-display text-xl font-semibold">
                {result.vibe}
              </p>
            </div>
            <ScoreRing score={result.score} size={72} stroke={7} label="" delay={100} />
          </div>
        </div>

        {/* Share targets */}
        <div className="mt-5 grid grid-cols-4 gap-3">
          {[
            { icon: Camera, label: 'Stories', action: share },
            { icon: Send, label: 'Messages', action: share },
            { icon: Link2, label: 'Copy link', action: copy },
            {
              icon: copied ? Check : Copy,
              label: copied ? 'Copied' : 'Caption',
              action: copy,
            },
          ].map(({ icon: Icon, label, action }) => (
            <button
              key={label}
              type="button"
              onClick={action}
              className="flex flex-col items-center gap-2"
            >
              <span className="grid size-14 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-primary transition-transform active:scale-90">
                <Icon className="size-5" />
              </span>
              <span className="text-[11px] text-muted-foreground">{label}</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={share}
          className="mt-5 w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition-transform active:scale-95"
        >
          Share now
        </button>
      </div>
    </div>
  )
}