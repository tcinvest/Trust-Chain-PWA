'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Brain, TrendingUp, ArrowRight, Bot, DollarSign, Zap, Shield, Target, Clock } from 'lucide-react';
import InstallButton from './InstallButton';

// Type definitions
interface DbBot {
  id: number;
  name: string;
  description: string | null;
  investment_range: string | null;
  capital_back: string | null;
  return_type: string | null;
  number_of_periods: string | null;
  profit_withdraw: string | null;
  holiday_note: string | null;
  is_active: boolean | null;
  days: number | null;
  return_percentage: number | null;
  min_invest: number | null;
  max_invest: number | null;
}

interface BotDisplay extends DbBot {
  minInvestmentFormatted: string;
  returnsFormatted: string;
}

export default function SignedInOnboarding() {
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
          minInvestmentFormatted: bot.min_invest !== null ? `$${Number(bot.min_invest).toLocaleString()} min` : 'N/A',
          returnsFormatted: bot.return_percentage !== null
            ? bot.days !== null
              ? `${Number(bot.return_percentage)}% in ${bot.days} Days`
              : `${Number(bot.return_percentage)}% for lifetime`
            : 'N/A',
        }));

        setBots(formatted);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load bots');
        console.error('Error fetching bots:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBots();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3 sm:mb-4"></div>
          <p className="text-gray-400 text-sm sm:text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || bots.length === 0) {
    return (

        <div className="text-center max-w-md">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-red-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Unable to Load Bots</h2>
          <p className="text-gray-400 text-sm sm:text-base mb-4 sm:mb-6">{error || 'No active bots available'}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-colors"
          >
            Retry
          </button>
        </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Animated Background - Optimized for mobile */}
      <div className="absolute inset-0 opacity-20 sm:opacity-30">
        <div className="absolute -top-40 -right-40 w-24 h-24 sm:w-32 sm:h-32 lg:w-48 lg:h-48 bg-amber-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-16 right-2 w-20 h-20 sm:w-24 sm:h-24 lg:w-36 lg:h-36 bg-yellow-600 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-8 left-4 w-22 h-22 sm:w-28 sm:h-28 lg:w-40 lg:h-40 bg-amber-700 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-16 right-6 w-18 h-18 sm:w-20 sm:h-20 lg:w-32 lg:h-32 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-3000"></div>
      </div>

      {/* Neon Grid Background - Reduced on mobile */}
      <div className="absolute inset-0 opacity-5 sm:opacity-10">
        <div className="h-full w-full bg-gradient-to-br from-transparent via-amber-500/20 to-transparent"></div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_24%,rgba(212,175,55,0.3)_25%,rgba(212,175,55,0.3)_26%,transparent_27%,transparent_74%,rgba(212,175,55,0.3)_75%,rgba(212,175,55,0.3)_76%,transparent_77%,transparent)] bg-[length:60px_60px] sm:bg-[length:100px_100px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24%,rgba(212,175,55,0.3)_25%,rgba(212,175,55,0.3)_26%,transparent_27%,transparent_74%,rgba(212,175,55,0.3)_75%,rgba(212,175,55,0.3)_76%,transparent_77%,transparent)] bg-[length:60px_60px] sm:bg-[length:100px_100px]"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-3 sm:px-4 py-6 sm:py-8 text-center">
        {/* Welcome Back Section */}
        <div className="mb-4 sm:mb-6 lg:mb-8 flex items-center space-x-2 sm:space-x-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center shadow-2xl shadow-amber-500/50">
            <Brain className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-black" />
          </div>
          <div className="text-left">
            <InstallButton />
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Welcome Back!</h1>
            <p className="text-amber-300 text-xs sm:text-sm lg:text-base font-medium">Ready to grow your wealth?</p>
          </div>
        </div>

        {/* Headline & Subtext */}
        <div className="max-w-2xl mx-auto mb-6 sm:mb-8 lg:mb-12 px-2">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-3 sm:mb-4 lg:mb-6 leading-tight">
            Your AI Investment
            <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent block drop-shadow-[0_0_20px_rgba(212,175,55,0.5)]">
              Dashboard Awaits
            </span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-300 leading-relaxed mb-4 sm:mb-6 lg:mb-8">
            Track your portfolio performance, discover new opportunities, and let our AI guide your investment decisions.
          </p>
        </div>

        {/* Dashboard Preview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 max-w-4xl mx-auto mb-6 sm:mb-8 lg:mb-12 w-full px-2">
          <div className="bg-gray-900/60 backdrop-blur-lg rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 border border-amber-500/20 shadow-2xl shadow-amber-500/10">
            <div className="flex items-center justify-between mb-2 sm:mb-3 lg:mb-4">
              <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-white">Portfolio Value</h3>
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            </div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">$12,847.92</div>
            <div className="text-amber-400 text-xs sm:text-sm">+15.7% this month</div>
          </div>

          <div className="bg-gray-900/60 backdrop-blur-lg rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 border border-amber-500/20 shadow-2xl shadow-amber-500/10">
            <div className="flex items-center justify-between mb-2 sm:mb-3 lg:mb-4">
              <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-white">AI Recommendations</h3>
              <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
            </div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">7 New</div>
            <div className="text-yellow-500 text-xs sm:text-sm">High-confidence signals</div>
          </div>

          <div className="bg-gray-900/60 backdrop-blur-lg rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 border border-amber-500/20 shadow-2xl shadow-amber-500/10 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between mb-2 sm:mb-3 lg:mb-4">
              <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-white">Active Bots</h3>
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
            </div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">{bots.filter(bot => bot.is_active).length} Running</div>
            <div className="text-amber-600 text-xs sm:text-sm">Generating returns</div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 max-w-3xl mx-auto mb-6 sm:mb-8 lg:mb-12 w-full px-2">
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4 border border-amber-500/20 text-center">
            <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-amber-400 mx-auto mb-1 sm:mb-2" />
            <div className="text-base sm:text-lg lg:text-xl font-bold text-white">{bots[0]?.minInvestmentFormatted || '$99'}</div>
            <div className="text-xs sm:text-sm text-gray-400">Min Investment</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4 border border-amber-500/20 text-center">
            <Target className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-amber-400 mx-auto mb-1 sm:mb-2" />
            <div className="text-base sm:text-lg lg:text-xl font-bold text-white">{bots[0]?.returnsFormatted || '10%'}</div>
            <div className="text-xs sm:text-sm text-gray-400">Expected ROI</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4 border border-amber-500/20 text-center">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-yellow-500 mx-auto mb-1 sm:mb-2" />
            <div className="text-base sm:text-lg lg:text-xl font-bold text-white">24/7</div>
            <div className="text-xs sm:text-sm text-gray-400">AI Trading</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4 border border-amber-500/20 text-center">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-amber-300 mx-auto mb-1 sm:mb-2" />
            <div className="text-base sm:text-lg lg:text-xl font-bold text-white">SEC</div>
            <div className="text-xs sm:text-sm text-gray-400">Regulated</div>
          </div>
        </div>

        {/* Available Bots Preview */}
        <div className="max-w-4xl mx-auto mb-6 sm:mb-8 lg:mb-12 w-full px-2">
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-3 sm:mb-4 lg:mb-6">Your Available AI Bots</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {bots.map((bot, index) => (
              <div
                key={bot.id}
                className={`bg-gray-900/60 backdrop-blur-lg rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-5 border border-amber-500/20 shadow-lg ${
                  index === 0 ? 'shadow-amber-500/20' : index === 1 ? 'shadow-yellow-500/20' : 'shadow-amber-700/20'
                } sm:col-span-${index === 2 && bots.length < 3 ? '2 lg:col-span-1' : '1'}`}
              >
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-lg flex items-center justify-center bg-gradient-to-br ${
                      index === 0
                        ? 'from-amber-400 to-yellow-500'
                        : index === 1
                        ? 'from-yellow-500 to-amber-600'
                        : 'from-amber-600 to-yellow-700'
                    }`}
                  >
                    <Bot className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-black" />
                  </div>
                  <span className={`text-xs sm:text-sm font-medium ${bot.is_active ? 'text-amber-400' : 'text-gray-500'}`}>
                    {bot.is_active ? 'ACTIVE' : 'AVAILABLE'}
                  </span>
                </div>
                <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-white mb-1">{bot.name}</h4>
                <p className="text-xs sm:text-sm text-gray-400 mb-2">{bot.description || 'AI Investment Bot'}</p>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className={`font-medium ${
                    index === 0 ? 'text-amber-400' : index === 1 ? 'text-yellow-500' : 'text-amber-600'
                  }`}>{bot.minInvestmentFormatted}</span>
                  <span className="text-amber-300">{bot.returnsFormatted}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <Link href="/dashboard" className="w-full max-w-xs sm:max-w-none sm:w-auto">
          <button className="group relative bg-gradient-to-r from-amber-400 to-yellow-600 hover:from-amber-500 hover:to-yellow-700 text-black font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg sm:rounded-xl lg:rounded-2xl text-sm sm:text-base lg:text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl shadow-amber-500/50 flex items-center justify-center space-x-2 w-full sm:w-auto">
            <span>Open Your Dashboard</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </Link>
      </div>
    </div>
  );
}
