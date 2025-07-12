'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function WithdrawMoneyPage() {
  const { user } = useUser();
  const router = useRouter();
  const [balance, setBalance] = useState(0);
  const [profitBalance, setProfitBalance] = useState(0);
  const [isKycVerified, setIsKycVerified] = useState(false);
  const [amount, setAmount] = useState('');
  const [balanceType, setBalanceType] = useState<'balance' | 'profit_balance'>('balance');
  const [walletAddress, setWalletAddress] = useState('');
  const [network, setNetwork] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Calculate withdrawal details
  const withdrawalAmount = parseFloat(amount) || 0;
  const charges = withdrawalAmount * 0.005; // 5% charges
  const youWillReceive = withdrawalAmount - charges;
  const selectedBalance = balanceType === 'balance' ? balance : profitBalance;

  // Get user data and check for pending requests
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;

      try {
        // Get user balance and KYC status
        const userRes = await fetch(`/api/user/balance?clerkId=${user.id}`);
        const userData = await userRes.json();
        setBalance(Number(userData.balance) || 0);
        setProfitBalance(Number(userData.profit_balance) || 0);
        
        // Get KYC status
        const kycRes = await fetch(`/api/user/kyc-status?clerkId=${user.id}`);
        const kycData = await kycRes.json();
        setIsKycVerified(kycData.isVerified);

        // Check for pending withdrawal requests
        const pendingRes = await fetch(`/api/user/pending-withdrawals?clerkId=${user.id}`);
        const pendingData = await pendingRes.json();
        setHasPendingRequest(pendingData.hasPending);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, [user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !amount || !walletAddress || !network) return;

    const withdrawAmount = parseFloat(amount);
    
    // Validation
    if (withdrawAmount <= 0) {
      setErrorMessage('Please enter a valid amount');
      return;
    }

    if (withdrawAmount > selectedBalance) {
      setErrorMessage(`Insufficient funds. Available: $${selectedBalance.toFixed(2)}`);
      return;
    }

    if (!isKycVerified) {
      setErrorMessage('KYC verification required to withdraw funds');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const requestData = {
        clerkId: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        amount: withdrawAmount.toString(),
        balanceType: balanceType,
        walletAddress: walletAddress,
        network: network
      };

      const res = await fetch('/api/withdraw-money', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitStatus('success');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else {
        setSubmitStatus('error');
        setErrorMessage(data.error || 'Request failed');
      }
    } catch (err) {
      console.error(err);
      setSubmitStatus('error');
      setErrorMessage('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white px-6 py-10 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Withdraw Money from Wallet</h1>

      {!isKycVerified && (
        <div className="bg-red-600 p-4 rounded-lg mb-6">
          ❌ KYC verification required to withdraw funds. Please complete your KYC verification first.
        </div>
      )}

      {hasPendingRequest && (
        <div className="bg-yellow-600 p-4 rounded-lg mb-6">
          ⚠️ You already have a pending withdrawal request. Please wait for admin approval.
        </div>
      )}

      {submitStatus === 'success' && (
        <div className="bg-green-600 p-4 rounded-lg mb-6">
          ✅ Withdrawal request submitted successfully! Redirecting to dashboard...
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="bg-red-600 p-4 rounded-lg mb-6">
          ❌ {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-slate-800 p-6 rounded-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400">Main Balance:</p>
            <div className="bg-slate-700 px-4 py-2 rounded mt-1 text-green-400 font-semibold">
              ${Number(balance).toFixed(2)}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-400">Profit Balance:</p>
            <div className="bg-slate-700 px-4 py-2 rounded mt-1 text-blue-400 font-semibold">
              ${Number(profitBalance).toFixed(2)}
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-400">Withdraw From *:</label>
          <select
            value={balanceType}
            onChange={(e) => setBalanceType(e.target.value as 'balance' | 'profit_balance')}
            className="w-full bg-slate-700 px-4 py-2 rounded mt-1 text-white outline-none"
            disabled={hasPendingRequest || !isKycVerified}
          >
            <option value="balance">Main Balance (${Number(balance).toFixed(2)})</option>
            <option value="profit_balance">Profit Balance (${Number(profitBalance).toFixed(2)})</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-400">Enter Amount to Withdraw *:</label>
          <div className="flex rounded overflow-hidden mt-1">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 bg-slate-700 px-4 py-2 outline-none text-white"
              placeholder="0.00"
              min="0.01"
              step="0.01"
              max={selectedBalance}
              required
              disabled={hasPendingRequest || !isKycVerified}
            />
            <span className="bg-blue-600 px-3 flex items-center">USD</span>
          </div>
          {selectedBalance > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              Available: ${selectedBalance.toFixed(2)}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm text-gray-400">Crypto Wallet Address *:</label>
          <input
            type="text"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            className="w-full bg-slate-700 px-4 py-2 rounded mt-1 text-white outline-none"
            placeholder="Enter your crypto wallet address"
            required
            disabled={hasPendingRequest || !isKycVerified}
          />
        </div>

        <div>
          <label className="text-sm text-gray-400">Network *:</label>
          <input
            type="text"
            value={network}
            onChange={(e) => setNetwork(e.target.value)}
            className="w-full bg-slate-700 px-4 py-2 rounded mt-1 text-white outline-none"
            placeholder="e.g., Bitcoin, Ethereum, BSC, Polygon"
            required
            disabled={hasPendingRequest || !isKycVerified}
          />
        </div>

        {withdrawalAmount > 0 && (
          <div className="bg-slate-700 p-4 rounded-lg">
            <h3 className="text-sm font-semibold mb-2">Withdrawal Summary:</h3>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-400">Withdrawal Amount:</span>
                <span className="text-white">${withdrawalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Charges (5%):</span>
                <span className="text-red-400">-${charges.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-600 pt-1 mt-2">
                <div className="flex justify-between font-semibold">
                  <span className="text-gray-400">You&apos;ll Receive:</span>
                  <span className="text-green-400">${youWillReceive.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-slate-700 p-4 rounded-lg">
          <h3 className="text-sm font-semibold mb-2">Important Notes:</h3>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• KYC verification is required to withdraw funds</li>
            <li>• A 0.5% charge applies to all withdrawals</li>
            <li>• Double-check your wallet address and network before submitting</li>
            <li>• Admin approval is required before funds are processed</li>
            <li>• Processing time: 1-24 hours</li>
            <li>• Contact support if you have any issues</li>
          </ul>
        </div>

        <div className="flex justify-between mt-6">
          <button
            type="submit"
            disabled={isSubmitting || hasPendingRequest || !isKycVerified || withdrawalAmount <= 0 || withdrawalAmount > selectedBalance}
            className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg"
          >
            {isSubmitting ? 'Processing...' : '💸 Submit Withdrawal'}
          </button>
          <button
            type="button"
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
            onClick={() => router.back()}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}