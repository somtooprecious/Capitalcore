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

  const body = (await req.json()) as { amount?: number; asset?: string; planId?: string };
  let amount = Number(body.amount);
  const asset = (body.asset ?? "BTC").toUpperCase();
  const planId = body.planId;

  if (!CRYPTO_ADDRESSES[asset]) {
    return NextResponse.json({ error: "Unsupported crypto asset." }, { status: 400 });
  }

  let plan:
    | {
        id: string;
        name: string;
        minDeposit: number;
      }
    | null = null;

  if (planId) {
    const dbPlan = await prisma.investmentPlan.findUnique({
      where: { id: planId },
      select: { id: true, name: true, minDeposit: true, isActive: true },
    });
    if (!dbPlan || !dbPlan.isActive) {
      return NextResponse.json({ error: "Selected plan is not available." }, { status: 400 });
    }
    amount = Number(dbPlan.minDeposit);
    plan = { id: dbPlan.id, name: dbPlan.name, minDeposit: amount };
  }

  if (!amount || amount < 10) {
    return NextResponse.json({ error: "Minimum deposit is $10." }, { status: 400 });
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
        metadata: {
          asset,
          depositAddress,
          purpose: plan ? "PLAN_SUBSCRIPTION" : "WALLET_DEPOSIT",
          planId: plan?.id,
          planName: plan?.name,
        },
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
    planName: plan?.name,
    message: plan
      ? `Send exactly ${amount} USD equivalent in ${asset} to activate ${plan.name}. Include your reference in memo if supported.`
      : "Send the equivalent USD amount in crypto and include your reference in the memo if supported.",
  });
}
