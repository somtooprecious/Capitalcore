import { prisma } from "@/lib/prisma";
import { activatePlanById, upgradePlanById } from "@/lib/investments";
import { dailyearningFor } from "@/lib/investment-plans";
import { grantReferralPlanDepositBonus } from "@/lib/referrals";

export async function approvePayment(paymentId: string) {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { user: { include: { wallet: true } } },
  });
  if (!payment) throw new Error("Payment not found.");
  if (payment.status === "COMPLETED") throw new Error("Payment is already completed.");

  const metadata =
    payment.metadata && typeof payment.metadata === "object" && !Array.isArray(payment.metadata)
      ? (payment.metadata as {
          purpose?: string;
          planId?: string;
          planName?: string;
          isUpgrade?: boolean;
        })
      : {};

  const paymentAmount = Number(payment.amount);

  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id: paymentId },
      data: { status: "COMPLETED" },
    });
    await tx.transaction.updateMany({
      where: { reference: payment.reference },
      data: { status: "COMPLETED" },
    });
    await tx.wallet.upsert({
      where: { userId: payment.userId },
      update: { balance: { increment: payment.amount } },
      create: { userId: payment.userId, balance: payment.amount },
    });
  });

  if (metadata.purpose === "PLAN_SUBSCRIPTION" && metadata.planId) {
    try {
      const { plan, amount } = await activatePlanById(payment.userId, metadata.planId);
      // Apply the deposit toward the plan by debiting the credited amount.
      await prisma.wallet.update({
        where: { userId: payment.userId },
        data: { balance: { decrement: payment.amount } },
      });
      await prisma.notification.create({
        data: {
          userId: payment.userId,
          title: "Plan activated",
          body: `${plan.name} is now active. Complete your daily task to earn $${dailyearningFor(
            amount,
          ).toFixed(2)} each day.`,
          type: "PLAN",
        },
      });
    } catch {
      // Ignore auto-activation failures; payment credit still succeeds.
    }

    await grantReferralPlanDepositBonus(payment.userId, paymentAmount).catch((error) => {
      console.error("[approvePayment] Referral bonus failed:", error);
    });
  }

  if (metadata.purpose === "PLAN_UPGRADE" && metadata.planId) {
    try {
      const { plan, amount, upgradeCost } = await upgradePlanById(payment.userId, metadata.planId, {
        debitWallet: true,
        debitAmount: paymentAmount,
      });
      await prisma.notification.create({
        data: {
          userId: payment.userId,
          title: "Plan upgraded",
          body: `Upgraded to ${plan.name} (top-up $${upgradeCost.toFixed(2)}). Daily task reward is now $${dailyearningFor(
            amount,
          ).toFixed(2)}.`,
          type: "PLAN",
        },
      });
    } catch (error) {
      console.error("[approvePayment] Plan upgrade failed:", error);
    }
  }
}

export async function rejectPayment(paymentId: string) {
  const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
  if (!payment) throw new Error("Payment not found.");

  await prisma.$transaction([
    prisma.payment.update({
      where: { id: paymentId },
      data: { status: "REJECTED" },
    }),
    prisma.transaction.updateMany({
      where: { reference: payment.reference },
      data: { status: "REJECTED" },
    }),
  ]);
}
