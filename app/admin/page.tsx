// app/admin/page.tsx
import Link from 'next/link';
import { getInvestmentStats } from '@/lib/actions/admin/getInvestmentsData';
import { getPendingKycs } from '@/lib/actions/admin/getPendingKycs';
import prisma from '@/lib/prisma';

export default async function AdminDashboard() {
    const [investmentStats, userCount, pendingKycUsers] = await Promise.all([
        getInvestmentStats(),
        prisma.users.count(),
        getPendingKycs()
    ]);

    const quickStats = [
        {
            title: 'Total Investments',
            value: investmentStats.total,
            color: 'bg-blue-500',
            href: '/admin/investments'
        },
        {
            title: 'Total Users',
            value: userCount,
            color: 'bg-green-500',
            href: '/admin/users'
        },
        {
            title: 'Pending KYC',
            value: pendingKycUsers.length,
            color: 'bg-yellow-500',
            href: '/admin/kyc-review'
        },
        {
            title: 'Total Investment Amount',
            value: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(Number(investmentStats.totalAmount)),
            color: 'bg-purple-500',
            href: '/admin/investments'
        }
    ];

    const adminActions = [
        {
            title: 'Manage Investments',
            description: 'View and manage all user investments',
            href: '/admin/investments',
            icon: '💰',
            color: 'bg-blue-50 hover:bg-blue-100 border-blue-200'
        },
        {
            title: 'KYC Review',
            description: 'Review and approve KYC documents',
            href: '/admin/kyc-review',
            icon: '🔍',
            color: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200'
        },
        {
            title: 'User Management',
            description: 'Manage user accounts and permissions',
            href: '/admin/users',
            icon: '👥',
            color: 'bg-green-50 hover:bg-green-100 border-green-200'
        },
        {
            title: 'KYC History',
            description: 'View KYC approval / rejection history',
            href: '/admin/kyc-history',
            icon: '👥',
            color: 'bg-green-50 hover:bg-green-100 border-green-200'
        }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-600">Welcome to your admin dashboard</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickStats.map((stat, index) => (
                    <Link
                        key={index}
                        href={stat.href}
                        className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center">
                            <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                                <div className="w-6 h-6 bg-white rounded opacity-30"></div>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {adminActions.map((action, index) => (
                        <Link
                            key={index}
                            href={action.href}
                            className={`p-6 rounded-lg border-2 transition-colors ${action.color}`}
                        >
                            <div className="flex items-center mb-4">
                                <span className="text-2xl mr-3">{action.icon}</span>
                                <h3 className="text-lg font-semibold text-gray-900">{action.title}</h3>
                            </div>
                            <p className="text-gray-600">{action.description}</p>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">New investment created</p>
                                <p className="text-xs text-gray-500">2 minutes ago</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">KYC document submitted</p>
                                <p className="text-xs text-gray-500">15 minutes ago</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">New user registered</p>
                                <p className="text-xs text-gray-500">1 hour ago</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}