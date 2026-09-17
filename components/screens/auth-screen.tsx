'use client'

import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail, Sparkles, User as UserIcon } from 'lucide-react'
import { useState } from 'react'
import { useApp } from '@/components/app-context'
import { cn } from '@/lib/utils'

type Mode = 'signup' | 'signin'

const PERKS = [
  'Instant AI style scores',
  'Pose guides while you shoot',
  'Shop the exact matching pieces',
]

export function AuthScreen() {
  const { signUp, signIn } = useApp()
  const [mode, setMode] = useState<Mode>('signup')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (busy) return
    setError('')
    setBusy(true)
    // Small delay so the transition feels intentional.
    setTimeout(() => {
      const res =
        mode === 'signup'
          ? signUp({ name, email, password })
          : signIn({ email, password })
      if (!res.ok) {
        setError(res.error ?? 'Something went wrong.')
        setBusy(false)
      }
      // On success the app unmounts this screen automatically.
    }, 450)
  }

  return (
    <main className="relative mx-auto flex min-h-dvh w-full max-w-[440px] flex-col overflow-hidden bg-background">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -left-16 -top-16 size-64 rounded-full bg-primary/20 blur-3xl animate-glow" />
      <div className="pointer-events-none absolute -right-20 top-40 size-56 rounded-full bg-violet/20 blur-3xl" />

      <div className="relative flex flex-1 flex-col px-6 pb-8 pt-16">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Sparkles className="size-5" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            Aura
          </span>
        </div>

        {/* Hero copy */}
        <div className="mt-10">
          <h1 className="font-display text-4xl font-semibold leading-tight text-balance">
            Your AI stylist,{' '}
            <span className="text-gradient-gold">in your pocket.</span>
          </h1>
          <p className="mt-3 max-w-[30ch] text-sm leading-relaxed text-muted-foreground">
            Rate any outfit, strike the perfect pose, and shop the look — in
            seconds.
          </p>
          <ul className="mt-5 space-y-2">
            {PERKS.map((perk) => (
              <li key={perk} className="flex items-center gap-2.5 text-sm">
                <span className="grid size-5 place-items-center rounded-full bg-primary/15 text-primary">
                  <Sparkles className="size-3" />
                </span>
                <span className="text-foreground/90">{perk}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Card */}
        <div className="mt-auto">
          <div className="mb-4 flex rounded-full border border-white/10 bg-card p-1">
            {(['signup', 'signin'] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMode(m)
                  setError('')
                }}
                className={cn(
                  'flex-1 rounded-full py-2.5 text-sm font-medium transition-colors',
                  mode === m
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground',
                )}
              >
                {m === 'signup' ? 'Create account' : 'Sign in'}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-3">
            {mode === 'signup' ? (
              <Field
                icon={<UserIcon className="size-4" />}
                type="text"
                placeholder="Full name"
                autoComplete="name"
                value={name}
                onChange={setName}
              />
            ) : null}
            <Field
              icon={<Mail className="size-4" />}
              type="email"
              placeholder="Email address"
              autoComplete="email"
              value={email}
              onChange={setEmail}
            />
            <div className="relative">
              <Field
                icon={<Lock className="size-4" />}
                type={showPw ? 'text' : 'password'}
                placeholder="Password"
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                value={password}
                onChange={setPassword}
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>

            {error ? (
              <p className="px-1 text-xs font-medium text-red-400">{error}</p>
            ) : null}

            <button
              type="submit"
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-transform active:scale-[0.98] disabled:opacity-70"
            >
              {busy ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  {mode === 'signup' ? 'Create free account' : 'Sign in'}
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-4 text-center text-[11px] leading-relaxed text-muted-foreground">
            By continuing you agree to our Terms & Privacy Policy.
            <br />
            3 free ratings every day — no card required.
          </p>
        </div>
      </div>
    </main>
  )
}

function Field({
  icon,
  type,
  placeholder,
  autoComplete,
  value,
  onChange,
}: {
  icon: React.ReactNode
  type: string
  placeholder: string
  autoComplete?: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-card px-4 py-3.5 focus-within:border-primary/50">
      <span className="text-muted-foreground">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
    </div>
  )
}
