// lib/actions/getBots.ts
'use server';

import prisma from '@/lib/prisma';

export async function getBots() {
  return await prisma.bots.findMany({
    where: { is_active: true },
    orderBy: { id: 'asc' }
  });
}
