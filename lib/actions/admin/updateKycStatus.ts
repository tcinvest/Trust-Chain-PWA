// lib/actions/admin/updateKycStatus.ts
'use server';
import prisma from '@/lib/prisma';

interface KycData {
  [key: string]: string | number | boolean | null | undefined;
  "Action Message"?: string;
}

export async function updateKycStatus(clerkId: string, newStatus: number, reason: string) {
  const user = await prisma.users.findUnique({
    where: { clerk_id: clerkId },
  });

  if (!user) return;

  let kycData: KycData = {};

  try {
    kycData = JSON.parse(user.kyc_credential || '{}');
  } catch {
  }

  kycData["Action Message"] = newStatus === 3 ? reason : "";

  await prisma.users.update({
    where: { clerk_id: clerkId },
    data: {
      kyc: newStatus,
      kyc_credential: JSON.stringify(kycData),
      updated_at: new Date().toISOString()
    }
  });
}