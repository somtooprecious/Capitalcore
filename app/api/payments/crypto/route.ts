import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

const CRYPTO_ADDRESSES: Record<string, string> = {
  BTC: process.env.CRYPTO_BTC_ADDRESS ?? "bc1qcapitalcore-demo-deposit",
  USDT: process.env.CRYPTO_USDT_ADDRESS ?? "0xCapitalCoreDemoUsdtDeposit",
  ETH: process.env.CRYPTO_ETH_ADDRESS ?? "0xCapitalCoreDemoEthDeposit",
};

export async function POST(req: Request) {
  const auth = await requireApiUser();
  if ("error" in auth) return auth.error;
  const { user } = auth;

  const body = (await req.json()) as { amount?: number; asset?: string };
  const amount = Number(body.amount);
  const asset = (body.asset ?? "BTC").toUpperCase();

  if (!amount || amount < 10) {
    return NextResponse.json({ error: "Minimum deposit is $10." }, { status: 400 });
  }

  if (!CRYPTO_ADDRESSES[asset]) {
    return NextResponse.json({ error: "Unsupported crypto asset." }, { status: 400 });
  }

  const reference = `CRYPTO-${randomBytes(6).toString("hex").toUpperCase()}`;
  const depositAddress = CRYPTO_ADDRESSES[asset];

  await prisma.$transaction([
    prisma.payment.create({
      data: {
        userId: user.id,
        amount,
        currency: "USD",
        provider: "crypto",
        reference,
        status: "PENDING",
        metadata: { asset, depositAddress },
      },
    }),
    prisma.transaction.create({
      data: {
        userId: user.id,
        type: "DEPOSIT",
        amount,
        status: "PENDING",
        reference,
        description: `Crypto deposit (${asset})`,
      },
    }),
  ]);

  return NextResponse.json({
    reference,
    depositAddress,
    asset,
    amount,
    message: "Send the equivalent USD amount in crypto and include your reference in the memo if supported.",
  });
}
