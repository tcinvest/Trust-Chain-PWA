import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const bots = await prisma.bots.findMany({
    where: { is_active: true },
    orderBy: { id: 'asc' },
  });

  const formattedBots = bots.map((bot) => ({
    ...bot,
    return_percentage: bot.return_percentage !== null
      ? Number(bot.return_percentage)
      : null,
    min_invest: bot.min_invest !== null ? Number(bot.min_invest) : null,
    max_invest: bot.max_invest !== null ? Number(bot.max_invest) : null,
  }));

  return NextResponse.json(formattedBots);
}
