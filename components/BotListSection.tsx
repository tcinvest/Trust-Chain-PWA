'use client';

import { Bot, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const bots = [
  {
    id: 1,
    name: 'Geniusinvestai',
    description: '30 Days 10%',
    investmentRange: '$99 - $9000',
    capitalBack: 'Yes',
    returnType: 'Period',
    numberOfPeriods: '1 Time',
    profitWithdraw: 'Anytime',
    holidayNote: '* Friday are Holidays',
    isActive: true,
  },
  {
    id: 2,
    name: 'Alphainvestai',
    description: '60 Days 30%',
    investmentRange: '$9000 - $99999',
    capitalBack: 'Yes',
    returnType: 'Period',
    numberOfPeriods: '1 Time',
    profitWithdraw: 'Anytime',
    holidayNote: '* Friday are Holidays',
    isActive: true,
  },
  {
    id: 3,
    name: 'ChainMaster (Affiliate)',
    description: '90 Days 40%',
    investmentRange: '$999 - $9999999',
    capitalBack: 'Yes',
    returnType: 'Period',
    numberOfPeriods: '1 Time',
    profitWithdraw: 'Anytime',
    holidayNote: '* Friday are Holidays',
    isActive: true,
  },
];

export default function BotListSection() {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="px-6 pt-4 pb-2">
      <div className="relative bg-gradient-to-br from-black/60 to-blue-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-4">
        {/* Glow background */}
        <div className="absolute -top-6 left-1/3 w-28 h-28 bg-cyan-400/10 blur-2xl rounded-full animate-pulse pointer-events-none" />

        {/* Header with toggle */}
        <div className="flex justify-between items-center mb-2 relative z-10">
          <div className="flex items-center gap-2">
            <Bot className="text-cyan-300" size={18} />
            <h3 className="text-white font-semibold text-base bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
              Investment Bots
            </h3>
          </div>

          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="text-cyan-200 hover:text-white transition-all"
          >
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>

        {/* Collapsible content */}
        {expanded && (
          <div className="space-y-3 mt-4 transition-all duration-300">
            {bots.map((bot) => (
              <div
                key={bot.id}
                className="relative z-10 border border-white/10 rounded-xl p-3 bg-black/30 backdrop-blur-sm"
              >
                <p className="text-white font-medium">{bot.name}</p>
                <p className="text-xs text-cyan-100/80">{bot.description}</p>
                <div className="text-xs text-white/70 mt-1 space-y-1">
                  <p>
                    <span className="text-cyan-300">Range:</span> {bot.investmentRange}
                  </p>
                  <p>
                    <span className="text-cyan-300">Profit:</span> {bot.profitWithdraw}
                  </p>
                  <p>
                    <span className="text-cyan-300">Periods:</span> {bot.numberOfPeriods}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
