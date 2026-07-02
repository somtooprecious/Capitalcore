import { prisma } from "@/lib/prisma";

export async function approvePayment(paymentId: string) {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { user: { include: { wallet: true } } },
  });
  if (!payment) throw new Error("Payment not found.");
  if (payment.status === "COMPLETED") throw new Error("Payment is already completed.");

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
