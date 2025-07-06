import { SignedIn, SignedOut } from '@clerk/nextjs'
import Link from 'next/link'
import { TrendingUp, Shield, Zap, ArrowRight, Brain, DollarSign } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden pt-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>

      <SignedOut>
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
          {/* Logo/Brand */}
          <div className="mb-8 flex items-center space-x-3">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-400 rounded-full flex items-center justify-center">
                <TrendingUp className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Trust Chain</h1>
              <p className="text-purple-300 text-sm font-medium">Invest AI</p>
            </div>
          </div>

          {/* Hero Content */}
          <div className="max-w-2xl mx-auto mb-12">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              AI-Powered
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent block">
                Investment
              </span>
              <span className="text-emerald-400">Revolution</span>
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              Harness the power of artificial intelligence to make smarter investment decisions. 
              Join thousands of investors who trust our advanced algorithms to grow their wealth.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">AI Analytics</h3>
              <p className="text-gray-300 text-sm">Advanced machine learning algorithms analyze market patterns in real-time</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Secure & Trusted</h3>
              <p className="text-gray-300 text-sm">Bank-level security with blockchain transparency and full regulatory compliance</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Lightning Fast</h3>
              <p className="text-gray-300 text-sm">Execute trades in milliseconds with our optimized infrastructure</p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="space-y-4">
            <Link href="/sign-up">
              <button className="group relative bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-4 px-8 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center space-x-2">
                <span>Start Your AI Investment Journey</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <p className="text-gray-400 text-sm">
              Join 50,000+ investors • No hidden fees • Start with $10
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 flex items-center justify-center space-x-8 opacity-60">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-gray-400">SEC Regulated</span>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-gray-400">FDIC Insured</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-gray-400">95% Success Rate</span>
            </div>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
          {/* Welcome Back Section */}
          <div className="mb-8 flex items-center space-x-3">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Welcome Back!</h1>
              <p className="text-emerald-300 text-sm font-medium">Ready to grow your wealth?</p>
            </div>
          </div>

          <div className="max-w-2xl mx-auto mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Your AI Investment
              <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent block">
                Dashboard Awaits
              </span>
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              Track your portfolio performance, discover new opportunities, and let our AI guide your investment decisions.
            </p>
          </div>

          {/* Dashboard Preview Cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Portfolio Value</h3>
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">$12,847.92</div>
              <div className="text-emerald-400 text-sm">+15.7% this month</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">AI Recommendations</h3>
                <Brain className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">7 New</div>
              <div className="text-purple-400 text-sm">High-confidence signals</div>
            </div>
          </div>

          {/* CTA Button */}
          <Link href="/dashboard/portfolio">
            <button className="group relative bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold py-4 px-8 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center space-x-2">
              <span>Open Your Dashboard</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </SignedIn>
    </div>
  )
}