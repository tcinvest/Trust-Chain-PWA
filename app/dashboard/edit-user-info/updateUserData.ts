// lib/actions/user.js
'use server';

import prisma from '@/lib/prisma';

type UpdateUserFormData = {
  first_name?: string;
  last_name?: string;
  username?: string;
  email?: string;
  phone?: string;
  country?: string;
  city?: string;
  zip_code?: string;
  address?: string;
  gender?: string;
  date_of_birth?: string;
};

export async function updateUserData(clerkId: string, formData: UpdateUserFormData) {
  try {
    const updatedUser = await prisma.users.update({
      where: {
        clerk_id: clerkId
      },
      data: {
        first_name: formData.first_name,
        last_name: formData.last_name,
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        city: formData.city,
        zip_code: formData.zip_code,
        address: formData.address,
        gender: formData.gender,
        date_of_birth: formData.date_of_birth,
        updated_at: new Date().toISOString()
      }
    });

    return { success: true, user: updatedUser };
  } catch (error) {
    console.error('Error updating user:', error);
    return { success: false, error: 'Failed to update user' };
  }
}