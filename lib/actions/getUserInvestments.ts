'use server';

import prisma from '@/lib/prisma';

export async function getUserInvestments(userId: number) {
  try {
    const investments = await prisma.invests.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });

    return investments.map(investment => ({
      ...investment,
      invest_amount: investment.invest_amount?.toNumber() || 0,
      total_profit_amount: investment.total_profit_amount?.toNumber() || 0,
    }));
  } catch (error) {
    console.error('Error fetching user investments:', error);
    return [];
  }
}