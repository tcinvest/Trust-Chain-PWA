// Updated checkUser function
import { currentUser } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import { cookies } from 'next/headers';

// Helper function to handle referral signup
// Updated handleReferralSignup function with transaction creation
// Updated handleReferralSignup function with transaction creation
// Updated handleReferralSignup function with transaction creation
// Updated handleReferralSignup function with transaction creation
const handleReferralSignup = async (newUserId: number, referralCode: string) => {
  try {
    // Find the referral link by code
    const referralLink = await prisma.referral_links.findFirst({
      where: { code: referralCode }
    });

    if (referralLink && referralLink.user_id) {
      // Check if relationship already exists to avoid duplicates
      const existingRelationship = await prisma.referral_relationships.findFirst({
        where: {
          referral_link_id: referralLink.id,
          user_id: newUserId
        }
      });

      if (!existingRelationship) {
        // Use a transaction to ensure atomicity
        await prisma.$transaction(async (tx) => {
          // 1. Create referral relationship
          await tx.referral_relationships.create({
            data: {
              referral_link_id: referralLink.id,
              user_id: newUserId,
              created_at: new Date().toISOString(),
            }
          });

          // 2. Credit the referrer's profit balance
          await tx.users.update({
            where: { id: referralLink.user_id! },
            data: {
              profit_balance: {
                increment: 10.00
              },
              updated_at: new Date().toISOString(),
            }
          });

          // 3. Create transaction record for the referrer
          await tx.transactions.create({
            data: {
              user_id: referralLink.user_id!,
              description: "Referral bonus for new user signup",
              amount: 10.00,
              type: "referral",
              status: "completed",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }
          });
        });

        console.log(`✅ Referral processed: User ${newUserId} referred by user ${referralLink.user_id}, $10 credited`);
      } else {
        console.log('⚠️ Referral relationship already exists');
      }
    } else {
      if (!referralLink) {
        console.log(`❌ Referral code ${referralCode} not found`);
      } else if (!referralLink.user_id) {
        console.log(`❌ Referral link ${referralCode} has no associated user`);
      }
    }
  } catch (error) {
    console.error('💥 Error handling referral signup:', error);
    // Don't throw - we don't want referral errors to break user creation
  }
};


export const checkUser = async () => {
  const user = await currentUser();
     
  if (!user) {
    return null;
  }
   
  // Get referral code from cookie instead of referer header
  const cookieStore = await cookies();
  const referralCode = cookieStore.get('referral_code')?.value;

  let loggedInUser = await prisma.users.findUnique({
    where: {
      clerk_id: user.id,
    },
  });

  if (loggedInUser) {
    return loggedInUser;
  }

  loggedInUser = await prisma.users.findFirst({
    where: {
      email: user.emailAddresses[0].emailAddress,
    },
  });

  if (loggedInUser) {
    const updatedUser = await prisma.users.update({
      where: { id: loggedInUser.id },
      data: { clerk_id: user.id },
    });
    return updatedUser;
  }
     
  // Create new user
  const newUser = await prisma.users.create({
    data: {
      clerk_id: user.id,
      first_name: `${user.firstName}`,
      last_name: `${user.lastName}`,
      username: `${user.username}`,
      avatar: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  });

  // Handle referral if code was captured
  if (referralCode) {
    await handleReferralSignup(newUser.id, referralCode);
  }

  // Auto-create referral link for new user
  try {
    await prisma.referral_links.create({
      data: {
        user_id: newUser.id,
        code: uuidv4(), // Generate UUID like existing users
        created_at: new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error('Error creating referral link:', error);
  }

  return newUser;
};