// app/api/admin/investments/[id]/approve/route.ts
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

    if (!investment.transaction_id) {
      return Response.json({ error: "Transaction ID missing" }, { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.invests.update({
        where: { id: parseInt(resolvedParams.id) },
        data: {
          status: "ongoing",
          updated_at: new Date().toISOString()
        }
      });

      await tx.transactions.update({
        where: { id: investment.transaction_id! },
        data: {
          status: "completed",
          updated_at: new Date().toISOString()
        }
      });
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error("Approve investment error:", err);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}