'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type Tab = 'scan' | 'discover' | 'feed' | 'profile'

export type Product = {
  id: string
  name: string
  brand: string
  price: number
  oldPrice?: number
  image: string
  category: 'Outerwear' | 'Footwear' | 'Bags' | 'Accessories' | 'Bottoms'
  match: number
  commission: number
}

export type Breakdown = {
  label: string
  score: number
  note: string
}

export type ScanResult = {
  image: string
  score: number
  vibe: string
  summary: string
  breakdown: Breakdown[]
  freeTips: string[]
  proTips: string[]
  products: Product[]
}

export type FeedPost = {
  id: string
  name: string
  handle: string
  initials: string
  image: string
  score: number
  vibe: string
  likes: number
  comments: number
  time: string
  liked?: boolean
}

export type User = {
  name: string
  email: string
  handle: string
  initials: string
}

// A single rated look, recorded after every completed scan. This is the
// real data source for level, streak, average score, and Style DNA — none
// of that is hardcoded anymore.
export type HistoryEntry = {
  id: string
  image: string
  score: number
  vibe: string
  date: string // ISO timestamp
}

export type Stats = {
  ratingsCount: number
  avgScore: number
  level: number
  streak: number
  topVibe: string | null
  vibeCounts: Record<string, number>
}

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Oversized Bomber Jacket',
    brand: 'ATELIER NORD',
    price: 189,
    oldPrice: 240,
    image: '/products/jacket.png',
    category: 'Outerwear',
    match: 96,
    commission: 12,
  },
  {
    id: 'p2',
    name: 'Chunky Court Sneakers',
    brand: 'FORMA',
    price: 145,
    image: '/products/sneakers.png',
    category: 'Footwear',
    match: 93,
    commission: 10,
  },
  {
    id: 'p3',
    name: 'Structured Leather Bag',
    brand: 'MAISON REY',
    price: 320,
    oldPrice: 390,
    image: '/products/bag.png',
    category: 'Bags',
    match: 90,
    commission: 15,
  },
  {
    id: 'p4',
    name: 'Gold Tortoise Sunglasses',
    brand: 'LUME',
    price: 96,
    image: '/products/sunglasses.png',
    category: 'Accessories',
    match: 88,
    commission: 18,
  },
  {
    id: 'p5',
    name: 'Cream Dial Watch',
    brand: 'HORA',
    price: 275,
    image: '/products/watch.png',
    category: 'Accessories',
    match: 85,
    commission: 14,
  },
  {
    id: 'p6',
    name: 'Wide-Leg Trousers',
    brand: 'ATELIER NORD',
    price: 118,
    oldPrice: 150,
    image: '/products/trousers.png',
    category: 'Bottoms',
    match: 91,
    commission: 11,
  },
]

export const SAMPLE_LOOKS = [
  { id: 'l1', label: 'Streetwear', image: '/outfits/street.png' },
  { id: 'l2', label: 'Quiet Luxury', image: '/outfits/minimal.png' },
  { id: 'l3', label: 'Evening', image: '/outfits/evening.png' },
  { id: 'l4', label: 'Smart Casual', image: '/outfits/casual.png' },
]

