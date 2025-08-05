// app/api/admin/users/route.ts
import  prisma  from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const search = searchParams.get("search") || "";
    const limit = 50;

    // Validate page number
    if (page < 1) {
      return Response.json(
        { error: "Page must be a positive number" },
        { status: 400 }
      );
    }

    const where = search.trim()
      ? { 
          email: { 
            contains: search.trim(), 
            mode: "insensitive" as const 
          } 
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.users.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { id: "desc" },
        select: {
          id: true,
          email: true,
          balance: true,
          profit_balance: true,
          recovery_fund: true,
        },
      }),
      prisma.users.count({ where })
    ]);

    return Response.json({ 
      users, 
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return Response.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

