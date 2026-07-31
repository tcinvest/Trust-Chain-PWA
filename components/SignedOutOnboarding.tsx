'use client';

import React, { useState, useEffect } from 'react';
import Script from 'next/script';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Brain,
  TrendingUp,
  Shield,
  DollarSign,
  Bot,
  Play,
  CheckCircle,
  Lock,
  Lightbulb,
  Sparkles,
  ArrowRight,
  Gem,
  Infinity as InfinityIcon,
} from 'lucide-react';
import InstallButton from './InstallButton';
import Navbar from './NavBar';
import Image from "next/image"
import InfoGrid from './InfoGrid';
import SecurityBar from './SecurityBar';

interface DbBot {
  id: number;
  name: string;
  tagline: string | null;
  min_invest: number;
  max_invest: number | null;
  return_percentage: number;
  days: number | null;
  description: string | null;
  features: string[] | null;
  capital_back: string | null;
  color: string | null;
  is_active: boolean;
}

interface BotDisplay extends DbBot {
  minInvestmentFormatted: string;
  maxInvestmentFormatted: string | null;
  returnsFormatted: string;
  periodFormatted: string;
}

const TIER_STYLES = [
  {
    icon: Brain,
    border: 'border-gray-500/40 hover:border-gray-400',
    iconBg: 'from-gray-300 to-gray-500',
    iconRing: 'ring-gray-400/30',
    label: 'text-gray-300',
    button: 'bg-gray-700 hover:bg-gray-600 text-white',
    cardBg: 'bg-gray-900/60',
  },
  {
    icon: InfinityIcon,
    border: 'border-blue-500/40 hover:border-blue-400',
    iconBg: 'from-blue-400 to-blue-600',
    iconRing: 'ring-blue-400/30',
    label: 'text-blue-300',
    button: 'bg-blue-700 hover:bg-blue-600 text-white',
    cardBg: 'bg-blue-950/40',
  },
  {
    icon: TrendingUp,
    border: 'border-amber-500/40 hover:border-amber-400',
    iconBg: 'from-amber-400 to-yellow-600',
    iconRing: 'ring-amber-400/30',
    label: 'text-amber-300',
    button: 'bg-gradient-to-r from-amber-400 to-yellow-600 hover:from-amber-500 hover:to-yellow-700 text-black',
    cardBg: 'bg-gray-900/60',
  },
  {
    icon: Gem,
    border: 'border-amber-400/60 hover:border-amber-300',
    iconBg: 'from-amber-300 to-yellow-500',
    iconRing: 'ring-amber-300/40',
    label: 'text-amber-200',
    button: 'bg-gradient-to-r from-amber-400 to-yellow-600 hover:from-amber-500 hover:to-yellow-700 text-black',
    cardBg: 'bg-gradient-to-b from-amber-950/40 to-gray-900/60',
    premium: true,
  },
];

