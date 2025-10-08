// app/api/admin/withdrawals/[id]/approve/route.ts
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const requestId = parseInt(id);

    if (isNaN(requestId)) {
      return new Response(JSON.stringify({ error: "Invalid request ID" }), { status: 400 });
    }

    // Get the withdrawal request
    const withdrawalRequest = await prisma.withdrawalrequests.findUnique({
      where: { id: requestId }
    });

    if (!withdrawalRequest) {
      return new Response(JSON.stringify({ error: "Withdrawal request not found" }), { status: 404 });
    }

    if (withdrawalRequest.status !== "pending") {
      return new Response(JSON.stringify({ error: "Request is not pending" }), { status: 400 });
    }

    // Perform atomic operations inside a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Re-fetch user to get fresh balance
      const freshUser = await tx.users.findUnique({
        where: { id: withdrawalRequest.user_id },
        select: { balance: true, profit_balance: true }
      });

      if (!freshUser) {
        throw new Error("User not found");
      }

      const currentBalance = withdrawalRequest.balance_type === "balance"
        ? Number(freshUser.balance)
        : Number(freshUser.profit_balance);

      const withdrawalAmount = Number(withdrawalRequest.amount);

      if (currentBalance < withdrawalAmount) {
        throw new Error(
          `Insufficient ${withdrawalRequest.balance_type === "balance" ? "main" : "profit"} balance`
        );
      }

      const newBalance = currentBalance - withdrawalAmount;
      const currentTimestamp = new Date().toISOString();

      // Create transaction record
      await tx.transactions.create({
        data: {
          user_id: withdrawalRequest.user_id,
          tnx: `WD${requestId}${Date.now()}`,
          description: `Withdrawal approved - ${withdrawalRequest.balance_type === "balance" ? "Main" : "Profit"} balance`,
          amount: withdrawalAmount,
          type: "withdraw",
          final_amount: withdrawalAmount,
          status: "success",
          created_at: currentTimestamp,
          updated_at: currentTimestamp
        }
      });

      // Update user balance
      await tx.users.update({
        where: { id: withdrawalRequest.user_id },
        data: withdrawalRequest.balance_type === "balance"
          ? { balance: newBalance.toString() }
          : { profit_balance: newBalance.toString() }
      });

      // Update withdrawal request
      await tx.withdrawalrequests.update({
        where: { id: requestId },
        data: {
          status: "approved",
          approved_at: currentTimestamp,
          updated_at: currentTimestamp
        }
      });

      return {
        newBalance,
        balanceType: withdrawalRequest.balance_type
      };
    });

    return new Response(JSON.stringify({
      message: "Withdrawal request approved successfully",
      ...result
    }));

  } catch (err: unknown) {
    console.error("Approve withdrawal error:", err);
    return new Response(JSON.stringify({ error: err || "Something went wrong" }), { status: 500 });
  }
}
