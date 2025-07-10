'use client';

import { Eye, EyeOff, ArrowUpDown } from 'lucide-react';
import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';

export default function DisplayBalance({
  totalBalance,
  profitBalance,
}: {
  totalBalance: number;
  profitBalance: number;
}) {
  const [showBalance, setShowBalance] = useState(true);
  const [showProfit, setShowProfit] = useState(false);

  const balanceToDisplay = showProfit ? profitBalance : totalBalance;

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[280px] px-6 py-8 bg-gradient-to-br from-slate-900 via-blue-900 to-black">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-gradient-to-br from-blue-400/25 to-white/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-20 h-20 bg-gradient-to-br from-white/15 to-cyan-300/15 rounded-full blur-xl animate-pulse delay-500"></div>
        <div className="absolute bottom-1/3 left-1/3 w-16 h-16 bg-gradient-to-br from-blue-300/20 to-slate-200/10 rounded-full blur-xl animate-pulse delay-1500"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center space-y-8">
        {/* Balance and buttons section */}
        <div className="flex items-center justify-between w-full max-w-lg">
          {/* Balance section */}
          <div className="flex-1">
            {/* Balance type indicator */}
            <div className="mb-3">
              <div className="inline-flex items-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-sm"></div>
                  <div className="relative px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-cyan-400/30">
                    <span className="text-xs font-semibold bg-gradient-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent">
                      {showProfit ? 'Profit Balance' : 'Main Balance'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Balance amount */}
            <div className="text-left">
              <div className="relative">
                <h1 className="text-4xl md:text-5xl font-thin tracking-tighter bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent">
                  {showBalance ? formatCurrency(balanceToDisplay) : '••••••••'}
                </h1>
                {showBalance && (
                  <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-cyan-400/70 to-transparent rounded-full"></div>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons - Right side */}
          <div className="flex flex-col gap-2 ml-6">
            <button
              onClick={() => setShowProfit(prev => !prev)}
              className="group relative overflow-hidden px-3 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-400/30 hover:to-blue-400/30 border border-cyan-400/40 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-400/20 group-hover:to-blue-400/20 transition-all duration-300"></div>
              <div className="relative flex items-center gap-2">
                <ArrowUpDown
                  size={14}
                  className="text-cyan-300 group-hover:rotate-180 transition-transform duration-300"
                />
                <span className="text-xs font-medium text-cyan-200">
                  {showProfit ? 'Main' : 'Profit'}
                </span>
              </div>
            </button>

            <button
              onClick={() => setShowBalance(prev => !prev)}
              className="group relative overflow-hidden px-3 py-2 bg-gradient-to-r from-slate-600/30 to-white/10 hover:from-slate-500/40 hover:to-white/20 border border-white/30 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-slate-600/0 to-white/0 group-hover:from-slate-500/20 group-hover:to-white/10 transition-all duration-300"></div>
              <div className="relative flex items-center gap-2">
                {showBalance ? (
                  <EyeOff
                    size={14}
                    className="text-white group-hover:scale-110 transition-transform duration-200"
                  />
                ) : (
                  <Eye
                    size={14}
                    className="text-white group-hover:scale-110 transition-transform duration-200"
                  />
                )}
                <span className="text-xs font-medium text-white">
                  {showBalance ? 'Hide' : 'Show'}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}