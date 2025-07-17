// app/api/kyc/upload/route.ts
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
    const documentType = formData.get('documentType') as string;
    const frontFile = formData.get('front') as File;
    const backFile = formData.get('back') as File;
    const selfieFile = formData.get('selfie') as File;

    // Validate required fields
    if (!documentType || !frontFile || !backFile || !selfieFile) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate file types and sizes
    const files = [frontFile, backFile, selfieFile];
    const fileNames = ['front', 'back', 'selfie'];
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > MAX_SIZE) {
        return NextResponse.json({ 
          error: `${fileNames[i]} file too large. Max size: 10MB` 
        }, { status: 400 });
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json({ 
          error: `${fileNames[i]} file type not supported` 
        }, { status: 400 });
      }
    }

    // Convert files to buffer and upload to Cloudinary
    const uploadFile = async (file: File, type: string) => {
        console.log(type)
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: 'kyc_uploads',
            resource_type: 'image',
            transformation: [
              { width: 1200, height: 1200, crop: 'limit' },
              { quality: 'auto', fetch_format: 'auto' }
            ]
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result?.secure_url);
          }
        ).end(buffer);
      });
    };

    // Upload all files
    const [frontUrl, backUrl, selfieUrl] = await Promise.all([
      uploadFile(frontFile, 'front'),
      uploadFile(backFile, 'back'),
      uploadFile(selfieFile, 'selfie')
    ]);

    // Get existing KYC credential
    const user = await prisma.users.findUnique({
      where: { clerk_id: userId },
      select: { kyc_credential: true },
    });

    let existingCredential = {};
    if (user?.kyc_credential) {
      try {
        existingCredential = JSON.parse(user.kyc_credential);
      } catch {
        existingCredential = {};
      }
    }

    // Update credential
    const updatedCredential = {
      ...existingCredential,
      [documentType]: {
        front: frontUrl,
        back: backUrl,
        selfie: selfieUrl,
        uploaded_at: new Date().toISOString(),
      },
      kyc_type_of_name: documentType,
      kyc_time_of_time: new Date().toISOString(),
      'Action Message': '',
    };

    // Save to database
    await prisma.users.update({
      where: { clerk_id: userId },
      data: {
        kyc: 1,
        kyc_credential: JSON.stringify(updatedCredential),
        updated_at: new Date().toISOString(),
      },
    });

    return NextResponse.json({ 
      success: true,
      message: 'KYC documents uploaded successfully'
    });

  } catch (error) {
    console.error('KYC upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed. Please try again.' },
      { status: 500 }
    );
  }
}