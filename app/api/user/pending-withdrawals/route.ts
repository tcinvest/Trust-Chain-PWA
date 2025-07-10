// app/api/user/pending-withdrawals/route.ts
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const clerkId = url.searchParams.get("clerkId");

    if (!clerkId) {
      return Response.json({ error: "Missing clerkId" }, { status: 400 });
    }

    // Check if user exists
    const user = await prisma.users.findUnique({
      where: { clerk_id: clerkId },
      select: { id: true }
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Check for pending withdrawal requests
    const pendingWithdrawal = await prisma.withdrawalrequests.findFirst({
      where: {
        user_id: user.id,
        status: "pending"
      }
    });

    return Response.json({ 
      hasPending: !!pendingWithdrawal,
      pendingRequest: pendingWithdrawal || null
    });
  } catch (err) {
    console.error("Get pending withdrawals error:", err);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}