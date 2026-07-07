import { prisma } from "@/lib/prisma";
import { getPlatformConfig } from "@/lib/platform-config";
import { withDbRetry } from "@/lib/db-retry";

function toNumber(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value);
  if (value && typeof value === "object" && "toNumber" in value) {
    return (value as { toNumber: () => number }).toNumber();
  }
  return 0;
}

export async function getAdminData() {
  return withDbRetry(async () => {
  const [
    totalUsers,
    pendingPayments,
    completedPayments,
    recentUsers,
    recentPayments,
    recentTransactions,
    recentPlans,
    investmentPlans,
    withdrawalRequests,
    platformConfig,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.payment.count({ where: { status: "PENDING" } }),
    prisma.payment.count({ where: { status: "COMPLETED" } }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 25,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        kycStatus: true,
        createdAt: true,
        wallet: { select: { balance: true, cryptoBtc: true } },
      },
    }),
    prisma.payment.findMany({
      orderBy: { createdAt: "desc" },
      take: 40,
      include: { user: { select: { email: true, name: true } } },
    }),
    prisma.transaction.findMany({
      orderBy: { createdAt: "desc" },
      take: 40,
      include: { user: { select: { email: true, name: true } } },
    }),
    prisma.userPlan.findMany({
      orderBy: { createdAt: "desc" },
      take: 25,
      include: {
        user: { select: { email: true, name: true } },
        plan: { select: { name: true } },
      },
    }),
    prisma.investmentPlan.findMany({
      orderBy: { minDeposit: "asc" },
      select: {
        id: true,
        name: true,
        minDeposit: true,
        roiPercent: true,
        durationDay: true,
        isActive: true,
        features: true,
      },
    }),
    prisma.withdrawalRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 40,
      include: { user: { select: { email: true, name: true } } },
    }),
    getPlatformConfig(),
  ]);

  const paymentVolume = recentPayments
    .filter((p) => p.status === "COMPLETED")
    .reduce((sum, p) => sum + toNumber(p.amount), 0);

  return {
    stats: {
      totalUsers,
      pendingPayments,
      completedPayments,
      paymentVolume,
    },
    recentUsers: recentUsers.map((user) => ({
      ...user,
      balance: toNumber(user.wallet?.balance),
      cryptoBtc: toNumber(user.wallet?.cryptoBtc),
      createdAt: user.createdAt.toISOString(),
    })),
    recentPayments: recentPayments.map((payment) => ({
      id: payment.id,
      user: payment.user.name ?? payment.user.email,
      email: payment.user.email,
      amount: toNumber(payment.amount),
      currency: payment.currency,
      provider: payment.provider,
      reference: payment.reference,
      status: payment.status,
      createdAt: payment.createdAt.toISOString(),
    })),
    recentTransactions: recentTransactions.map((tx) => ({
      id: tx.id,
      user: tx.user.name ?? tx.user.email,
      email: tx.user.email,
      type: tx.type,
      amount: toNumber(tx.amount),
      status: tx.status,
      reference: tx.reference,
      description: tx.description,
      createdAt: tx.createdAt.toISOString(),
    })),
    recentPlans: recentPlans.map((plan) => ({
      id: plan.id,
      user: plan.user.name ?? plan.user.email,
      email: plan.user.email,
      planName: plan.plan.name,
      amount: toNumber(plan.amount),
      status: plan.status,
      startDate: plan.startDate.toISOString(),
      endDate: plan.endDate.toISOString(),
      createdAt: plan.createdAt.toISOString(),
    })),
    investmentPlans: investmentPlans.map((plan) => ({
      id: plan.id,
      name: plan.name,
      minDeposit: toNumber(plan.minDeposit),
      roiPercent: toNumber(plan.roiPercent),
      durationDay: plan.durationDay,
      isActive: plan.isActive,
      features: plan.features,
    })),
    withdrawalRequests: withdrawalRequests.map((w) => ({
      id: w.id,
      user: w.user.name ?? w.user.email,
      email: w.user.email,
      amount: toNumber(w.amount),
      destination: w.destination,
      status: w.status,
      reference: w.reference,
      createdAt: w.createdAt.toISOString(),
    })),
    platformConfig,
  };
  });
}

export type AdminData = Awaited<ReturnType<typeof getAdminData>>;
