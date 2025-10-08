// lib/actions/processCompletedInvestments.ts
'use server';

import prisma from '@/lib/prisma';

export async function processCompletedInvestments(userId: number) {
  try {
    const investments = await prisma.invests.findMany({
      where: { 
        user_id: userId,
        status: 'ongoing'
      },
    });

    if (investments.length === 0) return { success: true, processed: 0 };

    const now = new Date();
    const completedInvestmentIds: number[] = [];

    for (const investment of investments) {
      if (!investment.created_at || !investment.schema_id) continue;

      const startDate = new Date(investment.created_at.replace(' ', 'T'));
      
      const botConfig = await prisma.bots.findUnique({
        where: { id: investment.schema_id }
      });

      if (!botConfig?.days) continue;

      const daysPassed = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // Only process if completed AND not yet processed
      if (daysPassed >= botConfig.days && investment.total_profit_amount === null) {
        completedInvestmentIds.push(investment.id);
      }
    }

    if (completedInvestmentIds.length === 0) return { success: true, processed: 0 };

    // Just mark as completed, no balance changes
    await prisma.$transaction(async (tx) => {
      const currentDateTime = new Date().toISOString().replace('T', ' ').split('.')[0];

      await Promise.all(
        completedInvestmentIds.map(id =>
          tx.invests.update({
            where: { id },
            data: {
              status: 'completed',
              total_profit_amount: 0, // Mark as processed
              updated_at: currentDateTime,
            }
          })
        )
      );
    });

    return { 
      success: true, 
      processed: completedInvestmentIds.length
    };

  } catch (error) {
    console.error('Error processing completed investments:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}