// app/admin/kyc-review/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { updateKycStatus } from '@/lib/actions/admin/updateKycStatus';
import { getPendingKycs } from '@/lib/actions/admin/getPendingKycs';
import { RotateCcw } from 'lucide-react';

interface KycUser {
  id: number;
  clerk_id: string | null;
  first_name: string | null;
  last_name: string | null;
  kyc_credential: string | null;
}

interface KycData {
  kyc_type_of_name: string;
  [key: string]: {
    front: string;
    back: string;
    selfie: string;
  } | string;
}

export default function AdminKycReviewPage() {
  const [kycUsers, setKycUsers] = useState<KycUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKycs = async () => {
      const data = await getPendingKycs();
      setKycUsers(data);
      setLoading(false);
    };

    fetchKycs();
  }, []);

  const handleAction = async (clerkId: string, status: number, reason: string) => {
    await updateKycStatus(clerkId, status, reason);
    setKycUsers((prev) => prev.filter((u) => u.clerk_id !== clerkId));
  };

  const handleReset = async (clerkId: string) => {
    const confirmed = confirm("Are you sure you want to reset this KYC to not started?");
    if (confirmed) {
      await updateKycStatus(clerkId, 0, "Reset to not started");
      setKycUsers((prev) => prev.filter((u) => u.clerk_id !== clerkId));
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  if (kycUsers.length === 0) return <p className="p-6">No pending KYCs.</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl text-gray-800 font-bold mb-4">KYC Review</h1>
      <div className="space-y-6">
      {kycUsers.map((user) => {
        let kyc: KycData = { kyc_type_of_name: '' };
        try {
          kyc = JSON.parse(user.kyc_credential || '{}');
        } catch {
          console.warn('Invalid JSON in kyc_credential for user', user.id);
          return null; // Skip rendering this user
        }

        const docType = kyc.kyc_type_of_name;
        const docData = kyc[docType] as { front: string; back: string; selfie: string } | undefined;
        const front = docData?.front;
        const back = docData?.back;
        const selfie = docData?.selfie;

        return (
          <div key={user.id} className="border text-gray-700 rounded-xl p-4">
            <p className="font-semibold mb-2">
              {user.first_name || 'N/A'} {user.last_name || 'N/A'} — {docType}
            </p>
            
            {/* Document Images */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Document Images</h3>
              <div className="flex gap-4">
                <div className="text-center">
                  <img src={front} alt="front" className="w-48 rounded border" />
                  <p className="text-xs text-gray-500 mt-1">Front Side</p>
                </div>
                <div className="text-center">
                  <img src={back} alt="back" className="w-48 rounded border" />
                  <p className="text-xs text-gray-500 mt-1">Back Side</p>
                </div>
              </div>
            </div>

            {/* Selfie Image */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Selfie with ID</h3>
              <div className="text-center">
                <img src={selfie} alt="selfie" className="w-48 rounded border" />
                <p className="text-xs text-gray-500 mt-1">Selfie Holding ID</p>
              </div>
            </div>

            <div className="flex mt-4 gap-2">
              <button
                onClick={() => user.clerk_id && handleAction(user.clerk_id, 2, '')}
                className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded text-sm"
              >
                Approve
              </button>
              <button
                onClick={() => {
                  const reason = prompt("Enter rejection reason:");
                  if (reason && user.clerk_id) handleAction(user.clerk_id, 3, reason);
                }}
                className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-sm"
              >
                Reject
              </button>
              <button
                onClick={() => user.clerk_id && handleReset(user.clerk_id)}
                className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-3 rounded text-sm flex items-center justify-center"
                title="Reset KYC Status"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
}