export default function TrustChainLanding() {
  const router = useRouter();
  const [activeBot, setActiveBot] = useState<number | null>(null);
  const [bots, setBots] = useState<BotDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBots = async () => {
      try {
        const res = await fetch('/api/bots');
        if (!res.ok) throw new Error('Failed to fetch bots');
        const data: DbBot[] = await res.json();

        const formatted = data.map(bot => ({
          ...bot,
          minInvestmentFormatted: bot.min_invest !== null ? `$${Number(bot.min_invest).toLocaleString()}` : 'N/A',
          maxInvestmentFormatted: bot.max_invest !== null ? `$${Number(bot.max_invest).toLocaleString()}` : 'N/A',
          returnsFormatted: bot.return_percentage !== null
            ? bot.days !== null
              ? `${Number(bot.return_percentage)}% in ${bot.days} Days`
              : `${Number(bot.return_percentage)}% for life`
            : 'N/A',
          periodFormatted: bot.days !== null ? `${bot.days} Days` : 'Life'
        }));

        setBots(formatted);
        if (formatted.length > 0) {
          setActiveBot(formatted[0].id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load bots');
        console.error('Error fetching bots:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBots();
  }, []);

  const currentBot = bots.find(b => b.id === activeBot);
  const defaultColor = 'from-amber-400 to-yellow-600';

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || bots.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Unable to Load Bots</h2>
          <p className="text-gray-400 mb-6">{error || 'No active bots available'}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-amber-500 hover:bg-amber-600 text-black px-6 py-3 rounded-lg transition-colors font-semibold"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black">
      <Navbar />

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
        <div className="absolute top-10 left-4 w-32 h-32 sm:w-48 sm:h-48 lg:w-72 lg:h-72 bg-amber-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-20 right-4 w-24 h-24 sm:w-36 sm:h-36 lg:w-48 lg:h-48 bg-yellow-600 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 left-6 w-28 h-28 sm:w-40 sm:h-40 lg:w-56 lg:h-56 bg-amber-700 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-8 w-20 h-20 sm:w-32 sm:h-32 lg:w-44 lg:h-44 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
      </div>

      {/* Neon Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full bg-gradient-to-br from-transparent via-amber-500/20 to-transparent"></div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_24%,rgba(212,175,55,0.3)_25%,rgba(212,175,55,0.3)_26%,transparent_27%,transparent_74%,rgba(212,175,55,0.3)_75%,rgba(212,175,55,0.3)_76%,transparent_77%,transparent)] bg-[length:100px_100px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24%,rgba(212,175,55,0.3)_25%,rgba(212,175,55,0.3)_26%,transparent_27%,transparent_74%,rgba(212,175,55,0.3)_75%,rgba(212,175,55,0.3)_76%,transparent_77%,transparent)] bg-[length:100px_100px]"></div>
      </div>

      <div className="relative z-10 px-4 py-8 sm:py-12">

        {/* ============ HERO ============ */}
        <div className="max-w-7xl mx-auto mb-16 sm:mb-24">
          <div className="flex justify-end mb-4">
            <InstallButton />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left column — copy */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 mb-6">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-300 text-xs sm:text-sm font-medium tracking-wide">SMART INVESTMENTS. REAL GROWTH.</span>
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Build Wealth.
                <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent block">
                  Secure Your Future.
                </span>
              </h2>

              <p className="text-base sm:text-lg text-gray-300 leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
                TrustChain InvestAI is an innovative investment platform that combines AI-powered strategies, blockchain security, and real-world assets to help you grow your wealth consistently and securely.
              </p>

              <div className="flex flex-col sm:flex-row items-center lg:items-start gap-3 sm:gap-4 mb-10 justify-center lg:justify-start">
                <Link href="/sign-up" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto group bg-gradient-to-r from-amber-400 to-yellow-600 hover:from-amber-500 hover:to-yellow-700 text-black font-bold py-4 px-8 rounded-full transition-all duration-300 shadow-lg shadow-amber-500/50 hover:shadow-xl hover:shadow-amber-500/70 transform hover:scale-105 text-base sm:text-lg flex items-center justify-center gap-2">
                    Get Started Now
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <a href="#plans" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto flex items-center justify-center gap-2 py-4 px-8 rounded-full border border-amber-500/30 text-amber-300 hover:bg-amber-500/10 transition-all duration-300 font-semibold text-base sm:text-lg">
                    Learn More
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </a>
              </div>

              {/* Trust strip */}
              <div className="flex items-center justify-center lg:justify-start gap-6 sm:gap-8 flex-wrap">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-amber-400" />
                  <span className="text-gray-300 text-xs sm:text-sm">Bank-Level Security</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-amber-400" />
                  <span className="text-gray-300 text-xs sm:text-sm">AI-Powered Platform</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-amber-400" />
                  <span className="text-gray-300 text-xs sm:text-sm">Trusted by Global Investors</span>
                </div>
              </div>
            </div>

            {/* Card Image Container */}
            <div className="relative flex justify-center lg:justify-end">
              {/* Ambient background glows */}
              <div className="absolute -top-6 -right-6 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-yellow-600/20 rounded-full blur-3xl" />

              {/* Card image wrapper */}
              <div className="relative w-full max-w-md aspect-[1.586/1] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl shadow-amber-500/30 border border-amber-500/30">
                <Image
                  src="/cardimage001.png"
                  alt="Trust Chain Card"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 448px"
                />
              </div>
            </div>
          </div>
        </div>
        {/* ============ END HERO ============ */}

        {/* Referral Commission Note */}
        <div className="max-w-6xl mx-auto text-center mb-6 sm:mb-8">
          <p className="text-amber-300 text-2xl italic">
            10% commission for Direct Referrals
          </p>
        </div>

        {/* Stats Bar */}
        <div className="max-w-6xl mx-auto mb-16 sm:mb-24">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 sm:gap-6 bg-gray-900/60 backdrop-blur-lg rounded-2xl border border-amber-500/20 p-6 sm:p-8">
            <div className="text-center">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1">$48M+</div>
              <div className="text-gray-400 text-xs sm:text-sm">Total Invested</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1">28,450+</div>
              <div className="text-gray-400 text-xs sm:text-sm">Active Investors</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1">7.3M+</div>
              <div className="text-gray-400 text-xs sm:text-sm">Total Paid Out</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1">120+</div>
              <div className="text-gray-400 text-xs sm:text-sm">Countries Served</div>
            </div>
            <div className="text-center col-span-2 sm:col-span-1">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1">100%</div>
              <div className="text-gray-400 text-xs sm:text-sm">Secure & Compliant</div>
            </div>
          </div>
        </div>

        {/* Bot Selection — Tiered Investment Solutions */}
        <div id="plans" className="max-w-7xl mx-auto mb-12 sm:mb-16">
          <div className="flex flex-col gap-6 sm:gap-8 mb-8 sm:mb-12">
            <div className="w-full">
              <div className="text-center mb-8 sm:mb-10">
                <div className="inline-flex items-center gap-2 mb-3">
                  <span className="h-px w-8 bg-amber-500/50"></span>
                  <span className="text-amber-400 text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase">Our Investment Solutions</span>
                  <span className="h-px w-8 bg-amber-500/50"></span>
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Tailored Solutions for Every Investor</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {bots.map((bot, index) => {
                  const tier = TIER_STYLES[index % TIER_STYLES.length];
                  const TierIcon = tier.icon;
                  const isSelected = activeBot === bot.id;

                  return (
                    <button
                      key={bot.id}
                      onClick={() => setActiveBot(bot.id)}
                      className={`relative text-left rounded-2xl border-2 p-5 sm:p-6 transition-all duration-300 flex flex-col ${tier.cardBg} ${
                        isSelected ? tier.border.split(' ')[1].replace('hover:', '') : 'border-gray-700'
                      } ${tier.border}`}
                    >
                      {tier.premium && (
                        <span className="absolute top-0 right-0 bg-gradient-to-r from-amber-400 to-yellow-600 text-black text-[10px] sm:text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl tracking-wide">
                          PREMIUM
                        </span>
                      )}

                      <div className="flex flex-col items-center text-center mb-4">
                        <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br ${tier.iconBg} ring-4 ${tier.iconRing} flex items-center justify-center mb-3`}>
                          <TierIcon className="w-6 h-6 sm:w-7 sm:h-7 text-black" />
                        </div>
                        <h4 className="text-white font-bold text-sm sm:text-base tracking-wide uppercase">{bot.name}</h4>
                        <p className={`${tier.label} text-xs sm:text-sm mt-1`}>{bot.tagline || 'AI Investment Bot'}</p>
                      </div>

                      <div className="text-center mb-4 pb-4 border-b border-gray-700/60">
                        <p className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-wide mb-1">Investment Range</p>
                        <p className="text-white font-bold text-base sm:text-lg">
                          {bot.minInvestmentFormatted} – {bot.maxInvestmentFormatted}
                        </p>
                      </div>

                      <div className="space-y-2 sm:space-y-2.5 mb-5 flex-1">
                        {(bot.features && bot.features.length > 0
                          ? bot.features.slice(0, 5)
                          : ['AI-driven investment technology', 'Real-time performance dashboard', 'Secure account management']
                        ).map((feature, fIdx) => (
                          <div key={fIdx} className="flex items-start gap-2">
                            <CheckCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${tier.label}`} />
                            <span className="text-gray-300 text-xs sm:text-sm leading-snug">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push('/contact');
                        }}
                        className={`w-full text-center font-semibold text-sm py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${tier.button}`}
                      >
                        Contact an Advisor
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bot Details */}
            {currentBot && (
              <div className="w-full">
                <div className="bg-gray-900/60 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-amber-500/20 shadow-2xl shadow-amber-500/10">
                  <div className="flex items-center space-x-3 sm:space-x-4 mb-6">
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${currentBot.color || defaultColor} rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg`}>
                      <Bot className="w-6 h-6 sm:w-8 sm:h-8 text-black" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight">{currentBot.name}</h3>
                      <p className="text-amber-300 text-sm sm:text-base lg:text-lg">{currentBot.tagline || 'AI Investment Bot'}</p>
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 leading-relaxed">
                    {currentBot.description || 'Advanced AI-powered investment solution designed to generate reliable returns.'}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    <div className="text-center p-4 bg-gray-800/50 rounded-xl sm:rounded-2xl border border-amber-500/20">
                      <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400 mx-auto mb-2" />
                      <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{currentBot.minInvestmentFormatted}</div>
                      <div className="text-xs sm:text-sm text-gray-400">Minimum Investment</div>
                      {currentBot.maxInvestmentFormatted && (
                        <div className="text-xs text-amber-400 mt-1">Max: {currentBot.maxInvestmentFormatted}</div>
                      )}
                    </div>
                    <div className="text-center p-4 bg-gray-800/50 rounded-xl sm:rounded-2xl border border-amber-500/20">
                      <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500 mx-auto mb-2" />
                      <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{currentBot.returnsFormatted}</div>
                      <div className="text-xs sm:text-sm text-gray-400">Expected Returns</div>
                    </div>
                    <div className="text-center p-4 bg-gray-800/50 rounded-xl sm:rounded-2xl border border-amber-500/20">
                      <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-amber-300 mx-auto mb-2" />
                      <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{currentBot.capital_back || 'Yes'}</div>
                      <div className="text-xs sm:text-sm text-gray-400">Capital Back</div>
                    </div>
                  </div>

                  {/* Features */}
                  {currentBot.features && currentBot.features.length > 0 && (
                    <div className="space-y-3 mb-6 sm:mb-8">
                      {currentBot.features.map((feature, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300 text-sm sm:text-base">{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="text-center">
                    <Link href="/sign-up">
                      <button className="bg-gradient-to-r from-amber-400 to-yellow-600 hover:from-amber-500 hover:to-yellow-700 text-black font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/50 hover:shadow-xl hover:shadow-amber-500/70 transform hover:scale-105">
                        Start with {currentBot.name}
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tutorial Videos */}
        <div id="how-it-works" className="max-w-4xl mx-auto mb-12 sm:mb-16">
          <div className="bg-gray-900/60 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-amber-500/20 shadow-2xl shadow-amber-500/10">
            <div className="text-center mb-6 sm:mb-8">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-500 to-yellow-700 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/50">
                <Play className="w-6 h-6 sm:w-8 sm:h-8 text-black" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">Watch Our Tutorial</h3>
              <p className="text-gray-300 text-sm sm:text-base lg:text-lg">Learn how to maximize your AI investment strategy</p>
            </div>

            <div className="space-y-6">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-amber-500/20">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/fFKcpmBDKVM?controls=1&modestbranding=1&rel=0"
                  title="Tutorial Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {['OHP86kxF3xY', 'JbcfSXZ8H3Q'].map((videoId) => (
                  <iframe
                    key={videoId}
                    className="w-full aspect-video rounded-lg border border-amber-500/20"
                    src={`https://www.youtube.com/embed/${videoId}?controls=1&modestbranding=1&rel=0`}
                    title="Tutorial Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div id="security" className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
            {[
              { icon: Shield, title: 'SEC Regulated', desc: 'Fully compliant with financial regulations' },
              { icon: Lock, title: 'TRM Labs Backed', desc: 'Blockchain intelligence & compliance' },
              { icon: TrendingUp, title: 'Proven Results', desc: '50,000+ satisfied investors' },
              { icon: Lightbulb, title: 'AI Innovation', desc: 'Cutting-edge investment technology' }
            ].map((item, idx) => (
              <div key={idx} className="text-center p-4 sm:p-6 bg-gray-900/50 backdrop-blur-lg rounded-xl sm:rounded-2xl border border-amber-500/20">
                <item.icon className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400 mx-auto mb-2 sm:mb-3" />
                <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-white mb-1 sm:mb-2">{item.title}</h4>
                <p className="text-xs sm:text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

           <InfoGrid />
      <SecurityBar />
      </div>

      <noscript>
        <div style={{position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999}}>
          Powered by <a href="https://www.smartsupp.com" target="_blank" rel="noopener noreferrer">Smartsupp</a>
        </div>
      </noscript>
    </div>
  );
}
