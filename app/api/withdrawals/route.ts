import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/api-auth";
import { createWithdrawalRequest } from "@/lib/withdrawals";

export async function POST(req: Request) {
  const auth = await requireApiUser();
  if ("error" in auth) return auth.error;
  const { user } = auth;

  const body = (await req.json()) as { amount?: number; destination?: string };
  const amount = Number(body.amount);
  const destination = body.destination?.trim();

  if (!amount || !destination) {
    return NextResponse.json({ error: "Amount and destination are required." }, { status: 400 });
  }

  try {
    const withdrawal = await createWithdrawalRequest(user.id, amount, destination);
    return NextResponse.json({
      id: withdrawal.id,
      reference: withdrawal.reference,
      status: withdrawal.status,
      amount: Number(withdrawal.amount),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not create withdrawal.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function GET() {
  const auth = await requireApiUser();
  if ("error" in auth) return auth.error;
  const { user } = auth;

  const { prisma } = await import("@/lib/prisma");
  const withdrawals = await prisma.withdrawalRequest.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({
    withdrawals: withdrawals.map((w) => ({
      id: w.id,
      amount: Number(w.amount),
      destination: w.destination,
      status: w.status,
      reference: w.reference,
      createdAt: w.createdAt.toISOString(),
      processedAt: w.processedAt?.toISOString() ?? null,
    })),
  });
}
