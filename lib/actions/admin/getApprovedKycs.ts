// lib/actions/admin/getApprovedKycs.ts
'use server';
import prisma from '@/lib/prisma';

export async function getApprovedKycs() {
  const users = await prisma.users.findMany({
    where: {
      kyc: 2,
      NOT: { kyc_credential: null },
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      clerk_id: true,
      kyc_credential: true,
      updated_at: true,
    },
    orderBy: {
      updated_at: 'desc',
    },
  });

  return users;
}