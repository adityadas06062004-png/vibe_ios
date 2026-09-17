'use client'

import {
  ArrowLeft,
  Check,
  Lock,
  RefreshCw,
  Share2,
  Sparkles,
} from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { useApp, usePending } from '@/components/app-context'
import { ProductCard } from '@/components/product-card'
import { ScoreRing } from '@/components/score-ring'
import { ShareSheet } from '@/components/share-sheet'

export function ResultScreen() {
  const { result, setResult, isPro, openPaywall } = useApp()
  const { setPendingImage } = usePending()
  const [shareOpen, setShareOpen] = useState(false)

  if (!result) return null

  return (
    <div className="pb-28">
      {/* Top image banner */}
      <div className="relative h-[46vh] min-h-[320px] w-full overflow-hidden">
        <Image
          src={result.image || '/placeholder.svg'}
          alt="Your rated outfit"
          fill
          sizes="440px"
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-background" />
        <button
          type="button"
          onClick={() => {
            setResult(null)
            setPendingImage(null)
          }}
          aria-label="Back"
          className="glass absolute left-4 top-4 grid size-10 place-items-center rounded-full border border-white/10"
        >
          <ArrowLeft className="size-5" />
        </button>
        <button
          type="button"
          onClick={() => setShareOpen(true)}
          aria-label="Share result"
          className="glass absolute right-4 top-4 grid size-10 place-items-center rounded-full border border-white/10"
        >
          <Share2 className="size-4.5" />
        </button>
      </div>

      {/* Score card */}
      <div className="relative -mt-24 px-5">
        <div className="animate-fade-up rounded-[2rem] border border-white/10 bg-card/80 p-6 text-center backdrop-blur-xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="size-3" /> {result.vibe}
          </span>
          <div className="mt-3 flex justify-center">
            <ScoreRing score={result.score} />
          </div>
          <p className="mx-auto mt-3 max-w-[34ch] text-pretty text-sm text-muted-foreground">
            {result.summary}
          </p>
        </div>
      </div>

      {/* Breakdown */}
      <section className="mt-6 px-5">
        <h3 className="mb-3 text-sm font-semibold">Style breakdown</h3>
        <div className="space-y-3 rounded-3xl border border-white/8 bg-card p-5">
          {result.breakdown.map((b, i) => (
            <div key={b.label} className="animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{b.label}</span>
                <span className="tabular-nums text-muted-foreground">
                  {b.score}
                </span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/8">
                <div
                  className="h-full rounded-full ring-gradient"
                  style={{ width: `${b.score}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{b.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tips */}
      <section className="mt-6 px-5">
        <h3 className="mb-3 text-sm font-semibold">Stylist tips</h3>
        <div className="space-y-2.5">
          {result.freeTips.map((tip) => (
            <div
              key={tip}
              className="flex items-start gap-3 rounded-2xl border border-white/8 bg-card p-4"
            >
              <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-primary/20 text-primary">
                <Check className="size-3.5" />
              </span>
              <p className="text-sm">{tip}</p>
            </div>
          ))}

          {/* Pro tips */}
          <div className="relative overflow-hidden rounded-2xl border border-primary/25 bg-card p-4">
            <div className="space-y-2.5">
              {result.proTips.map((tip) => (
                <div key={tip} className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-primary/20 text-primary">
                    <Sparkles className="size-3" />
                  </span>
                  <p className="text-sm">{tip}</p>
                </div>
              ))}
            </div>
            {!isPro ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-card/60 px-6 text-center backdrop-blur-md">
                <span className="grid size-11 place-items-center rounded-full bg-primary/20 text-primary">
                  <Lock className="size-5" />
                </span>
                <p className="text-sm font-medium">
                  {result.proTips.length} pro insights locked
                </p>
                <button
                  type="button"
                  onClick={() => openPaywall('Unlock every pro stylist insight.')}
                  className="rounded-full bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground transition-transform active:scale-95"
                >
                  Unlock with Pro
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Complete the look — affiliate */}
      <section className="mt-7">
        <div className="flex items-center justify-between px-5">
          <h3 className="text-sm font-semibold">Complete the look</h3>
          <span className="text-xs text-muted-foreground">Shop the match</span>
        </div>
        <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto px-5">
          {result.products.map((p) => (
            <div key={p.id} className="w-44 shrink-0">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      {/* Actions */}
      <div className="mt-7 flex gap-3 px-5">
        <button
          type="button"
          onClick={() => {
            setResult(null)
            setPendingImage(null)
          }}
          className="flex flex-1 items-center justify-center gap-2 rounded-full border border-white/12 py-3.5 text-sm font-semibold transition-transform active:scale-95"
        >
          <RefreshCw className="size-4" />
          Rate again
        </button>
        <button
          type="button"
          onClick={() => setShareOpen(true)}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition-transform active:scale-95"
        >
          <Share2 className="size-4" />
          Share score
        </button>
      </div>

      {shareOpen ? (
        <ShareSheet result={result} onClose={() => setShareOpen(false)} />
      ) : null}
    </div>
  )
}
