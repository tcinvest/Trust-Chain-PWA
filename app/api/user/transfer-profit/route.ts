import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { clerkId } = await req.json();

    if (!clerkId) {
      return Response.json({ error: "Missing clerkId" }, { status: 400 });
    }

    const user = await prisma.users.findUnique({
      where: { clerk_id: clerkId },
      select: { id: true }
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const freshUser = await tx.users.findUnique({
        where: { id: user.id },
        select: { 
          balance: true, 
          profit_balance: true 
        }
      });

      if (!freshUser) {
        throw new Error("User not found");
      }

      const currentProfitBalance = freshUser.profit_balance?.toNumber() ?? 0;

      if (currentProfitBalance <= 0) {
        throw new Error("No profit balance to transfer");
      }

      const updatedUser = await tx.users.update({
        where: { id: user.id },
        data: {
          balance: { increment: currentProfitBalance },
          profit_balance: 0,
          updated_at: new Date().toISOString()
        },
        select: {
          balance: true,
          profit_balance: true
        }
      });

      await tx.transactions.create({
        data: {
          user_id: user.id,
          description: "Profit balance transferred to main balance",
          amount: currentProfitBalance,
          type: "transfer",
          status: "completed",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      });

      return {
        transferredAmount: currentProfitBalance,
        newMainBalance: updatedUser.balance?.toNumber() ?? 0,
        newProfitBalance: updatedUser.profit_balance?.toNumber() ?? 0
      };
    });

    return Response.json({
      success: true,
      ...result
    }, { status: 200 });

  } catch (err) {
    console.error("Transfer failed:", err);
    const errorMessage = err instanceof Error ? err.message : "Something went wrong";
    return Response.json({ error: errorMessage }, { status: 500 });
  }
}