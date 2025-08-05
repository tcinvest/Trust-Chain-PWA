import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { getUserData } from '@/lib/actions/GetUserData';

export async function POST() {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserData(clerkId);
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const userId = user.id;

    // Get user's referral link
    const referralLink = await prisma.referral_links.findFirst({
      where: { user_id: userId },
      select: { id: true, code: true },
    });

    if (!referralLink) {
      return NextResponse.json({
        success: true,
        data: {
          totalEarned: 0,
          totalReferrals: 0,
          referralCode: 'No referral code found',
          referralLink: `${process.env.NEXT_PUBLIC_APP_URL}/sign-up?ref=NOCODE`,
          recentReferrals: [],
          referralTransactions: [],
        },
      });
    }

    // Get all referral relationships for this user with user details
    const relationships = await prisma.referral_relationships.findMany({
      where: { referral_link_id: referralLink.id },
      orderBy: { created_at: 'desc' }
    });

    // Get user details for the referred users (filter out null user_ids)
    const userIds = relationships.map(rel => rel.user_id).filter((id): id is number => id !== null);
    const referredUsers = await prisma.users.findMany({
      where: { id: { in: userIds } },
      select: { id: true, first_name: true, last_name: true, username: true }
    });

    // Create a map for quick lookup
    const userMap = new Map();
    referredUsers.forEach(user => {
      const displayName = user.first_name && user.last_name
         ? `${user.first_name} ${user.last_name}`.trim()
        : user.username || `User ${user.id}`;
      userMap.set(user.id, displayName);
    });

    // Calculate total earned from transactions (referral + bonus types)
    const totalEarnedResult = await prisma.transactions.aggregate({
      where: {
        user_id: userId,
        type: {
          in: ['referral', 'bonus']
        }
      },
      _sum: {
        amount: true
      }
    });

    // Get referral transactions with details
    const referralTransactions = await prisma.transactions.findMany({
      where: {
        user_id: userId,
        type: {
          in: ['referral', 'bonus']
        }
      },
      orderBy: { created_at: 'desc' },
      take: 10,
      select: {
        id: true,
        amount: true,
        type: true,
        description: true,
        status: true,
        created_at: true
      }
    });

    const totalEarned = totalEarnedResult._sum.amount || 0;

    const response = {
      success: true,
      data: {
        totalEarned: Number(totalEarned),
        totalReferrals: relationships.length,
        referralCode: referralLink.code,
        referralLink: `${process.env.NEXT_PUBLIC_APP_URL}/sign-up?ref=${referralLink.code}`,
        recentReferrals: relationships.slice(0, 5).map((rel) => ({
          id: rel.id.toString(),
          name: userMap.get(rel.user_id) || `User ${rel.user_id}`,
          joinedAt: rel.created_at || new Date().toISOString(),
        })),
        referralTransactions: referralTransactions.map((txn) => ({
          id: txn.id.toString(),
          amount: Number(txn.amount || 0),
          type: txn.type || 'referral',
          description: txn.description || 'Referral bonus',
          status: txn.status || 'completed',
          createdAt: txn.created_at || new Date().toISOString(),
        })),
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('[REFERRAL_STATS_ERROR]', error);
    return NextResponse.json(
      { success: false, message: 'Server error occurred.' },
      { status: 500 }
    );
  }
}