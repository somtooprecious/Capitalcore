import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { ensureWallet } from "@/lib/wallet";

/** Flat bonus credited to the referrer when a referred user deposits for a plan. */
export const REFERRAL_BONUS_USD = 5;

const REWARD_TYPE = "PLAN_DEPOSIT_BONUS";

/**
 * Credits the referrer $5 once when a referred user completes a plan deposit.
 * Safe to call multiple times — skips if this referral was already rewarded.
 */
export async function grantReferralPlanDepositBonus(referredUserId: string) {
  const referral = await prisma.referral.findUnique({
    where: { referredId: referredUserId },
    select: { id: true, referrerId: true, code: true },
  });
  if (!referral) return { credited: false as const, reason: "no_referral" as const };

  const existing = await prisma.referralEarning.findFirst({
    where: {
      referralId: referral.id,
      type: { in: [REWARD_TYPE, "SIGNUP_BONUS"] },
    },
    select: { id: true },
  });
  if (existing) return { credited: false as const, reason: "already_credited" as const };

  await ensureWallet(referral.referrerId);

  const reference = `REF-${randomBytes(4).toString("hex").toUpperCase()}`;

  await prisma.$transaction(async (tx) => {
    await tx.wallet.update({
      where: { userId: referral.referrerId },
      data: { balance: { increment: REFERRAL_BONUS_USD } },
    });

    await tx.earning.create({
      data: {
        userId: referral.referrerId,
        amount: REFERRAL_BONUS_USD,
        source: "REFERRAL",
        reference,
      },
    });

    await tx.referralEarning.create({
      data: {
        referralId: referral.id,
        amount: REFERRAL_BONUS_USD,
        type: REWARD_TYPE,
      },
    });

    await tx.transaction.create({
      data: {
        userId: referral.referrerId,
        type: "REFERRAL",
        amount: REFERRAL_BONUS_USD,
        status: "COMPLETED",
        reference,
        description: `Referral bonus — invited user deposited for a plan (${referral.code})`,
      },
    });

    await tx.notification.create({
      data: {
        userId: referral.referrerId,
        title: "Referral bonus credited",
        body: `You earned $${REFERRAL_BONUS_USD.toFixed(2)} because someone you referred deposited for an investment plan.`,
        type: "REFERRAL",
      },
    });
  });

  return { credited: true as const, amount: REFERRAL_BONUS_USD };
}
