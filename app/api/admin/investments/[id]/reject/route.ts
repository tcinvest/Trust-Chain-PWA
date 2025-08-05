// app/api/admin/investments/[id]/reject/route.ts
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const investment = await prisma.invests.findUnique({
      where: { id: parseInt(resolvedParams.id) }
    });

    if (!investment) {
      return Response.json({ error: "Investment not found" }, { status: 404 });
    }

    if (investment.status !== "pending") {
      return Response.json({ error: "Investment not pending" }, { status: 400 });
    }

    // Update investment status to rejected
    await prisma.invests.update({
      where: { id: parseInt(resolvedParams.id) },
      data: {
        status: "rejected",
        updated_at: new Date().toISOString()
      }
    });

    // Update transaction status to failed
    if (investment.transaction_id) {
      await prisma.transactions.update({
        where: { id: investment.transaction_id },
        data: {
          status: "failed",
          updated_at: new Date().toISOString()
        }
      });
    }

    // Optional: Delete the payment proof since investment is rejected
    await prisma.payment_proofs.deleteMany({
      where: {
        reference_id: investment.id,
        type: "investment"
      }
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error("Reject investment error:", err);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}