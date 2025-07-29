import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { getUserData } from '@/lib/actions/GetUserData';

export async function POST(request: Request) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserData(clerkId);
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const { type, page = 1, limit = 50 } = body;

    if (!type || !['referrals', 'earnings'].includes(type)) {
      return NextResponse.json({ success: false, message: 'Invalid type parameter' }, { status: 400 });
    }

    const userId = user.id;
    const offset = (page - 1) * limit;

    if (type === 'referrals') {
      // Get user's referral link
      const referralLink = await prisma.referral_links.findFirst({
        where: { user_id: userId },
        select: { id: true },
      });

      if (!referralLink) {
        return NextResponse.json({
          success: true,
          data: {
            items: [],
            hasMore: false,
            total: 0,
          },
        });
      }

      // Get total count
      const totalCount = await prisma.referral_relationships.count({
        where: { referral_link_id: referralLink.id },
      });

      // Get paginated referral relationships
      const relationships = await prisma.referral_relationships.findMany({
        where: { referral_link_id: referralLink.id },
        orderBy: { created_at: 'desc' },
        skip: offset,
        take: limit,
      });

      // Get user details for the referred users
      const userIds = relationships.map(rel => rel.user_id).filter((id): id is number => id !== null);
      const referredUsers = await prisma.users.findMany({
        where: { id: { in: userIds } },
        select: { id: true, first_name: true, last_name: true, username: true }
      });

      // Create user map
      const userMap = new Map();
      referredUsers.forEach(user => {
        const displayName = user.first_name && user.last_name
          ? `${user.first_name} ${user.last_name}`.trim()
          : user.username || `User ${user.id}`;
        userMap.set(user.id, displayName);
      });

      const items = relationships.map((rel) => ({
        id: rel.id.toString(),
        name: userMap.get(rel.user_id) || `User ${rel.user_id}`,
        joinedAt: rel.created_at || new Date().toISOString(),
      }));

      return NextResponse.json({
        success: true,
        data: {
          items,
          hasMore: offset + limit < totalCount,
          total: totalCount,
        },
      });

    } else if (type === 'earnings') {
      // Get total count of transactions
      const totalCount = await prisma.transactions.count({
        where: {
          user_id: userId,
          type: {
            in: ['referral', 'bonus']
          }
        }
      });

      // Get paginated referral transactions
      const referralTransactions = await prisma.transactions.findMany({
        where: {
          user_id: userId,
          type: {
            in: ['referral', 'bonus']
          }
        },
        orderBy: { created_at: 'desc' },
        skip: offset,
        take: limit,
        select: {
          id: true,
          amount: true,
          type: true,
          description: true,
          status: true,
          created_at: true
        }
      });

      const items = referralTransactions.map((txn) => ({
        id: txn.id.toString(),
        amount: Number(txn.amount || 0),
        type: txn.type || 'referral',
        description: txn.description || 'Referral bonus',
        status: txn.status || 'completed',
        createdAt: txn.created_at || new Date().toISOString(),
      }));

      return NextResponse.json({
        success: true,
        data: {
          items,
          hasMore: offset + limit < totalCount,
          total: totalCount,
        },
      });
    }

  } catch (error) {
    console.error('[REFERRAL_ALL_ERROR]', error);
    return NextResponse.json(
      { success: false, message: 'Server error occurred.' },
      { status: 500 }
    );
  }
}