import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";
import { bots } from "@/lib/bot-config/InvestmentsBots";

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

    // Get user
    const user = await prisma.users.findUnique({
      where: { clerk_id: clerkId },
      select: { id: true }
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Get bot details
    const bot = bots.find(b => b.id === parseInt(schemaId));
    if (!bot) {
      return Response.json({ error: "Bot not found" }, { status: 404 });
    }

    // Upload proof if provided
    if (file && file.size > 0) {
      const buffer = await file.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");
      
      await cloudinary.uploader.upload(
        `data:${file.type};base64,${base64}`,
        { folder: "investments" }
      );
    }

    // Create transaction
    const transaction = await prisma.transactions.create({
      data: {
        user_id: user.id,
        description: `Investment in ${bot.name}`,
        amount: parseFloat(amount),
        type: "investment",
        status: "pending",
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
        invest_amount: parseFloat(amount),
        wallet,
        status: "pending",
        interest: 20, // from bot description
        interest_type: "percentage",
        return_type: bot.returnType,
        number_of_period: 1,
        period_hours: bot.id === 1 ? 720 : bot.id === 2 ? 1440 : 2160, // 30/60/90 days in hours
        capital_back: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    });

    return Response.json({ 
      success: true, 
      investmentId: investment.id 
    }, { status: 201 });

  } catch (err) {
    console.error("Investment failed:", err);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}