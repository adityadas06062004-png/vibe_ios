'use client'

import { Camera, Flame, ImageIcon, Sparkles, Zap } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import {
  SAMPLE_LOOKS,
  getResult,
  useApp,
  usePending,
} from '@/components/app-context'
import { cn } from '@/lib/utils'

const PHASES = [
  'Detecting garments',
  'Analyzing fit & proportion',
  'Reading color harmony',
  'Scoring against 40k looks',
  'Finding matching pieces',
]

export function ScanScreen() {
  const {
    credits,
    isPro,
    openPaywall,
    openCamera,
    setResult,
    finishScan,
    scanning,
    startScan,
  } = useApp()
  const { pendingImage } = usePending()
  const [phase, setPhase] = useState(0)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!scanning || !pendingImage) return
    setPhase(0)
    const stepper = setInterval(
      () => setPhase((p) => Math.min(p + 1, PHASES.length - 1)),
      520,
    )
    const done = setTimeout(() => {
      clearInterval(stepper)
      setResult(getResult(pendingImage))
      finishScan()
    }, 2800)
    return () => {
      clearInterval(stepper)
      clearTimeout(done)
    }
  }, [scanning, pendingImage, setResult, finishScan])

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => startScan(String(reader.result))
    reader.readAsDataURL(file)
  }

  if (scanning && pendingImage) {
    return (
      <div className="relative flex min-h-dvh flex-col items-center justify-center px-6">
        <div className="relative aspect-[3/4] w-full max-w-[300px] overflow-hidden rounded-[2rem] border border-white/10">
          <img
            src={pendingImage || '/placeholder.svg'}
            alt="Outfit being analyzed"
            className="size-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
          <div
            className="absolute inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_20px_2px_var(--gold)] animate-scanline"
            style={{ top: '4%' }}
          />
          <div className="absolute inset-0 ring-1 ring-inset ring-primary/20" />
        </div>
        <div className="mt-8 flex items-center gap-2 text-primary">
          <Sparkles className="size-4 animate-pulse" />
          <span className="text-sm font-medium">{PHASES[phase]}…</span>
        </div>
        <div className="mt-4 flex gap-1.5">
          {PHASES.map((_, i) => (
            <span
              key={i}
              className={cn(
                'h-1 w-6 rounded-full transition-colors duration-300',
                i <= phase ? 'bg-primary' : 'bg-white/15',
              )}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="px-5 pb-28 pt-4">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs tracking-[0.2em] text-muted-foreground">
            GOOD EVENING
          </p>
          <h1 className="font-display text-2xl font-semibold">Rate your look</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-card px-3 py-1.5">
            {isPro ? (
              <>
                <Sparkles className="size-3.5 text-primary" />
                <span className="text-xs font-semibold text-primary">Pro</span>
              </>
            ) : (
              <>
                <Zap className="size-3.5 text-primary" />
                <span className="text-xs font-semibold tabular-nums">
                  {credits}
                </span>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero capture card */}
      <section className="relative mt-5 overflow-hidden rounded-[2rem] border border-white/10 bg-aurora p-6">
        <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-primary/20 blur-3xl animate-glow" />
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] font-medium text-primary backdrop-blur-md">
            <Sparkles className="size-3" /> AI Stylist v3
          </span>
          <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-balance">
            Snap it. Score it. <span className="text-gradient-gold">Slay it.</span>
          </h2>
          <p className="mt-2 max-w-[26ch] text-sm text-muted-foreground">
            Get an instant, brutally honest style score with pro-level tips in
            seconds.
          </p>
          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={openCamera}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-transform active:scale-95"
            >
              <Camera className="size-4" />
              Open camera
            </button>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              aria-label="Upload from gallery"
              className="grid size-[52px] place-items-center rounded-full border border-white/12 bg-black/20 backdrop-blur-md transition-transform active:scale-95"
            >
              <ImageIcon className="size-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Streak / challenge */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-white/8 bg-card p-4">
          <div className="flex items-center gap-2 text-primary">
            <Flame className="size-4" />
            <span className="text-xs font-medium text-muted-foreground">
              Daily streak
            </span>
          </div>
          <p className="mt-2 font-display text-2xl font-semibold">6 days</p>
        </div>
        <div className="rounded-2xl border border-white/8 bg-card p-4">
          <p className="text-xs font-medium text-muted-foreground">
            Today&apos;s challenge
          </p>
          <p className="mt-2 text-sm font-medium leading-snug">
            Monochrome fit — beat <span className="text-primary">88</span>
          </p>
        </div>
      </div>

      {/* Try a sample */}
      <section className="mt-7">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Try a sample look</h3>
          <span className="text-xs text-muted-foreground">Tap to rate</span>
        </div>
        <div className="no-scrollbar -mx-5 mt-3 flex gap-3 overflow-x-auto px-5">
          {SAMPLE_LOOKS.map((look) => (
            <button
              key={look.id}
              type="button"
              onClick={() => startScan(look.image)}
              className="group relative aspect-[3/4] w-36 shrink-0 overflow-hidden rounded-2xl border border-white/8"
            >
              <Image
                src={look.image || '/placeholder.svg'}
                alt={look.label}
                fill
                sizes="144px"
                className="object-cover transition-transform duration-500 group-active:scale-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent" />
              <span className="absolute bottom-2 left-2.5 text-xs font-medium">
                {look.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Free-tier ad */}
      {!isPro ? (
        <button
          type="button"
          onClick={() => openPaywall('Go Pro to remove ads and unlock more.')}
          className="mt-6 flex w-full items-center gap-3 rounded-2xl border border-dashed border-white/12 bg-white/[0.02] p-3 text-left"
        >
          <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet/30 to-primary/30">
            <Sparkles className="size-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] tracking-widest text-muted-foreground">
              SPONSORED
            </p>
            <p className="text-sm font-medium">Autumn drop — up to 40% off</p>
          </div>
          <span className="text-xs text-muted-foreground">Remove ✕</span>
        </button>
      ) : null}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={onFile}
        className="hidden"
      />
    </div>
  )
}
