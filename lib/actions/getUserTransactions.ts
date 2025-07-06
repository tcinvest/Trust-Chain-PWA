// lib/actions/getUserTransactions.ts
'use server';

import prisma from '@/lib/prisma';

export async function getUserTransactions(userId: number, limit?: number) {
  try {
    const transactions = await prisma.transactions.findMany({
      where: {
        user_id: userId,
        type: {
          in: ['signup_bonus','bonus', 'interest', 'refund', 'investment', 'manual_deposit', 'withdraw'],
        },
      },
      orderBy: { created_at: 'desc' },
      ...(limit ? { take: limit } : {}),
    });

    return transactions.map(transaction => ({
      ...transaction,
      amount: transaction.amount?.toNumber() || 0,
      final_amount: transaction.final_amount?.toNumber() || 0,
    }));
  } catch (error) {
    console.error('Error fetching user transactions:', error);
    return [];
  }
}
