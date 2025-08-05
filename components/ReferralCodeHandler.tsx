// components/ReferralCodeHandler.tsx
'use client';

import { useEffect } from 'react';

export default function ReferralCodeHandler() {
  useEffect(() => {
    // Get referral code from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    
    if (refCode) {
      // Store referral code in cookie for 7 days
      document.cookie = `referral_code=${refCode}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
      console.log(`Referral code ${refCode} stored in cookie`);
    }
  }, []);

  return null;
}