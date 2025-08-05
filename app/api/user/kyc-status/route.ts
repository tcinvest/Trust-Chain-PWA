// app/api/user/kyc-status/route.ts
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
      select: { kyc: true }
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({ isVerified: user.kyc === 2 });
  } catch (err) {
    console.error("Get KYC status error:", err);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}