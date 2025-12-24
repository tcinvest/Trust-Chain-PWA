import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {

    const { userId } = await auth();
    
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { enabled } = body;

    if (enabled === undefined) {
      return Response.json({ error: "Missing enabled field" }, { status: 400 });
    }

    const result = await prisma.users.updateMany({
      data: { withdrawals_enabled: enabled }
    });

    return Response.json({ 
      message: `Withdrawals ${enabled ? 'enabled' : 'disabled'} for all users`,
      updatedCount: result.count,
      success: true
    });

  } catch (err) {
    console.error("Toggle all withdrawals error:", err);
    return Response.json({ 
      error: "Something went wrong",
      details: err instanceof Error ? err.message : "Unknown error"
    }, { status: 500 });
  }
}