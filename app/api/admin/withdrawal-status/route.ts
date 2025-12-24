import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {

    // Get count of users with withdrawals enabled vs disabled
    const enabledCount = await prisma.users.count({
      where: { withdrawals_enabled: true }
    });

    const disabledCount = await prisma.users.count({
      where: { withdrawals_enabled: false }
    });

    const totalUsers = await prisma.users.count();

    const globalStatus = enabledCount >= disabledCount;

    return Response.json({ 
      enabled: globalStatus,
      stats: {
        enabled: enabledCount,
        disabled: disabledCount,
        total: totalUsers
      }
    });

  } catch (err) {
    console.error("Get withdrawal status error:", err);
    return Response.json({ 
      error: "Something went wrong" 
    }, { status: 500 });
  }
}