'use server';

import prisma from '@/lib/prisma';

export async function getReferralProfit(userId: number): Promise<number> {
  const record = await prisma.referral_profit.findUnique({
    where: { user_id: userId },
    select: { balance: true },
  });

  return record?.balance?.toNumber() ?? 0;
}
