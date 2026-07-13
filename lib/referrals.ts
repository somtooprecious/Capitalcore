import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { ensureWallet } from "@/lib/wallet";

/** Percent of a referred user's plan deposit credited to the referrer. */
export const REFERRAL_BONUS_PERCENT = 5;

const REWARD_TYPE = "PLAN_DEPOSIT_BONUS";

export function referralBonusForDeposit(depositAmount: number) {
  return Math.round(((Math.max(0, depositAmount) * REFERRAL_BONUS_PERCENT) / 100) * 100) / 100;
}

/**
 * Credits the referrer once with 5% of the referred user's plan deposit.
 * Safe to call multiple times — skips if this referral was already rewarded.
 */
export async function grantReferralPlanDepositBonus(referredUserId: string, depositAmount: number) {
  const bonus = referralBonusForDeposit(depositAmount);
  if (bonus <= 0) return { credited: false as const, reason: "zero_bonus" as const };

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
      data: { balance: { increment: bonus } },
    });

    await tx.earning.create({
      data: {
        userId: referral.referrerId,
        amount: bonus,
        source: "REFERRAL",
        reference,
      },
    });

    await tx.referralEarning.create({
      data: {
        referralId: referral.id,
        amount: bonus,
        type: REWARD_TYPE,
      },
    });

    await tx.transaction.create({
      data: {
        userId: referral.referrerId,
        type: "REFERRAL",
        amount: bonus,
        status: "COMPLETED",
        reference,
        description: `Referral bonus (${REFERRAL_BONUS_PERCENT}% of $${depositAmount.toFixed(2)} plan deposit · ${referral.code})`,
      },
    });

    await tx.notification.create({
      data: {
        userId: referral.referrerId,
        title: "Referral bonus credited",
        body: `You earned $${bonus.toFixed(2)} (${REFERRAL_BONUS_PERCENT}% of a $${depositAmount.toFixed(2)} plan deposit) from your referral.`,
        type: "REFERRAL",
      },
    });
  });

  return { credited: true as const, amount: bonus };
}
