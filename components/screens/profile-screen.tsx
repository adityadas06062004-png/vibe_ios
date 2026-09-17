'use client'

import {
  Bell,
  Bookmark,
  ChevronRight,
  Crown,
  LogOut,
  Palette,
  Plus,
  Settings,
  Sparkles,
  Zap,
} from 'lucide-react'
import { useApp } from '@/components/app-context'

const STYLE_DNA = ['Minimal', 'Neutral tones', 'Tailored', 'Street', 'Warm']

export function ProfileScreen() {
  const { isPro, setPro, credits, addCredits, openPaywall, savedIds, user, signOut } =
    useApp()

  return (
    <div className="px-5 pb-28 pt-4">
      <header className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">You</h1>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Notifications"
            className="grid size-9 place-items-center rounded-full border border-white/10 bg-card"
          >
            <Bell className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Settings"
            className="grid size-9 place-items-center rounded-full border border-white/10 bg-card"
          >
            <Settings className="size-4" />
          </button>
        </div>
      </header>

      {/* Identity */}
      <div className="mt-5 flex items-center gap-4">
        <span className="grid size-16 place-items-center rounded-full bg-gradient-to-br from-violet/50 to-primary/50 font-display text-xl font-semibold">
          {user?.initials ?? 'YOU'}
        </span>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-display text-lg font-semibold">
              {user?.name ?? 'Your name'}
            </p>
            {isPro ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
                <Crown className="size-3" /> PRO
              </span>
            ) : null}
          </div>
          <p className="text-sm text-muted-foreground">
            {user?.handle ?? '@you'} · Style Lv. 4
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-5 grid grid-cols-3 gap-3">
        {[
          { label: 'Looks rated', value: '48' },
          { label: 'Avg score', value: '89' },
          { label: 'Followers', value: '1.2k' },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-white/8 bg-card p-3 text-center"
          >
            <p className="font-display text-xl font-semibold text-gradient-gold">
              {s.value}
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Pro / upgrade */}
      {isPro ? (
        <div className="mt-5 flex items-center gap-3 rounded-3xl border border-primary/25 bg-aurora p-5">
          <Crown className="size-6 text-primary" />
          <div className="flex-1">
            <p className="font-semibold">Aura Pro active</p>
            <p className="text-xs text-muted-foreground">
              Unlimited ratings · ad-free · pro insights
            </p>
          </div>
          <button
            type="button"
            onClick={() => setPro(false)}
            className="text-xs text-muted-foreground underline"
          >
            Manage
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => openPaywall('Unlock unlimited ratings & pro insights.')}
          className="mt-5 flex w-full items-center gap-3 overflow-hidden rounded-3xl border border-primary/25 bg-aurora p-5 text-left"
        >
          <span className="grid size-11 place-items-center rounded-2xl bg-primary/20 text-primary">
            <Crown className="size-5" />
          </span>
          <div className="flex-1">
            <p className="font-display text-base font-semibold">
              Upgrade to Aura Pro
            </p>
            <p className="text-xs text-muted-foreground">
              Unlimited ratings, pro insights & no ads
            </p>
          </div>
          <ChevronRight className="size-5 text-muted-foreground" />
        </button>
      )}

      {/* Credits */}
      <div className="mt-4 rounded-3xl border border-white/8 bg-card p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="size-4 text-primary" />
            <span className="text-sm font-medium">Rating credits</span>
          </div>
          <span className="font-display text-lg font-semibold tabular-nums">
            {isPro ? '∞' : credits}
          </span>
        </div>
        {!isPro ? (
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              { n: 5, price: '$1.99' },
              { n: 15, price: '$3.99' },
              { n: 40, price: '$7.99' },
            ].map((pack) => (
              <button
                key={pack.n}
                type="button"
                onClick={() => addCredits(pack.n)}
                className="flex flex-col items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.03] py-3 transition-transform active:scale-95"
              >
                <span className="flex items-center gap-1 font-display text-base font-semibold">
                  <Plus className="size-3.5 text-primary" />
                  {pack.n}
                </span>
                <span className="text-xs text-muted-foreground">
                  {pack.price}
                </span>
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {/* Style DNA */}
      <div className="mt-4 rounded-3xl border border-white/8 bg-card p-5">
        <div className="flex items-center gap-2">
          <Palette className="size-4 text-primary" />
          <span className="text-sm font-medium">Your Style DNA</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {STYLE_DNA.map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="mt-4 overflow-hidden rounded-3xl border border-white/8 bg-card">
        {[
          { icon: Bookmark, label: 'Saved items', meta: `${savedIds.length}` },
          { icon: Sparkles, label: 'Rating history', meta: '48' },
          { icon: Settings, label: 'Preferences', meta: '' },
        ].map((row, i) => (
          <button
            key={row.label}
            type="button"
            className={cnRow(i)}
          >
            <row.icon className="size-4 text-muted-foreground" />
            <span className="flex-1 text-left text-sm">{row.label}</span>
            {row.meta ? (
              <span className="text-xs text-muted-foreground">{row.meta}</span>
            ) : null}
            <ChevronRight className="size-4 text-muted-foreground" />
          </button>
        ))}
      </div>

      {/* Sign out */}
      <button
        type="button"
        onClick={signOut}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-3xl border border-white/8 bg-card py-4 text-sm font-medium text-muted-foreground transition-colors active:bg-white/[0.04]"
      >
        <LogOut className="size-4" />
        Sign out
      </button>
    </div>
  )
}

function cnRow(i: number) {
  return `flex w-full items-center gap-3 px-5 py-4 ${i > 0 ? 'border-t border-white/8' : ''}`
}
