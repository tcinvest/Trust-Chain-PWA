// app/api/add-money/route.ts
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
    const amount = formData.get("amount") as string;
    const file = formData.get("proof") as File | null;

    if (!clerkId || !amount || !file) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Get user
    const user = await prisma.users.findUnique({
      where: { clerk_id: clerkId },
      select: { id: true, balance: true }
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user already has pending add money request
    const existingRequest = await prisma.payment_proofs.findFirst({
      where: {
        user_id: user.id,
        type: "add_money",
        status: "pending"
      }
    });

    if (existingRequest) {
      return Response.json({ error: "You already have a pending add money request" }, { status: 400 });
    }

    const addAmount = parseFloat(amount);
    if (addAmount <= 0) {
      return Response.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Upload payment proof
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");

    const uploadResult = await cloudinary.uploader.upload(
      `data:${file.type};base64,${base64}`,
      { folder: "add_money_proofs" }
    );

    // Create payment proof record
    const paymentProof = await prisma.payment_proofs.create({
      data: {
        user_id: user.id,
        proof_url: uploadResult.secure_url,
        type: "add_money",
        amount: addAmount.toString(),
        status: "pending",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    });

    return Response.json({
      success: true,
      requestId: paymentProof.id
    }, { status: 201 });

  } catch (err) {
    console.error("Add money request failed:", err);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}