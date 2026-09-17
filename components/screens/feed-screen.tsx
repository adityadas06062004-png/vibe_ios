'use client'

import { Heart, MessageCircle, Share2, Sparkles, Trophy } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { FEED_POSTS, type FeedPost, useApp } from '@/components/app-context'
import { cn } from '@/lib/utils'

const LEADERS = [
  { rank: 1, name: 'Daniel O.', score: 95, initials: 'DO' },
  { rank: 2, name: 'Sofia M.', score: 93, initials: 'SM' },
  { rank: 3, name: 'Aria C.', score: 91, initials: 'AC' },
]

export function FeedScreen() {
  const { setTab } = useApp()
  const [posts, setPosts] = useState<FeedPost[]>(FEED_POSTS)

  function toggleLike(id: string) {
    setPosts((cur) =>
      cur.map((p) =>
        p.id === id
          ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) }
          : p,
      ),
    )
  }

  return (
    <div className="px-5 pb-28 pt-4">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs tracking-[0.2em] text-muted-foreground">
            COMMUNITY
          </p>
          <h1 className="font-display text-2xl font-semibold">Style feed</h1>
        </div>
        <button
          type="button"
          onClick={() => setTab('scan')}
          className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
        >
          <Sparkles className="size-3.5" />
          Rate yours
        </button>
      </header>

      {/* Leaderboard */}
      <section className="mt-4 rounded-3xl border border-white/8 bg-card p-4">
        <div className="flex items-center gap-2">
          <Trophy className="size-4 text-primary" />
          <h3 className="text-sm font-semibold">Top looks today</h3>
        </div>
        <div className="mt-3 space-y-2">
          {LEADERS.map((l) => (
            <div key={l.rank} className="flex items-center gap-3">
              <span
                className={cn(
                  'grid size-6 place-items-center rounded-full text-xs font-bold',
                  l.rank === 1
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-white/8 text-muted-foreground',
                )}
              >
                {l.rank}
              </span>
              <span className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-violet/40 to-primary/40 text-[11px] font-semibold">
                {l.initials}
              </span>
              <span className="flex-1 text-sm">{l.name}</span>
              <span className="font-display text-sm font-semibold text-gradient-gold">
                {l.score}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Posts */}
      <div className="mt-5 space-y-5">
        {posts.map((post) => (
          <article
            key={post.id}
            className="overflow-hidden rounded-3xl border border-white/8 bg-card"
          >
            <div className="flex items-center gap-3 p-3">
              <span className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-violet/40 to-primary/40 text-xs font-semibold">
                {post.initials}
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium">{post.name}</p>
                <p className="text-xs text-muted-foreground">
                  {post.handle} · {post.time}
                </p>
              </div>
              <span className="rounded-full bg-primary/15 px-2.5 py-1 text-xs font-semibold text-primary">
                {post.vibe}
              </span>
            </div>

            <div className="relative aspect-[4/5] w-full">
              <Image
                src={post.image || '/placeholder.svg'}
                alt={`${post.name}'s look`}
                fill
                sizes="420px"
                className="object-cover"
              />
              <div className="glass absolute right-3 top-3 flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5">
                <Sparkles className="size-3.5 text-primary" />
                <span className="font-display text-sm font-semibold">
                  {post.score}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-5 p-3">
              <button
                type="button"
                onClick={() => toggleLike(post.id)}
                className={cn(
                  'flex items-center gap-1.5 text-sm transition-colors',
                  post.liked ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                <Heart
                  className="size-5"
                  fill={post.liked ? 'currentColor' : 'none'}
                />
                {post.likes.toLocaleString()}
              </button>
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MessageCircle className="size-5" />
                {post.comments}
              </span>
              <Share2 className="ml-auto size-5 text-muted-foreground" />
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
