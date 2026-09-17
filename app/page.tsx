'use client'

import { AppProvider, useApp } from '@/components/app-context'
import { BottomNav } from '@/components/bottom-nav'
import { PaywallSheet } from '@/components/paywall-sheet'
import { AuthScreen } from '@/components/screens/auth-screen'
import { DiscoverScreen } from '@/components/screens/discover-screen'
import { FeedScreen } from '@/components/screens/feed-screen'
import { PoseCameraScreen } from '@/components/screens/pose-camera-screen'
import { ProfileScreen } from '@/components/screens/profile-screen'
import { ResultScreen } from '@/components/screens/result-screen'
import { ScanScreen } from '@/components/screens/scan-screen'

function Screens() {
  const { authReady, user, tab, result, cameraOpen } = useApp()

  // Wait for persisted session before deciding what to render.
  if (!authReady) {
    return (
      <main className="grid min-h-dvh w-full max-w-[440px] mx-auto place-items-center bg-background">
        <span className="size-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
      </main>
    )
  }

  if (!user) return <AuthScreen />

  return (
    <main className="relative mx-auto min-h-dvh w-full max-w-[440px] overflow-hidden bg-background">
      {tab === 'scan' ? result ? <ResultScreen /> : <ScanScreen /> : null}
      {tab === 'discover' ? <DiscoverScreen /> : null}
      {tab === 'feed' ? <FeedScreen /> : null}
      {tab === 'profile' ? <ProfileScreen /> : null}

      <BottomNav />
      <PaywallSheet />
      {cameraOpen ? <PoseCameraScreen /> : null}
    </main>
  )
}

export default function Page() {
  return (
    <AppProvider>
      <Screens />
    </AppProvider>
  )
}
