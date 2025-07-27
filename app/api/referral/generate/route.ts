// pages/api/referral/generate.ts or app/api/referral/generate/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Get current user ID from auth (this is Clerk's user ID)
    const { userId: clerkUserId } = getAuth(request);
    
    if (!clerkUserId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Find your internal user record using the Clerk ID
    const user = await prisma.users.findFirst({
      where: { 
        clerk_id: clerkUserId // or whatever field you use to store Clerk ID
      }
    });
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Now use your internal user ID
    const internalUserId = user.id;

    // Check if user already has a referral code
    const existingReferral = await prisma.referral_links.findFirst({
      where: { user_id: internalUserId }
    });

    if (existingReferral) {
      return NextResponse.json(
        { success: false, error: 'Referral code already exists' },
        { status: 400 }
      );
    }

    // Generate new referral code
    const newReferralCode = uuidv4();
    
    const referralLink = await prisma.referral_links.create({
      data: {
        user_id: internalUserId,
        code: newReferralCode,
        created_at: new Date().toISOString(),
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        code: referralLink.code,
        created_at: referralLink.created_at
      }
    });

  } catch (error) {
    console.error('Error generating referral code, please try again :', error);
    
    // Return safe error response
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate referral code. Please try again.' 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}