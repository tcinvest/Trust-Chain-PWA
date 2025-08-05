// app/api/bots/[id]/route.ts
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const bot = await prisma.bots.findUnique({
      where: { id: parseInt(id) }
    });

    if (!bot) {
      return Response.json({ error: "Bot not found" }, { status: 404 });
    }

    return Response.json(bot);
  } catch (err) {
    console.error("Get bot error:", err);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
