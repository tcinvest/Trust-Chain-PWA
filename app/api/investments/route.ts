// app/api/investments/route.ts
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const clerkId = formData.get("clerkId") as string;
    const schemaId = formData.get("schemaId") as string;
    const wallet = formData.get("wallet") as string;
    const amount = formData.get("amount") as string;
    const file = formData.get("proof") as File | null;

    if (!clerkId || !schemaId || !wallet || !amount) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Only allow main wallet and gateway
    if (wallet !== "main" && wallet !== "gateway") {
      return Response.json({ error: "Invalid wallet type" }, { status: 400 });
    }

    // Get user with balance
    const user = await prisma.users.findUnique({
      where: { clerk_id: clerkId },
      select: { id: true, balance: true }
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    /* Check if user already has active/pending investment
    const existingInvestment = await prisma.invests.findFirst({
      where: {
        user_id: user.id,
        status: { in: ["pending", "ongoing"] }
      }
    });

    if (existingInvestment) {
      return Response.json({ error: "You already have an active investment" }, { status: 400 });
    } */

    // Get bot details from database
    const bot = await prisma.bots.findUnique({
      where: { id: parseInt(schemaId) }
    });

    if (!bot) {
      return Response.json({ error: "Bot not found" }, { status: 404 });
    }

    const investAmount = parseFloat(amount);
    const balanceNum = user.balance?.toNumber() ?? 0;

    // Check balance for main wallet
    if (wallet === "main" && balanceNum < investAmount) {
      return Response.json({ error: "Insufficient balance" }, { status: 400 });
    }

    // Determine status and period hours
    const status = wallet === "main" ? "ongoing" : "pending";
    const periodHours = bot.id === 1 ? 720 : bot.id === 2 ? 1440 : 2160; // 30/60/90 days

    // Create transaction
    const transaction = await prisma.transactions.create({
      data: {
        user_id: user.id,
        description: `Investment in ${bot.name}`,
        amount: investAmount,
        type: "investment",
        status: status === "ongoing" ? "completed" : "pending",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    });

    // Create investment
    const investment = await prisma.invests.create({
      data: {
        user_id: user.id,
        schema_id: parseInt(schemaId),
        transaction_id: transaction.id,
        invest_amount: investAmount,
        wallet,
        status,
        interest: 20,
        interest_type: "percentage",
        return_type: bot.return_type,
        number_of_period: 1,
        period_hours: periodHours,
        capital_back: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    });

    // Upload proof and store URL for gateway wallet
    if (wallet === "gateway" && file && file.size > 0) {
      const buffer = await file.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");

      const uploadResult = await cloudinary.uploader.upload(
        `data:${file.type};base64,${base64}`,
        { folder: "investments" }
      );

      // Store proof URL in payment_proofs table
      await prisma.payment_proofs.create({
        data: {
          user_id: user.id,
          proof_url: uploadResult.secure_url,
          type: "investment",
          reference_id: investment.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      });
    }

    // Deduct balance for main wallet
    if (wallet === "main") {
      await prisma.users.update({
        where: { id: user.id },
        data: {
          balance: balanceNum - investAmount,
          updated_at: new Date().toISOString()
        }
      });
    }

    return Response.json({
      success: true,
      investmentId: investment.id
    }, { status: 201 });

  } catch (err) {
    console.error("Investment failed:", err);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}