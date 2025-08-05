// app/api/crypto-currencies/route.ts
import { NextResponse } from 'next/server';
import  prisma  from '@/lib/prisma';

export async function GET() {
  try {
    const cryptos = await prisma.crypto_currencies.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(cryptos);
  } catch (error) {
    console.error('Error fetching crypto currencies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch crypto currencies' },
      { status: 500 }
    );
  }
}