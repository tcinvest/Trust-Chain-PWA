// lib/actions/admin/bots.ts
'use server';

import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

type UpdateBotInput = Prisma.botsUpdateInput;

export async function getAllBots() {
  return await prisma.bots.findMany({ orderBy: { id: 'asc' } });
}

export async function updateBot(id: number, data: UpdateBotInput) {
  return await prisma.bots.update({
    where: { id },
    data
  });
}
