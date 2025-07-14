// app/api/user/investment-status/route.ts
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
      select: { id: true }
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const activeInvestment = await prisma.invests.findFirst({
      where: {
        user_id: user.id,
        status: { in: ["pending", "ongoing"] }
      }
    });

    return Response.json({
      hasActiveOrPending: !!activeInvestment,
      investment: activeInvestment
    });
  } catch (err) {
    console.error("Check investment status error:", err);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}