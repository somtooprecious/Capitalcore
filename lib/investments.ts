import { prisma } from "@/lib/prisma";
import { ensureWallet } from "@/lib/wallet";
import {
  DAILY_ROI_PERCENT,
  PLAN_DEFINITIONS,
  PLAN_DURATION_DAYS,
  dailyearningFor,
  ensureInvestmentPlans,
  projectedTotalFor,
} from "@/lib/investment-plans";

function toNumber(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value);
  if (value && typeof value === "object" && "toNumber" in value) {
    return (value as { toNumber: () => number }).toNumber();
  }
  return 0;
}

export type ActivePlan = {
  id: string;
  planId: string;
  name: string;
  amount: number;
  dailyEarning: number;
  status: string;
  startDate: string;
  endDate: string;
};

/** Returns the user's highest-value active (non-expired) plan, if any. */
export async function getActivePlan(userId: string): Promise<ActivePlan | null> {
  const userPlan = await prisma.userPlan.findFirst({
    where: { userId, status: "ACTIVE", endDate: { gt: new Date() } },
    orderBy: { amount: "desc" },
    include: { plan: { select: { name: true } } },
  });

  if (!userPlan) return null;

  const amount = toNumber(userPlan.amount);
  return {
    id: userPlan.id,
    planId: userPlan.planId,
    name: userPlan.plan.name,
    amount,
    dailyEarning: dailyearningFor(amount),
    status: userPlan.status,
    startDate: userPlan.startDate.toISOString(),
    endDate: userPlan.endDate.toISOString(),
  };
}

export type PlansOverview = {
  dailyRoiPercent: number;
  durationDays: number;
  balance: number;
  activePlan: ActivePlan | null;
  plans: {
    id: string;
    name: string;
    amount: number;
    tagline: string;
    features: string[];
    highlight: boolean;
    dailyEarning: number;
    projectedTotal: number;
    affordable: boolean;
    canUpgrade: boolean;
    upgradeCost: number;
    upgradeAffordable: boolean;
    isCurrent: boolean;
    isLower: boolean;
  }[];
};

export async function getPlansOverview(userId: string): Promise<PlansOverview> {
  await ensureInvestmentPlans();
  await ensureWallet(userId);

  const [dbPlans, wallet, activePlan] = await Promise.all([
    prisma.investmentPlan.findMany({
      where: { isActive: true },
      orderBy: { minDeposit: "asc" },
    }),
    prisma.wallet.findUnique({ where: { userId } }),
    getActivePlan(userId),
  ]);

  const balance = toNumber(wallet?.balance);
  const activeAmount = activePlan?.amount ?? 0;
  const defByName = new Map(PLAN_DEFINITIONS.map((p) => [p.name, p]));

  const plans = dbPlans.map((plan) => {
    const amount = toNumber(plan.minDeposit);
    const def = defByName.get(plan.name);
    const canUpgrade = Boolean(activePlan) && amount > activeAmount;
    const upgradeCost = canUpgrade ? Math.round((amount - activeAmount) * 100) / 100 : 0;
    const isCurrent = Boolean(activePlan) && amount === activeAmount;
    const isLower = Boolean(activePlan) && amount < activeAmount;

    return {
      id: plan.id,
      name: plan.name,
      amount,
      tagline: def?.tagline ?? "",
      features: plan.features,
      highlight: def?.highlight ?? false,
      dailyEarning: dailyearningFor(amount),
      projectedTotal: projectedTotalFor(amount),
      affordable: !activePlan && balance >= amount,
      canUpgrade,
      upgradeCost,
      upgradeAffordable: canUpgrade && balance >= upgradeCost,
      isCurrent,
      isLower,
    };
  });

  return {
    dailyRoiPercent: DAILY_ROI_PERCENT,
    durationDays: PLAN_DURATION_DAYS,
    balance,
    activePlan,
    plans,
  };
}

/**
 * Activates a plan from wallet (new subscription) or upgrades an existing lower plan,
 * paying only the difference from available balance.
 */
export async function subscribeToPlan(userId: string, planId: string) {
  await ensureInvestmentPlans();
  await ensureWallet(userId);

  const plan = await prisma.investmentPlan.findUnique({ where: { id: planId } });
  if (!plan || !plan.isActive) {
    throw new Error("This plan is not available.");
  }

  const targetAmount = toNumber(plan.minDeposit);
  const wallet = await prisma.wallet.findUnique({ where: { userId } });
  const balance = toNumber(wallet?.balance);

  const active = await prisma.userPlan.findFirst({
    where: { userId, status: "ACTIVE", endDate: { gt: new Date() } },
    orderBy: { amount: "desc" },
  });

  if (active) {
    const currentAmount = toNumber(active.amount);
    if (targetAmount <= currentAmount) {
      throw new Error("Choose a higher plan to upgrade.");
    }
    const upgradeCost = Math.round((targetAmount - currentAmount) * 100) / 100;
    if (balance < upgradeCost) {
      throw new Error(
        `You need $${upgradeCost.toFixed(2)} more in your wallet to upgrade. Deposit the difference or use crypto to top up.`,
      );
    }

    const result = await upgradePlanById(userId, planId, { debitWallet: true, debitAmount: upgradeCost });
    await prisma.notification.create({
      data: {
        userId,
        title: "Plan upgraded",
        body: `Upgraded to ${plan.name}. Daily task reward is now $${dailyearningFor(targetAmount).toFixed(2)}.`,
        type: "PLAN",
      },
    });

    return {
      id: result.userPlan.id,
      name: plan.name,
      amount: targetAmount,
      dailyEarning: dailyearningFor(targetAmount),
      endDate: result.endDate.toISOString(),
      upgraded: true,
      upgradeCost,
    };
  }

  if (balance < targetAmount) {
    throw new Error(
      `You need at least $${targetAmount.toFixed(2)} in your wallet to activate this plan. Please make a deposit first.`,
    );
  }

  await prisma.wallet.update({
    where: { userId },
    data: { balance: { decrement: targetAmount } },
  });

  const { userPlan, endDate } = await activatePlanById(userId, plan.id);

  await prisma.notification.create({
    data: {
      userId,
      title: "Plan activated",
      body: `Your ${plan.name} plan is active. Complete your daily task to earn $${dailyearningFor(
        targetAmount,
      ).toFixed(2)} each day.`,
      type: "PLAN",
    },
  });

  return {
    id: userPlan.id,
    name: plan.name,
    amount: targetAmount,
    dailyEarning: dailyearningFor(targetAmount),
    endDate: endDate.toISOString(),
    upgraded: false,
  };
}

