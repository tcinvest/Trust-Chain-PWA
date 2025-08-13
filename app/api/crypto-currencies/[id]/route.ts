// app/api/crypto-currencies/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    // Verify user authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the ID from params (await in Next.js 15)
    const { id } = await context.params;
    const cryptoId = parseInt(id);
    
    if (isNaN(cryptoId)) {
      return NextResponse.json({ error: 'Invalid crypto ID' }, { status: 400 });
    }

    // Parse request body
    const body = await request.json();
    const { name, wallet_address, qr_code_image } = body;

    // Validate required fields
    if (!name?.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    if (!wallet_address?.trim()) {
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
    }

    // Check if crypto currency exists
    const existingCrypto = await prisma.crypto_currencies.findUnique({
      where: { id: cryptoId }
    });

    if (!existingCrypto) {
      return NextResponse.json({ error: 'Crypto currency not found' }, { status: 404 });
    }

    // Update the crypto currency
    const updatedCrypto = await prisma.crypto_currencies.update({
      where: { id: cryptoId },
      data: {
        name: name.trim(),
        wallet_address: wallet_address.trim(),
        qr_code_image: qr_code_image || existingCrypto.qr_code_image,
        updated_at: new Date(),
      },
    });

    console.log(`Successfully updated crypto: ${updatedCrypto.name} (ID: ${cryptoId})`);

    return NextResponse.json({
      success: true,
      message: 'Crypto currency updated successfully',
      crypto: updatedCrypto
    });

  } catch (error) {
    console.error('PUT /api/crypto-currencies/[id] error:', error);
    
    // Return proper JSON error response
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to update crypto currency',
        success: false
      },
      { status: 500 }
    );
  }
}
