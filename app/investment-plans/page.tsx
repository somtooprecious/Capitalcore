import type { Metadata } from "next";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/landing/site-header";
import { SiteFooter } from "@/components/landing/site-footer";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { createPageMetadata } from "@/lib/seo";
import {
  DAILY_ROI_PERCENT,
  PLAN_DEFINITIONS,
  PLAN_DURATION_DAYS,
  dailyearningFor,
  projectedTotalFor,
} from "@/lib/investment-plans";
import { formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";
import { getSiteUrl } from "@/lib/site-url";

export const metadata: Metadata = createPageMetadata({
  title: "Investment Plans — $50, $100, $200, $500",
  description: `Choose a CapitalCore AI investment plan and earn ${DAILY_ROI_PERCENT}% of your deposit daily for ${PLAN_DURATION_DAYS} days by completing daily tasks. Crypto deposits supported (BTC, USDT, ETH).`,
  path: "/investment-plans",
  index: true,
});

export default function PublicInvestmentPlansPage() {
  const siteUrl = getSiteUrl();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "CapitalCore AI Investment Plans",
    description: `Investment plans paying ${DAILY_ROI_PERCENT}% daily for ${PLAN_DURATION_DAYS} days.`,
    url: `${siteUrl}/investment-plans`,
    itemListElement: PLAN_DEFINITIONS.map((plan, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `${plan.name} Plan`,
      description: plan.tagline,
      url: `${siteUrl}/investment-plans`,
    })),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
            Investment plans
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">
            Choose a plan. Earn {DAILY_ROI_PERCENT}% daily.
          </h1>
          <p className="mt-4 text-base text-muted md:text-lg">
            Deposit with crypto, activate a plan, and earn {DAILY_ROI_PERCENT}% of your deposit
            every day you complete your daily task — for {PLAN_DURATION_DAYS} days.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/signup" className={cn(buttonVariants({ variant: "accent" }))}>
              Create free account
            </Link>
            <Link href="/plans" className={cn(buttonVariants({ variant: "outline" }))}>
              Open plans dashboard
            </Link>
          </div>
        </div>

        <Card className="mt-10 p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Sparkles className="h-5 w-5 text-amber-400" />
            How it works
          </h2>
          <ol className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Fund your wallet with BTC, USDT, or ETH.",
              "Choose a $50, $100, $200, or $500 plan.",
              `Complete your daily task to earn ${DAILY_ROI_PERCENT}% of your deposit.`,
              `Keep earning for ${PLAN_DURATION_DAYS} days while your plan is active.`,
            ].map((step, i) => (
              <li key={step} className="rounded-xl border border-border bg-background/50 p-4 text-sm text-muted">
                <span className="font-semibold text-foreground">Step {i + 1}</span>
                <p className="mt-2">{step}</p>
              </li>
            ))}
          </ol>
        </Card>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {PLAN_DEFINITIONS.map((plan) => (
            <Card
              key={plan.name}
              className={cn(
                "relative flex flex-col p-6",
                plan.highlight && "border-amber-500/40 ring-1 ring-amber-500/30",
              )}
            >
              {plan.highlight ? (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-500 px-3 py-0.5 text-xs font-bold text-black">
                  Most popular
                </span>
              ) : null}
              <p className="text-sm font-semibold uppercase tracking-wide text-muted">{plan.name}</p>
              <p className="mt-2 text-3xl font-bold tabular-nums">{formatUsd(plan.amount)}</p>
              <p className="mt-1 text-sm text-muted">{plan.tagline}</p>
              <div className="my-5 space-y-2 rounded-xl border border-border bg-background/50 p-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Daily earning</span>
                  <span className="font-bold text-green-400">{formatUsd(dailyearningFor(plan.amount))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Daily rate</span>
                  <span className="font-semibold">{DAILY_ROI_PERCENT}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">{PLAN_DURATION_DAYS}-day potential</span>
                  <span className="font-semibold text-amber-400">
                    {formatUsd(projectedTotalFor(plan.amount))}
                  </span>
                </div>
              </div>
              <ul className="mb-6 space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-muted">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className={cn(
                  buttonVariants({ variant: plan.highlight ? "accent" : "default" }),
                  "mt-auto w-full",
                )}
              >
                Get started
              </Link>
            </Card>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
