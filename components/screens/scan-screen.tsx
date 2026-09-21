'use client'

import {
  Camera,
  Flame,
  ImageIcon,
  PlayCircle,
  Sparkles,
  X,
  Zap,
} from 'lucide-react'
import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
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

// Generic, non-medical wellness nudges — kept light and style-adjacent
// rather than prescriptive diet/health advice.
const WELLNESS_TIPS = [
  'Natural light flatters every outfit — try facing a window for your next shot.',
  'A glass of water and a good posture check go a long way before a photo.',
  'Confidence reads on camera. Stand tall, relax your shoulders, take a breath.',
  'Well-rested skin photographs better — small stuff, big difference.',
  'A short walk before you shoot can shake off stiffness and improve your stance.',
]

function getGreeting() {
  const h = new Date().getHours()
  if (h < 5) return 'STILL UP?'
  if (h < 12) return 'GOOD MORNING'
  if (h < 17) return 'GOOD AFTERNOON'
  return 'GOOD EVENING'
}

// Deterministic "random" pick that stays stable for the whole day.
function pickOfTheDay<T>(items: T[]): T {
  const seed = new Date().toDateString()
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0
  return items[Math.abs(h) % items.length]
}

const CHALLENGE_THEMES = [
  'Monochrome fit',
  'Layered textures',
  'One statement piece',
  'All-neutral palette',
  'Bold color pairing',
]

