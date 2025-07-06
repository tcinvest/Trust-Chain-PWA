// app/admin/kyc-review/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { updateKycStatus } from '@/lib/actions/admin/updateKycStatus';
import { getPendingKycs } from '@/lib/actions/admin/getPendingKycs';

export default function AdminKycReviewPage() {
  const [kycUsers, setKycUsers] = useState<any[]>([]);
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

  if (loading) return <p className="p-6">Loading...</p>;

  if (kycUsers.length === 0) return <p className="p-6">No pending KYCs.</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">KYC Review</h1>
      <div className="space-y-6">
      {kycUsers.map((user) => {
        let kyc: any = {};
        try {
          kyc = JSON.parse(user.kyc_credential || '{}');
        } catch (err) {
          console.warn('Invalid JSON in kyc_credential for user', user.id);
          return null; // Skip rendering this user
        }

        const docType = kyc.kyc_type_of_name;
        const front = kyc[docType]?.front;
        const back = kyc[docType]?.back;

        return (
          <div key={user.id} className="border rounded-xl p-4">
            <p className="font-semibold mb-2">
              {user.first_name} {user.last_name} — {docType}
            </p>
            <div className="flex gap-4">
              <img src={front} alt="front" className="w-48 rounded border" />
              <img src={back} alt="back" className="w-48 rounded border" />
            </div>
            <div className="flex mt-4 gap-2">
              <button
                onClick={() => handleAction(user.clerk_id, 2, '')}
                className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded text-sm"
              >
                Approve
              </button>
              <button
                onClick={() => {
                  const reason = prompt("Enter rejection reason:");
                  if (reason) handleAction(user.clerk_id, 3, reason);
                }}
                className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-sm"
              >
                Reject
              </button>
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
}