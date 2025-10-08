// app/api/cron/process-daily-returns/route.ts
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    
    // Get all ongoing investments
    const investments = await prisma.invests.findMany({
      where: { 
        status: 'ongoing'
      }
    });

    if (investments.length === 0) {
      return Response.json({ 
        success: true, 
        processed: 0,
        message: "No ongoing investments to process" 
      });
    }

    let totalProcessed = 0;
    let totalCredited = 0;

    // Process each investment
    for (const investment of investments) {
      if (!investment.created_at || !investment.schema_id || !investment.user_id) continue;

      // Get bot config
      const bot = await prisma.bots.findUnique({
        where: { id: investment.schema_id }
      });

      if (!bot || !bot.return_percentage) continue;

      const startDate = new Date(investment.created_at.replace(' ', 'T'));
      const daysPassed = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const daysCredited = investment.days_credited || 0;

      // Check if investment period is complete (only for fixed duration plans)
      if (bot.days !== null && daysPassed >= bot.days) {
        // Investment completed - will be handled by processCompletedInvestments
        continue;
      }

      // Calculate days to credit
      const daysToCredit = daysPassed - daysCredited;

      if (daysToCredit > 0) {
        const investAmount = investment.invest_amount?.toNumber() || 0;
        const dailyRate = Number(bot.return_percentage) / 100;
        const dailyProfit = investAmount * dailyRate;
        const totalDailyCredit = dailyProfit * daysToCredit;

        await prisma.$transaction(async (tx) => {
          // Get current user balance
          const user = await tx.users.findUnique({
            where: { id: investment.user_id! },
            select: { profit_balance: true }
          });

          if (!user) {
            throw new Error("User not found");
          }

          const currentProfitBalance = user.profit_balance?.toNumber() || 0;
          
          // Update profit balance
          await tx.users.update({
            where: { id: investment.user_id! },
            data: {
              profit_balance: currentProfitBalance + totalDailyCredit,
              updated_at: new Date().toISOString()
            }
          });

          // Create transaction record
          await tx.transactions.create({
            data: {
              user_id: investment.user_id!,
              amount: totalDailyCredit,
              final_amount: totalDailyCredit,
              type: 'interest',
              description: `Daily return - ${daysToCredit} day(s)`,
              status: 'completed',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }
          });

          // Update investment tracking
          await tx.invests.update({
            where: { id: investment.id },
            data: {
              days_credited: daysPassed,
              last_credited_date: now,
              updated_at: new Date().toISOString()
            }
          });
        });

        totalProcessed++;
        totalCredited += totalDailyCredit;
      }
    }

    return Response.json({
      success: true,
      processed: totalProcessed,
      totalCredited: totalCredited,
      timestamp: now.toISOString()
    });

  } catch (error) {
    console.error("Daily returns processing error:", error);
    return Response.json({ 
      error: error instanceof Error ? error.message : "Something went wrong" 
    }, { status: 500 });
  }
}