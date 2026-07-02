import { prisma } from "@/lib/prisma";

export type PlatformConfig = {
  depositMin: number;
  depositMax: number;
  withdrawalMin: number;
  withdrawalMax: number;
  withdrawalCooldownHours: number;
  dailyTaskRewardType: "FIXED" | "PERCENT";
  dailyTaskRewardValue: number;
  dailyTaskTitle: string;
  dailyTaskDescription: string;
  referralCommissionPercent: number;
  platformName: string;
  maintenanceMode: boolean;
  announcementBanner: string;
  brokerMode: "DEMO" | "LIVE";
  brokerApiKey: string;
  aiTradingEnabled: boolean;
};

const DEFAULTS: PlatformConfig = {
  depositMin: 10,
  depositMax: 100000,
  withdrawalMin: 20,
  withdrawalMax: 50000,
  withdrawalCooldownHours: 24,
  dailyTaskRewardType: "FIXED",
  dailyTaskRewardValue: 5,
  dailyTaskTitle: "Daily platform check-in",
  dailyTaskDescription:
    "Complete today's configured task to earn a platform reward. Rewards are set by administration—not live AI trading profits.",
  referralCommissionPercent: 10,
  platformName: "CapitalCore AI",
  maintenanceMode: false,
  announcementBanner: "",
  brokerMode: "DEMO",
  brokerApiKey: "",
  aiTradingEnabled: true,
};

const CONFIG_KEYS = Object.keys(DEFAULTS) as (keyof PlatformConfig)[];

function toConfigValue(key: keyof PlatformConfig, value: unknown): PlatformConfig[keyof PlatformConfig] {
  const fallback = DEFAULTS[key];
  if (typeof fallback === "boolean") return Boolean(value) as PlatformConfig[keyof PlatformConfig];
  if (typeof fallback === "number") return Number(value ?? fallback) as PlatformConfig[keyof PlatformConfig];
  return String(value ?? fallback) as PlatformConfig[keyof PlatformConfig];
}

export async function getPlatformConfig(): Promise<PlatformConfig> {
  const rows = await prisma.platformSetting.findMany({
    where: { key: { in: CONFIG_KEYS as string[] } },
  });
  const map = new Map(rows.map((r) => [r.key, r.value]));
  const config: PlatformConfig = { ...DEFAULTS };
  for (const key of CONFIG_KEYS) {
    if (map.has(key)) {
      (config as Record<string, unknown>)[key] = toConfigValue(key, map.get(key));
    }
  }
  return config;
}

export async function setPlatformConfig(updates: Partial<PlatformConfig>) {
  const entries = Object.entries(updates) as [keyof PlatformConfig, PlatformConfig[keyof PlatformConfig]][];
  for (const [key, value] of entries) {
    await prisma.platformSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }
}

export async function seedPlatformDefaults() {
  for (const key of CONFIG_KEYS) {
    await prisma.platformSetting.upsert({
      where: { key },
      update: {},
      create: { key, value: DEFAULTS[key] },
    });
  }
}

export function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function generateReferralCode(seed: string) {
  const base = seed.replace(/[^a-zA-Z0-9]/g, "").slice(0, 6).toUpperCase();
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${base || "CC"}${suffix}`;
}
