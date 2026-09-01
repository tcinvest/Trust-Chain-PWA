// app/api/investments/route.ts
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const REFERRAL_BONUS_RATE = 0.10; // 10%

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

    if (wallet !== "main" && wallet !== "gateway") {
      return Response.json({ error: "Invalid wallet type" }, { status: 400 });
    }

    const user = await prisma.users.findUnique({
      where: { clerk_id: clerkId },
      select: { id: true, balance: true }
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const bot = await prisma.bots.findUnique({
      where: { id: parseInt(schemaId) }
    });

    if (!bot) {
      return Response.json({ error: "Bot not found" }, { status: 404 });
    }

    const investAmount = parseFloat(amount);

    // Validate min/max investment amounts
    const minInvest = bot.min_invest?.toNumber();
    const maxInvest = bot.max_invest?.toNumber();

    if (minInvest && investAmount < minInvest) {
      return Response.json({
        error: `Minimum investment for ${bot.name} is ${minInvest}`
      }, { status: 400 });
    }

    if (maxInvest && investAmount > maxInvest) {
      return Response.json({
        error: `Maximum investment for ${bot.name} is ${maxInvest}`
      }, { status: 400 });
    }

    const status = wallet === "main" ? "ongoing" : "pending";
    const periodHours = bot.days || 0;

    let proofUrl: string | null = null;
    if (wallet === "gateway" && file && file.size > 0) {
      const buffer = await file.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");

      const uploadResult = await cloudinary.uploader.upload(
        `data:${file.type};base64,${base64}`,
        { folder: "investments" }
      );
      proofUrl = uploadResult.secure_url;
    }

    const result = await prisma.$transaction(async (tx) => {
      const freshUser = await tx.users.findUnique({
        where: { id: user.id },
        select: { balance: true }
      });

      if (!freshUser) {
        throw new Error("User not found");
      }

      const balanceNum = freshUser.balance?.toNumber() ?? 0;

      if (wallet === "main" && balanceNum < investAmount) {
        throw new Error("Insufficient balance");
      }

      // --- Referral bonus eligibility check (BEFORE creating this investment,
      // so the count reflects prior investments only) ---
      const priorInvestmentsCount = await tx.invests.count({
        where: { user_id: user.id }
      });
      const isFirstInvestment = priorInvestmentsCount === 0;

      let referralLinkOwnerId: number | null = null;

      if (isFirstInvestment) {
        const referralRelationship = await tx.referral_relationships.findFirst({
          where: { user_id: user.id }
        });

        if (referralRelationship?.referral_link_id) {
          const referralLink = await tx.referral_links.findUnique({
            where: { id: referralRelationship.referral_link_id }
          });

          if (referralLink && referralLink.user_id !== user.id) {
            referralLinkOwnerId = referralLink.user_id;
          }
        }
      }
      // --- end eligibility check ---

      const transaction = await tx.transactions.create({
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

      const investment = await tx.invests.create({
        data: {
          user_id: user.id,
          schema_id: parseInt(schemaId),
          transaction_id: transaction.id,
          invest_amount: investAmount,
          wallet,
          status,
          interest: Number(bot.return_percentage),
          interest_type: "percentage",
          return_type: bot.return_type,
          number_of_period: 1,
          period_hours: periodHours * 24, // Convert days to hours
          capital_back: 1,
          days_credited: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      });

      if (wallet === "gateway" && proofUrl) {
        await tx.payment_proofs.create({
          data: {
            user_id: user.id,
            proof_url: proofUrl,
            type: "investment",
            reference_id: investment.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        });
      }

      if (wallet === "main") {
        await tx.users.update({
          where: { id: user.id },
          data: {
            balance: balanceNum - investAmount,
            updated_at: new Date().toISOString()
          }
        });
      }

      // --- Pay referral bonus (only reached if this was genuinely
      // the referred user's first investment, and a valid referrer was found) ---
           if (referralLinkOwnerId !== null) {
        const bonusAmount = investAmount * REFERRAL_BONUS_RATE;

        await tx.transactions.create({
          data: {
            user_id: referralLinkOwnerId,
            description: `Referral bonus (10%) from ${bot.name} investment`,
            amount: bonusAmount,
            type: "referral",
            status: "completed",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        });

        await tx.referral_profit.upsert({
          where: { user_id: referralLinkOwnerId },
          update: {
            balance: { increment: bonusAmount },
            updated_at: new Date().toISOString(),
          },
          create: {
            user_id: referralLinkOwnerId,
            balance: bonusAmount,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        });
      }
      // --- end referral bonus payout ---

      return investment;
    });

    return Response.json({
      success: true,
      investmentId: result.id
    }, { status: 201 });

  } catch (err) {
    console.error("Investment failed:", err);
    const errorMessage = err instanceof Error ? err.message : "Something went wrong";
    return Response.json({ error: errorMessage }, { status: 500 });
  }
}
