// app/api/crypto-currencies/upload-qr/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { v2 as cloudinary } from 'cloudinary';
import prisma from '@/lib/prisma';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    // Verify user authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get form data
    const formData = await request.formData();
    const qrCodeFile = formData.get('qr_code') as File;
    const cryptoId = formData.get('crypto_id') as string;

    // Validate required fields
    if (!qrCodeFile || !cryptoId) {
      return NextResponse.json({ 
        error: 'Missing required fields (qr_code file and crypto_id)' 
      }, { status: 400 });
    }

    // Validate file type
    const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!ALLOWED_TYPES.includes(qrCodeFile.type)) {
      return NextResponse.json({ 
        error: 'File type not supported. Please use JPEG, PNG, or WebP format.' 
      }, { status: 400 });
    }

    // Validate file size (5MB limit)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (qrCodeFile.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        error: 'File size too large.' 
      }, { status: 400 });
    }

    // Verify crypto currency exists
    const cryptoExists = await prisma.crypto_currencies.findUnique({
      where: { id: parseInt(cryptoId) },
    });

    if (!cryptoExists) {
      return NextResponse.json({ 
        error: 'Crypto currency not found' 
      }, { status: 404 });
    }

    console.log(`Uploading QR code for crypto ID: ${cryptoId}, size: ${(qrCodeFile.size / 1024 / 1024).toFixed(2)}MB`);

    // Upload to Cloudinary
    const bytes = await qrCodeFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    //eslint-disable-next-line 
    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'crypto_qr_codes',
          resource_type: 'image',
          transformation: [
            { quality: 'auto', fetch_format: 'auto' },
            { width: 400, height: 400, crop: 'limit' } // Resize if too large
          ]
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            console.log('QR code uploaded successfully to Cloudinary');
            resolve(result);
          }
        }
      ).end(buffer);
    });

    if (!uploadResult?.secure_url) {
      throw new Error('Failed to get upload URL from Cloudinary');
    }

    // Update the crypto currency record with the new QR code URL
    const updatedCrypto = await prisma.crypto_currencies.update({
      where: { id: parseInt(cryptoId) },
      data: {
        qr_code_image: uploadResult.secure_url,
        updated_at: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'QR code uploaded successfully',
      qr_code_url: uploadResult.secure_url,
      crypto: updatedCrypto
    });

  } catch (error) {
    console.error('QR code upload error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Upload failed. Please try again.' 
      },
      { status: 500 }
    );
  }
}