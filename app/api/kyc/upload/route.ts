import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { v2 as cloudinary } from 'cloudinary';
import prisma from '@/lib/prisma';
import sharp from 'sharp';

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

    // Validate file types - we'll handle size with compression
    const files = [frontFile, backFile, selfieFile];
    const fileNames = ['front', 'back', 'selfie'];
    const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json({ 
          error: `${fileNames[i]} file type not supported` 
        }, { status: 400 });
      }
    }

    // Enhanced file compression and upload function
    const compressAndUploadFile = async (file: File, type: string) => {
      console.log(`Processing ${type}, original size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      
      const bytes = await file.arrayBuffer();
      let buffer = Buffer.from(bytes);
      
      // Compress if file is over 10MB or always compress for better performance
      const MAX_SIZE = 10 * 1024 * 1024; // 10MB
      
      if (file.size > MAX_SIZE) {
        console.log(`Compressing ${type} file...`);
        
        // Aggressive compression for large files
        buffer = Buffer.from(await sharp(buffer)
          .resize({ 
            width: 1920, 
            height: 1920, 
            fit: 'inside',
            withoutEnlargement: true 
          })
          .jpeg({ 
            quality: 75,
            progressive: true,
            mozjpeg: true
          })
          .toBuffer());
          
        console.log(`${type} compressed to: ${(buffer.length / 1024 / 1024).toFixed(2)}MB`);
        
        // If still too large, compress more aggressively
        if (buffer.length > MAX_SIZE) {
          buffer = Buffer.from(await sharp(buffer)
            .resize({ 
              width: 1440, 
              height: 1440, 
              fit: 'inside',
              withoutEnlargement: true 
            })
            .jpeg({ 
              quality: 60,
              progressive: true
            })
            .toBuffer());
            
          console.log(`${type} further compressed to: ${(buffer.length / 1024 / 1024).toFixed(2)}MB`);
        }
        
        // Final check - if still too large, return error
        if (buffer.length > MAX_SIZE) {
          throw new Error(`Unable to compress ${type} file below 10MB limit`);
        }
      } else {
        // Light optimization for files under 10MB
        buffer = Buffer.from(await sharp(buffer)
          .resize({ 
            width: 2048, 
            height: 2048, 
            fit: 'inside',
            withoutEnlargement: true 
          })
          .jpeg({ 
            quality: 85,
            progressive: true
          })
          .toBuffer());
      }
      
      // Upload to Cloudinary
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: 'kyc_uploads',
            resource_type: 'image',
            // Remove transformation since we're handling it with Sharp
            transformation: [
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

    // Upload all files with compression
    const [frontUrl, backUrl, selfieUrl] = await Promise.all([
      compressAndUploadFile(frontFile, 'front'),
      compressAndUploadFile(backFile, 'back'),
      compressAndUploadFile(selfieFile, 'selfie')
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
      { error: error instanceof Error ? error.message : 'Upload failed. Please try again.' },
      { status: 500 }
    );
  }
}