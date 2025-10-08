'use client';

import { Bot, ChevronDown, ChevronUp } from 'lucide-react';
import { useEffect, useState } from 'react';

interface BotData {
  id: number;
  name: string;
  description: string;
  min_invest: number | null;
  max_invest: number | null;
  return_percentage: number | null;
  isActive: boolean;
}

export default function BotListSection() {
  const [bots, setBots] = useState<BotData[]>([]);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    const fetchBots = async () => {
      const res = await fetch('/api/bots');
      const data = await res.json();
  
      // Convert Decimal strings to numbers
      // eslint-disable-next-line
      const formatted = data.map((bot: any) => ({
        ...bot,
        return_percentage: bot.return_percentage ? parseFloat(bot.return_percentage) : null,
      }));
  
      setBots(formatted);
    };
    fetchBots();
  }, []);
  

  return (
    <div className="px-6 pt-4 pb-2">
      <div className="relative bg-gradient-to-br from-black/60 to-blue-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-4">
        <div className="absolute -top-6 left-1/3 w-28 h-28 bg-cyan-400/10 blur-2xl rounded-full animate-pulse pointer-events-none" />

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

        {expanded && (
          <div className="space-y-3 mt-4 transition-all duration-300">
            {bots.map((bot) => (
              <div
                key={bot.id}
                className="relative z-10 border border-white/10 rounded-xl p-3 bg-black/30 backdrop-blur-sm"
              >
                <p className="text-white font-medium">{bot.name}</p>
                <p className="text-xs text-cyan-100/80">
                  {bot.return_percentage ? `${bot.return_percentage}% Daily` : bot.description}
                </p>
                <div className="text-xs text-white/70 mt-1 space-y-1">
                  <p>
                    <span className="text-cyan-300">Range:</span>{' '}
                    ${bot.min_invest ?? 0} - ${bot.max_invest ?? 0}
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
