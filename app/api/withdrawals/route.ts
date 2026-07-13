import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/api-auth";
import {
  WITHDRAWAL_ASSETS,
  createWithdrawalRequest,
  formatWithdrawalDestination,
  type WithdrawalAssetCode,
} from "@/lib/withdrawals";

const ALLOWED_ASSETS = new Set(WITHDRAWAL_ASSETS.map((a) => a.code));

export async function POST(req: Request) {
  const auth = await requireApiUser();
  if ("error" in auth) return auth.error;
  const { user } = auth;

  const body = (await req.json()) as {
    amount?: number;
    destination?: string;
    asset?: string;
    address?: string;
  };
  const amount = Number(body.amount);
  const asset = (body.asset ?? "").toUpperCase() as WithdrawalAssetCode;
  const address = (body.address ?? body.destination ?? "").trim();

  if (!amount) {
    return NextResponse.json({ error: "Amount is required." }, { status: 400 });
  }
  if (!ALLOWED_ASSETS.has(asset)) {
    return NextResponse.json({ error: "Select BTC, Ethereum, or USDT BEP 20." }, { status: 400 });
  }
  if (!address || address.length < 8) {
    return NextResponse.json({ error: "Enter a valid wallet address." }, { status: 400 });
  }

  const destination = formatWithdrawalDestination(asset, address);

  try {
    const { withdrawal, fees } = await createWithdrawalRequest(user.id, amount, destination);
    return NextResponse.json({
      id: withdrawal.id,
      reference: withdrawal.reference,
      status: withdrawal.status,
      amount: Number(withdrawal.amount),
      destination,
      fees,
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
