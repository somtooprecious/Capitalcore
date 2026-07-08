import { prisma } from "@/lib/prisma";

/**
 * Daily return every investor earns on their deposited amount when they complete
 * the day's task. The same rate applies to every plan; larger deposits simply
 * earn more in absolute terms.
 */
export const DAILY_ROI_PERCENT = 3.5;

/** How long a subscribed plan stays active (in days). */
export const PLAN_DURATION_DAYS = 80;

export type PlanDefinition = {
  name: string;
  amount: number;
  tagline: string;
  features: string[];
  highlight?: boolean;
};

export const PLAN_DEFINITIONS: PlanDefinition[] = [
  {
    name: "Starter",
    amount: 50,
    tagline: "Test the waters and start earning daily.",
    features: [
      "Perfect for first-time investors",
      "Earn every day you complete your task",
      "Withdraw earnings anytime (per platform rules)",
    ],
  },
  {
    name: "Standard",
    amount: 100,
    tagline: "A balanced plan for steady daily growth.",
    features: [
      "Double the daily earnings of Starter",
      "Priority support",
      "Full access to trading dashboard",
    ],
    highlight: true,
  },
  {
    name: "Advanced",
    amount: 200,
    tagline: "Grow faster with a larger daily payout.",
    features: [
      "4x the daily earnings of Starter",
      "Priority withdrawals",
      "Advanced portfolio insights",
    ],
  },
  {
    name: "Premium",
    amount: 500,
    tagline: "Maximum daily earnings for serious investors.",
    features: [
      "10x the daily earnings of Starter",
      "Dedicated account manager",
      "Highest daily payout on the platform",
    ],
  },
];

/** Daily earning (in USD) for a given deposited amount. */
export function dailyearningFor(amount: number): number {
  return Math.round(((amount * DAILY_ROI_PERCENT) / 100) * 100) / 100;
}

/** Total projected earning over the full plan duration (if every task is done). */
export function projectedTotalFor(amount: number): number {
  return Math.round(dailyearningFor(amount) * PLAN_DURATION_DAYS * 100) / 100;
}

/**
 * Make sure the four canonical plans exist and any legacy plans are deactivated,
 * so users always see exactly the intended set.
 */
export async function ensureInvestmentPlans() {
  const names = PLAN_DEFINITIONS.map((p) => p.name);

  for (const plan of PLAN_DEFINITIONS) {
    await prisma.investmentPlan.upsert({
      where: { name: plan.name },
      update: {
        minDeposit: plan.amount,
        roiPercent: DAILY_ROI_PERCENT,
        durationDay: PLAN_DURATION_DAYS,
        features: plan.features,
        isActive: true,
      },
      create: {
        name: plan.name,
        minDeposit: plan.amount,
        roiPercent: DAILY_ROI_PERCENT,
        durationDay: PLAN_DURATION_DAYS,
        features: plan.features,
        isActive: true,
      },
    });
  }

  // Retire any older plans that are not part of the current lineup.
  await prisma.investmentPlan.updateMany({
    where: { name: { notIn: names } },
    data: { isActive: false },
  });
}
