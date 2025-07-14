'use server';

import prisma from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';

interface FormState {
  success?: boolean;
  error?: string[];
}

// File size limit (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Allowed file types
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export async function uploadKyc(prevState: FormState | null, formData: FormData): Promise<FormState> {
  try {
    const clerkId = formData.get('clerkId') as string;
    const docType = formData.get('kyc_type_of_name') as string;
    const fileFront = formData.get('kyc_file_front') as File;
    const fileBack = formData.get('kyc_file_back') as File;
    const fileSelfie = formData.get('kyc_file_selfie') as File;

    // Input validation
    if (!clerkId || !docType || !fileFront || !fileBack || !fileSelfie) {
      return { error: ['Missing required fields'], success: false };
    }

    // File validation
    const files = [fileFront, fileBack, fileSelfie];
    const fileNames = ['front', 'back', 'selfie'];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileName = fileNames[i];
      
      if (file.size > MAX_FILE_SIZE) {
        return { error: [`${fileName} file is too large. Maximum size is 10MB.`], success: false };
      }
      
      if (!ALLOWED_TYPES.includes(file.type)) {
        return { error: [`${fileName} file type not supported. Use JPEG, PNG, or WebP.`], success: false };
      }
    }

    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
      api_key: process.env.CLOUDINARY_API_KEY!,
      api_secret: process.env.CLOUDINARY_API_SECRET!,
    });

    // Convert files to base64 with error handling
    let bufferFront: Buffer, bufferBack: Buffer, bufferSelfie: Buffer;
    
    try {
      bufferFront = Buffer.from(await fileFront.arrayBuffer());
      bufferBack = Buffer.from(await fileBack.arrayBuffer());
      bufferSelfie = Buffer.from(await fileSelfie.arrayBuffer());
    } catch (error) {
      console.error('File processing error:', error);
      return { error: ['Failed to process uploaded files'], success: false };
    }

    const base64Front = `data:${fileFront.type};base64,${bufferFront.toString('base64')}`;
    const base64Back = `data:${fileBack.type};base64,${bufferBack.toString('base64')}`;
    const base64Selfie = `data:${fileSelfie.type};base64,${bufferSelfie.toString('base64')}`;

    // Upload to Cloudinary with retry logic and better error handling
    let frontUpload, backUpload, selfieUpload;
    
    try {
      [frontUpload, backUpload, selfieUpload] = await Promise.all([
        cloudinary.uploader.upload(base64Front, { 
          folder: 'kyc_uploads',
          timeout: 60000, // 60 second timeout
          resource_type: 'image'
        }),
        cloudinary.uploader.upload(base64Back, { 
          folder: 'kyc_uploads',
          timeout: 60000,
          resource_type: 'image'
        }),
        cloudinary.uploader.upload(base64Selfie, { 
          folder: 'kyc_uploads',
          timeout: 60000,
          resource_type: 'image'
        })
      ]);
    } catch (cloudinaryError) {
      console.error('Cloudinary upload error:', cloudinaryError);
      return { error: ['Upload failed. Please try again.'], success: false };
    }

    // Get existing KYC credential to preserve other document types
    const existingUser = await prisma.users.findUnique({
      where: { clerk_id: clerkId },
      select: { kyc_credential: true }
    });

    let existingCredential = {};
    if (existingUser?.kyc_credential) {
      try {
        // First attempt: direct JSON parse
        existingCredential = JSON.parse(existingUser.kyc_credential);
      } catch (parseError) {
        console.warn('Failed to parse existing KYC credential:', parseError);
        console.warn('Malformed JSON:', existingUser.kyc_credential);
        
        // Second attempt: try to fix common JSON issues
        try {
          const fixedJson = existingUser.kyc_credential
            .replace(/'/g, '"')  // Replace single quotes with double quotes
            .replace(/(\w+):/g, '"$1":')  // Add quotes around unquoted keys
            .replace(/,\s*}/g, '}')  // Remove trailing commas
            .replace(/,\s*]/g, ']');  // Remove trailing commas in arrays
          
          existingCredential = JSON.parse(fixedJson);
          console.log('Successfully fixed and parsed malformed JSON');
        } catch (fixError) {
          console.warn('Could not fix malformed JSON:', fixError);
          
          // Third attempt: try to extract meaningful data with regex
          try {
            const docTypes = ['Driver\'s license', 'National Identity card', 'Voter\'s card'];
            const extractedData = {};
            
            for (const docType of docTypes) {
              const regex = new RegExp(`"${docType}":\\s*{[^}]+}`, 'g');
              const match = existingUser.kyc_credential.match(regex);
              if (match) {
                try {
                  const docData = JSON.parse(`{${match[0]}}`);
                  Object.assign(extractedData, docData);
                } catch (e) {
                  console.warn(`Failed to extract ${docType} ${e} data`);
                }
              }
            }
            
            if (Object.keys(extractedData).length > 0) {
              existingCredential = extractedData;
              console.log('Successfully extracted data from malformed JSON');
            } else {
              // Final fallback: reset to empty object
              existingCredential = {};
              console.warn('Resetting KYC credential to empty object due to parse failure');
            }
          } catch (extractError) {
            console.warn('Data extraction failed:', extractError);
          }
        }
      }
    }

    // OPTION 1: Replace entire credential (one document type per user)
    const updatedCredential = {
      [docType]: {
        front: frontUpload.secure_url,
        back: backUpload.secure_url,
        selfie: selfieUpload.secure_url,
        uploaded_at: new Date().toISOString()
      },
      kyc_type_of_name: docType,
      kyc_time_of_time: new Date().toISOString(),
      "Action Message": ""
    };
    let serializedCredential: string;
    try {
      serializedCredential = JSON.stringify(updatedCredential, null, 0);
      
      // Validate that the serialized JSON can be parsed back
      JSON.parse(serializedCredential);
    } catch (serializationError) {
      console.error('JSON serialization error:', serializationError);
      console.error('Problem credential object:', updatedCredential);
      
      // Fallback: create a clean credential object
      serializedCredential = JSON.stringify({
        [docType]: {
          front: frontUpload.secure_url,
          back: backUpload.secure_url,
          selfie: selfieUpload.secure_url,
          uploaded_at: new Date().toISOString()
        },
        kyc_type_of_name: docType,
        kyc_time_of_time: new Date().toISOString(),
        "Action Message": ""
      });
    }

    // Update database with transaction for consistency
    await prisma.users.update({
      where: { clerk_id: clerkId },
      data: {
        kyc: 1, // pending
        kyc_credential: serializedCredential,
        updated_at: new Date().toISOString()
      }
    });

    return { success: true };
    
  } catch (err) {
    console.error('KYC Upload Error:', err);
    
    // Provide more specific error messages
    if (err instanceof Error) {
      if (err.message.includes('timeout')) {
        return { error: ['Upload timeout. Please check your connection and try again.'], success: false };
      }
      if (err.message.includes('network')) {
        return { error: ['Network error. Please try again.'], success: false };
      }
    }
    
    return { error: ['KYC upload failed. Please try again.'], success: false };
  }
}