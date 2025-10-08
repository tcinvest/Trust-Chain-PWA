'use server';

import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

type UpdateBotInput = Prisma.botsUpdateInput;

export async function getAllBots() {
  const bots = await prisma.bots.findMany({ orderBy: { id: 'asc' } });
  return bots.map(bot => ({
    ...bot,
    return_percentage: bot.return_percentage !== null ? Number(bot.return_percentage) : null,
    min_invest: bot.min_invest !== null ? Number(bot.min_invest) : null,
    max_invest: bot.max_invest !== null ? Number(bot.max_invest) : null,
  }));
}

export async function updateBot(id: number, data: UpdateBotInput) {
  return await prisma.bots.update({
    where: { id },
    data
  });
}