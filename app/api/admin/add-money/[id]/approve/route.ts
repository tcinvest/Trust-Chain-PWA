import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const requestId = parseInt(resolvedParams.id);

    if (isNaN(requestId)) {
      return Response.json({ error: "Invalid request ID" }, { status: 400 });
    }

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

    // Execute approval atomically
    await prisma.$transaction(async (tx) => {
      // Re-check user inside transaction
      const freshUser = await tx.users.findUnique({
        where: { id: addMoneyRequest.user_id },
        select: { id: true, balance: true }
      });

      if (!freshUser) {
        throw new Error("User not found");
      }

      const currentBalance = freshUser.balance?.toNumber?.() ?? 0;
      const amountToAdd = parseFloat(addMoneyRequest.amount!);
      const newBalance = currentBalance + amountToAdd;
      // Update payment proof status
      await tx.payment_proofs.update({
        where: { id: requestId },
        data: {
          status: "approved",
          updated_at: new Date().toISOString()
        }
      });

      // Update user balance
      await tx.users.update({
        where: { id: freshUser.id },
        data: {
          balance: newBalance,
          updated_at: new Date().toISOString()
        }
      });

      // Create transaction record
      await tx.transactions.create({
        data: {
          user_id: freshUser.id,
          description: `Balance addition - Admin approved`,
          amount: addMoneyRequest.amount,
          type: "deposit",
          status: "completed",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      });
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error("Approve add money error:", err);
    const errorMessage = err instanceof Error ? err.message : "Something went wrong";
    return Response.json({ error: errorMessage }, { status: 500 });
  }
}