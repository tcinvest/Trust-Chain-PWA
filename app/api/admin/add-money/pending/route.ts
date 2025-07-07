import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Get all pending add_money requests
    const requests = await prisma.payment_proofs.findMany({
      where: {
        type: "add_money",
        status: "pending"
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    // Get user details for all request user_ids
    const userIds = requests.map(r => r.user_id);
    const users = await prisma.users.findMany({
      where: { id: { in: userIds } },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        balance: true
      }
    });

    // Merge user info into each request
    const requestsWithUser = requests.map(req => ({
      ...req,
      user: users.find(u => u.id === req.user_id) || null
    }));

    return Response.json(requestsWithUser);
  } catch (err) {
    console.error("Failed to fetch add money requests:", err);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
