// lib/db.ts
import prisma from '@/lib/prisma'; // Adjust path to your prisma client

export async function getAllInvestments() {
  return await prisma.invests.findMany({
    orderBy: { created_at: 'desc' }
  });
}

export async function getInvestmentStats() {
  const [total, totalAmount, totalProfit] = await Promise.all([
    prisma.invests.count(),
    prisma.invests.aggregate({
      _sum: { invest_amount: true }
    }),
    prisma.invests.aggregate({
      _sum: { total_profit_amount: true }
    })
  ]);

  return {
    total,
    totalAmount: totalAmount._sum.invest_amount || 0,
    totalProfit: totalProfit._sum.total_profit_amount || 0
  };
}