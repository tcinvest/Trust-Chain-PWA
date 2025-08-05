// app/admin/layout.tsx
'use client';


import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const adminRoutes = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: '📊'
  },
  {
    name: 'All Investments',
    href: '/admin/invests',
    icon: '📈'
  },
  {
    name: 'Investments requests',
    href: '/admin/investments',
    icon: '💰'
  },
  {
    name: 'Add money requests',
    href: '/admin/add-money',
    icon: '💸'
  },
  {
    name: 'KYC Review',
    href: '/admin/kyc-review',
    icon: '🔍'
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: '👥'
  },
  {
    name: 'Withdrawal Requests',
    href: '/admin/withdrawals',
    icon: '💸'
  },
  {
    name: 'Bots',
    href: '/admin/bots',
    icon: '🤖'
  },
  {
    name: 'Complaints',
    href: '/admin/complaints',
    icon: '📨'
  },
   {
    name: 'Update Addrresses',
    href: '/admin/update-crypto',
    icon: '📨'
  },
  {
    name: 'KYC History',
    href: '/admin/kyc-history',
    icon: '📜'
  }
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:relative lg:transform-none ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <nav className="mt-8 flex-1 overflow-y-auto">
          {adminRoutes.map((route) => {
            const isActive = pathname === route.href;
            return (
              <Link
                key={route.href}
                href={route.href}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="mr-3 text-lg">{route.icon}</span>
                {route.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, Admin</span>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}