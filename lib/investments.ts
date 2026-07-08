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

  const defByName = new Map(PLAN_DEFINITIONS.map((p) => [p.name, p]));

  const plans = dbPlans.map((plan) => {
    const amount = toNumber(plan.minDeposit);
    const def = defByName.get(plan.name);
    return {
      id: plan.id,
      name: plan.name,
      amount,
      tagline: def?.tagline ?? "",
      features: plan.features,
      highlight: def?.highlight ?? false,
      dailyEarning: dailyearningFor(amount),
      projectedTotal: projectedTotalFor(amount),
      affordable: balance >= amount,
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

export async function subscribeToPlan(userId: string, planId: string) {
  await ensureInvestmentPlans();
  await ensureWallet(userId);

  const plan = await prisma.investmentPlan.findUnique({ where: { id: planId } });
  if (!plan || !plan.isActive) {
    throw new Error("This plan is not available.");
  }

  const amount = toNumber(plan.minDeposit);

  const wallet = await prisma.wallet.findUnique({ where: { userId } });
  const balance = toNumber(wallet?.balance);
  if (balance < amount) {
    throw new Error(
      `You need at least $${amount.toFixed(2)} in your wallet to activate this plan. Please make a deposit first.`,
    );
  }

  const existing = await prisma.userPlan.findFirst({
    where: { userId, status: "ACTIVE", endDate: { gt: new Date() } },
  });
  if (existing) {
    throw new Error(
      "You already have an active plan. Wait for it to complete before choosing a new one.",
    );
  }

  const { userPlan, endDate } = await activatePlanById(userId, plan.id);

  await prisma.notification.create({
    data: {
      userId,
      title: "Plan activated",
      body: `Your ${plan.name} plan is active. Complete your daily task to earn $${dailyearningFor(
        amount,
      ).toFixed(2)} each day.`,
      type: "PLAN",
    },
  });

  return {
    id: userPlan.id,
    name: plan.name,
    amount,
    dailyEarning: dailyearningFor(amount),
    endDate: endDate.toISOString(),
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
