import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/api-auth";
import { approvePayment } from "@/lib/admin-actions";
import { prisma } from "@/lib/prisma";
import { getPlanPaymentAmount } from "@/lib/investments";

const USDT_ADDRESS = process.env.CRYPTO_USDT_ADDRESS ?? "0xCapitalCoreDemoUsdtDeposit";
const DEPOSIT_ASSET = "USDT";
const DEPOSIT_NETWORK = "BEP20";
const ASSET_LABEL = "USDT BEP 20";

export async function GET() {
  const auth = await requireApiUser();
  if ("error" in auth) return auth.error;

  return NextResponse.json({
    asset: DEPOSIT_ASSET,
    network: DEPOSIT_NETWORK,
    depositAddress: USDT_ADDRESS,
    assetLabel: ASSET_LABEL,
  });
}

export async function POST(req: Request) {
  const auth = await requireApiUser();
  if ("error" in auth) return auth.error;
  const { user } = auth;

  const body = (await req.json()) as { amount?: number; asset?: string; planId?: string };
  let amount = Number(body.amount);
  const asset = (body.asset ?? DEPOSIT_ASSET).toUpperCase();
  const planId = body.planId;

  if (asset !== DEPOSIT_ASSET) {
    return NextResponse.json(
      { error: "Only USDT BEP 20 deposits are supported." },
      { status: 400 },
    );
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
  const depositAddress = USDT_ADDRESS;

  const payment = await prisma.$transaction(async (tx) => {
    const created = await tx.payment.create({
      data: {
        userId: user.id,
        amount,
        currency: "USD",
        provider: "crypto",
        reference,
        status: "PENDING",
        metadata: {
          asset: DEPOSIT_ASSET,
          network: DEPOSIT_NETWORK,
          depositAddress,
          purpose,
          planId: plan?.id,
          planName: plan?.name,
          isUpgrade,
          targetPlanAmount: plan?.minDeposit,
        },
      },
    });

    await tx.transaction.create({
      data: {
        userId: user.id,
        type: "DEPOSIT",
        amount,
        status: "PENDING",
        reference,
        description: plan
          ? isUpgrade
            ? `Plan upgrade top-up (${ASSET_LABEL}) · ${plan.name}`
            : `Crypto deposit (${ASSET_LABEL}) · ${plan.name}`
          : `Crypto deposit (${ASSET_LABEL})`,
      },
    });

    return created;
  });

  try {
    await approvePayment(payment.id);
  } catch (error) {
    console.error("[crypto deposit] Instant approval failed:", error);
    return NextResponse.json({ error: "Could not credit this deposit right now." }, { status: 500 });
  }

  const instantMessage = plan
    ? isUpgrade
      ? `${plan.name} upgrade credited instantly. Send ${amount} USDT (${ASSET_LABEL}) to the address below.`
      : `${plan.name} activated instantly. Send ${amount} USDT (${ASSET_LABEL}) to the address below. Referral bonuses are credited automatically.`
    : `$${amount.toFixed(2)} credited to your wallet instantly. Send USDT (${ASSET_LABEL}) to the address below. Referral bonuses are credited automatically.`;

  return NextResponse.json({
    reference,
    depositAddress,
    asset: DEPOSIT_ASSET,
    network: DEPOSIT_NETWORK,
    amount,
    planName: plan?.name,
    isUpgrade,
    status: "COMPLETED",
    message: instantMessage,
  });
}
