//api/admin/investments/pending
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const investments = await prisma.invests.findMany({
      where: { status: "pending" },
      orderBy: { created_at: "desc" }
    });

    // Manually enrich each investment with user, bot, and payment proof data
    const enriched = await Promise.all(
      investments.map(async (inv) => {
        const user = inv.user_id
          ? await prisma.users.findUnique({
              where: { id: inv.user_id },
              select: { id: true, email: true, first_name: true, last_name: true }
            })
          : null;

        const bot = inv.schema_id
          ? await prisma.bots.findUnique({
              where: { id: inv.schema_id },
              select: { id: true, name: true, description: true }
            })
          : null;

        // Get payment proof for this investment
        const payment_proof = await prisma.payment_proofs.findFirst({
          where: {
            reference_id: inv.id,
            type: "investment"
          },
          select: {
            id: true,
            proof_url: true,
            created_at: true
          }
        });

        return {
          ...inv,
          user,
          bot,
          payment_proof
        };
      })
    );

    return Response.json(enriched);
  } catch (err) {
    console.error("Get pending investments error:", err);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}