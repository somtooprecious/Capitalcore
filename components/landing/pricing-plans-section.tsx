import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Briefcase, Check, Crown, Diamond, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

type PlanSpec = {
  slug: string;
  name: string;
  Icon: LucideIcon;
  rows: string[];
};

const plans: PlanSpec[] = [
  {
    slug: "primary",
    name: "Primary Plan",
    Icon: Rocket,
    rows: [
      "Minimum: $50",
      "Maximum: $499",
      "Earn 5% after 1 day",
      "Daily Percent: 5%",
      "Duration: 1 Day",
      "Referral Commission: 10%",
    ],
  },
  {
    slug: "promo",
    name: "Promo Plan",
    Icon: Briefcase,
    rows: [
      "Minimum: $500",
      "Maximum: $2,999",
      "Earn 10% after 2 days",
      "Daily Percent: 5%",
      "Duration: 2 Day",
      "Referral Commission: 10%",
    ],
  },
  {
    slug: "mega",
    name: "Mega Plan",
    Icon: Diamond,
    rows: [
      "Minimum: $3,000",
      "Maximum: $4,999",
      "Earn 20% after 5 days",
      "Daily Percent: 4%",
      "Duration: 5 Days",
      "Referral Commission: 10%",
    ],
  },
  {
    slug: "top-investor",
    name: "Top Investor Plan",
    Icon: Crown,
    rows: [
      "Minimum: $5,000",
      "Maximum: $100,000,000",
      "Earn 20% after 5 days",
      "Daily Percent: 4%",
      "Duration: 5 Day",
      "Referral Commission: 10%",
    ],
  },
];

type PricingPlansSectionProps = {
  /** When true, omit the main heading (parent page already has a title). */
  hideHeading?: boolean;
  /** Use on inner pages so `id="plans"` stays unique to the landing hero section. */
  variant?: "landing" | "page";
};

export function PricingPlansSection({ hideHeading = false, variant = "landing" }: PricingPlansSectionProps) {
  const sectionId = variant === "landing" ? "plans" : "plan-offers";
  return (
    <section
      id={sectionId}
      className="scroll-mt-24 rounded-2xl bg-[#121214] py-12 text-white dark:bg-[#121214] md:py-16"
    >
      <div className="mx-auto max-w-6xl px-4">
        {hideHeading ? null : (
          <h2 className="mb-10 text-center text-2xl font-bold tracking-tight md:text-3xl">
            Investment plans
          </h2>
        )}
        <div className="grid gap-5 md:grid-cols-3">
          {plans.map(({ slug, name, Icon, rows }) => (
            <article
              key={slug}
              className="flex flex-col rounded-2xl bg-[#1c1c1e] p-8 shadow-lg ring-1 ring-white/5"
            >
              <div className="mb-6 flex flex-col items-center text-center">
                <span
                  className="mb-4 inline-flex rounded-full border-2 border-emerald-500/90 p-3 text-emerald-500"
                  aria-hidden
                >
                  <Icon className="size-7 stroke-[1.75]" />
                </span>
                <h3 className="text-lg font-bold text-white">{name}</h3>
              </div>
              <ul className="mb-8 flex-1 space-y-0 divide-y divide-white/5">
                {rows.map((row) => (
                  <li
                    key={row}
                    className="flex items-center justify-between gap-3 py-3 text-sm text-zinc-400"
                  >
                    <span className="text-left leading-snug">{row}</span>
                    <Check
                      className="size-5 shrink-0 text-emerald-500"
                      strokeWidth={2.5}
                      aria-hidden
                    />
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex justify-center">
                <Link
                  href={`/investment-plans?plan=${slug}`}
                  className={cn(
                    buttonVariants({ variant: "invest" }),
                    "min-w-[160px] text-center font-semibold"
                  )}
                >
                  Invest Now
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
