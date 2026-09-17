'use client'

import { Search, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { PRODUCTS, useApp } from '@/components/app-context'
import { ProductCard } from '@/components/product-card'
import { cn } from '@/lib/utils'

const CATEGORIES = [
  'All',
  'Outerwear',
  'Footwear',
  'Bags',
  'Accessories',
  'Bottoms',
] as const

export function DiscoverScreen() {
  const { isPro, openPaywall } = useApp()
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>('All')

  const items =
    cat === 'All' ? PRODUCTS : PRODUCTS.filter((p) => p.category === cat)

  return (
    <div className="px-5 pb-28 pt-4">
      <header>
        <p className="text-xs tracking-[0.2em] text-muted-foreground">
          CURATED FOR YOU
        </p>
        <h1 className="font-display text-2xl font-semibold">Shop the look</h1>
      </header>

      {/* Search */}
      <div className="mt-4 flex items-center gap-2 rounded-full border border-white/10 bg-card px-4 py-3">
        <Search className="size-4 text-muted-foreground" />
        <input
          placeholder="Search pieces, brands, vibes…"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      {/* Trending banner */}
      <div className="mt-4 flex items-center gap-3 overflow-hidden rounded-2xl border border-white/8 bg-aurora p-4">
        <span className="grid size-10 place-items-center rounded-xl bg-primary/20 text-primary">
          <TrendingUp className="size-5" />
        </span>
        <div className="flex-1">
          <p className="text-sm font-semibold">Trending this week</p>
          <p className="text-xs text-muted-foreground">
            Quiet luxury neutrals are up 32%
          </p>
        </div>
      </div>

      {/* Categories */}
      <div className="no-scrollbar -mx-5 mt-5 flex gap-2 overflow-x-auto px-5">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCat(c)}
            className={cn(
              'shrink-0 rounded-full border px-4 py-2 text-xs font-medium transition-colors',
              cat === c
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-white/10 bg-card text-muted-foreground',
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {/* Free-tier ad */}
      {!isPro ? (
        <button
          type="button"
          onClick={() => openPaywall('Go Pro for ad-free shopping.')}
          className="mt-5 flex w-full items-center gap-3 rounded-2xl border border-dashed border-white/12 bg-white/[0.02] p-4 text-left"
        >
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary text-lg font-semibold">
            %
          </div>
          <div className="flex-1">
            <p className="text-[10px] tracking-widest text-muted-foreground">
              SPONSORED
            </p>
            <p className="text-sm font-medium">
              Members get early access to sale drops
            </p>
          </div>
        </button>
      ) : null}
    </div>
  )
}
