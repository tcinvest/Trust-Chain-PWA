'use client';

import { useUser, SignOutButton } from '@clerk/nextjs'
import React, { useState, useEffect } from 'react';
import { HelpCircle, ChevronRight, Wallet, TrendingUp, Users, PencilIcon, ArrowDownLeft } from 'lucide-react';

import { getUserData } from '@/lib/actions/GetUserData';
import { UserData } from '@/types/type';
import { updateUserAvatar } from '@/lib/actions/UpdateAvatar';
import AvatarUploadForm from '@/components/AvatarUploadForm'; 
import { formatCurrency, getKycStatus } from '@/lib/utils';
import Link from 'next/link';
import HeaderWithLocation from '@/components/dashboard/HeaderWithLocation';

export default function PortfolioScreen() {
  const { isLoaded, user } = useUser();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showKycNotice, setShowKycNotice] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;
      
      try {
        const data = await getUserData(user.id);
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded && user) {
      fetchUserData();
    }
  }, [isLoaded, user]);

  if (!isLoaded || !user) return null;
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const balance = userData?.balance || 0;
  const profitBalance = userData?.profit_balance || 0;
  const recoveryFund = userData?.recovery_fund || 0;
  const totalWithdrawals = userData?.total_withdrawals || 0;
  const kycStatus = getKycStatus(userData?.kyc || null);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <HeaderWithLocation />

        <div className="px-6 space-y-6">
          {/* Profile Card */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden">
                {userData?.avatar ? (
                  <img
                    src={userData.avatar} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {userData?.first_name?.charAt(0) || user?.firstName?.charAt(0) || 'U'}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-black dark:text-white text-xl font-bold">
                  {userData?.first_name || user?.firstName} {userData?.last_name || user?.lastName}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {userData?.email || user?.emailAddresses?.[0]?.emailAddress}
                </p>
                <div className="flex items-center mt-2 space-x-4">
                  <span className={`text-sm font-medium ${kycStatus.color}`}>
                    KYC: {kycStatus.text}
                  </span>
                  {userData?.kyc === 3 && userData?.kyc_credential && (
                    <p className="text-red-500 text-sm mt-1">
                      Reason: {JSON.parse(userData.kyc_credential)["Action Message"] || 'No reason provided'}
                    </p>
                  )}
                {userData?.kyc === 1 && showKycNotice && (
                  <div className="fixed top-6 right-6 z-50 max-w-sm bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100 p-4 rounded-xl shadow-lg flex items-start justify-between space-x-4">
                    <div className="text-sm">
                      If you haven&#39;t uploaded your KYC document yet, please submit both the front and back of your ID.
                      If you have already submitted, kindly ignore this message and wait for approval.
                    </div>
                    <button
                      onClick={() => setShowKycNotice(false)}
                      className="text-xl leading-none text-yellow-900 dark:text-yellow-200 hover:text-red-500 ml-4"
                      aria-label="Close"
                    >
                      &times;
                    </button>
                  </div>
                )}
                  {userData?.country && (
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                       Location: {userData.city}, {userData.country}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <AvatarUploadForm 
              userId={user.id}
              formAction={updateUserAvatar}
            />

          <div className="mt-6">
            <Link 
              href="/dashboard/edit-user-info" 
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 rounded-lg transition-all duration-200 hover:shadow-sm"
            >
              <PencilIcon size={16} />
              Upload KYC Document
            </Link>
          </div>

          </div>

          {/* Financial Overview */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <h3 className="text-black dark:text-white text-lg font-semibold mb-4 flex items-center">
              <Wallet size={20} className="mr-2" />
              Financial Overview
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Account Balance</p>
                    <p className="text-black dark:text-white text-2xl font-bold">
                      {formatCurrency(balance)}
                    </p>
                  </div>
                  <Wallet className="text-blue-500" size={24} />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 dark:text-green-400 text-sm font-medium">Profit Balance</p>
                    <p className="text-black dark:text-white text-2xl font-bold">
                      {formatCurrency(profitBalance)}
                    </p>
                  </div>
                  <TrendingUp className="text-green-500" size={24} />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">Recovery Fund</p>
                    <p className="text-black dark:text-white text-2xl font-bold">
                      {formatCurrency(recoveryFund)}
                    </p>
                  </div>
                  <Users className="text-purple-500" size={24} />
                </div>
              </div>

              {/* New Total Withdrawals Card */}
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 rounded-xl border border-orange-200 dark:border-orange-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-600 dark:text-orange-400 text-sm font-medium">Total Withdrawals</p>
                    <p className="text-black dark:text-white text-2xl font-bold">
                      {formatCurrency(totalWithdrawals)}
                    </p>
                  </div>
                  <ArrowDownLeft className="text-orange-500" size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <h3 className="text-black dark:text-white text-lg font-semibold mb-4">
              Account Information
            </h3>
            <div className="space-y-3">
              {userData?.phone && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 dark:text-gray-400">Phone</span>
                  <span className="text-black dark:text-white font-medium">{userData.phone}</span>
                </div>
              )}
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 dark:text-gray-400">Member Since</span>
                <span className="text-black dark:text-white font-medium">
                  {userData?.created_at ? new Date(userData.created_at).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 dark:text-gray-400">Account Status</span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            {[
              { icon: Users, label: 'My Referrals', href: '/dashboard/referrals' },
              { icon: HelpCircle, label: 'Help & Support', href: '/dashboard/support' },
            ].map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="w-full bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-800 flex items-center transition-colors"
              >
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <item.icon size={18} className="text-black dark:text-white" />
                </div>
                <span className="text-black dark:text-white ml-4 flex-1 text-left font-medium">
                  {item.label}
                </span>
                <ChevronRight size={16} className="text-gray-400" />
              </a>
            ))}
          </div>
          
          <SignOutButton>
            <button className=" py-4 bg-slate-700 text-white w-full rounded-lg hover:bg-slate-500">
              Log Out
            </button>
          </SignOutButton>
        </div>
      </div>
    </div>
  );
}