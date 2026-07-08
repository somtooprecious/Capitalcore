import { prisma } from "@/lib/prisma";
import { activatePlanById } from "@/lib/investments";
import { dailyearningFor } from "@/lib/investment-plans";

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
        })
      : {};

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

  // If this payment was created specifically for a plan, try to auto-activate it.
  if (metadata.purpose === "PLAN_SUBSCRIPTION" && metadata.planId) {
    try {
      const { plan, amount } = await activatePlanById(payment.userId, metadata.planId);
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
      // Ignore auto-activation failures (e.g., already active plan); payment credit still succeeds.
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
