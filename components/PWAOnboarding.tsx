// components/PWAOnboarding.tsx
'use client'

import { useRouter } from 'next/navigation'
import { SignedIn, SignedOut } from '@clerk/nextjs'
import Script from 'next/script'

export default function PWAOnboarding() {
  const router = useRouter()

  const handleGetStarted = () => {
    router.push('/sign-up')
  }

  const handleDashboard = () => {
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center px-6">
      {/* Smartsupp Live Chat Script */}
      <Script
        id="smartsupp-chat"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            var _smartsupp = _smartsupp || {};
            _smartsupp.key = 'bc2353ae9bf12c5f80748245026c8f47818a0af4';
            window.smartsupp = function(d) {
              var s,c,o=smartsupp=function(){ o._.push(arguments)};o._=[];
              s=d.getElementsByTagName('script')[0];c=d.createElement('script');
              c.type='text/javascript';c.charset='utf-8';c.async=true;
              c.src='https://www.smartsuppchat.com/loader.js?';s.parentNode.insertBefore(c,s);
            };
            window.smartsupp(document);
          `
        }}
      />

      {/* Animated background elements with neon blue */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 text-center max-w-md mx-auto">
        {/* Main Content */}
        <div className="mb-16">
          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Trust Chain
            <span className="block text-cyan-400 neon-glow">Invest AI</span>
          </h1>

          {/* Subtitle */}
          <p className="text-gray-300 text-lg leading-relaxed">
            Empowering your financial future with intelligent blockchain investments and AI-driven insights.
          </p>
        </div>

        {/* Geometric AI Visual Element */}
        <div className="mb-16 relative">
          <div className="relative mx-auto w-32 h-32">
            {/* AI Letters with 3D effect */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl font-black text-cyan-400 neon-glow transform rotate-12 perspective-3d">
                AI
              </span>
            </div>

            {/* Geometric shapes */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-cyan-400 rounded opacity-80 animate-pulse"></div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-400 rounded opacity-60 animate-pulse delay-300"></div>
            <div className="absolute top-1/2 -right-4 w-3 h-3 bg-cyan-300 rounded-full opacity-70 animate-pulse delay-700"></div>

            {/* Connecting lines */}
            <div className="absolute top-4 left-4 w-16 h-px bg-gradient-to-r from-cyan-400 to-transparent opacity-50"></div>
            <div className="absolute bottom-4 right-4 w-12 h-px bg-gradient-to-l from-blue-400 to-transparent opacity-50"></div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="space-y-4">
          <SignedOut>
            <button
              onClick={handleGetStarted}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/25 neon-button"
            >
              Get Started
            </button>
          </SignedOut>

          <SignedIn>
            <button
              onClick={handleDashboard}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/25 neon-button"
            >
              Dashboard
            </button>
          </SignedIn>
        </div>

        {/* Progress indicator */}
        <div className="mt-12 flex justify-center">
          <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
        </div>
      </div>

      {/* Custom styles */}
      <style jsx>{`
        .neon-glow {
          text-shadow: 
            0 0 5px #00bcd4,
            0 0 10px #00bcd4,
            0 0 15px #00bcd4,
            0 0 20px #00bcd4;
        }
        
        .neon-button {
          box-shadow: 
            0 0 20px rgba(0, 188, 212, 0.3),
            0 4px 15px rgba(0, 0, 0, 0.3);
        }
        
        .neon-button:hover {
          box-shadow: 
            0 0 30px rgba(0, 188, 212, 0.5),
            0 6px 20px rgba(0, 0, 0, 0.4);
        }
        
        .perspective-3d {
          transform: perspective(1000px) rotateX(15deg) rotateY(-15deg);
        }

        /* Smartsupp chat widget position override */
        :global(#smartsupp-widget-container),
        :global(.smartsupp-widget),
        :global([id*="smartsupp"]) {
          top: 20px !important;
          bottom: auto !important;
          right: 20px !important;
        }
      `}</style>

      {/* Fallback for users with JavaScript disabled */}
      <noscript>
        <div style={{position: 'fixed', top: '20px', right: '20px', zIndex: 9999}}>
          Powered by <a href="https://www.smartsupp.com" target="_blank" rel="noopener noreferrer">Smartsupp</a>
        </div>
      </noscript>
    </div>
  )
}