/**
 * Activates a plan for a user without checking wallet balance.
 * Useful for trusted flows such as admin-confirmed crypto payments.
 */
export async function activatePlanById(userId: string, planId: string) {
  await ensureInvestmentPlans();
  const plan = await prisma.investmentPlan.findUnique({ where: { id: planId } });
  if (!plan || !plan.isActive) {
    throw new Error("This plan is not available.");
  }

  const active = await prisma.userPlan.findFirst({
    where: { userId, status: "ACTIVE", endDate: { gt: new Date() } },
  });
  if (active) {
    throw new Error("User already has an active plan.");
  }

  const amount = toNumber(plan.minDeposit);
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + plan.durationDay);

  const userPlan = await prisma.userPlan.create({
    data: {
      userId,
      planId: plan.id,
      amount,
      status: "ACTIVE",
      endDate,
    },
  });

  return { userPlan, plan, amount, endDate };
}

/**
 * Upgrades an active lower plan to a higher one. Optionally debits the wallet
 * for the top-up amount (used for wallet upgrades and crypto top-ups after credit).
 */
export async function upgradePlanById(
  userId: string,
  planId: string,
  options?: { debitWallet?: boolean; debitAmount?: number },
) {
  await ensureInvestmentPlans();
  const plan = await prisma.investmentPlan.findUnique({ where: { id: planId } });
  if (!plan || !plan.isActive) {
    throw new Error("This plan is not available.");
  }

  const targetAmount = toNumber(plan.minDeposit);
  const active = await prisma.userPlan.findFirst({
    where: { userId, status: "ACTIVE", endDate: { gt: new Date() } },
    orderBy: { amount: "desc" },
  });
  if (!active) {
    throw new Error("No active plan to upgrade.");
  }

  const currentAmount = toNumber(active.amount);
  if (targetAmount <= currentAmount) {
    throw new Error("Choose a higher plan to upgrade.");
  }

  const upgradeCost = Math.round((targetAmount - currentAmount) * 100) / 100;
  const debitAmount = options?.debitAmount ?? upgradeCost;

  if (options?.debitWallet) {
    const wallet = await prisma.wallet.findUnique({ where: { userId } });
    if (toNumber(wallet?.balance) < debitAmount) {
      throw new Error(`Insufficient balance to upgrade. Need $${debitAmount.toFixed(2)}.`);
    }
  }

  const endDate = new Date();
  endDate.setDate(endDate.getDate() + plan.durationDay);

  const userPlan = await prisma.$transaction(async (tx) => {
    if (options?.debitWallet) {
      await tx.wallet.update({
        where: { userId },
        data: { balance: { decrement: debitAmount } },
      });
    }

    await tx.userPlan.update({
      where: { id: active.id },
      data: { status: "UPGRADED" },
    });

    return tx.userPlan.create({
      data: {
        userId,
        planId: plan.id,
        amount: targetAmount,
        status: "ACTIVE",
        endDate,
      },
    });
  });

  return { userPlan, plan, amount: targetAmount, endDate, upgradeCost };
}

/** How much a user must pay (crypto or wallet) to reach a given plan. */
export async function getPlanPaymentAmount(userId: string, planId: string) {
  await ensureInvestmentPlans();
  const plan = await prisma.investmentPlan.findUnique({
    where: { id: planId },
    select: { id: true, name: true, minDeposit: true, isActive: true },
  });
  if (!plan || !plan.isActive) {
    throw new Error("Selected plan is not available.");
  }

  const targetAmount = toNumber(plan.minDeposit);
  const active = await getActivePlan(userId);

  if (!active) {
    return {
      plan,
      amount: targetAmount,
      purpose: "PLAN_SUBSCRIPTION" as const,
      upgradeCost: 0,
      isUpgrade: false,
    };
  }

  if (targetAmount <= active.amount) {
    throw new Error("Choose a higher plan than your current active plan.");
  }

  const upgradeCost = Math.round((targetAmount - active.amount) * 100) / 100;
  return {
    plan,
    amount: upgradeCost,
    purpose: "PLAN_UPGRADE" as const,
    upgradeCost,
    isUpgrade: true,
  };
}
