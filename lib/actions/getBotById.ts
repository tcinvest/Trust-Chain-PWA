// lib/actions/getBotById.ts
'use server';

import  prisma from '@/lib/prisma';

export async function getBotById(botId: number) {
  try {
    const bot = await prisma.bots.findUnique({
      where: { id: botId }
    });
    return bot;
  } catch (error) {
    console.error('Error fetching bot:', error);
    return null;
  }
}
