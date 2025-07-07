'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import CryptoPaymentDetails from '@/components/CryptoPaymentDetails';

export default function AddMoneyPage() {
  const { user } = useUser();
  const router = useRouter();
  const [userBalance, setUserBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [selectedCoin, setSelectedCoin] = useState('');
  const [proof, setProof] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Get user balance and check for pending requests
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;

      // Get user balance
      const userRes = await fetch(`/api/user/balance?clerkId=${user.id}`);
      const userData = await userRes.json();
      setUserBalance(Number(userData.balance) || 0);

      // Check for pending add money requests
      const pendingRes = await fetch(`/api/user/pending-add-money?clerkId=${user.id}`);
      const pendingData = await pendingRes.json();
      setHasPendingRequest(pendingData.hasPending);
    };
    fetchUserData();
  }, [user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !amount || !proof) return;

    const addAmount = parseFloat(amount);
    if (addAmount <= 0) {
      setErrorMessage('Please enter a valid amount');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('clerkId', user.id);
      formData.append('amount', amount);
      formData.append('proof', proof);

      const res = await fetch('/api/add-money', {
        method: 'POST',
        body: formData,
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
      <h1 className="text-2xl font-bold mb-6">Add Money to Wallet</h1>

      {hasPendingRequest && (
        <div className="bg-yellow-600 p-4 rounded-lg mb-6">
          ⚠️ You already have a pending add money request. Please wait for admin approval.
        </div>
      )}

      {submitStatus === 'success' && (
        <div className="bg-green-600 p-4 rounded-lg mb-6">
          ✅ Add money request submitted successfully! Redirecting to dashboard...
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="bg-red-600 p-4 rounded-lg mb-6">
          ❌ {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-slate-800 p-6 rounded-xl space-y-4">
        <div>
          <p className="text-sm text-gray-400">Current Balance:</p>
          <div className="bg-slate-700 px-4 py-2 rounded mt-1 text-green-400 font-semibold">
            ${Number(userBalance).toFixed(2)}
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-400">Enter Amount to Add *:</label>
          <div className="flex rounded overflow-hidden mt-1">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 bg-slate-700 px-4 py-2 outline-none text-white"
              placeholder="0.00"
              min="0.01"
              step="0.01"
              required
              disabled={hasPendingRequest}
            />
            <span className="bg-blue-600 px-3 flex items-center">USD</span>
          </div>
        </div>

        <CryptoPaymentDetails selectedCoin={selectedCoin} setSelectedCoin={setSelectedCoin} />

        <div>
          <label className="text-sm text-gray-400">Upload Payment Proof *:</label>
          <input
            type="file"
            onChange={(e) => setProof(e.target.files?.[0] || null)}
            accept="image/*"
            className="w-full bg-slate-700 px-4 py-2 rounded mt-1 text-white"
            required
            disabled={hasPendingRequest}
          />
          <p className="text-xs text-gray-500 mt-1">
            Upload a screenshot or photo of your payment confirmation
          </p>
        </div>

        <div className="bg-slate-700 p-4 rounded-lg">
          <h3 className="text-sm font-semibold mb-2">Important Notes:</h3>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• Make sure the payment proof clearly shows the transaction details</li>
            <li>• Admin approval is required before funds are added to your balance</li>
            <li>• Processing time: 1-24 hours</li>
            <li>• Contact support if you have any issues</li>
          </ul>
        </div>

        <div className="flex justify-between mt-6">
          <button
            type="submit"
            disabled={isSubmitting || hasPendingRequest}
            className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg"
          >
            {isSubmitting ? 'Processing...' : '💰 Submit Request'}
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