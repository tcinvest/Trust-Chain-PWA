'use client';

import { RotateCcw } from 'lucide-react';
import { useState } from 'react';

export default function DashboardHeader({
  avatar,
  userInitial,
  username,
  //eslint-disable-next-line
  totalBalance,
  onRefresh,
}: {
  avatar?: string;
  userInitial: string;
  username: string;
  totalBalance: number;
  onRefresh: () => void;
}) {
  //eslint-disable-next-line
  const [refreshing, setRefreshing] = useState(false);

  return (
    <div className="relative flex justify-between items-center px-2 pt-8 pb-4">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-blue-900/30 to-black/50 -mx-6 -my-2 rounded-2xl"></div>
      
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -mx-6 -my-2">
        <div className="absolute top-2 left-8 w-16 h-16 bg-gradient-to-br from-blue-400/15 to-blue-500/15 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-2 right-8 w-12 h-12 bg-gradient-to-br from-blue-400/20 to-white/10 rounded-full blur-lg animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 flex items-center space-x-3">
        {/* Avatar with neon glow */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-blue-400/30 rounded-full blur-sm animate-pulse"></div>
          <div className="relative w-10 h-10 bg-gradient-to-br from-slate-800 to-blue-900 rounded-full flex items-center justify-center overflow-hidden border-2 border-cyan-400/50">
            {avatar ? (
              <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-cyan-100 font-bold text-lg bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                {userInitial}
              </span>
            )}
          </div>
        </div>

        {/* User info with neon styling */}
        <div className="flex flex-col">
          <p className="text-cyan-300/80 text-sm font-medium">Hello</p>
          <p className="text-white text-sm font-semibold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
            @{username},
          </p>
        </div>
      </div>

      {/* Refresh button with neon theme */}
      <div className="relative z-10">
        <button
          onClick={onRefresh}
          title="Refresh"
          className="group relative overflow-hidden w-10 h-10 bg-gradient-to-r from-slate-700/60 to-blue-800/60 rounded-full flex items-center justify-center hover:from-slate-600/70 hover:to-blue-700/70 transition-all duration-300 border border-cyan-400/30 hover:border-cyan-400/50 backdrop-blur-sm"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-400/20 group-hover:to-blue-400/20 transition-all duration-300 rounded-full"></div>
          <RotateCcw 
            size={18} 
            className={`relative text-cyan-300 group-hover:text-cyan-200 transition-colors ${refreshing ? 'animate-spin' : ''}`} 
          />
        </button>
      </div>
    </div>
  );
}