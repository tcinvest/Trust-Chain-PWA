'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Clock, User, DollarSign, Wallet, Network } from 'lucide-react';

interface WithdrawalRequest {
  id: number;
  amount: number;
  balance_type: string;
  wallet_address: string;
  network: string;
  charges: number;
  net_amount: number;
  status: string;
  created_at: string;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    balance: number;
    profit_balance: number;
  };
}

export default function AdminWithdrawalPage() {
  const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState<number | null>(null);
  const [rejecting, setRejecting] = useState<number | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/admin/withdrawals/pending');
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error('Failed to fetch withdrawal requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId: number) => {
    setApproving(requestId);
    try {
      const res = await fetch(`/api/admin/withdrawals/${requestId}/approve`, {
        method: 'PATCH'
      });

      if (res.ok) {
        // Remove from pending list
        setRequests(prev => prev.filter(req => req.id !== requestId));
        alert('Withdrawal request approved successfully!');
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to approve request');
      }
    } catch (err) {
      console.error('Approval error:', err);
      alert('Error approving request');
    } finally {
      setApproving(null);
    }
  };

  const handleReject = async (requestId: number) => {
    if (!confirm('Are you sure you want to reject this withdrawal request? This action cannot be undone.')) {
      return;
    }

    setRejecting(requestId);
    try {
      const res = await fetch(`/api/admin/withdrawals/${requestId}/reject`, {
        method: 'PATCH'
      });

      if (res.ok) {
        // Remove from pending list
        setRequests(prev => prev.filter(req => req.id !== requestId));
        alert('Withdrawal request rejected successfully!');
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to reject request');
      }
    } catch (err) {
      console.error('Rejection error:', err);
      alert('Error rejecting request');
    } finally {
      setRejecting(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span>Loading withdrawal requests...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Withdrawal Requests</h1>
          <p className="text-gray-400">Review and approve pending withdrawal requests</p>
        </div>

        {requests.length === 0 ? (
          <div className="bg-slate-800 rounded-xl p-8 text-center">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Pending Requests</h3>
            <p className="text-gray-400">All withdrawal requests have been processed.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request.id} className="bg-slate-800 rounded-xl p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="bg-red-600 rounded-full p-2">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">
                          {request.user.first_name} {request.user.last_name}
                        </h3>
                        <p className="text-gray-400 text-sm">{request.user.email}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="bg-slate-700 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-1">
                          <DollarSign className="w-4 h-4 text-red-400" />
                          <span className="text-sm text-gray-400">Withdrawal Amount</span>
                        </div>
                        <p className="text-xl font-bold text-red-400">${Number(request.amount).toFixed(2)}</p>
                      </div>

                      <div className="bg-slate-700 rounded-lg p-4">
                        <p className="text-sm text-gray-400 mb-1">Charges (5%)</p>
                        <p className="text-lg font-semibold text-orange-400">${Number(request.charges).toFixed(2)}</p>
                      </div>

                      <div className="bg-slate-700 rounded-lg p-4">
                        <p className="text-sm text-gray-400 mb-1">Net Amount</p>
                        <p className="text-lg font-semibold text-green-400">${Number(request.net_amount).toFixed(2)}</p>
                      </div>

                      <div className="bg-slate-700 rounded-lg p-4">
                        <p className="text-sm text-gray-400 mb-1">From Balance</p>
                        <p className="text-lg font-semibold text-blue-400 capitalize">
                          {request.balance_type === 'balance' ? 'Main Balance' : 'Profit Balance'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-slate-700 rounded-lg p-4">
                        <p className="text-sm text-gray-400 mb-1">Current Main Balance</p>
                        <p className="text-xl font-bold text-green-400">${Number(request.user.balance).toFixed(2)}</p>
                      </div>

                      <div className="bg-slate-700 rounded-lg p-4">
                        <p className="text-sm text-gray-400 mb-1">Current Profit Balance</p>
                        <p className="text-xl font-bold text-blue-400">${Number(request.user.profit_balance).toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="bg-slate-700 rounded-lg p-4 mb-4">
                      <h4 className="text-sm font-semibold text-gray-400 mb-3">Withdrawal Details</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Wallet className="w-4 h-4 text-blue-400" />
                          <span className="text-sm text-gray-400">Wallet Address:</span>
                          <span className="text-sm text-white font-mono break-all">{request.wallet_address}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Network className="w-4 h-4 text-green-400" />
                          <span className="text-sm text-gray-400">Network:</span>
                          <span className="text-sm text-white">{request.network}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-gray-400">
                          Submitted: {new Date(request.created_at).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApprove(request.id)}
                          disabled={approving === request.id}
                          className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                        >
                          {approving === request.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              <span>Approving...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              <span>Approve</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleReject(request.id)}
                          disabled={rejecting === request.id}
                          className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                        >
                          {rejecting === request.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              <span>Rejecting...</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4" />
                              <span>Reject</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}