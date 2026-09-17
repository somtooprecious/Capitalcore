/** Percent fee applied Mon–Fri withdrawals (of requested amount). */
export const WITHDRAWAL_PERCENT_FEE = 0.1;
/** Flat fee — kept at 0; weekday withdrawals use the percent fee only. */
export const WITHDRAWAL_FLAT_FEE_USD = 0;

/** Withdrawal window timezone (09:00–17:00). */
export const WITHDRAWAL_SCHEDULE_TIMEZONE = "Etc/UTC";

export const WITHDRAWAL_OPEN_HOUR = 9;
export const WITHDRAWAL_CLOSE_HOUR = 17;

export const WITHDRAWAL_INSTRUCTIONS = [
  "A 10% fee is automatically deducted for each withdrawal made from Monday through Friday.",
  "Withdrawals are not supported on Saturdays and Sundays.",
  "Withdrawal hours are 09:00–17:00.",
] as const;

export const WITHDRAWAL_ASSETS = [
  { code: "BTC", label: "Bitcoin (BTC)", network: null },
  { code: "ETH", label: "Ethereum (ETH)", network: null },
  { code: "USDT", label: "USDT BEP 20", network: "BEP20" },
] as const;

export type WithdrawalAssetCode = (typeof WITHDRAWAL_ASSETS)[number]["code"];

export type WithdrawalScheduleContext = {
  day: number;
  isWeekend: boolean;
  isMonday: boolean;
  isWeekday: boolean;
  isWithinHours: boolean;
  hours: number;
  minutes: number;
};

export type WithdrawalFeeBreakdown = {
  percentFee: number;
  flatFee: number;
  totalFee: number;
  netPayout: number;
  feeLabel: string;
  schedule: WithdrawalScheduleContext;
};

const WEEKDAY_SHORT: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

export function getWithdrawalScheduleContext(date = new Date()): WithdrawalScheduleContext {
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: WITHDRAWAL_SCHEDULE_TIMEZONE,
    weekday: "short",
  }).format(date);
  const day = WEEKDAY_SHORT[weekday] ?? 0;

  const timeParts = new Intl.DateTimeFormat("en-US", {
    timeZone: WITHDRAWAL_SCHEDULE_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const hours = Number(timeParts.find((part) => part.type === "hour")?.value ?? 0);
  const minutes = Number(timeParts.find((part) => part.type === "minute")?.value ?? 0);
  const totalMinutes = hours * 60 + minutes;
  const openMinutes = WITHDRAWAL_OPEN_HOUR * 60;
  const closeMinutes = WITHDRAWAL_CLOSE_HOUR * 60;

  return {
    day,
    isWeekend: day === 0 || day === 6,
    isMonday: day === 1,
    isWeekday: day >= 1 && day <= 5,
    isWithinHours: totalMinutes >= openMinutes && totalMinutes < closeMinutes,
    hours,
    minutes,
  };
}

export function validateWithdrawalWindow(date = new Date()) {
  const schedule = getWithdrawalScheduleContext(date);
  if (schedule.isWeekend) {
    throw new Error("Withdrawals are not available on Saturdays and Sundays.");
  }
  if (!schedule.isWithinHours) {
    throw new Error(
      `Withdrawals are only available between ${String(WITHDRAWAL_OPEN_HOUR).padStart(2, "0")}:00 and ${String(WITHDRAWAL_CLOSE_HOUR).padStart(2, "0")}:00.`,
    );
  }
  return schedule;
}

export function calculateWithdrawalFees(amount: number, date = new Date()): WithdrawalFeeBreakdown {
  const schedule = getWithdrawalScheduleContext(date);
  const percentFee = Math.round(amount * WITHDRAWAL_PERCENT_FEE * 100) / 100;
  const flatFee = WITHDRAWAL_FLAT_FEE_USD;
  const totalFee = Math.round((percentFee + flatFee) * 100) / 100;
  const netPayout = Math.round((amount - totalFee) * 100) / 100;
  return {
    percentFee,
    flatFee,
    totalFee,
    netPayout,
    feeLabel: "10% withdrawal fee (Mon–Fri)",
    schedule,
  };
}

export function formatWithdrawalDestination(asset: WithdrawalAssetCode, address: string) {
  const meta = WITHDRAWAL_ASSETS.find((row) => row.code === asset);
  const label = meta?.label ?? asset;
  return `${label} · ${address.trim()}`;
}

export function parseWithdrawalDestination(destination: string) {
  const separator = " · ";
  const index = destination.lastIndexOf(separator);
  if (index === -1) {
    return { asset: "Withdrawal", address: destination.trim() };
  }
  return {
    asset: destination.slice(0, index).trim(),
    address: destination.slice(index + separator.length).trim(),
  };
}
