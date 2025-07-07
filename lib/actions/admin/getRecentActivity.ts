'use server';

import prisma from '@/lib/prisma';

export interface RecentActivityItem {
  id: string;
  type: 'investment' | 'kyc' | 'user_registration';
  message: string;
  timestamp: Date;
  userId?: number;
  userName?: string;
}

export async function getRecentActivity(limit: number = 10): Promise<RecentActivityItem[]> {
  try {
    const activities: RecentActivityItem[] = [];

    // Get recent investments (without relationship)
    const recentInvestments = await prisma.invests.findMany({
      take: 5,
      orderBy: { created_at: 'desc' }
    });

    // Get user details for investments
    const investmentUserIds = recentInvestments
      .map(inv => inv.user_id)
      .filter(id => id !== null) as number[];
    
    const investmentUsers = await prisma.users.findMany({
      where: { id: { in: investmentUserIds } },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        username: true
      }
    });

    // Get recent KYC submissions
    const recentKycSubmissions = await prisma.users.findMany({
      take: 5,
      where: {
        kyc: { in: [1, 2, 3] },
        kyc_credential: { not: null },
        updated_at: { not: null }
      },
      orderBy: { updated_at: 'desc' },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        username: true,
        kyc: true,
        updated_at: true
      }
    });

    // Get recent user registrations
    const recentUsers = await prisma.users.findMany({
      take: 5,
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        username: true,
        created_at: true
      }
    });

    // Process investments with manual user lookup
    recentInvestments.forEach(investment => {
      const user = investmentUsers.find(u => u.id === investment.user_id);
      const userName = user?.first_name && user?.last_name
        ? `${user.first_name} ${user.last_name}`
        : user?.username || 'Unknown User';

      activities.push({
        id: `investment-${investment.id}`,
        type: 'investment',
        message: `${userName} created a new investment of $${investment.invest_amount}`,
        timestamp: new Date(investment.created_at || Date.now()),
        userId: user?.id,
        userName
      });
    });

    // Process KYC submissions
    recentKycSubmissions.forEach(user => {
      const userName = user.first_name && user.last_name
        ? `${user.first_name} ${user.last_name}`
        : user.username || 'Unknown User';

      let kycStatus = '';
      switch(user.kyc) {
        case 1:
          kycStatus = 'submitted KYC for review';
          break;
        case 2:
          kycStatus = 'had KYC approved';
          break;
        case 3:
          kycStatus = 'had KYC rejected';
          break;
      }

      activities.push({
        id: `kyc-${user.id}`,
        type: 'kyc',
        message: `${userName} ${kycStatus}`,
        timestamp: new Date(user.updated_at || Date.now()),
        userId: user.id,
        userName
      });
    });

    // Process user registrations
    recentUsers.forEach(user => {
      const userName = user.first_name && user.last_name
        ? `${user.first_name} ${user.last_name}`
        : user.username || 'New User';

      activities.push({
        id: `user-${user.id}`,
        type: 'user_registration',
        message: `${userName} registered`,
        timestamp: new Date(user.created_at || Date.now()),
        userId: user.id,
        userName
      });
    });

    // Sort all activities by timestamp and limit
    return activities
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);

  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return [];
  }
}