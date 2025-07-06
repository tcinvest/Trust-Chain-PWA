'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboardIcon,
  GroupIcon,
  BriefcaseIcon,
  UserIcon,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useState } from 'react';

export default function Nav() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);

  return (
    <div className="fixed bottom-0 w-full z-50">
      {/* Toggle Button */}
      <div className="w-full flex justify-center mb-1">
        <button
          onClick={() => setVisible(!visible)}
          className="bg-white dark:bg-slate-900 border rounded-full shadow px-2 py-1"
        >
          {visible ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
        </button>
      </div>

      {/* Drawer Nav */}
      <nav
        className={`w-full rounded-t-lg backdrop-blur-sm bg-white dark:bg-slate-900 shadow-lg border-t border-white transition-all duration-300 ${
          visible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="max-w-lg mx-auto flex justify-around text-white dark:text-slate-400 items-center h-16">
          <Link
            href="/dashboard"
            className={`flex-1 flex flex-col justify-center items-center h-full transition-colors text-slate-600 dark:text-slate-400 ${
              pathname === '/dashboard' ? 'text-blue-700' : 'hover:text-slate-700'
            }`}
          >
            <LayoutDashboardIcon className="w-5 h-5 mb-1" />
            <span className="text-xs">Dashboard</span>
          </Link>

          <Link
            href="/dashboard/referrals"
            className={`flex-1 flex flex-col justify-center items-center h-full transition-colors text-slate-600 dark:text-slate-400 ${
              pathname === '/dashboard/referrals' ? 'text-blue-700' : 'hover:text-slate-700'
            }`}
          >
            <GroupIcon className="w-5 h-5 mb-1" />
            <span className="text-xs">Referrals</span>
          </Link>

          <Link
            href="/dashboard/invest"
            className={`flex-1 flex flex-col justify-center items-center h-full transition-colors text-slate-600 dark:text-slate-400 ${
              pathname === '/dashboard/invest' ? 'text-blue-700' : 'hover:text-slate-700'
            }`}
          >
            <BriefcaseIcon className="w-5 h-5 mb-1" />
            <span className="text-xs">Invest</span>
          </Link>

          <Link
            href="/dashboard/portfolio"
            className={`flex-1 flex flex-col justify-center items-center h-full transition-colors text-slate-600 dark:text-slate-400 ${
              pathname === '/dashboard/portfolio' ? 'text-blue-700' : 'hover:text-slate-700'
            }`}
          >
            <UserIcon className="w-5 h-5 mb-1" />
            <span className="text-xs">Portfolio</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
