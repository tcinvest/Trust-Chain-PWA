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
    <div className="relative flex flex-col w-full max-w-md mx-auto aspect-[1.6/1] p-6 bg-gradient-to-br from-white via-slate-50 to-cyan-100 rounded-2xl shadow-2xl transform transition-all duration-300">
      {/* Credit card floating shadow effects */}
      <div className="absolute -inset-1 bg-gradient-to-br from-cyan-400/50 via-blue-500/50 to-white/50 rounded-2xl blur-xl opacity-75"></div>
      <div className="absolute -inset-2 bg-gradient-to-br from-cyan-500/30 via-blue-600/30 to-white/30 rounded-2xl blur-2xl opacity-50 "></div>
      
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-cyan-300/30 to-blue-400/30 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-gradient-to-br from-blue-300/35 to-white/35 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-20 h-20 bg-gradient-to-br from-white/40 to-cyan-300/25 rounded-full blur-xl animate-pulse delay-500"></div>
        <div className="absolute bottom-1/3 left-1/3 w-16 h-16 bg-gradient-to-br from-cyan-200/30 to-blue-200/20 rounded-full blur-xl animate-pulse delay-1500"></div>
      </div>

      {/* Switch button - Top right */}
      <div className="relative z-10 flex justify-end mb-4">
        <button
          onClick={() => setShowProfit(prev => !prev)}
          className="group relative overflow-hidden px-3 py-2 bg-gradient-to-r from-white/40 to-cyan-200/30 hover:from-white/50 hover:to-cyan-100/40 border border-cyan-400/50 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-cyan-200/0 group-hover:from-white/20 group-hover:to-cyan-100/30 transition-all duration-300"></div>
          <div className="relative flex items-center gap-2">
            <ArrowUpDown
              size={14}
              className="text-cyan-700 group-hover:rotate-180 transition-transform duration-300"
            />
            <span className="text-xs font-medium text-cyan-800">
              {showProfit ? 'Main' : 'Profit'}
            </span>
          </div>
        </button>
      </div>

      {/* Balance section - Top left */}
      <div className="relative z-10 flex-1">
        {/* Wallet name on top */}
        <div className="mb-4">
          <div className="inline-flex items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/40 to-blue-400/30 rounded-full blur-sm"></div>
              <div className="relative px-4 py-2 bg-white/60 backdrop-blur-md rounded-full border border-cyan-400/40">
                <span className="text-sm font-semibold bg-gradient-to-r from-cyan-700 to-blue-700 bg-clip-text text-transparent">
                  {showProfit ? 'Profit Balance' : 'Main Balance'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Balance amount - Larger size */}
        <div className="mb-6">
          <div className="relative">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-thin tracking-tighter bg-gradient-to-r from-slate-800 via-cyan-700 to-blue-700 bg-clip-text text-transparent drop-shadow-lg">
              {showBalance ? formatCurrency(balanceToDisplay) : '••••••••'}
            </h1>
            {showBalance && (
              <div className="absolute -bottom-3 left-0 w-16 h-0.5 bg-gradient-to-r from-cyan-500/70 to-transparent rounded-full"></div>
            )}
          </div>
        </div>

        {/* Show/Hide button below balance */}
        <div>
          <button
            onClick={() => setShowBalance(prev => !prev)}
            className="group relative overflow-hidden px-4 py-2 bg-gradient-to-r from-white/50 to-cyan-100/40 hover:from-white/60 hover:to-cyan-50/50 border border-cyan-400/50 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-cyan-100/0 group-hover:from-white/20 group-hover:to-cyan-50/30 transition-all duration-300"></div>
            <div className="relative flex items-center gap-2">
              {showBalance ? (
                <EyeOff
                  size={16}
                  className="text-cyan-700 group-hover:scale-110 transition-transform duration-200"
                />
              ) : (
                <Eye
                  size={16}
                  className="text-cyan-700 group-hover:scale-110 transition-transform duration-200"
                />
              )}
              <span className="text-sm font-medium text-cyan-800">
                {showBalance ? 'Hide Balance' : 'Show Balance'}
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}