const RESULTS: Record<string, ScanResult> = {
  '/outfits/street.png': {
    image: '/outfits/street.png',
    score: 91,
    vibe: 'Elevated Street',
    summary:
      'Confident proportions with a clean neutral palette. The oversized top balances beautifully against tailored volume below.',
    breakdown: [
      { label: 'Fit & Proportion', score: 94, note: 'Balanced silhouette' },
      { label: 'Color Harmony', score: 92, note: 'Cohesive neutrals' },
      { label: 'Footwear', score: 88, note: 'On-trend chunky sole' },
      { label: 'Occasion Match', score: 90, note: 'Great for day-out' },
      { label: 'Trend Score', score: 89, note: 'Current & relevant' },
    ],
    freeTips: [
      'Add a slim gold accessory to sharpen the neckline.',
      'Cuff the trousers once to reveal the sneaker silhouette.',
    ],
    proTips: [
      'Swap the shoulder bag for a structured tan bag to add warmth to the palette.',
      'A tortoise sunglass frame would echo the warm undertones and lift the face.',
      'For evening, layer a fitted knit under the bomber to transition the look.',
    ],
    products: [PRODUCTS[0], PRODUCTS[1], PRODUCTS[2], PRODUCTS[3]],
  },
  '/outfits/minimal.png': {
    image: '/outfits/minimal.png',
    score: 95,
    vibe: 'Quiet Luxury',
    summary:
      'Impeccable restraint. The tonal layering reads expensive and intentional — a masterclass in minimalism.',
    breakdown: [
      { label: 'Fit & Proportion', score: 96, note: 'Tailored precision' },
      { label: 'Color Harmony', score: 97, note: 'Refined tonal' },
      { label: 'Footwear', score: 92, note: 'Elegant leather' },
      { label: 'Occasion Match', score: 94, note: 'Versatile' },
      { label: 'Trend Score', score: 93, note: 'Timeless' },
    ],
    freeTips: [
      'Keep accessories to a single metal tone for cohesion.',
      'A leather watch strap would complete the tailored story.',
    ],
    proTips: [
      'Introduce a camel scarf for texture without breaking the palette.',
      'A structured leather bag elevates this to full editorial.',
      'Consider a slightly cropped trouser to modernize the proportion.',
    ],
    products: [PRODUCTS[4], PRODUCTS[2], PRODUCTS[5], PRODUCTS[3]],
  },
  '/outfits/evening.png': {
    image: '/outfits/evening.png',
    score: 93,
    vibe: 'Evening Glamour',
    summary:
      'Striking and elegant. The fabric movement and jewel tone photograph beautifully under warm light.',
    breakdown: [
      { label: 'Fit & Proportion', score: 93, note: 'Flattering drape' },
      { label: 'Color Harmony', score: 95, note: 'Rich jewel tone' },
      { label: 'Footwear', score: 90, note: 'Complements hemline' },
      { label: 'Occasion Match', score: 96, note: 'Perfect for event' },
      { label: 'Trend Score', score: 88, note: 'Classic glam' },
    ],
    freeTips: [
      'Delicate gold jewelry keeps the focus on the silhouette.',
      'A soft updo would elongate the neckline.',
    ],
    proTips: [
      'A metallic clutch adds a functional highlight without competing.',
      'Warm-toned sunglasses work for the daytime version of this look.',
      'A fine gold watch balances the wrist against statement earrings.',
    ],
    products: [PRODUCTS[3], PRODUCTS[4], PRODUCTS[2], PRODUCTS[0]],
  },
  '/outfits/casual.png': {
    image: '/outfits/casual.png',
    score: 87,
    vibe: 'Smart Casual',
    summary:
      'Clean and approachable. Great base — a few tonal tweaks would push this from good to standout.',
    breakdown: [
      { label: 'Fit & Proportion', score: 89, note: 'Comfortable & neat' },
      { label: 'Color Harmony', score: 86, note: 'Soft earth tones' },
      { label: 'Footwear', score: 88, note: 'Clean minimal' },
      { label: 'Occasion Match', score: 90, note: 'Everyday ready' },
      { label: 'Trend Score', score: 82, note: 'Safe but solid' },
    ],
    freeTips: [
      'Roll the sleeves for a more relaxed, intentional look.',
      'Add a watch to fill the wrist and add polish.',
    ],
    proTips: [
      'A structured bag would add a premium anchor to the outfit.',
      'Swap to off-white sneakers to warm up the palette.',
      'A tortoise sunglass frame instantly lifts the whole look.',
    ],
    products: [PRODUCTS[4], PRODUCTS[1], PRODUCTS[2], PRODUCTS[3]],
  },
}

