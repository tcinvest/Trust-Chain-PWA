'use client';

import React, { useEffect, useState } from 'react';
import { Bot, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';

interface InvestmentBot {
  id: number;
  name: string;
  description: string;
  investment_range: string;
  capital_back: string;
  return_type: string;
  number_of_periods: string;
  profit_withdraw: string;
  holiday_note: string;
  is_active: boolean;
}

export default function InvestBotsPage() {
  const [bots, setBots] = useState<InvestmentBot[]>([]);
  const [selectedBot, setSelectedBot] = useState<InvestmentBot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/bots')
      .then(res => res.json())
      .then(data => {
        setBots(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        Loading bots...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-4xl mx-auto">
        <div className="px-6 pt-8 pb-8">
          <h1 className="text-white text-3xl font-semibold mb-3">Investment Bots</h1>
          <p className="text-gray-400 text-base">AI-powered trading bots for automated returns</p>
        </div>

        <div className="px-6 pb-8">
          {bots.map((bot) => (
            <div key={bot.id} className="mb-4">
              <div
                className={`bg-gray-800 rounded-3xl transition-all duration-200 overflow-hidden ${
                  selectedBot?.id === bot.id ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div
                  className="p-6 pb-4 cursor-pointer hover:bg-gray-700/50"
                  onClick={() => setSelectedBot(selectedBot?.id === bot.id ? null : bot)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                          <Bot size={18} color="white" />
                        </div>
                        <h3 className="text-white text-lg font-semibold">{bot.name}</h3>
                      </div>
                      <p className="text-gray-400 text-sm">{bot.description}</p>
                    </div>
                    <div className="ml-4">
                      {selectedBot?.id === bot.id ? (
                        <ChevronUp size={20} color="#9CA3AF" />
                      ) : (
                        <ChevronDown size={20} color="#9CA3AF" />
                      )}
                    </div>
                  </div>

                  {selectedBot?.id === bot.id && (
                    <div className="border-t border-gray-700 p-6 space-y-3">
                      <p className="text-gray-400 text-sm">
                        <span className="font-semibold text-white block">Investment</span>
                        {bot.investment_range}
                      </p>
                      <p className="text-gray-400 text-sm">
                        <span className="font-semibold text-white block">Capital Back</span>
                        {bot.capital_back}
                      </p>
                      <p className="text-gray-400 text-sm">
                        <span className="font-semibold text-white block">Return Type</span>
                        {bot.return_type}
                      </p>
                      <p className="text-gray-400 text-sm">
                        <span className="font-semibold text-white block">Number of Periods</span>
                        {bot.number_of_periods}
                      </p>
                      <p className="text-gray-400 text-sm">
                        <span className="font-semibold text-white block">Profit Withdraw</span>
                        {bot.profit_withdraw}
                      </p>
                      <p className="text-yellow-400 text-sm italic">{bot.holiday_note}</p>

                      <Link
                        href={`/dashboard/invest/${bot.id}`}
                        className="inline-block bg-blue-600 text-white px-4 py-2 rounded-xl text-sm mt-2"
                      >
                        Invest
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
