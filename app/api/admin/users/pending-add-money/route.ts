// app/api/user/pending-add-money/route.ts
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const clerkId = searchParams.get('clerkId');

    if (!clerkId) {
      return Response.json({ error: "Clerk ID required" }, { status: 400 });
    }

    const user = await prisma.users.findUnique({
      where: { clerk_id: clerkId },
      select: { id: true }
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const pendingRequest = await prisma.payment_proofs.findFirst({
      where: {
        user_id: user.id,
        type: "add_money",
        status: "pending"
      }
    });

    return Response.json({ hasPending: !!pendingRequest });
  } catch (err) {
    console.error("Check pending add money error:", err);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}