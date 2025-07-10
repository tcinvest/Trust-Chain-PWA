'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboardIcon,
  GroupIcon,
  BriefcaseIcon,
  UserIcon,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useState } from 'react';

// Loading Spinner Component
const LoadingOverlay = () => (
  <div className="fixed inset-0 bg-opacity-30 flex items-center justify-center z-[60]">
    <div className="rounded-lg p-4 shadow-lg">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
    </div>
  </div>
);

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const [visible, setVisible] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleNavigation = (href: string) => {
    if (pathname !== href) {
      setLoading(true);
      router.push(href);
      // Hide loading after navigation completes
      setTimeout(() => setLoading(false), 800);
    }
  };

  return (
    <>
      {loading && <LoadingOverlay />}
      
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
            <button
              onClick={() => handleNavigation('/dashboard')}
              className={`flex-1 flex flex-col justify-center items-center h-full transition-colors text-slate-600 dark:text-slate-400 ${
                pathname === '/dashboard' ? 'text-blue-700' : 'hover:text-slate-700'
              }`}
            >
              <LayoutDashboardIcon className="w-5 h-5 mb-1" />
              <span className="text-xs">Dashboard</span>
            </button>

            <button
              onClick={() => handleNavigation('/dashboard/referrals')}
              className={`flex-1 flex flex-col justify-center items-center h-full transition-colors text-slate-600 dark:text-slate-400 ${
                pathname === '/dashboard/referrals' ? 'text-blue-700' : 'hover:text-slate-700'
              }`}
            >
              <GroupIcon className="w-5 h-5 mb-1" />
              <span className="text-xs">Referrals</span>
            </button>

            <button
              onClick={() => handleNavigation('/dashboard/invest')}
              className={`flex-1 flex flex-col justify-center items-center h-full transition-colors text-slate-600 dark:text-slate-400 ${
                pathname === '/dashboard/invest' ? 'text-blue-700' : 'hover:text-slate-700'
              }`}
            >
              <BriefcaseIcon className="w-5 h-5 mb-1" />
              <span className="text-xs">Invest</span>
            </button>

            <button
              onClick={() => handleNavigation('/dashboard/portfolio')}
              className={`flex-1 flex flex-col justify-center items-center h-full transition-colors text-slate-600 dark:text-slate-400 ${
                pathname === '/dashboard/portfolio' ? 'text-blue-700' : 'hover:text-slate-700'
              }`}
            >
              <UserIcon className="w-5 h-5 mb-1" />
              <span className="text-xs">Portfolio</span>
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}