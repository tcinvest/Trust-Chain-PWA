'use server';
import prisma from '@/lib/prisma';

export async function getUserData(clerkId: string) {
  try {
    const user = await prisma.users.findUnique({
      where: { clerk_id: clerkId },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        phone: true,
        country: true,
        city: true,
        avatar: true,
        balance: true,
        withdrawals_enabled: true,
        profit_balance: true,
        recovery_fund: true,
        status: true,
        kyc: true,
        created_at: true,
        username: true,
        zip_code: true,
        address: true,
        gender: true,
        date_of_birth: true,
      },
    });

    if (!user) return null;

    // Get total successful withdrawals for this user
    const withdrawalsResult = await prisma.transactions.aggregate({
      where: {
        user_id: user.id,
        type: 'withdraw',
        status: 'success'
      },
      _sum: {
        amount: true
      }
    });

    const totalWithdrawals = withdrawalsResult._sum.amount?.toNumber() || 0;

    // Simple conversion: just use .toNumber() on Decimals
    return {
      ...user,
      balance: user.balance?.toNumber() || 0,
      profit_balance: user.profit_balance?.toNumber() || 0,
      recovery_fund: user.recovery_fund?.toNumber() || 0,
      total_withdrawals: totalWithdrawals,
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}