'use client'

import { Bookmark, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { useApp, type Product } from './app-context'

export function ProductCard({ product }: { product: Product }) {
  const { savedIds, toggleSaved } = useApp()
  const saved = savedIds.includes(product.id)

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/8 bg-card">
      <div className="relative aspect-square overflow-hidden bg-white/[0.03]">
        <Image
          src={product.image || '/placeholder.svg'}
          alt={product.name}
          fill
          sizes="200px"
          className="object-cover transition-transform duration-500 group-active:scale-95"
        />
        <span className="absolute left-2 top-2 rounded-full bg-black/50 px-2 py-1 text-[10px] font-semibold text-primary backdrop-blur-md">
          {product.match}% match
        </span>
        <button
          type="button"
          onClick={() => toggleSaved(product.id)}
          aria-label={saved ? 'Remove from saved' : 'Save item'}
          className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-black/50 text-white backdrop-blur-md transition-colors hover:text-primary"
        >
          <Bookmark
            className="size-4"
            fill={saved ? 'currentColor' : 'none'}
          />
        </button>
      </div>
      <div className="space-y-2 p-3">
        <p className="text-[10px] font-medium tracking-[0.18em] text-muted-foreground">
          {product.brand}
        </p>
        <p className="line-clamp-1 text-sm font-medium">{product.name}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-semibold">${product.price}</span>
            {product.oldPrice ? (
              <span className="text-xs text-muted-foreground line-through">
                ${product.oldPrice}
              </span>
            ) : null}
          </div>
        </div>
        <button
          type="button"
          className={cn(
            'flex w-full items-center justify-center gap-1.5 rounded-full bg-primary py-2 text-xs font-semibold text-primary-foreground',
            'transition-transform active:scale-95',
          )}
        >
          Shop now
          <ExternalLink className="size-3.5" />
        </button>
      </div>
    </div>
  )
}