export const FEED_POSTS: FeedPost[] = [
  {
    id: 'f1',
    name: 'Sofia Marchetti',
    handle: '@sofiam',
    initials: 'SM',
    image: '/outfits/evening.png',
    score: 93,
    vibe: 'Evening Glamour',
    likes: 1240,
    comments: 86,
    time: '2h',
  },
  {
    id: 'f2',
    name: 'Daniel Okoro',
    handle: '@dnl',
    initials: 'DO',
    image: '/outfits/minimal.png',
    score: 95,
    vibe: 'Quiet Luxury',
    likes: 2380,
    comments: 154,
    time: '5h',
  },
  {
    id: 'f3',
    name: 'Aria Chen',
    handle: '@ariastyle',
    initials: 'AC',
    image: '/outfits/street.png',
    score: 91,
    vibe: 'Elevated Street',
    likes: 980,
    comments: 42,
    time: '8h',
  },
]

// Deterministic pseudo-score so a given uploaded photo always scores the same.
function hashString(s: string) {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

export function getResult(image: string): ScanResult {
  const base = RESULTS[image]
  if (base) return base

  // Custom capture / upload: synthesize a believable result around the photo.
  const templates = Object.values(RESULTS)
  const h = hashString(image)
  const template = templates[h % templates.length]
  const drift = (h % 9) - 4 // -4..+4
  const clamp = (n: number) => Math.max(70, Math.min(99, n))
  return {
    ...template,
    image,
    score: clamp(template.score + drift),
    breakdown: template.breakdown.map((b, i) => ({
      ...b,
      score: clamp(b.score + (((h >> (i + 1)) % 7) - 3)),
    })),
  }
}

// --- Stats, derived entirely from real history. No hardcoded "Level 4". ---
export function computeStreak(history: HistoryEntry[]): number {
  if (history.length === 0) return 0
  const daySet = new Set(history.map((h) => new Date(h.date).toDateString()))
  const cursor = new Date()
  // If nothing logged today yet, the streak can still count through
  // yesterday — it only breaks once a full day is missed.
  if (!daySet.has(cursor.toDateString())) {
    cursor.setDate(cursor.getDate() - 1)
  }
  let streak = 0
  while (daySet.has(cursor.toDateString())) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

export function computeStats(history: HistoryEntry[]): Stats {
  const ratingsCount = history.length
  const avgScore = ratingsCount
    ? Math.round(history.reduce((sum, h) => sum + h.score, 0) / ratingsCount)
    : 0
  // Level up every 5 rated looks — starts at 1, no ceiling.
  const level = 1 + Math.floor(ratingsCount / 5)
  const vibeCounts: Record<string, number> = {}
  for (const h of history) vibeCounts[h.vibe] = (vibeCounts[h.vibe] ?? 0) + 1
  let topVibe: string | null = null
  let topCount = 0
  for (const [vibe, count] of Object.entries(vibeCounts)) {
    if (count > topCount) {
      topCount = count
      topVibe = vibe
    }
  }
  return {
    ratingsCount,
    avgScore,
    level,
    streak: computeStreak(history),
    topVibe,
    vibeCounts,
  }
}

const ACCOUNTS_KEY = 'vibe:accounts'
const SESSION_KEY = 'vibe:session'
const PREFS_KEY = 'vibe:prefs'
const MAX_FREE_ADS_PER_DAY = 3

type Account = User & { password: string }

type Prefs = {
  isPro: boolean
  credits: number
  savedIds: string[]
  lastResetDate: string
  adsWatchedToday: number
}

function todayStr() {
  return new Date().toDateString()
}

function historyKey(email: string) {
  return `vibe:history:${email}`
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'YOU'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function handleFrom(name: string, email: string) {
  const base = name.trim().split(/\s+/)[0] || email.split('@')[0]
  return '@' + base.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function writeJSON(key: string, value: unknown) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable — fail silently, nothing user-facing to break */
  }
}

type AuthResult = { ok: boolean; error?: string }

type AppState = {
  authReady: boolean
  user: User | null
  signUp: (input: { name: string; email: string; password: string }) => AuthResult
  signIn: (input: { email: string; password: string }) => AuthResult
  signOut: () => void
  tab: Tab
  setTab: (t: Tab) => void
  isPro: boolean
  setPro: (v: boolean) => void
  credits: number
  addCredits: (n: number) => void
  paywallOpen: boolean
  openPaywall: (reason?: string) => void
  closePaywall: () => void
  paywallReason: string
  result: ScanResult | null
  setResult: (r: ScanResult | null) => void
  scanning: boolean
  startScan: (image: string) => boolean
  finishScan: () => void
  recordScan: (result: ScanResult) => void
  cameraOpen: boolean
  openCamera: () => void
  closeCamera: () => void
  savedIds: string[]
  toggleSaved: (id: string) => void
  history: HistoryEntry[]
  stats: Stats
  outOfCreditsNotice: boolean
  dismissOutOfCreditsNotice: () => void
  adsWatchedToday: number
  maxFreeAdsPerDay: number
  watchAd: () => boolean
}

const Ctx = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [authReady, setAuthReady] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [tab, setTab] = useState<Tab>('scan')
  const [isPro, setPro] = useState(false)
  const [credits, setCredits] = useState(3)
  const [paywallOpen, setPaywallOpen] = useState(false)
  const [paywallReason, setPaywallReason] = useState('')
  const [result, setResult] = useState<ScanResult | null>(null)
  const [scanning, setScanning] = useState(false)
  const [cameraOpen, setCameraOpen] = useState(false)
  const [savedIds, setSavedIds] = useState<string[]>([])
  const [pendingImage, setPendingImage] = useState<string | null>(null)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [outOfCreditsNotice, setOutOfCreditsNotice] = useState(false)
  const [adsWatchedToday, setAdsWatchedToday] = useState(0)
  const [lastResetDate, setLastResetDate] = useState(todayStr())

  // Hydrate persisted session + prefs after mount (avoids SSR mismatch).
  useEffect(() => {
    const session = readJSON<User | null>(SESSION_KEY, null)
    const prefs = readJSON<Prefs>(PREFS_KEY, {
      isPro: false,
      credits: 3,
      savedIds: [],
      lastResetDate: todayStr(),
      adsWatchedToday: 0,
    })

    // "3 free ratings every day" only means something if it actually resets.
    const isNewDay = prefs.lastResetDate !== todayStr()
    const hydratedCredits = isNewDay ? 3 : prefs.credits
    const hydratedAds = isNewDay ? 0 : prefs.adsWatchedToday

    if (session) {
      setUser(session)
      setHistory(readJSON<HistoryEntry[]>(historyKey(session.email), []))
    }
    setPro(prefs.isPro)
    setCredits(hydratedCredits)
    setAdsWatchedToday(hydratedAds)
    setSavedIds(prefs.savedIds ?? [])
    setLastResetDate(todayStr())
    setAuthReady(true)
  }, [])

  // Persist prefs whenever they change (after hydration).
  useEffect(() => {
    if (!authReady) return
    writeJSON(PREFS_KEY, {
      isPro,
      credits,
      savedIds,
      lastResetDate,
      adsWatchedToday,
    } satisfies Prefs)
  }, [authReady, isPro, credits, savedIds, lastResetDate, adsWatchedToday])

  const stats = useMemo(() => computeStats(history), [history])

  const value = useMemo<AppState>(() => {
    const openPaywall = (reason = '') => {
      setPaywallReason(reason)
      setPaywallOpen(true)
    }

    const persistSession = (u: User | null) => {
      if (typeof window === 'undefined') return
      if (u) window.localStorage.setItem(SESSION_KEY, JSON.stringify(u))
      else window.localStorage.removeItem(SESSION_KEY)
    }

    return {
      authReady,
      user,
      signUp: ({ name, email, password }) => {
        const cleanEmail = email.trim().toLowerCase()
        if (name.trim().length < 2)
          return { ok: false, error: 'Please enter your name.' }
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(cleanEmail))
          return { ok: false, error: 'Enter a valid email address.' }
        if (password.length < 6)
          return { ok: false, error: 'Password must be at least 6 characters.' }
        const accounts = readJSON<Account[]>(ACCOUNTS_KEY, [])
        if (accounts.some((a) => a.email === cleanEmail))
          return { ok: false, error: 'An account with this email already exists.' }
        const newUser: User = {
          name: name.trim(),
          email: cleanEmail,
          handle: handleFrom(name, cleanEmail),
          initials: initials(name),
        }
        const next = [...accounts, { ...newUser, password }]
        writeJSON(ACCOUNTS_KEY, next)
        persistSession(newUser)
        setUser(newUser)
        // Brand-new account: no history, full fresh daily allowance.
        setHistory([])
        setCredits(3)
        setAdsWatchedToday(0)
        setLastResetDate(todayStr())
        return { ok: true }
      },
      signIn: ({ email, password }) => {
        const cleanEmail = email.trim().toLowerCase()
        const accounts = readJSON<Account[]>(ACCOUNTS_KEY, [])
        const found = accounts.find((a) => a.email === cleanEmail)
        if (!found) return { ok: false, error: 'No account found for this email.' }
        if (found.password !== password)
          return { ok: false, error: 'Incorrect password.' }
        const u: User = {
          name: found.name,
          email: found.email,
          handle: found.handle,
          initials: found.initials,
        }
        persistSession(u)
        setUser(u)
        setHistory(readJSON<HistoryEntry[]>(historyKey(u.email), []))
        return { ok: true }
      },
      signOut: () => {
        persistSession(null)
        setUser(null)
        setTab('scan')
        setResult(null)
        setHistory([])
      },
      tab,
      setTab,
      isPro,
      setPro: (v: boolean) => {
        setPro(v)
        if (v) {
          setPaywallOpen(false)
          setOutOfCreditsNotice(false)
        }
      },
      credits,
      addCredits: (n: number) => setCredits((c) => c + n),
      paywallOpen,
      openPaywall,
      closePaywall: () => setPaywallOpen(false),
      paywallReason,
      result,
      setResult,
      scanning,
      startScan: (image: string) => {
        if (!isPro) {
          if (credits <= 0) {
            // Close the camera first so the paywall never silently stacks
            // underneath it — the user only sees it once the camera is gone.
            setCameraOpen(false)
            setOutOfCreditsNotice(true)
            return false
          }
          setCredits((c) => c - 1)
        }
        setPendingImage(image)
        setResult(null)
        setScanning(true)
        setCameraOpen(false)
        setOutOfCreditsNotice(false)
        setTab('scan')
        return true
      },
      finishScan: () => setScanning(false),
      recordScan: (r: ScanResult) => {
        if (!user) return
        const entry: HistoryEntry = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          image: r.image,
          score: r.score,
          vibe: r.vibe,
          date: new Date().toISOString(),
        }
        setHistory((prev) => {
          const next = [entry, ...prev]
          writeJSON(historyKey(user.email), next)
          return next
        })
      },
      cameraOpen,
      openCamera: () => setCameraOpen(true),
      closeCamera: () => setCameraOpen(false),
      savedIds,
      toggleSaved: (id: string) =>
        setSavedIds((ids) =>
          ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id],
        ),
      history,
      stats,
      outOfCreditsNotice,
      dismissOutOfCreditsNotice: () => setOutOfCreditsNotice(false),
      adsWatchedToday,
      maxFreeAdsPerDay: MAX_FREE_ADS_PER_DAY,
      watchAd: () => {
        if (adsWatchedToday >= MAX_FREE_ADS_PER_DAY) return false
        setAdsWatchedToday((n) => n + 1)
        setCredits((c) => c + 1)
        setOutOfCreditsNotice(false)
        return true
      },
    }
  }, [
    authReady,
    user,
    tab,
    isPro,
    credits,
    paywallOpen,
    paywallReason,
    result,
    scanning,
    cameraOpen,
    savedIds,
    history,
    stats,
    outOfCreditsNotice,
    adsWatchedToday,
  ])

  return (
    <Ctx.Provider value={value}>
      <PendingCtx.Provider value={{ pendingImage, setPendingImage }}>
        {children}
      </PendingCtx.Provider>
    </Ctx.Provider>
  )
}

const PendingCtx = createContext<{
  pendingImage: string | null
  setPendingImage: (v: string | null) => void
} | null>(null)

export function usePending() {
  const c = useContext(PendingCtx)
  if (!c) throw new Error('usePending must be used within AppProvider')
  return c
}

export function useApp() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useApp must be used within AppProvider')
  return c
}