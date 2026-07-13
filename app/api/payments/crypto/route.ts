import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { getPlanPaymentAmount } from "@/lib/investments";

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
  let purpose: "PLAN_SUBSCRIPTION" | "PLAN_UPGRADE" | "WALLET_DEPOSIT" = "WALLET_DEPOSIT";
  let isUpgrade = false;

  if (planId) {
    try {
      const payment = await getPlanPaymentAmount(user.id, planId);
      amount = payment.amount;
      purpose = payment.purpose;
      isUpgrade = payment.isUpgrade;
      plan = {
        id: payment.plan.id,
        name: payment.plan.name,
        minDeposit: Number(payment.plan.minDeposit),
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Selected plan is not available.";
      return NextResponse.json({ error: message }, { status: 400 });
    }
  }

  if (!amount || amount < 10) {
    return NextResponse.json({ error: "Minimum deposit is $10." }, { status: 400 });
  }

  const reference = `CRYPTO-${randomBytes(6).toString("hex").toUpperCase()}`;
  const depositAddress = CRYPTO_ADDRESSES[asset];
  const network = asset === "USDT" ? "BEP20" : null;
  const assetLabel = asset === "USDT" ? "USDT BEP 20" : asset;

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
          network,
          depositAddress,
          purpose,
          planId: plan?.id,
          planName: plan?.name,
          isUpgrade,
          targetPlanAmount: plan?.minDeposit,
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
        description: plan
          ? isUpgrade
            ? `Plan upgrade top-up (${assetLabel}) · ${plan.name}`
            : `Crypto deposit (${assetLabel}) · ${plan.name}`
          : network
            ? `Crypto deposit (${assetLabel})`
            : `Crypto deposit (${asset})`,
      },
    }),
  ]);

  return NextResponse.json({
    reference,
    depositAddress,
    asset,
    network,
    amount,
    planName: plan?.name,
    isUpgrade,
    message: plan
      ? isUpgrade
        ? `Send exactly ${amount} USD equivalent in ${assetLabel} to upgrade to ${plan.name}. Include your reference in memo if supported.`
        : `Send exactly ${amount} USD equivalent in ${assetLabel} to activate ${plan.name}. Include your reference in memo if supported.`
      : `Send the equivalent USD amount in ${assetLabel} and include your reference in the memo if supported.`,
  });
}
