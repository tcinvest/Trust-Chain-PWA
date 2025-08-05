// lib/actions/admin/getPendingKycs.ts
'use server';

import  prisma  from '@/lib/prisma';

export async function getPendingKycs() {
  const users = await prisma.users.findMany({
    where: {
      kyc: 1,
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
  });

  return users;
}