export function ScanScreen() {
  const {
    credits,
    isPro,
    openCamera,
    setResult,
    finishScan,
    recordScan,
    scanning,
    startScan,
    stats,
    outOfCreditsNotice,
    dismissOutOfCreditsNotice,
    openPaywall,
    adsWatchedToday,
    maxFreeAdsPerDay,
    watchAd,
  } = useApp()
  const { pendingImage } = usePending()
  const [phase, setPhase] = useState(0)
  const [watchingAd, setWatchingAd] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const wellnessTip = useMemo(() => pickOfTheDay(WELLNESS_TIPS), [])
  const challengeTheme = useMemo(() => pickOfTheDay(CHALLENGE_THEMES), [])
  const isNewUser = stats.ratingsCount === 0

  useEffect(() => {
    if (!scanning || !pendingImage) return
    setPhase(0)
    const stepper = setInterval(
      () => setPhase((p) => Math.min(p + 1, PHASES.length - 1)),
      520,
    )
    const done = setTimeout(() => {
      clearInterval(stepper)
      const r = getResult(pendingImage)
      setResult(r)
      recordScan(r)
      finishScan()
    }, 2800)
    return () => {
      clearInterval(stepper)
      clearTimeout(done)
    }
  }, [scanning, pendingImage, setResult, finishScan, recordScan])

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => startScan(String(reader.result))
    reader.readAsDataURL(file)
  }

  function simulateWatchAd() {
    if (watchingAd) return
    setWatchingAd(true)
    // Stand-in for a real rewarded-ad SDK callback (e.g. AdMob/AppLovin).
    // Swap this timeout for the SDK's "onAdCompleted" hook when wired up.
    setTimeout(() => {
      watchAd()
      setWatchingAd(false)
    }, 1200)
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
            {getGreeting()}
          </p>
          <h1 className="font-display text-2xl font-semibold">
            {isNewUser ? 'Rate your first look' : 'Rate your look'}
          </h1>
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

      {/* Out-of-credits banner — shown proactively, before you ever hit the wall */}
      {!isPro && credits === 0 ? (
        <button
          type="button"
          onClick={() => openPaywall('You are out of free ratings for today.')}
          className="mt-3 flex w-full items-center gap-3 rounded-2xl border border-primary/25 bg-primary/10 p-3 text-left"
        >
          <Zap className="size-4 shrink-0 text-primary" />
          <span className="flex-1 text-xs font-medium text-foreground/90">
            Today&apos;s free ratings are used up.{' '}
            {adsWatchedToday < maxFreeAdsPerDay
              ? 'Watch a quick ad or go Pro for more.'
              : 'Go Pro for unlimited ratings.'}
          </span>
        </button>
      ) : null}

      {/* Hero capture card */}
      <section className="relative mt-5 overflow-hidden rounded-[2rem] border border-white/10 bg-aurora p-6">
        <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-primary/20 blur-3xl animate-glow" />
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] font-medium text-primary backdrop-blur-md">
            <Sparkles className="size-3" /> AI Stylist v3
          </span>
          <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-balance">
            {isNewUser ? (
              <>
                Snap it. Score it. <span className="text-gradient-gold">See your vibe.</span>
              </>
            ) : (
              <>
                Snap it. Score it. <span className="text-gradient-gold">Slay it.</span>
              </>
            )}
          </h2>
          <p className="mt-2 max-w-[26ch] text-sm text-muted-foreground">
            {isNewUser
              ? 'Take your first photo (or try a sample below) to see your instant AI style score.'
              : 'Get an instant, brutally honest style score with pro-level tips in seconds.'}
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

      {isNewUser ? (
        /* First-time guidance instead of fabricated stats */
        <div className="mt-4 rounded-2xl border border-white/8 bg-card p-4">
          <p className="text-sm font-medium">How it works</p>
          <ol className="mt-2 space-y-1.5 text-xs text-muted-foreground">
            <li>1. Snap a photo or upload one of your outfit.</li>
            <li>2. Get an instant score with a full style breakdown.</li>
            <li>3. Share it, or shop the pieces that complete the look.</li>
          </ol>
        </div>
      ) : (
        /* Streak / challenge — computed from your real rating history */
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/8 bg-card p-4">
            <div className="flex items-center gap-2 text-primary">
              <Flame className="size-4" />
              <span className="text-xs font-medium text-muted-foreground">
                Daily streak
              </span>
            </div>
            <p className="mt-2 font-display text-2xl font-semibold">
              {stats.streak} {stats.streak === 1 ? 'day' : 'days'}
            </p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-card p-4">
            <p className="text-xs font-medium text-muted-foreground">
              Today&apos;s challenge
            </p>
            <p className="mt-2 text-sm font-medium leading-snug">
              {challengeTheme} — beat{' '}
              <span className="text-primary">{stats.avgScore || 85}</span>
            </p>
          </div>
        </div>
      )}

      {/* Personalized suggestion once there's enough history to say something real */}
      {!isNewUser && stats.topVibe ? (
        <div className="mt-3 flex items-center gap-3 rounded-2xl border border-white/8 bg-card p-4">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
            <Sparkles className="size-4" />
          </span>
          <p className="text-xs text-muted-foreground">
            You tend to shine in{' '}
            <span className="font-medium text-foreground">{stats.topVibe}</span>{' '}
            looks — averaging {stats.avgScore} overall.
          </p>
        </div>
      ) : null}

      {/* Wellness tip — light, general, non-prescriptive */}
      <div className="mt-3 flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.02] p-4">
        <span className="text-lg">🌿</span>
        <p className="text-xs text-muted-foreground">{wellnessTip}</p>
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

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={onFile}
        className="hidden"
      />

      {/* Out-of-credits notice — replaces the old behavior where the paywall
          silently opened underneath the camera and only appeared once you
          closed it. This shows immediately, on top of everything, with a
          real choice: watch an ad or go Pro. */}
      {outOfCreditsNotice ? (
        <div className="fixed inset-x-0 bottom-0 z-[60] flex justify-center px-4 pb-[max(env(safe-area-inset-bottom),16px)]">
          <div className="animate-pop w-full max-w-[400px] rounded-3xl border border-white/10 bg-card p-5 shadow-[0_8px_40px_-8px_rgba(0,0,0,0.7)]">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="grid size-9 place-items-center rounded-xl bg-primary/15 text-primary">
                  <Zap className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold">Out of free ratings</p>
                  <p className="text-xs text-muted-foreground">
                    You&apos;ve used today&apos;s free ratings.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={dismissOutOfCreditsNotice}
                aria-label="Dismiss"
                className="grid size-7 shrink-0 place-items-center rounded-full bg-white/8"
              >
                <X className="size-3.5" />
              </button>
            </div>

            <div className="mt-4 flex gap-2.5">
              <button
                type="button"
                onClick={simulateWatchAd}
                disabled={watchingAd || adsWatchedToday >= maxFreeAdsPerDay}
                className="flex flex-1 items-center justify-center gap-2 rounded-full border border-white/12 py-3 text-xs font-semibold transition-transform active:scale-95 disabled:opacity-40"
              >
                <PlayCircle className="size-4" />
                {watchingAd
                  ? 'Loading ad…'
                  : adsWatchedToday >= maxFreeAdsPerDay
                    ? 'No ads left today'
                    : `Watch ad (+1) · ${maxFreeAdsPerDay - adsWatchedToday} left`}
              </button>
              <button
                type="button"
                onClick={() => {
                  dismissOutOfCreditsNotice()
                  openPaywall('Go Pro for unlimited ratings — no ads, ever.')
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary py-3 text-xs font-semibold text-primary-foreground transition-transform active:scale-95"
              >
                <Sparkles className="size-4" />
                Go Pro
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}