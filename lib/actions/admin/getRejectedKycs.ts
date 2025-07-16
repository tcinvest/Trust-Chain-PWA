// lib/actions/admin/getRejectedKycs.ts
'use server';
import prisma from '@/lib/prisma';

export async function getRejectedKycs() {
  const users = await prisma.users.findMany({
    where: {
      kyc: 3,
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