import Nav from '@/components/Nav'
import { checkUser } from '@/lib/check-user'
import { redirect } from 'next/navigation'
import { AlertCircle, RefreshCw } from 'lucide-react'
import Link from 'next/link'

// Error component for authentication failures
function AuthError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-4">
          <AlertCircle className="h-8 w-8 text-red-500 mr-3" />
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Authentication Error
          </h1>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          We&apos;re having trouble verifying your account. Please try signing in again.
        </p>
        
        <div className="space-y-3">
          <Link
            href="/sign-in"
            className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Sign In Again
          </Link>
          
          <Link
            href="/"
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  try {
    const user = await checkUser()
    
    // If checkUser returns null (not authenticated), redirect to sign-in
    if (!user) {
      redirect('/sign-in')
    }
    
    return (
      <div className="flex flex-col h-screen bg-white dark:bg-slate-900">
        <main className="flex-1 overflow-y-auto bg-white dark:bg-slate-900 pb-20 relative z-10">
          {children}
        </main>
        <Nav />
      </div>
    )
  } catch (error) {
    // Log the error for debugging
    console.error('Dashboard authentication error:', error)
    
    // Return error UI instead of crashing
    return <AuthError />
  }
}