"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, Sparkles, TrendingUp, CalendarClock, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatUsd, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Plan = {
  id: string;
  name: string;
  amount: number;
  tagline: string;
  features: string[];
  highlight: boolean;
  dailyEarning: number;
  projectedTotal: number;
  affordable: boolean;
};

type ActivePlan = {
  id: string;
  name: string;
  amount: number;
  dailyEarning: number;
  endDate: string;
};

type Overview = {
  dailyRoiPercent: number;
  durationDays: number;
  balance: number;
  activePlan: ActivePlan | null;
  plans: Plan[];
};

export function InvestmentPlansWorkspace() {
  const router = useRouter();
  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscribingId, setSubscribingId] = useState<string | null>(null);

  const load = async () => {
    const res = await fetch("/api/plans");
    const json = (await res.json()) as Overview;
    setData(json);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const subscribe = async (plan: Plan) => {
    setSubscribingId(plan.id);
    try {
      const res = await fetch("/api/plans/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: plan.id }),
      });
      const json = (await res.json()) as { error?: string; dailyEarning?: number };
      if (!res.ok) {
        toast.error(json.error ?? "Could not activate plan.");
        return;
      }
      toast.success(
        `${plan.name} plan activated! Complete your daily task to earn ${formatUsd(
          json.dailyEarning ?? plan.dailyEarning,
        )} every day.`,
      );
      await load();
      router.refresh();
    } finally {
      setSubscribingId(null);
    }
  };

  if (loading || !data) {
    return <Card className="animate-pulse p-8 text-muted">Loading investment plans…</Card>;
  }

  const { activePlan, dailyRoiPercent, durationDays } = data;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Investment Plans</h1>
        <p className="mt-1 max-w-2xl text-muted">
          Choose the plan that fits your budget. Every plan pays{" "}
          <span className="font-semibold text-amber-400">{dailyRoiPercent}% of your deposit daily</span>{" "}
          — you earn it each day you complete your daily task on the platform.
        </p>
      </div>

      {/* How it works */}
      <Card className="p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Sparkles className="h-5 w-5 text-amber-400" />
          How it works
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Wallet,
              step: "1. Fund your wallet",
              body: "Make a deposit so your balance covers the plan you want to activate.",
            },
            {
              icon: TrendingUp,
              step: "2. Choose a plan",
              body: "Pick $50, $100, $200, or $500. Bigger deposits earn more each day.",
            },
            {
              icon: Check,
              step: "3. Do your daily task",
              body: `Each day you complete the task, ${dailyRoiPercent}% of your deposit is added to your balance.`,
            },
            {
              icon: CalendarClock,
              step: "4. Earn for 30 days",
              body: `Your plan runs for ${durationDays} days. Keep your streak to maximise earnings.`,
            },
          ].map(({ icon: Icon, step, body }) => (
            <div key={step} className="rounded-xl border border-border bg-background/50 p-4">
              <Icon className="h-6 w-6 text-primary" />
              <p className="mt-3 font-semibold text-foreground">{step}</p>
              <p className="mt-1 text-sm text-muted">{body}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Active plan banner */}
      {activePlan ? (
        <Card className="border-green-500/30 bg-green-500/5 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-green-400">Active plan</p>
              <h3 className="mt-1 text-xl font-bold">{activePlan.name} — {formatUsd(activePlan.amount)}</h3>
              <p className="mt-1 text-sm text-muted">
                Earning <span className="font-semibold text-green-400">{formatUsd(activePlan.dailyEarning)}</span>{" "}
                per completed daily task · runs until {formatDate(activePlan.endDate)}
              </p>
            </div>
            <Link href="/daily-tasks">
              <Button variant="accent">Complete today&apos;s task</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/60 px-5 py-4">
          <p className="text-sm text-muted">
            Your wallet balance:{" "}
            <span className="font-semibold text-foreground">{formatUsd(data.balance)}</span>
          </p>
          <Link href="/deposits" className="text-sm font-medium text-primary hover:underline">
            Need funds? Make a deposit →
          </Link>
        </div>
      )}

      {/* Plan cards */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {data.plans.map((plan) => {
          const isActive = activePlan?.name === plan.name;
          return (
            <Card
              key={plan.id}
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

              <div className="my-5 space-y-2 rounded-xl border border-border bg-background/50 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Daily earning</span>
                  <span className="font-bold text-green-400">{formatUsd(plan.dailyEarning)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Daily rate</span>
                  <span className="font-semibold text-foreground">{dailyRoiPercent}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">30-day potential</span>
                  <span className="font-semibold text-amber-400">{formatUsd(plan.projectedTotal)}</span>
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

              <div className="mt-auto">
                {isActive ? (
                  <Button variant="outline" className="w-full" disabled>
                    Currently active
                  </Button>
                ) : activePlan ? (
                  <Button variant="outline" className="w-full" disabled>
                    Finish active plan first
                  </Button>
                ) : plan.affordable ? (
                  <Button
                    variant={plan.highlight ? "accent" : "default"}
                    className="w-full"
                    disabled={subscribingId === plan.id}
                    onClick={() => subscribe(plan)}
                  >
                    {subscribingId === plan.id ? "Activating…" : "Choose this plan"}
                  </Button>
                ) : (
                  <Link href="/deposits" className="block">
                    <Button variant="outline" className="w-full">
                      Deposit to unlock
                    </Button>
                  </Link>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <p className="text-xs text-muted">
        Earnings are credited only on days you complete your daily task. Rewards are configurable platform
        rewards and are not guaranteed live trading profits.
      </p>
    </div>
  );
}
