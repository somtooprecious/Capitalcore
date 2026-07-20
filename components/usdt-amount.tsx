import Image from "next/image";
import { cn } from "@/lib/utils";

export const USDT_ICON_SRC = "/images/crypto/tether.svg";

export function formatUsdt(amount: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

type UsdtIconProps = {
  size?: number;
  className?: string;
};

export function UsdtIcon({ size = 18, className }: UsdtIconProps) {
  return (
    <Image
      src={USDT_ICON_SRC}
      alt="USDT"
      width={size}
      height={size}
      className={cn("inline-block shrink-0 rounded-full", className)}
      unoptimized
    />
  );
}

type UsdtAmountProps = {
  amount: number;
  /** Show a leading + or − */
  sign?: "+" | "−" | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  iconClassName?: string;
};

const SIZE_MAP = {
  sm: { icon: 14, text: "text-sm" },
  md: { icon: 18, text: "text-base" },
  lg: { icon: 22, text: "text-xl" },
  xl: { icon: 26, text: "text-2xl" },
} as const;

export function UsdtAmount({
  amount,
  sign = null,
  size = "md",
  className,
  iconClassName,
}: UsdtAmountProps) {
  const s = SIZE_MAP[size];
  return (
    <span className={cn("inline-flex items-center gap-1.5 font-bold tabular-nums", s.text, className)}>
      <UsdtIcon size={s.icon} className={iconClassName} />
      <span>
        {sign ?? ""}
        {formatUsdt(amount)}
        <span className="ml-1 font-semibold text-muted">USDT</span>
      </span>
    </span>
  );
}

/** Compact label for menus / selects: icon + "USDT" text */
export function UsdtLabel({
  suffix,
  size = 16,
  className,
}: {
  suffix?: string;
  size?: number;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <UsdtIcon size={size} />
      <span>{suffix ? `USDT ${suffix}` : "USDT"}</span>
    </span>
  );
}
