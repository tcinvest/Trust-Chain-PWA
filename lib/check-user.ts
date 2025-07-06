import { currentUser } from '@clerk/nextjs/server';
import  prisma  from '@/lib/prisma';

export const checkUser = async () => {
      const user = await currentUser();
      
      if (!user) {
        return null;
      }
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
      
      // Create new user with signup bonus
      const newUser = await prisma.users.create({
        data: {
          clerk_id: user.id,
          first_name: `${user.firstName}`,
          last_name: `${user.lastName}`,
          username: `${user.username}`,
          avatar: user.imageUrl,
          email: user.emailAddresses[0].emailAddress,
          balance: 10.00, // Add signup bonus to balance
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      });

      // Create signup bonus transaction
      await prisma.transactions.create({
        data: {
          user_id: newUser.id,
          description: 'Signup bonus',
          amount: 10.00,
          type: 'signup_bonus',
          status: 'completed',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      });

      return newUser;
};