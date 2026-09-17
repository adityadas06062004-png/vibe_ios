# Vibe

AI-powered outfit rating, sharing, and shopping — all in one loop.

Snap a fit, get an instant AI score, share it, then shop the pieces you (or your friends) rate highest. Vibe turns a simple "rate my outfit" idea into a full AI → social → discovery → commerce loop.

## The Idea

Most "AI rates your outfit" apps stop at the rating. Vibe closes the loop:

```
AI rating → share result → discover similar looks → shop the pieces → affiliate commission
```

That combination — **AI + Social + Utility + Transaction** — is what makes it a product instead of a novelty.

## Core Flow

1. **Auth** — sign in / onboarding
2. **Scan** — open the camera, use pose guides to frame the outfit
3. **Score** — AI rates the fit (visualized with a score ring)
4. **Result** — see the breakdown, save or retake
5. **Share** — export a share card to socials
6. **Discover** — browse a feed of other looks and trending styles
7. **Shop** — tap a product card to buy the piece (affiliate link) or upgrade via the paywall for premium features

## Screens

| Screen | Purpose |
|---|---|
| `auth-screen` | Sign in / sign up |
| `pose-camera-screen` | Capture the outfit with pose guidance |
| `scan-screen` | Processing / analysis state |
| `result-screen` | AI score + breakdown for the captured outfit |
| `feed-screen` | Home feed of results and looks |
| `discover-screen` | Browse outfits, styles, and products |
| `profile-screen` | User profile, history, saved looks |

## Key Components

- `score-ring` — animated circular AI score display
- `pose-guides` — on-camera framing overlay
- `product-card` — shoppable item card (drives the affiliate/transaction layer)
- `paywall-sheet` — premium upsell
- `share-sheet` — export/share the result
- `bottom-nav`, `app-context` — navigation and global state

## Tech Stack

- **Frontend:** Next.js (App Router) + TypeScript + Tailwind
- **Mobile shell:** Capacitor, wrapping the web app as a native **iOS** app
- **Native iOS project:** Xcode workspace (`ios/App`) with a Swift package (`CapApp-SPM`) for Capacitor plugins

## Getting Started

```bash
pnpm install
pnpm dev          # run the web app locally

npx cap sync ios  # sync web build into the iOS project
npx cap open ios  # open in Xcode
```

## Status

Early concept build — screens and components are scaffolded; AI scoring, affiliate product data, and the discovery feed are the next layers to wire up.

## License

TBD
