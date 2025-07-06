'use server';

import prisma from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';

interface FormState {
  success?: boolean;
  error?: string[];
}

export async function uploadKyc(prevState: FormState | null, formData: FormData): Promise<FormState> {
  try {
    const clerkId = formData.get('clerkId') as string;
    const docType = formData.get('kyc_type_of_name') as string;
    const fileFront = formData.get('kyc_file_front') as File;
    const fileBack = formData.get('kyc_file_back') as File;

    if (!clerkId || !docType || !fileFront || !fileBack) {
      return { error: ['Missing required fields'], success: false };
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
      api_key: process.env.CLOUDINARY_API_KEY!,
      api_secret: process.env.CLOUDINARY_API_SECRET!,
    });

    const bufferFront = Buffer.from(await fileFront.arrayBuffer());
    const bufferBack = Buffer.from(await fileBack.arrayBuffer());

    const base64Front = `data:${fileFront.type};base64,${bufferFront.toString('base64')}`;
    const base64Back = `data:${fileBack.type};base64,${bufferBack.toString('base64')}`;

    const [frontUpload, backUpload] = await Promise.all([
      cloudinary.uploader.upload(base64Front, { folder: 'kyc_uploads' }),
      cloudinary.uploader.upload(base64Back, { folder: 'kyc_uploads' })
    ]);

    const kycCredential = {
      [docType]: {
        front: frontUpload.secure_url,
        back: backUpload.secure_url,
      },
      kyc_type_of_name: docType,
      kyc_time_of_time: new Date().toISOString(),
      "Action Message": ""
    };

    await prisma.users.update({
      where: { clerk_id: clerkId },
      data: {
        kyc: 1, // pending
        kyc_credential: JSON.stringify(kycCredential),
        updated_at: new Date().toISOString()
      }
    });

    return { success: true };
  } catch (err) {
    console.error('KYC Upload Error:', err);
    return { error: ['KYC upload failed'], success: false };
  }
}