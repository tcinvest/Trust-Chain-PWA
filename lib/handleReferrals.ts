// lib/handle-referral.ts
import prisma from '@/lib/prisma';

export const processReferralSignup = async (userId: number, referralCode: string) => {
  try {
    // Find the referral link by code
    const referralLink = await prisma.referral_links.findFirst({
      where: { code: referralCode }
    });

    if (referralLink) {
      // Create referral relationship
      await prisma.referral_relationships.create({
        data: {
          referral_link_id: referralLink.id,
          user_id: userId,
          created_at: new Date().toISOString(),
        }
      });

      console.log(`Referral processed: User ${userId} referred by ${referralCode}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Referral processing error:', error);
    return false;
  }
};