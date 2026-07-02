import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireOwnerApi } from "@/lib/require-owner-api";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireOwnerApi();
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const body = (await req.json()) as { balance?: number; cryptoBtc?: number };

  const user = await prisma.user.findUnique({ where: { id }, select: { id: true } });
  if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 });

  const update: { balance?: number; cryptoBtc?: number } = {};
  if (body.balance !== undefined) {
    if (body.balance < 0) return NextResponse.json({ error: "Balance cannot be negative." }, { status: 400 });
    update.balance = body.balance;
  }
  if (body.cryptoBtc !== undefined) {
    if (body.cryptoBtc < 0) return NextResponse.json({ error: "Crypto balance cannot be negative." }, { status: 400 });
    update.cryptoBtc = body.cryptoBtc;
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "No valid fields to update." }, { status: 400 });
  }

  const wallet = await prisma.wallet.upsert({
    where: { userId: id },
    update,
    create: { userId: id, ...update },
    select: { balance: true, cryptoBtc: true },
  });

  return NextResponse.json({
    wallet: {
      balance: Number(wallet.balance),
      cryptoBtc: Number(wallet.cryptoBtc),
    },
  });
}
