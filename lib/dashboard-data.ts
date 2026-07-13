import { prisma } from "@/lib/prisma";
import { getDailyTaskStatus } from "@/lib/daily-tasks";
import { ensureWallet } from "@/lib/wallet";
import { withDbRetry } from "@/lib/db-retry";

function toNumber(value: { toString(): string } | number | null | undefined) {
  if (value == null) return 0;
  return typeof value === "number" ? value : Number(value.toString());
}

export type DashboardData = {
  /** Current funds in the account (available + locked withdrawals). */
  balance: number;
  availableBalance: number;
  lockedBalance: number;
  cryptoBtc: number;
  /** Profit generated on the platform (tasks, referrals, rewards). */
  totalRevenue: number;
  /** @deprecated Prefer totalRevenue */
  totalEarnings: number;
  referralEarnings: number;
  depositTotal: number;
  withdrawalTotal: number;
  activePlans: number;
  unreadNotifications: number;
  dailyTask: Awaited<ReturnType<typeof getDailyTaskStatus>>;
  recentTransactions: {
    id: string;
    type: string;
    amount: number;
    status: string;
    description: string | null;
    createdAt: string;
  }[];
  earningsChart: { month: string; amount: number }[];
  portfolioBreakdown: { name: string; value: number }[];
};

export async function getDashboardData(userId: string): Promise<DashboardData> {
  return withDbRetry(async () => {
  await ensureWallet(userId);

  const [
    wallet,
    activePlans,
    recentTransactions,
    earnings,
    referralEarningsAgg,
    depositsAgg,
    withdrawalsAgg,
    pendingWithdrawalsAgg,
    unreadNotifications,
    dailyTask,
  ] = await Promise.all([
    prisma.wallet.findUnique({ where: { userId } }),
    prisma.userPlan.count({ where: { userId, status: "ACTIVE" } }),
    prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.earning.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    prisma.earning.aggregate({
      where: { userId, source: "REFERRAL" },
      _sum: { amount: true },
    }),
    prisma.payment.aggregate({
      where: { userId, status: "COMPLETED" },
      _sum: { amount: true },
    }),
    prisma.withdrawalRequest.aggregate({
      where: { userId, status: { in: ["COMPLETED", "APPROVED"] } },
      _sum: { amount: true },
    }),
    prisma.withdrawalRequest.aggregate({
      where: { userId, status: "PENDING" },
      _sum: { amount: true },
    }),
    prisma.notification.count({ where: { userId, read: false } }),
    getDailyTaskStatus(userId),
  ]);

  const balance = toNumber(wallet?.balance);
  const cryptoBtc = toNumber(wallet?.cryptoBtc);
  const lockedBalance = toNumber(pendingWithdrawalsAgg._sum.amount);
  const availableBalance = Math.max(0, balance);
  const totalRevenue = earnings.reduce((sum, e) => sum + toNumber(e.amount), 0);
  const depositTotal = toNumber(depositsAgg._sum.amount);
  const withdrawalTotal = toNumber(withdrawalsAgg._sum.amount);
  // Total money currently in the account (available wallet + pending withdrawal holds).
  const totalBalance = availableBalance + lockedBalance;

  const portfolioBreakdown =
    totalBalance > 0
      ? [
          { name: "Available", value: Math.round((availableBalance / (totalBalance || 1)) * 100) },
          { name: "Locked", value: Math.round((lockedBalance / (totalBalance || 1)) * 100) },
          { name: "Crypto (BTC)", value: Math.round((cryptoBtc / (totalBalance || 1)) * 100) },
        ].filter((s) => s.value > 0)
      : [
          { name: "Available", value: 70 },
          { name: "Crypto (BTC)", value: 30 },
        ];

  const monthMap = new Map<string, number>();
  for (const e of earnings) {
    const month = e.createdAt.toISOString().slice(0, 7);
    monthMap.set(month, (monthMap.get(month) ?? 0) + toNumber(e.amount));
  }
  const earningsChart = Array.from(monthMap.entries())
    .slice(0, 6)
    .reverse()
    .map(([month, amount]) => ({ month, amount }));

  return {
    balance: totalBalance,
    availableBalance,
    lockedBalance,
    cryptoBtc,
    totalRevenue,
    totalEarnings: totalRevenue,
    referralEarnings: toNumber(referralEarningsAgg._sum.amount),
    depositTotal,
    withdrawalTotal,
    activePlans,
    unreadNotifications,
    dailyTask,
    recentTransactions: recentTransactions.map((tx) => ({
      id: tx.id,
      type: tx.type,
      amount: toNumber(tx.amount),
      status: tx.status,
      description: tx.description,
      createdAt: tx.createdAt.toISOString(),
    })),
    earningsChart,
    portfolioBreakdown,
  };
  });
}
