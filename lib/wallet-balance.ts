import { prisma } from "@/lib/prisma";

function toNumber(value: { toString(): string } | number | null | undefined) {
  if (value == null) return 0;
  return typeof value === "number" ? value : Number(value.toString());
}

export type WalletBalanceSummary = {
  balance: number;
  availableBalance: number;
  lockedBalance: number;
  currency: string;
};

export async function getWalletBalanceSummary(userId: string): Promise<WalletBalanceSummary> {
  await prisma.wallet.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });

  const [wallet, pendingWithdrawalsAgg, user] = await Promise.all([
    prisma.wallet.findUnique({ where: { userId } }),
    prisma.withdrawalRequest.aggregate({
      where: { userId, status: "PENDING" },
      _sum: { amount: true },
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { preferredCurrency: true },
    }),
  ]);

  const availableBalance = Math.max(0, toNumber(wallet?.balance));
  const lockedBalance = toNumber(pendingWithdrawalsAgg._sum.amount);
  const balance = availableBalance + lockedBalance;

  return {
    balance,
    availableBalance,
    lockedBalance,
    currency: user?.preferredCurrency ?? "USD",
  };
}
