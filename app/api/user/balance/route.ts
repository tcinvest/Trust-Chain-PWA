// app/api/user/balance/route.ts
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const clerkId = url.searchParams.get("clerkId");

    if (!clerkId) {
      return Response.json({ error: "Missing clerkId" }, { status: 400 });
    }

    const user = await prisma.users.findUnique({
      where: { clerk_id: clerkId },
      select: { 
        balance: true,
        profit_balance: true
      }
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({ 
      balance: user.balance,
      profit_balance: user.profit_balance
    });
  } catch (err) {
    console.error("Get balance error:", err);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}