// app/api/admin/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type UpdateUserFields = {
  balance?: number;
  profit_balance?: number;
  recovery_fund?: number;
};

function validateNumericField(value: unknown, fieldName: string): number | undefined {
  if (value === undefined || value === null || value === "") return undefined;

  const numValue = parseFloat(String(value));
  if (isNaN(numValue)) throw new Error(`${fieldName} must be a valid number`);
  if (numValue < 0) throw new Error(`${fieldName} cannot be negative`);
  return numValue;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ✅ Fixed: params is now a Promise
) {
  try {
    // ✅ Fixed: await params before accessing properties
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id) || id <= 0) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const body = (await req.json()) as Partial<Record<keyof UpdateUserFields, unknown>>;
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const user = await prisma.users.findUnique({ where: { id }, select: { id: true } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updateData: UpdateUserFields = {};

    try {
      if (body.balance !== undefined)
        updateData.balance = validateNumericField(body.balance, "Balance");

      if (body.profit_balance !== undefined)
        updateData.profit_balance = validateNumericField(body.profit_balance, "Profit balance");

      if (body.recovery_fund !== undefined)
        updateData.recovery_fund = validateNumericField(body.recovery_fund, "Recovery fund");
    } catch (err: unknown) {
      if (err instanceof Error) {
        return NextResponse.json({ error: err.message }, { status: 400 });
      }
      return NextResponse.json({ error: "Invalid field value" }, { status: 400 });
    }

    Object.keys(updateData).forEach((key) => {
      if (updateData[key as keyof UpdateUserFields] === undefined) {
        delete updateData[key as keyof UpdateUserFields];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const updatedUser = await prisma.users.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        balance: true,
        profit_balance: true,
        recovery_fund: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error: unknown) {
    console.error("Update error:", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      typeof (error as { code?: unknown }).code === "string"
    ) {
      const code = (error as { code: string }).code;

      if (code === "P2002") {
        return NextResponse.json({ error: "Duplicate entry" }, { status: 409 });
      }

      if (code === "P2025") {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
    }

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}