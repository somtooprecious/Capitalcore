import { prisma } from "@/lib/prisma";
import { getPlatformConfig, todayKey } from "@/lib/platform-config";

function toNumber(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value);
  if (value && typeof value === "object" && "toNumber" in value) {
    return (value as { toNumber: () => number }).toNumber();
  }
  return 0;
}

export async function getDailyTaskStatus(userId: string) {
  const config = await getPlatformConfig();
  const dayKey = todayKey();

  let task = await prisma.dailyTask.findFirst({
    where: { isActive: true },
    orderBy: { updatedAt: "desc" },
  });

  if (!task) {
    task = await prisma.dailyTask.create({
      data: {
        title: config.dailyTaskTitle,
        description: config.dailyTaskDescription,
        rewardType: config.dailyTaskRewardType,
        rewardValue: config.dailyTaskRewardValue,
        isActive: true,
      },
    });
  }

  const todayCompletion = await prisma.dailyTaskCompletion.findUnique({
    where: { userId_dayKey: { userId, dayKey } },
  });

  const history = await prisma.dailyTaskCompletion.findMany({
    where: { userId },
    orderBy: { completedAt: "desc" },
    take: 14,
    include: { task: { select: { title: true } } },
  });

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = todayKey(yesterday);
  const yesterdayDone = history.some((h) => h.dayKey === yesterdayKey);
  const streak = todayCompletion?.streakCount ?? (yesterdayDone ? history[0]?.streakCount ?? 0 : 0);

  const nextReset = new Date();
  nextReset.setUTCHours(24, 0, 0, 0);

  return {
    task: {
      id: task.id,
      title: task.title,
      description: task.description,
      rewardType: task.rewardType,
      rewardValue: toNumber(task.rewardValue),
    },
    config: {
      rewardType: config.dailyTaskRewardType,
      rewardValue: config.dailyTaskRewardValue,
    },
    completedToday: Boolean(todayCompletion),
    streak,
    nextReset: nextReset.toISOString(),
    history: history.map((h) => ({
      id: h.id,
      title: h.task.title,
      rewardAmount: toNumber(h.rewardAmount),
      dayKey: h.dayKey,
      completedAt: h.completedAt.toISOString(),
      streakCount: h.streakCount,
    })),
  };
}

export async function completeDailyTask(userId: string) {
  const config = await getPlatformConfig();
  const dayKey = todayKey();

  const existing = await prisma.dailyTaskCompletion.findUnique({
    where: { userId_dayKey: { userId, dayKey } },
  });
  if (existing) throw new Error("You have already completed today's task.");

  let task = await prisma.dailyTask.findFirst({
    where: { isActive: true },
    orderBy: { updatedAt: "desc" },
  });
  if (!task) {
    task = await prisma.dailyTask.create({
      data: {
        title: config.dailyTaskTitle,
        description: config.dailyTaskDescription,
        rewardType: config.dailyTaskRewardType,
        rewardValue: config.dailyTaskRewardValue,
      },
    });
  }

  const wallet = await prisma.wallet.findUnique({ where: { userId } });
  const balance = toNumber(wallet?.balance);
  let rewardAmount = config.dailyTaskRewardValue;
  if (config.dailyTaskRewardType === "PERCENT" && balance > 0) {
    rewardAmount = (balance * config.dailyTaskRewardValue) / 100;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayCompletion = await prisma.dailyTaskCompletion.findUnique({
    where: { userId_dayKey: { userId, dayKey: todayKey(yesterday) } },
  });
  const streakCount = yesterdayCompletion ? yesterdayCompletion.streakCount + 1 : 1;

  const reference = `TASK-${dayKey}-${userId.slice(0, 6).toUpperCase()}`;

  await prisma.$transaction(async (tx) => {
    await tx.dailyTaskCompletion.create({
      data: {
        userId,
        taskId: task.id,
        dayKey,
        rewardAmount,
        streakCount,
      },
    });
    await tx.wallet.upsert({
      where: { userId },
      update: { balance: { increment: rewardAmount } },
      create: { userId, balance: rewardAmount },
    });
    await tx.earning.create({
      data: {
        userId,
        amount: rewardAmount,
        source: "DAILY_TASK",
        reference,
      },
    });
    await tx.transaction.create({
      data: {
        userId,
        type: "EARNING",
        amount: rewardAmount,
        status: "COMPLETED",
        reference,
        description: `Daily task reward (${task.title})`,
      },
    });
    await tx.notification.create({
      data: {
        userId,
        title: "Daily task completed",
        body: `You earned $${rewardAmount.toFixed(2)}. Streak: ${streakCount} day(s).`,
        type: "DAILY_TASK",
      },
    });
  });

  return { rewardAmount, streakCount, dayKey };
}
