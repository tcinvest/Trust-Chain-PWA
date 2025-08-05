// app/api/admin/withdrawals/[id]/reject/route.ts
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

    // Update withdrawal request status to rejected
    await prisma.withdrawalrequests.update({
      where: { id: requestId },
      data: {
        status: "rejected",
        updated_at: new Date().toISOString()
      }
    });

    const currentTimestamp = new Date().toISOString();

     await prisma.transactions.create({
      data: {
        user_id: withdrawalRequest.user_id,
        tnx: `WD${requestId}${Date.now()}`,
        description: `Withdrawal approved - ${withdrawalRequest.balance_type === 'balance' ? 'Main' : 'Profit'} balance`,
        amount: Number(withdrawalRequest.amount),
        type: "withdraw",
        final_amount: Number(withdrawalRequest.amount),
        status: "failed",
        created_at: currentTimestamp,
        updated_at: currentTimestamp
      }
    });

    return Response.json({ 
      message: "Withdrawal request rejected successfully"
    });

  } catch (err) {
    console.error("Reject withdrawal error:", err);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}