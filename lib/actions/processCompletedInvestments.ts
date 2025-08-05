// lib/actions/processCompletedInvestments.ts
'use server';

import prisma from '@/lib/prisma';

type CompletedInvestment = {
  id: number;
  user_id: number;
  invest_amount: number;
  total_profit_amount: number;
};

export async function processCompletedInvestments(userId: number) {
  try {
    // Get user's ongoing investments
    const investments = await prisma.invests.findMany({
      where: { 
        user_id: userId,
        status: 'ongoing'
      },
    });

    if (investments.length === 0) return { success: true, processed: 0 };

    const now = new Date();
    const completedInvestments: CompletedInvestment[] = [];

    // Check which investments are completed
    for (const investment of investments) {
      if (!investment.created_at) continue;

      // Parse the created_at date and get bot configuration
      const startDate = new Date(investment.created_at.replace(' ', 'T'));
      
      // Get bot configuration to determine duration
      let botConfig = null;
      if (investment.schema_id) {
        botConfig = await prisma.bots.findUnique({
          where: { id: investment.schema_id }
        });
      }

      if (!botConfig || !botConfig.days) continue;

      // Calculate if investment is completed
      const daysPassed = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysPassed >= botConfig.days) {
        const investAmount = investment.invest_amount?.toNumber() || 0;
        const returnPercentage = botConfig.return_percentage || 0;
        
        // Calculate total profit if not already set
        const totalProfit = investment.total_profit_amount?.toNumber() || 
          (investAmount * returnPercentage / 100);

        completedInvestments.push({
          id: investment.id,
          user_id: investment.user_id!,
          invest_amount: investAmount,
          total_profit_amount: totalProfit,
        });
      }
    }

    if (completedInvestments.length === 0) return { success: true, processed: 0 };

    // Process all completed investments in a transaction
    await prisma.$transaction(async (tx) => {
      // Get current user balance
      const user = await tx.users.findUnique({
        where: { id: userId },
        select: { balance: true, profit_balance: true }
      });

      if (!user) throw new Error('User not found');

      // Convert Decimal to number for calculations
      const currentBalance = typeof user.balance === 'number' ? user.balance : user.balance?.toNumber() || 0;
      const currentProfitBalance = typeof user.profit_balance === 'number' ? user.profit_balance : user.profit_balance?.toNumber() || 0;

      let totalCapitalReturn = 0;
      let totalProfitReturn = 0;

      // Calculate totals
      for (const investment of completedInvestments) {
        totalCapitalReturn += investment.invest_amount;
        totalProfitReturn += investment.total_profit_amount;
      }

      // Update user balances
      await tx.users.update({
        where: { id: userId },
        data: {
          balance: currentBalance + totalCapitalReturn,
          profit_balance: currentProfitBalance + totalProfitReturn,
        }
      });

      // Create transaction records
      const transactionPromises = [];
      const currentDateTime = new Date().toISOString().replace('T', ' ').split('.')[0];

      // Capital return transaction
      if (totalCapitalReturn > 0) {
        transactionPromises.push(
          tx.transactions.create({
            data: {
              user_id: userId,
              amount: totalCapitalReturn,
              final_amount: totalCapitalReturn,
              type: 'capital_return',
              description: 'Investment capital return',
              status: 'completed',
              created_at: currentDateTime,
              updated_at: currentDateTime,
            }
          })
        );
      }

      // Profit completion transaction
      if (totalProfitReturn > 0) {
        transactionPromises.push(
          tx.transactions.create({
            data: {
              user_id: userId,
              amount: totalProfitReturn,
              final_amount: totalProfitReturn,
              type: 'profit_completion',
              description: 'Investment profit completion',
              status: 'completed',
              created_at: currentDateTime,
              updated_at: currentDateTime,
            }
          })
        );
      }

      await Promise.all(transactionPromises);

      // Update investment statuses to completed and set total_profit_amount
      await Promise.all(
        completedInvestments.map(investment =>
          tx.invests.update({
            where: { id: investment.id },
            data: {
              status: 'completed',
              total_profit_amount: investment.total_profit_amount,
              updated_at: new Date().toISOString().replace('T', ' ').split('.')[0],
            }
          })
        )
      );
    });

    return { 
      success: true, 
      processed: completedInvestments.length,
      totalCapitalReturned: completedInvestments.reduce((sum, inv) => sum + inv.invest_amount, 0),
      totalProfitCredited: completedInvestments.reduce((sum, inv) => sum + inv.total_profit_amount, 0)
    };

  } catch (error) {
    console.error('Error processing completed investments:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}