// /app/api/referral/stats/route.ts
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

    // Step 1: Get user's referral link
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
          activeReferrals: 0,
          pendingRewards: 0,
          referralCode: `REF${userId}`,
          referralLink: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}?ref=REF${userId}`,
          recentReferrals: [],
        },
      });
    }

    const relationships = await prisma.referral_relationships.findMany({
      where: { referral_link_id: referralLink.id },
      orderBy: { created_at: 'desc' },
      take: 10,
    });

    const relationshipIds = relationships.map((rel) => rel.id);

    const earnings = await prisma.referrals.findMany({
      where: { referral_target_id: { in: relationshipIds } },
    });

    const totalEarned = earnings
      .filter((e) => e.status === 1)
      .reduce((sum, e) => sum + Number(e.bounty || 0), 0);

    const pendingRewards = earnings
      .filter((e) => e.status === 0)
      .reduce((sum, e) => sum + Number(e.bounty || 0), 0);

    const response = {
      success: true,
      data: {
        totalEarned,
        totalReferrals: relationships.length,
        activeReferrals: earnings.filter((e) => e.status === 1).length,
        pendingRewards,
        referralCode: referralLink.code,
        referralLink: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}?ref=${referralLink.code}`,
        recentReferrals: relationships.slice(0, 5).map((rel) => {
          const matched = earnings.find((e) => e.referral_target_id === rel.id);
          return {
            id: rel.id.toString(),
            name: `User ${rel.user_id}`,
            joinedAt: rel.created_at?.toString() || new Date().toISOString(),
            earned: matched?.bounty || 0,
            status: matched?.status === 1 ? 'active' : 'inactive',
          };
        }),
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
