'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Clock, User, DollarSign, Eye, X } from 'lucide-react';

interface Investment {
  id: number;
  invest_amount: number;
  wallet: string;
  status: string;
  created_at: string;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
  bot: {
    id: number;
    name: string;
    description: string;
  };
  payment_proof?: {
    id: number;
    proof_url: string;
    created_at: string;
  };
}

export default function AdminInvestmentsPage() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState<number | null>(null);
  const [rejecting, setRejecting] = useState<number | null>(null);
  const [selectedProof, setSelectedProof] = useState<string | null>(null);

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    try {
      const res = await fetch('/api/admin/investments/pending');
      const data = await res.json();
      setInvestments(data);
    } catch (err) {
      console.error('Failed to fetch investments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (investmentId: number) => {
    setApproving(investmentId);
    try {
      const res = await fetch(`/api/admin/investments/${investmentId}/approve`, {
        method: 'PATCH'
      });

      if (res.ok) {
        // Remove from pending list
        setInvestments(prev => prev.filter(inv => inv.id !== investmentId));
        alert('Investment approved successfully!');
      } else {
        alert('Failed to approve investment');
      }
    } catch (err) {
      console.error('Approval error:', err);
      alert('Error approving investment');
    } finally {
      setApproving(null);
    }
  };

  const handleReject = async (investmentId: number) => {
    if (!confirm('Are you sure you want to reject this investment? This action cannot be undone.')) {
      return;
    }

    setRejecting(investmentId);
    try {
      const res = await fetch(`/api/admin/investments/${investmentId}/reject`, {
        method: 'PATCH'
      });

      if (res.ok) {
        // Remove from pending list
        setInvestments(prev => prev.filter(inv => inv.id !== investmentId));
        alert('Investment rejected successfully!');
      } else {
        alert('Failed to reject investment');
      }
    } catch (err) {
      console.error('Rejection error:', err);
      alert('Error rejecting investment');
    } finally {
      setRejecting(null);
    }
  };

  const openProofModal = (proofUrl: string) => {
    setSelectedProof(proofUrl);
  };

  const closeProofModal = () => {
    setSelectedProof(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span>Loading investments Requests...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Investment Requests</h1>
          <p className="text-gray-400">Review and approve pending gateway investments</p>
        </div>

        {investments.length === 0 ? (
          <div className="bg-slate-800 rounded-xl p-8 text-center">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Pending Investments</h3>
            <p className="text-gray-400">All investment requests have been processed.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {investments.map((investment) => (
              <div key={investment.id} className="bg-slate-800 rounded-xl p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="bg-blue-600 rounded-full p-2">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">
                          {investment.user.first_name} {investment.user.last_name}
                        </h3>
                        <p className="text-gray-400 text-sm">{investment.user.email}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="bg-slate-700 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-1">
                          <DollarSign className="w-4 h-4 text-green-400" />
                          <span className="text-sm text-gray-400">Amount</span>
                        </div>
                        <p className="text-xl font-bold">${investment.invest_amount}</p>
                      </div>

                      <div className="bg-slate-700 rounded-lg p-4">
                        <p className="text-sm text-gray-400 mb-1">Bot Schema</p>
                        <p className="font-semibold">{investment.bot.name}</p>
                      </div>

                      <div className="bg-slate-700 rounded-lg p-4">
                        <p className="text-sm text-gray-400 mb-1">Wallet Type</p>
                        <p className="font-semibold capitalize">{investment.wallet}</p>
                      </div>

                      {investment.wallet === 'gateway' && investment.payment_proof && (
                        <div className="bg-slate-700 rounded-lg p-4">
                          <p className="text-sm text-gray-400 mb-2">Payment Proof</p>
                          <div className="flex items-center space-x-2">
                            <img 
                              src={investment.payment_proof.proof_url} 
                              alt="Payment proof"
                              className="w-12 h-12 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() => openProofModal(investment.payment_proof!.proof_url)}
                            />
                            <button
                              onClick={() => openProofModal(investment.payment_proof!.proof_url)}
                              className="text-blue-400 hover:text-blue-300 text-sm flex items-center space-x-1"
                            >
                              <Eye className="w-4 h-4" />
                              <span>View</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="bg-slate-700 rounded-lg p-4 mb-4">
                      <p className="text-sm text-gray-400 mb-1">Bot Description</p>
                      <p className="text-sm">{investment.bot.description}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-gray-400">
                          Submitted: {new Date(investment.created_at).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApprove(investment.id)}
                          disabled={approving === investment.id}
                          className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                        >
                          {approving === investment.id ? (
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
                          onClick={() => handleReject(investment.id)}
                          disabled={rejecting === investment.id}
                          className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                        >
                          {rejecting === investment.id ? (
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

        {/* Proof Modal */}
        {selectedProof && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="relative max-w-4xl max-h-full">
              <button
                onClick={closeProofModal}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 flex items-center space-x-2"
              >
                <X className="w-6 h-6" />
                <span>Close</span>
              </button>
              <img 
                src={selectedProof} 
                alt="Payment proof full size"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}