// app/api/bots/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const bots = await prisma.bots.findMany({
    where: { is_active: true },
    orderBy: { id: 'asc' },
  });

  return NextResponse.json(bots);
}
