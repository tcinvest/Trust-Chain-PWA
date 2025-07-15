// Updated Home component (app/page.tsx)
'use client'
import { SignedIn, SignedOut } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { usePWADetection } from '@/hooks/usePWADetection'
import SignedInOnboarding from '@/components/SignedInOnboarding'
import SignedOutOnboarding from '@/components/SignedOutOnboarding'
import PWAOnboarding from '@/components/PWAOnboarding'

export default function Home() {
  const router = useRouter()
  const isPWA = usePWADetection()

  useEffect(() => {
    // If PWA is installed and user is not authenticated, redirect to sign-in
    if (isPWA) {
      // We'll handle the redirect in the SignedOut component to avoid auth state conflicts
    }
  }, [isPWA, router])

  return (
    <div className="min-h-screen bg-black relative overflow-hidden pt-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>

      <SignedOut>
        <PWASignedOutHandler isPWA={isPWA} />
      </SignedOut>

      <SignedIn>
        {isPWA ? <PWAOnboarding /> : <SignedInOnboarding />}
      </SignedIn>
    </div>
  )
}

function PWASignedOutHandler({ isPWA }: { isPWA: boolean }) {
  const router = useRouter()

  useEffect(() => {
    if (isPWA) {
      // Don't redirect anymore - show onboarding instead
      return
    }
  }, [isPWA, router])

  // If PWA, show onboarding screen
  if (isPWA) {
    return <PWAOnboarding />
  }

  // If not PWA, show the normal signed out onboarding
  return <SignedOutOnboarding />
}