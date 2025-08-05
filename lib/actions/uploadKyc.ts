'use server';

import prisma from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';

interface FormState {
  success?: boolean;
  error?: string[];
}

// File limits
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export async function uploadKyc(prevState: FormState | null, formData: FormData): Promise<FormState> {
  try {
    const clerkId = formData.get('clerkId') as string;
    const docType = formData.get('kyc_type_of_name') as string;
    const fileFront = formData.get('kyc_file_front') as File;
    const fileBack = formData.get('kyc_file_back') as File;
    const fileSelfie = formData.get('kyc_file_selfie') as File;

    // === Input Validation ===
    if (!clerkId || !docType || !fileFront || !fileBack || !fileSelfie) {
      console.warn('Missing required fields');
      return { error: ['Missing required fields'], success: false };
    }

    const files = [fileFront, fileBack, fileSelfie];
    const names = ['front', 'back', 'selfie'];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > MAX_FILE_SIZE) {
        return { error: [`${names[i]} file too large. Max size: 10MB.`], success: false };
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        return { error: [`${names[i]} file type not supported.`], success: false };
      }
    }

    // === Cloudinary Config ===
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('Missing Cloudinary credentials');
      return { error: ['Server misconfiguration. Please try again later.'], success: false };
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
      api_key: process.env.CLOUDINARY_API_KEY!,
      api_secret: process.env.CLOUDINARY_API_SECRET!,
    });

    // === Convert to base64 ===
    let base64Front: string, base64Back: string, base64Selfie: string;
    try {
      const bufferFront = Buffer.from(await fileFront.arrayBuffer());
      const bufferBack = Buffer.from(await fileBack.arrayBuffer());
      const bufferSelfie = Buffer.from(await fileSelfie.arrayBuffer());
      base64Front = `data:${fileFront.type};base64,${bufferFront.toString('base64')}`;
      base64Back = `data:${fileBack.type};base64,${bufferBack.toString('base64')}`;
      base64Selfie = `data:${fileSelfie.type};base64,${bufferSelfie.toString('base64')}`;
    } catch (error) {
      console.error('Error converting files to base64:', error);
      return { error: ['File processing error. Please retry.'], success: false };
    }

    // === Upload to Cloudinary ===
    let frontUpload, backUpload, selfieUpload;
    try {
      [frontUpload, backUpload, selfieUpload] = await Promise.all([
        cloudinary.uploader.upload(base64Front, { folder: 'kyc_uploads', timeout: 60000, resource_type: 'image' }),
        cloudinary.uploader.upload(base64Back, { folder: 'kyc_uploads', timeout: 60000, resource_type: 'image' }),
        cloudinary.uploader.upload(base64Selfie, { folder: 'kyc_uploads', timeout: 60000, resource_type: 'image' }),
      ]);
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      return { error: ['Image upload failed. Try again or check connection.'], success: false };
    }

    // === Get existing KYC Credential (safe parsing) ===
    const user = await prisma.users.findUnique({
      where: { clerk_id: clerkId },
      select: { kyc_credential: true },
    });

    let existingCredential = {};
    if (user?.kyc_credential) {
      try {
        existingCredential = JSON.parse(user.kyc_credential);
      } catch {
        console.warn('KYC credential malformed. Attempting to recover...');
        try {
          const fixed = user.kyc_credential
            .replace(/'/g, '"')
            .replace(/(\w+):/g, '"$1":')
            .replace(/,\s*}/g, '}')
            .replace(/,\s*]/g, ']');
          existingCredential = JSON.parse(fixed);
        } catch {
          console.warn('Failed to recover malformed credential. Resetting.');
          existingCredential = {};
        }
      }
    }

    // === Construct Updated Credential Object ===
    const updatedCredential = {
      ...existingCredential,
      [docType]: {
        front: frontUpload.secure_url,
        back: backUpload.secure_url,
        selfie: selfieUpload.secure_url,
        uploaded_at: new Date().toISOString(),
      },
      kyc_type_of_name: docType,
      kyc_time_of_time: new Date().toISOString(),
      'Action Message': '',
    };

    // === Serialize & Save ===
    let serialized;
    try {
      serialized = JSON.stringify(updatedCredential);
      JSON.parse(serialized); // double-check
    } catch (err) {
      console.error('JSON serialization error:', err);
      return { error: ['Failed to save KYC. Please try again.'], success: false };
    }

    try {
      await prisma.users.update({
        where: { clerk_id: clerkId },
        data: {
          kyc: 1,
          kyc_credential: serialized,
          updated_at: new Date().toISOString(),
        },
      });
    } catch (dbError) {
      console.error('Database update error:', dbError);
      return { error: ['Internal database error. Please contact support.'], success: false };
    }

    return { success: true };
    //eslint-disable-next-line
  } catch (err: any) {
    console.error('Unhandled KYC Upload Error:', err);

    const msg =
      err?.message?.includes('timeout') ? 'Upload timeout. Try again.' :
      err?.message?.includes('network') ? 'Network error. Check your connection.' :
      'Something went wrong. Try again later.';

    return { error: [msg], success: false };
  }
}
