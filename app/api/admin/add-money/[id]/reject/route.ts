import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const addMoneyRequest = await prisma.payment_proofs.findUnique({
      where: { id: parseInt(resolvedParams.id) }
    });

    if (!addMoneyRequest) {
      return Response.json({ error: "Request not found" }, { status: 404 });
    }

    if (addMoneyRequest.status !== "pending") {
      return Response.json({ error: "Request not pending" }, { status: 400 });
    }

    // Update payment proof status to rejected
    await prisma.payment_proofs.update({
      where: { id: parseInt(resolvedParams.id) },
      data: {
        status: "rejected",
        updated_at: new Date().toISOString()
      }
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error("Reject add money error:", err);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}