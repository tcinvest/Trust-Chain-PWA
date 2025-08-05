// app/api/admin/withdrawals/[id]/approve/route.ts
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  console.log(req)
  try {
    const { id } = await params;
    const requestId = parseInt(id);
    
    if (isNaN(requestId)) {
      return Response.json({ error: "Invalid request ID" }, { status: 400 });
    }

    // Get the withdrawal request
    const withdrawalRequest = await prisma.withdrawalrequests.findUnique({
      where: { id: requestId }
    });

    if (!withdrawalRequest) {
      return Response.json({ error: "Withdrawal request not found" }, { status: 404 });
    }

    if (withdrawalRequest.status !== "pending") {
      return Response.json({ error: "Request is not pending" }, { status: 400 });
    }

    // Get user data
    const user = await prisma.users.findUnique({
      where: { id: withdrawalRequest.user_id },
      select: {
        id: true,
        balance: true,
        profit_balance: true
      }
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user has sufficient balance
    const currentBalance = withdrawalRequest.balance_type === 'balance' 
      ? Number(user.balance) 
      : Number(user.profit_balance);

    if (currentBalance < Number(withdrawalRequest.amount)) {
      return Response.json({ 
        error: `Insufficient ${withdrawalRequest.balance_type === 'balance' ? 'main' : 'profit'} balance` 
      }, { status: 400 });
    }

    // Calculate new balance after deduction
    const newBalance = currentBalance - Number(withdrawalRequest.amount);
    const currentTimestamp = new Date().toISOString();

    // First create the transaction record (like in your investment route)
     await prisma.transactions.create({
      data: {
        user_id: withdrawalRequest.user_id,
        tnx: `WD${requestId}${Date.now()}`,
        description: `Withdrawal approved - ${withdrawalRequest.balance_type === 'balance' ? 'Main' : 'Profit'} balance`,
        amount: Number(withdrawalRequest.amount),
        type: "withdraw",
        final_amount: Number(withdrawalRequest.amount),
        status: "success",
        created_at: currentTimestamp,
        updated_at: currentTimestamp
      }
    });

    // Then update user balance and withdrawal request in a transaction
    await prisma.$transaction([
      // Update user balance
      prisma.users.update({
        where: { id: withdrawalRequest.user_id },
        data: withdrawalRequest.balance_type === 'balance' 
          ? { balance: newBalance.toString() }
          : { profit_balance: newBalance.toString() }
      }),
      
      // Update withdrawal request status
      prisma.withdrawalrequests.update({
        where: { id: requestId },
        data: {
          status: "approved",
          approved_at: currentTimestamp,
          updated_at: currentTimestamp
        }
      })
    ]);

    return Response.json({
      message: "Withdrawal request approved successfully",
      newBalance: newBalance,
      balanceType: withdrawalRequest.balance_type
    });

  } catch (err) {
    console.error("Approve withdrawal error:", err);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}