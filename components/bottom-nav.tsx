'use client'

import { Compass, Home, Sparkles, User, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useApp, usePending, type Tab } from './app-context'

const items: { key: Tab; label: string; icon: typeof Home }[] = [
  { key: 'scan', label: 'Rate', icon: Home },
  { key: 'discover', label: 'Shop', icon: Compass },
  { key: 'feed', label: 'Feed', icon: Users },
  { key: 'profile', label: 'You', icon: User },
]

export function BottomNav() {
  const { tab, setTab, setResult } = useApp()
  const { setPendingImage } = usePending()

  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center pb-[max(env(safe-area-inset-bottom),12px)]">
      <div className="glass-strong pointer-events-auto mx-4 flex w-full max-w-[420px] items-center justify-around rounded-full border border-white/10 px-2 py-2 shadow-[0_8px_40px_-8px_rgba(0,0,0,0.6)]">
        {items.map(({ key, label, icon: Icon }) => {
          const active = tab === key
          return (
            <button
              key={key}
              type="button"
              onClick={() => {
                setTab(key)
                if (key === 'scan') {
                  setResult(null)
                  setPendingImage(null)
                }
              }}
              className={cn(
                'flex flex-1 flex-col items-center gap-1 rounded-full py-1.5 transition-colors',
                active ? 'text-primary' : 'text-muted-foreground',
              )}
              aria-current={active ? 'page' : undefined}
            >
              <Icon
                className={cn(
                  'size-5 transition-transform',
                  active && 'scale-110',
                )}
                strokeWidth={active ? 2.4 : 2}
              />
              <span className="text-[10px] font-medium tracking-wide">
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
