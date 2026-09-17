'use client'

import { Check, Crown, Sparkles, X } from 'lucide-react'
import { useState } from 'react'
import { useApp } from '@/components/app-context'
import { cn } from '@/lib/utils'

const PLANS = [
  {
    id: 'yearly',
    label: 'Yearly',
    price: '$39.99',
    per: '/yr',
    sub: '$3.33/mo · billed annually',
    badge: 'Save 44%',
  },
  {
    id: 'monthly',
    label: 'Monthly',
    price: '$5.99',
    per: '/mo',
    sub: 'billed monthly, cancel anytime',
    badge: '',
  },
] as const

const PERKS = [
  'Unlimited outfit ratings',
  'Every pro stylist insight unlocked',
  'Ad-free experience',
  'Exclusive early access to sale drops',
  'Advanced Style DNA & trend reports',
]

export function PaywallSheet() {
  const { paywallOpen, closePaywall, setPro, paywallReason } = useApp()
  const [plan, setPlan] = useState<(typeof PLANS)[number]['id']>('yearly')

  if (!paywallOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button
        type="button"
        aria-label="Close"
        onClick={closePaywall}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-up"
      />
      <div className="animate-pop relative z-10 max-h-[92dvh] w-full max-w-[420px] overflow-y-auto rounded-t-[2rem] border-t border-white/10 bg-card pb-[max(env(safe-area-inset-bottom),20px)]">
        {/* Header */}
        <div className="relative overflow-hidden bg-aurora px-6 pb-6 pt-7">
          <button
            type="button"
            onClick={closePaywall}
            aria-label="Close"
            className="absolute right-4 top-4 grid size-8 place-items-center rounded-full bg-black/30 backdrop-blur-md"
          >
            <X className="size-4" />
          </button>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary">
            <Crown className="size-3.5" /> VIBE PRO
          </span>
          <h2 className="mt-3 font-display text-2xl font-semibold leading-tight text-balance">
            Dress like the top 1%.
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {paywallReason || 'Unlock the full power of your AI stylist.'}
          </p>
        </div>

        <div className="px-6 pt-5">
          {/* Perks */}
          <ul className="space-y-2.5">
            {PERKS.map((perk) => (
              <li key={perk} className="flex items-center gap-3 text-sm">
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary/20 text-primary">
                  <Check className="size-3.5" />
                </span>
                {perk}
              </li>
            ))}
          </ul>

          {/* Plans */}
          <div className="mt-5 space-y-3">
            {PLANS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPlan(p.id)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-colors',
                  plan === p.id
                    ? 'border-primary bg-primary/10'
                    : 'border-white/10 bg-white/[0.02]',
                )}
              >
                <span
                  className={cn(
                    'grid size-5 shrink-0 place-items-center rounded-full border-2',
                    plan === p.id
                      ? 'border-primary bg-primary'
                      : 'border-white/25',
                  )}
                >
                  {plan === p.id ? (
                    <Check className="size-3 text-primary-foreground" />
                  ) : null}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{p.label}</span>
                    {p.badge ? (
                      <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                        {p.badge}
                      </span>
                    ) : null}
                  </div>
                  <p className="text-xs text-muted-foreground">{p.sub}</p>
                </div>
                <div className="text-right">
                  <span className="font-display text-lg font-semibold">
                    {p.price}
                  </span>
                  <span className="text-xs text-muted-foreground">{p.per}</span>
                </div>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setPro(true)}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-transform active:scale-95"
          >
            <Sparkles className="size-4" />
            Start 7-day free trial
          </button>
          <p className="mt-3 text-center text-[11px] text-muted-foreground">
            Then {PLANS.find((p) => p.id === plan)?.price}
            {PLANS.find((p) => p.id === plan)?.per}. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  )
}