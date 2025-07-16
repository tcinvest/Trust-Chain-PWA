// Updated Home component (app/page.tsx)
'use client'
import { SignedIn, SignedOut } from '@clerk/nextjs'
import { usePWADetection } from '@/hooks/usePWADetection'
import SignedInOnboarding from '@/components/SignedInOnboarding'
import SignedOutOnboarding from '@/components/SignedOutOnboarding'
import PWAOnboarding from '@/components/PWAOnboarding'

export default function Home() {
  const isPWA = usePWADetection()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* If user is signed in, show different onboarding based on PWA status */}
        <SignedIn>
          {isPWA ? (
            // User is signed in and using PWA - show PWA-specific signed-in onboarding
            <PWAOnboarding />
          ) : (
            // User is signed in and using regular web - show regular signed-in onboarding
            <SignedInOnboarding />
          )}
        </SignedIn>

        {/* If user is signed out, show different onboarding based on PWA status */}
        <SignedOut>
          {isPWA ? (
            // User is signed out and using PWA - show PWA-specific signed-out onboarding
            <PWAOnboarding />
          ) : (
            // User is signed out and using regular web - show regular signed-out onboarding
            <SignedOutOnboarding />
          )}
        </SignedOut>
      </div>
    </div>
  )
}