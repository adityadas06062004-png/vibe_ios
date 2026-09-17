'use client'

import {
  Check,
  ImageIcon,
  RefreshCw,
  Sparkles,
  SwitchCamera,
  X,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useApp } from '@/components/app-context'
import { POSES, type Pose } from '@/components/pose-guides'
import { cn } from '@/lib/utils'

type Facing = 'user' | 'environment'

export function PoseCameraScreen() {
  const { closeCamera, startScan } = useApp()
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const [facing, setFacing] = useState<Facing>('environment')
  const [ready, setReady] = useState(false)
  const [denied, setDenied] = useState(false)
  const [pose, setPose] = useState<Pose>(POSES[0])
  const [opacity, setOpacity] = useState(0.35)

  // Start / restart the camera stream when facing changes.
  useEffect(() => {
    let cancelled = false
    setReady(false)
    setDenied(false)

    async function start() {
      if (
        typeof navigator === 'undefined' ||
        !navigator.mediaDevices?.getUserMedia
      ) {
        setDenied(true)
        return
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facing },
          audio: false,
        })
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play().catch(() => {})
        }
        setReady(true)
      } catch {
        setDenied(true)
      }
    }

    start()
    return () => {
      cancelled = true
      streamRef.current?.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
  }, [facing])

  function capture() {
    const video = videoRef.current
    if (!video || !ready) return
    const w = video.videoWidth || 720
    const h = video.videoHeight || 960
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    if (facing === 'user') {
      // Un-mirror the selfie so the saved photo matches reality.
      ctx.translate(w, 0)
      ctx.scale(-1, 1)
    }
    ctx.drawImage(video, 0, 0, w, h)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
    startScan(dataUrl)
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => startScan(String(reader.result))
    reader.readAsDataURL(file)
  }

  const PoseGuide = pose.Guide

  return (
    <div className="fixed inset-0 z-50 mx-auto flex max-w-[440px] flex-col bg-black">
      {/* Camera feed */}
      <div className="relative flex-1 overflow-hidden">
        <video
          ref={videoRef}
          playsInline
          muted
          className={cn(
            'size-full object-cover transition-opacity duration-500',
            facing === 'user' && '-scale-x-100',
            ready ? 'opacity-100' : 'opacity-0',
          )}
        />

        {/* Rule-of-thirds framing */}
        {ready ? (
          <div className="pointer-events-none absolute inset-0 opacity-40">
            <div className="absolute inset-y-0 left-1/3 w-px bg-white/25" />
            <div className="absolute inset-y-0 left-2/3 w-px bg-white/25" />
            <div className="absolute inset-x-0 top-1/3 h-px bg-white/25" />
            <div className="absolute inset-x-0 top-2/3 h-px bg-white/25" />
          </div>
        ) : null}

        {/* Pose overlay guide */}
        {ready ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <PoseGuide
              className="h-[78%] w-auto text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]"
              style={{ opacity }}
            />
          </div>
        ) : null}

        {/* Loading / denied fallback */}
        {!ready ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8 text-center">
            {denied ? (
              <>
                <div className="grid size-14 place-items-center rounded-2xl bg-white/10">
                  <ImageIcon className="size-6 text-white" />
                </div>
                <div>
                  <p className="font-display text-lg font-semibold text-white">
                    Camera unavailable
                  </p>
                  <p className="mt-1 text-sm text-white/60">
                    Allow camera access, or upload a photo from your library to
                    get rated.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="mt-1 flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
                >
                  <ImageIcon className="size-4" />
                  Upload a photo
                </button>
              </>
            ) : (
              <>
                <RefreshCw className="size-6 animate-spin text-white/70" />
                <p className="text-sm text-white/60">Starting camera…</p>
              </>
            )}
          </div>
        ) : null}

        {/* Top bar */}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
          <button
            type="button"
            onClick={closeCamera}
            aria-label="Close camera"
            className="grid size-10 place-items-center rounded-full bg-black/40 text-white backdrop-blur-md"
          >
            <X className="size-5" />
          </button>
          <span className="flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
            <Sparkles className="size-3.5 text-primary" />
            {pose.name}
          </span>
          <button
            type="button"
            onClick={() => setFacing((f) => (f === 'user' ? 'environment' : 'user'))}
            aria-label="Flip camera"
            disabled={!ready}
            className="grid size-10 place-items-center rounded-full bg-black/40 text-white backdrop-blur-md disabled:opacity-40"
          >
            <SwitchCamera className="size-5" />
          </button>
        </div>

        {/* Opacity slider */}
        {ready ? (
          <div className="absolute right-4 top-1/2 flex -translate-y-1/2 flex-col items-center gap-2">
            <span className="text-[10px] font-medium text-white/70">Guide</span>
            <input
              type="range"
              min={0.1}
              max={0.7}
              step={0.05}
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              aria-label="Pose guide opacity"
              className="h-28 w-1.5 cursor-pointer appearance-none rounded-full bg-white/25 accent-primary [writing-mode:vertical-lr]"
            />
          </div>
        ) : null}
      </div>

      {/* Bottom controls */}
      <div className="shrink-0 bg-black px-4 pb-8 pt-4">
        <div className="flex items-center justify-between">
          <p className="text-xs text-white/60">Pick a pose, then line yourself up</p>
        </div>

        {/* Pose picker */}
        <div className="no-scrollbar -mx-4 mt-3 flex gap-2.5 overflow-x-auto px-4">
          {POSES.map((p) => {
            const Mini = p.Guide
            const active = p.id === pose.id
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setPose(p)}
                className={cn(
                  'flex w-16 shrink-0 flex-col items-center gap-1 rounded-2xl border p-2 transition-colors',
                  active
                    ? 'border-primary bg-primary/15'
                    : 'border-white/10 bg-white/[0.04]',
                )}
              >
                <Mini
                  className={cn(
                    'h-10 w-auto',
                    active ? 'text-primary' : 'text-white/70',
                  )}
                />
                <span
                  className={cn(
                    'text-[9px] font-medium leading-tight',
                    active ? 'text-primary' : 'text-white/60',
                  )}
                >
                  {p.tag}
                </span>
              </button>
            )
          })}
        </div>

        {/* Shutter row */}
        <div className="mt-5 flex items-center justify-between px-4">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            aria-label="Upload from library"
            className="grid size-12 place-items-center rounded-2xl border border-white/15 bg-white/[0.06] text-white"
          >
            <ImageIcon className="size-5" />
          </button>

          <button
            type="button"
            onClick={capture}
            disabled={!ready}
            aria-label="Capture photo"
            className="grid size-[74px] place-items-center rounded-full bg-white ring-4 ring-white/25 transition-transform active:scale-95 disabled:opacity-40"
          >
            <span className="grid size-16 place-items-center rounded-full bg-primary text-primary-foreground">
              <Check className="size-7" />
            </span>
          </button>

          <div className="size-12" aria-hidden />
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={onFile}
        className="hidden"
      />
    </div>
  )
}
