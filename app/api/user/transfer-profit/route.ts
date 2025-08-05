
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { clerkId } = await req.json();

    if (!clerkId) {
      return Response.json({ error: "Missing clerkId" }, { status: 400 });
    }

    // Get user with current balances
    const user = await prisma.users.findUnique({
      where: { clerk_id: clerkId },
      select: { 
        id: true, 
        balance: true, 
        profit_balance: true 
      }
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const currentBalance = user.balance?.toNumber() ?? 0;
    const currentProfitBalance = user.profit_balance?.toNumber() ?? 0;

    // Check if there's profit balance to transfer
    if (currentProfitBalance <= 0) {
      return Response.json({ error: "No profit balance to transfer" }, { status: 400 });
    }

    // Calculate new balances
    const newMainBalance = currentBalance + currentProfitBalance;
    const newProfitBalance = 0;

    // Update user balances
    const updatedUser = await prisma.users.update({
      where: { id: user.id },
      data: {
        balance: newMainBalance,
        profit_balance: newProfitBalance,
        updated_at: new Date().toISOString()
      },
      select: {
        balance: true,
        profit_balance: true
      }
    });

    // Create transaction record for the transfer
    await prisma.transactions.create({
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

    return Response.json({
      success: true,
      transferredAmount: currentProfitBalance,
      newMainBalance: updatedUser.balance?.toNumber() ?? 0,
      newProfitBalance: updatedUser.profit_balance?.toNumber() ?? 0
    }, { status: 200 });

  } catch (err) {
    console.error("Transfer failed:", err);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}