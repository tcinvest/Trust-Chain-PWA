// app/api/admin/complaints/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Get total count
    const total = await prisma.support_complaints.count();

    // Get complaints ordered by latest first
    const complaints = await prisma.support_complaints.findMany({
      orderBy: {
        created_at: 'desc'
      },
      skip,
      take: limit,
    });

    return NextResponse.json({
      complaints,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error('Error fetching complaints:', error);
    return NextResponse.json(
      { error: 'Failed to fetch complaints' },
      { status: 500 }
    );
  }
}