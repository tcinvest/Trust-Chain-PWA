// app/api/withdraw-money/route.ts
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clerkId, email, amount, balanceType, walletAddress, network } = body;

    // Validation
    if (!clerkId || !amount || !balanceType || !walletAddress || !network) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const withdrawAmount = parseFloat(amount);
    if (withdrawAmount <= 0) {
      return Response.json({ error: "Invalid withdrawal amount" }, { status: 400 });
    }

    if (!['balance', 'profit_balance'].includes(balanceType)) {
      return Response.json({ error: "Invalid balance type" }, { status: 400 });
    }

    // Get user data
    const user = await prisma.users.findUnique({
      where: { clerk_id: clerkId }, 
      select: { 
        id: true, 
        balance: true, 
        profit_balance: true, 
        kyc: true,
        email: true,
        first_name: true,
        last_name: true,
        withdrawals_enabled: true
      }
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    if (user.withdrawals_enabled === false) {
      return Response.json({ 
        error: "Withdrawals are temporarily disabled. Please try again later or contact support." 
      }, { status: 403 });
    }

    // KYC
    if (user.kyc !== 2) {
      return Response.json({ error: "KYC verification required" }, { status: 400 });
    }

    // existing pending withdrawal
    const existingRequest = await prisma.withdrawalrequests.findFirst({
      where: {
        user_id: user.id,
        status: "pending"
      }
    });

    if (existingRequest) {
      return Response.json({ error: "You already have a pending withdrawal request" }, { status: 400 });
    }

    //  balance check
    const currentBalance = balanceType === 'balance' 
      ? Number(user.balance) 
      : Number(user.profit_balance);

    if (withdrawAmount > currentBalance) {
      return Response.json({ 
        error: `Insufficient ${balanceType === 'balance' ? 'main' : 'profit'} balance. Available: $${currentBalance.toFixed(2)}` 
      }, { status: 400 });
    }

    // charges (5%)
    const charges = withdrawAmount * 0.05;
    const netAmount = withdrawAmount - charges;

    const withdrawalRequest = await prisma.withdrawalrequests.create({
      data: {
        user_id: user.id,
        user_email: email || user.email,
        user_name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
        amount: withdrawAmount,
        balance_type: balanceType,
        wallet_address: walletAddress,
        network: network,
        charges: charges,
        net_amount: netAmount,
        status: "pending",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    });

    return Response.json({ 
      message: "Withdrawal request submitted successfully",
      requestId: withdrawalRequest.id,
      amount: withdrawAmount,
      charges: charges,
      netAmount: netAmount,
      status: "pending"
    });

  } catch (err) {
    console.error("Withdraw money error:", err);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
