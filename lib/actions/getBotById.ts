// lib/actions/getBotById.ts
'use server';

import prisma from '@/lib/prisma';

export async function getBotById(botId: number) {
  try {
    const bot = await prisma.bots.findUnique({
      where: { id: botId }
    });
    
    if (!bot) return null;
    
    // Convert Decimals to numbers for client components
    return {
      ...bot,
      min_invest: bot.min_invest?.toNumber() ?? null,
      max_invest: bot.max_invest?.toNumber() ?? null,
      return_percentage: Number(bot.return_percentage) ?? null,
    };
  } catch (error) {
    console.error('Error fetching bot:', error);
    return null;
  }
}