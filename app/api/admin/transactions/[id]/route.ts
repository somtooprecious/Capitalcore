import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireOwnerApi } from "@/lib/require-owner-api";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireOwnerApi();
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const body = (await req.json()) as { status?: string };

  if (!body.status || !["PENDING", "COMPLETED", "REJECTED", "CANCELLED"].includes(body.status)) {
    return NextResponse.json({ error: "Invalid transaction status." }, { status: 400 });
  }

  const transaction = await prisma.transaction.update({
    where: { id },
    data: { status: body.status },
    select: { id: true, status: true, type: true, amount: true },
  });

  return NextResponse.json({
    transaction: { ...transaction, amount: Number(transaction.amount) },
  });
}
