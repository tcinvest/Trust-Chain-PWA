// app/api/admin/withdrawals/pending/route.ts
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  console.log(req)
  try {
    // Get all pending withdrawal requests with user data
    const pendingRequests = await prisma.withdrawalrequests.findMany({
      where: {
        status: "pending"
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    // Get user data for each request
    const requestsWithUsers = await Promise.all(
      pendingRequests.map(async (request) => {
        const user = await prisma.users.findUnique({
          where: { id: request.user_id },
          select: {
            id: true,
            email: true,
            first_name: true,
            last_name: true,
            balance: true,
            profit_balance: true
          }
        });

        return {
          ...request,
          user: user || {
            id: request.user_id,
            email: 'Unknown',
            first_name: 'Unknown',
            last_name: 'User',
            balance: 0,
            profit_balance: 0
          }
        };
      })
    );

    return Response.json(requestsWithUsers);
  } catch (err) {
    console.error("Get pending withdrawals error:", err);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}