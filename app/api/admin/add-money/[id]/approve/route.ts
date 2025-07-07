import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const requestId = parseInt(resolvedParams.id);

    // Get the payment request
    const addMoneyRequest = await prisma.payment_proofs.findUnique({
      where: { id: requestId }
    });

    if (!addMoneyRequest) {
      return Response.json({ error: "Request not found" }, { status: 404 });
    }

    if (addMoneyRequest.status !== "pending") {
      return Response.json({ error: "Request not pending" }, { status: 400 });
    }

    if (!addMoneyRequest.amount) {
      return Response.json({ error: "Amount not found" }, { status: 400 });
    }

    // Get the user info manually using user_id
    const user = await prisma.users.findUnique({
      where: { id: addMoneyRequest.user_id },
      select: { id: true, balance: true }
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const currentBalance = user.balance?.toNumber?.() ?? 0;
    const newBalance = currentBalance + addMoneyRequest.amount;

    // Update payment proof status
    await prisma.payment_proofs.update({
      where: { id: requestId },
      data: {
        status: "approved",
        updated_at: new Date().toISOString()
      }
    });

    // Update user balance
    await prisma.users.update({
      where: { id: user.id },
      data: {
        balance: newBalance,
        updated_at: new Date().toISOString()
      }
    });

    // Create transaction record
    await prisma.transactions.create({
      data: {
        user_id: user.id,
        description: `Balance addition - Admin approved`,
        amount: addMoneyRequest.amount,
        type: "deposit",
        status: "completed",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error("Approve add money error:", err);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}