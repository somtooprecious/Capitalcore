import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { getPlatformConfig } from "@/lib/platform-config";
import { logAudit } from "@/lib/audit";
import { sendWithdrawalEmail } from "@/lib/email";
import {
  WITHDRAWAL_ASSETS,
  WITHDRAWAL_FLAT_FEE_USD,
  WITHDRAWAL_PERCENT_FEE,
  calculateWithdrawalFees,
  formatWithdrawalDestination,
  type WithdrawalAssetCode,
} from "@/lib/withdrawal-fees";

export {
  WITHDRAWAL_ASSETS,
  WITHDRAWAL_FLAT_FEE_USD,
  WITHDRAWAL_PERCENT_FEE,
  calculateWithdrawalFees,
  formatWithdrawalDestination,
};
export type { WithdrawalAssetCode };

function toNumber(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value);
  if (value && typeof value === "object" && "toNumber" in value) {
    return (value as { toNumber: () => number }).toNumber();
  }
  return 0;
}

export async function createWithdrawalRequest(userId: string, amount: number, destination: string) {
  const config = await getPlatformConfig();
  if (amount < config.withdrawalMin || amount > config.withdrawalMax) {
    throw new Error(`Withdrawal must be between $${config.withdrawalMin} and $${config.withdrawalMax}.`);
  }

  const fees = calculateWithdrawalFees(amount);
  if (fees.netPayout <= 0) {
    throw new Error(
      `Amount is too low after the 10% withdrawal fee. Increase the withdrawal amount.`,
    );
  }

  const wallet = await prisma.wallet.findUnique({ where: { userId } });
  const balance = toNumber(wallet?.balance);
  if (amount > balance) throw new Error("Insufficient available balance.");

  const cooldownMs = config.withdrawalCooldownHours * 60 * 60 * 1000;
  const recent = await prisma.withdrawalRequest.findFirst({
    where: { userId, status: { in: ["PENDING", "APPROVED", "COMPLETED"] } },
    orderBy: { createdAt: "desc" },
  });
  if (recent && Date.now() - recent.createdAt.getTime() < cooldownMs) {
    throw new Error(`Please wait ${config.withdrawalCooldownHours}h between withdrawal requests.`);
  }

  const reference = `WD-${randomBytes(5).toString("hex").toUpperCase()}`;

  const withdrawal = await prisma.$transaction(async (tx) => {
    const created = await tx.withdrawalRequest.create({
      data: { userId, amount, destination, reference, status: "PENDING" },
    });
    await tx.wallet.update({
      where: { userId },
      data: { balance: { decrement: amount } },
    });
    await tx.transaction.create({
      data: {
        userId,
        type: "WITHDRAWAL",
        amount,
        status: "PENDING",
        reference,
        description: `Withdrawal request (−10% fee) to ${destination.slice(0, 32)}`,
      },
    });
    await tx.notification.create({
      data: {
        userId,
        title: "Withdrawal submitted",
        body: `Withdrawal of $${amount.toFixed(2)} submitted. Fees: $${fees.totalFee.toFixed(2)}. Net payout: $${fees.netPayout.toFixed(2)}. Pending admin review.`,
        type: "WITHDRAWAL",
      },
    });
    return created;
  });

  return { withdrawal, fees };
}

export async function processWithdrawal(
  withdrawalId: string,
  status: "APPROVED" | "REJECTED" | "COMPLETED",
  adminUserId: string,
) {
  const withdrawal = await prisma.withdrawalRequest.findUnique({ where: { id: withdrawalId } });
  if (!withdrawal) throw new Error("Withdrawal not found.");
  if (withdrawal.status !== "PENDING" && status === "REJECTED" && withdrawal.status !== "APPROVED") {
    throw new Error("Withdrawal cannot be updated.");
  }

  await prisma.$transaction(async (tx) => {
    await tx.withdrawalRequest.update({
      where: { id: withdrawalId },
      data: { status, processedAt: new Date() },
    });
    await tx.transaction.updateMany({
      where: { reference: withdrawal.reference },
      data: { status: status === "REJECTED" ? "REJECTED" : "COMPLETED" },
    });

    if (status === "REJECTED") {
      await tx.wallet.update({
        where: { userId: withdrawal.userId },
        data: { balance: { increment: withdrawal.amount } },
      });
    }

    await tx.notification.create({
      data: {
        userId: withdrawal.userId,
        title: `Withdrawal ${status.toLowerCase()}`,
        body:
          status === "REJECTED"
            ? `Your withdrawal was rejected. Funds were returned to your wallet.`
            : `Your withdrawal of $${toNumber(withdrawal.amount).toFixed(2)} has been ${status.toLowerCase()}.`,
        type: "WITHDRAWAL",
      },
    });
  });

  await logAudit({
    userId: adminUserId,
    action: `WITHDRAWAL_${status}`,
    entity: "WithdrawalRequest",
    entityId: withdrawalId,
  });

  const user = await prisma.user.findUnique({
    where: { id: withdrawal.userId },
    select: { email: true, emailNotifications: true },
  });
  if (user?.emailNotifications && user.email) {
    await sendWithdrawalEmail(user.email, toNumber(withdrawal.amount), status);
  }
}
