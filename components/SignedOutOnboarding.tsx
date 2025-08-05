'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Script from 'next/script';
import Link from 'next/link';
import { Brain, TrendingUp, Shield, DollarSign, Bot, Download, Play, CheckCircle, Lock, Lightbulb } from 'lucide-react';
import ReferralRecoverySection from './ReferralRecoverySection';
import InstallButton from './InstallButton';

export default function TrustChainLanding() {
  const [activeBot, setActiveBot] = useState('genius');

  const bots = {
    genius: {
      name: 'GeniusInvestAiBot',
      tagline: 'Smart Investment Made Simple',
      minInvestment: '$99',
      returns: '10% Monthly',
      period: 'Monthly',
      color: 'from-cyan-400 to-blue-500',
      description: 'An advanced AI-powered investment solution designed to generate steady, reliable returns. Built on cutting-edge financial algorithms and real-time data analysis.',
      features: [
        'Affordable starting point – Just $99 per bot',
        'AI-driven insights for smarter, faster decisions',
        '10% monthly return – consistently and passively',
        'Backed by TrustChainInvestAI\'s commitment to integrity'
      ]
    },
    alpha: {
      name: 'AlphaInvestAIBot',
      tagline: 'Lightspeed Elite Trading',
      minInvestment: '$9,999',
      returns: '30% in 60 Days',
      period: '60 Days',
      color: 'from-blue-400 to-indigo-500',
      description: 'Operates at lightspeed, executing high-frequency strategies across dynamic markets with split-second precision. Built on next-generation AI architecture.',
      features: [
        'Operates at Lightspeed – Real-time trading execution',
        '30% ROI in 60 Days – High-yield, time-bound model',
        'AI-Powered Smart Decisions – Data-driven action',
        'Elite Investment Tool – For serious wealth builders'
      ]
    },
    chain: {
      name: 'ChainMasterBot',
      tagline: 'High-Growth + Fund Recovery',
      minInvestment: '$999',
      returns: '40% in 90 Days',
      period: '90 Days',
      color: 'from-blue-500 to-purple-500',
      description: 'Next-generation AI-powered investment solution backed by TRM Labs, designed to deliver outstanding returns with built-in fund recovery program.',
      features: [
        '40% ROI in 90 Days guaranteed',
        'Fund Recovery Program – Recover up to 100% of past losses',
        'Backed by TRM Labs for top-tier security',
        'Up to 70% Total ROI in 90 Days'
      ]
    }
  };

  const currentBot = bots[activeBot as keyof typeof bots];

  return (
    <div className="relative min-h-screen bg-black">
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

      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-4 w-32 h-32 sm:w-48 sm:h-48 lg:w-72 lg:h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-20 right-4 w-24 h-24 sm:w-36 sm:h-36 lg:w-48 lg:h-48 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-10 left-6 w-28 h-28 sm:w-40 sm:h-40 lg:w-56 lg:h-56 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-8 w-20 h-20 sm:w-32 sm:h-32 lg:w-44 lg:h-44 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-3000"></div>
      </div>

      {/* Neon Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full bg-gradient-to-br from-transparent via-blue-500/20 to-transparent"></div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_24%,rgba(59,130,246,0.3)_25%,rgba(59,130,246,0.3)_26%,transparent_27%,transparent_74%,rgba(59,130,246,0.3)_75%,rgba(59,130,246,0.3)_76%,transparent_77%,transparent)] bg-[length:100px_100px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24%,rgba(59,130,246,0.3)_25%,rgba(59,130,246,0.3)_26%,transparent_27%,transparent_74%,rgba(59,130,246,0.3)_75%,rgba(59,130,246,0.3)_76%,transparent_77%,transparent)] bg-[length:100px_100px]"></div>
      </div>

      <div className="relative z-10 px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/50">
                <Brain className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-6 h-6 sm:w-8 sm:h-8 bg-cyan-400 rounded-full flex items-center justify-center shadow-lg shadow-cyan-400/50">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-black" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">TrustChain</h1>
              <p className="text-cyan-300 text-sm sm:text-base lg:text-lg font-medium">InvestAI</p>
            </div>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            AI-Powered
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent block">
              Investment
            </span>
            <span className="text-blue-400 drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]">Revolution</span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto mb-8 sm:mb-12">
            Choose your AI investment strategy. From accessible wealth building to elite trading and fund recovery—powered by cutting-edge artificial intelligence.
          </p>
          
          {/* Get Started Button */}
          <div className="mb-8 sm:mb-12 flex justify-center">
            <Link href="/sign-up">
              <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 shadow-lg shadow-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/70 transform hover:scale-105 text-lg sm:text-xl">
                Get Started Now
              </button>
            </Link>
          </div>

          {/* Hero Image Section */}
          <div className="relative max-w-5xl mx-auto mb-12 sm:mb-16">
            <InstallButton />
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-cyan-500/20 shadow-2xl shadow-cyan-500/20">
              <Image 
                src="/Trustchain.png"
                alt="Three AI robots representing TrustChain's investment bots"
                width={1200}
                height={600}
                className="w-full h-64 sm:h-80 lg:h-96 object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  <div className="text-center p-2 sm:p-3 bg-black/50 backdrop-blur-lg rounded-lg border border-cyan-500/30">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg mx-auto mb-1 sm:mb-2 flex items-center justify-center">
                      <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <p className="text-xs sm:text-sm text-cyan-300 font-medium">AlphaInvestAI</p>
                    <p className="text-xs text-gray-400">$9,999 Elite</p>
                  </div>
                  <div className="text-center p-2 sm:p-3 bg-black/50 backdrop-blur-lg rounded-lg border border-blue-500/30">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg mx-auto mb-1 sm:mb-2 flex items-center justify-center">
                      <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <p className="text-xs sm:text-sm text-blue-300 font-medium">ChainMaster</p>
                    <p className="text-xs text-gray-400">$999 Recovery</p>
                  </div>
                  <div className="text-center p-2 sm:p-3 bg-black/50 backdrop-blur-lg rounded-lg border border-purple-500/30">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg mx-auto mb-1 sm:mb-2 flex items-center justify-center">
                      <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <p className="text-xs sm:text-sm text-purple-300 font-medium">GeniusInvestAI</p>
                    <p className="text-xs text-gray-400">$99 Start</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bot Selection */}
        <div className="max-w-6xl mx-auto mb-12 sm:mb-16">
          <div className="flex flex-col gap-6 sm:gap-8 mb-8 sm:mb-12">
            {/* Bot Selector */}
            <div className="w-full">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 text-center">Choose Your AI Bot</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
                {Object.entries(bots).map(([key, bot]) => (
                  <button
                    key={key}
                    onClick={() => setActiveBot(key)}
                    className={`text-left p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 ${
                      activeBot === key
                        ? 'border-cyan-400 bg-cyan-500/20 backdrop-blur-lg shadow-lg shadow-cyan-400/30'
                        : 'border-gray-700 bg-gray-900/50 backdrop-blur-lg hover:border-cyan-400/50 hover:bg-cyan-500/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-base sm:text-lg lg:text-xl font-semibold text-white leading-tight">{bot.name}</h4>
                      <div className={`w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br ${bot.color} rounded-lg flex items-center justify-center shadow-lg`}>
                        <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                    </div>
                    <p className="text-cyan-300 text-xs sm:text-sm mb-3">{bot.tagline}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-cyan-400 font-bold text-sm sm:text-base">{bot.minInvestment}</span>
                      <span className="text-blue-400 font-bold text-sm sm:text-base">{bot.returns}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Bot Details */}
            <div className="w-full">
              <div className="bg-gray-900/60 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-700 shadow-2xl shadow-blue-500/10">
                <div className="flex items-center space-x-3 sm:space-x-4 mb-6">
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${currentBot.color} rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg`}>
                    <Bot className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight">{currentBot.name}</h3>
                    <p className="text-cyan-300 text-sm sm:text-base lg:text-lg">{currentBot.tagline}</p>
                  </div>
                </div>

                <p className="text-gray-300 text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 leading-relaxed">
                  {currentBot.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                  <div className="text-center p-4 bg-gray-800/50 rounded-xl sm:rounded-2xl border border-gray-700">
                    <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400 mx-auto mb-2" />
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{currentBot.minInvestment}</div>
                    <div className="text-xs sm:text-sm text-gray-400">Minimum Investment</div>
                  </div>
                  <div className="text-center p-4 bg-gray-800/50 rounded-xl sm:rounded-2xl border border-gray-700">
                    <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{currentBot.returns}</div>
                    <div className="text-xs sm:text-sm text-gray-400">Expected Returns</div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-6 sm:mb-8">
                  {currentBot.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300 text-sm sm:text-base">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Get Started Button for Selected Bot */}
                <div className="text-center">
                  <Link href="/sign-up">
                    <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/70 transform hover:scale-105">
                      Start with {currentBot.name}
                    </button>
                  </Link>
                </div>
               
              </div>
            </div>
          </div>
        </div>

        {/* Tutorial Video Section */}
        <div className="max-w-4xl mx-auto mb-12 sm:mb-16">
          <div className="bg-gray-900/60 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-700 shadow-2xl shadow-blue-500/10">
            <div className="text-center mb-6 sm:mb-8">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-red-400 to-pink-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-500/50">
                <Play className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">Watch Our Tutorial</h3>
              <p className="text-gray-300 text-sm sm:text-base lg:text-lg">Learn how to maximize your AI investment strategy with our comprehensive guide</p>
            </div>
            
            <div className="space-y-6">
              {/* Main Large Video */}
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-gray-700">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/fFKcpmBDKVM?controls=1&modestbranding=1&rel=0"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              {/* Smaller Video Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <iframe
                  className="w-full aspect-video rounded-lg border border-gray-700"
                  src="https://www.youtube.com/embed/OHP86kxF3xY?controls=1&modestbranding=1&rel=0"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
                <iframe
                  className="w-full aspect-video rounded-lg border border-gray-700"
                  src="https://www.youtube.com/embed/JbcfSXZ8H3Q?controls=1&modestbranding=1&rel=0"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
                <iframe
                  className="w-full aspect-video rounded-lg border border-gray-700"
                  src="https://www.youtube.com/embed/XRK4CvRVIcs?controls=1&modestbranding=1&rel=0"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </div>



          </div>
        </div>

        {/* PDF Download Section */}
        <div className="max-w-4xl mx-auto mb-12 sm:mb-16">
          <div className="bg-gray-900/60 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-700 shadow-2xl shadow-blue-500/10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start space-x-3 sm:space-x-4 mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/50">
                    <Download className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white">Investment Guide</h3>
                    <p className="text-gray-300 text-sm sm:text-base">Complete AI Investment Strategy PDF</p>
                  </div>
                </div>
                <p className="text-gray-400 text-sm max-w-sm">
                  Download our comprehensive guide covering all three AI bots, investment strategies, and risk management.
                </p>
              </div>
              <a
                href="/api/download-guide"
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-500/50 flex items-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>Download PDF</span>
              </a>
            </div>
          </div>
        </div>

        {/* Section: Referral Recovery */}
        <ReferralRecoverySection />

        {/* Trust Indicators */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
            <div className="text-center p-4 sm:p-6 bg-gray-900/50 backdrop-blur-lg rounded-xl sm:rounded-2xl border border-gray-700">
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400 mx-auto mb-2 sm:mb-3" />
              <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-white mb-1 sm:mb-2">SEC Regulated</h4>
              <p className="text-xs sm:text-sm text-gray-400">Fully compliant with financial regulations</p>
            </div>
            <div className="text-center p-4 sm:p-6 bg-gray-900/50 backdrop-blur-lg rounded-xl sm:rounded-2xl border border-gray-700">
              <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400 mx-auto mb-2 sm:mb-3" />
              <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-white mb-1 sm:mb-2">TRM Labs Backed</h4>
              <p className="text-xs sm:text-sm text-gray-400">Blockchain intelligence & compliance</p>
            </div>
            <div className="text-center p-4 sm:p-6 bg-gray-900/50 backdrop-blur-lg rounded-xl sm:rounded-2xl border border-gray-700">
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400 mx-auto mb-2 sm:mb-3" />
              <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-white mb-1 sm:mb-2">Proven Results</h4>
              <p className="text-xs sm:text-sm text-gray-400">50,000+ satisfied investors</p>
            </div>
            <div className="text-center p-4 sm:p-6 bg-gray-900/50 backdrop-blur-lg rounded-xl sm:rounded-2xl border border-gray-700">
              <Lightbulb className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400 mx-auto mb-2 sm:mb-3" />
              <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-white mb-1 sm:mb-2">AI Innovation</h4>
              <p className="text-xs sm:text-sm text-gray-400">Cutting-edge investment technology</p>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Get Started Button */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <Link href="/sign-up">
          <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-lg shadow-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/70 transform hover:scale-105 flex items-center space-x-2">
            <span>Get Started</span>
          </button>
        </Link>
      </div>

      {/* Fallback for users with JavaScript disabled */}
      <noscript>
        <div style={{position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999}}>
          Powered by <a href="https://www.smartsupp.com" target="_blank" rel="noopener noreferrer">Smartsupp</a>
        </div>
      </noscript>
    </div>
  );
}