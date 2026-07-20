"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Area, AreaChart, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { TradingViewWidget } from "@/components/trading-view-widget";
import { formatDate } from "@/lib/format";
import { UsdtAmount, formatUsdt } from "@/components/usdt-amount";
import type { DashboardData } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

const colors = ["#1d4ed8", "#f5b342", "#4ade80", "#f87171"];

type DashboardHomeProps = {
  user: {
    name?: string | null;
    email?: string | null;
    kycStatus: string;
  };
  data: DashboardData;
};

export function DashboardHome({ user, data }: DashboardHomeProps) {
  const displayName = user.name?.trim() || user.email?.split("@")[0] || "Trader";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-amber-400">AI Trading Platform</p>
          <h1 className="text-3xl font-bold">Welcome back, {displayName}</h1>
          <p className="mt-1 text-muted">Portfolio, earnings, and platform activity at a glance.</p>
        </div>
        <span
          className={cn(
            "rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wide",
            user.kycStatus === "APPROVED"
              ? "border-green-500/40 bg-green-500/10 text-green-400"
              : "border-amber-500/40 bg-amber-500/10 text-amber-400",
          )}
        >
          KYC: {user.kycStatus.replaceAll("_", " ")}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total balance", amount: data.balance, hint: "Money currently in your account" },
          { label: "Available", amount: data.availableBalance, hint: "Ready to use or withdraw" },
          { label: "Locked", amount: data.lockedBalance, hint: "Pending withdrawals" },
          { label: "Total revenue", amount: data.totalRevenue, hint: "Profit generated on the platform" },
        ].map((w) => (
          <Card key={w.label} className="border-border/80 bg-card/80 p-4 backdrop-blur">
            <p className="text-xs uppercase tracking-wide text-muted">{w.label}</p>
            <div className="mt-2">
              <UsdtAmount amount={w.amount} size="lg" />
            </div>
            <p className="mt-1 text-[11px] text-muted">{w.hint}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Money in (deposits)", amount: data.depositTotal },
          { label: "Money out (withdrawals)", amount: data.withdrawalTotal },
          { label: "Referral earnings", amount: data.referralEarnings },
        ].map((w) => (
          <Card key={w.label} className="p-4">
            <p className="text-xs uppercase tracking-wide text-muted">{w.label}</p>
            <div className="mt-2">
              <UsdtAmount amount={w.amount} size="md" />
            </div>
          </Card>
        ))}
        <Card className="p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Notifications</p>
          <p className="mt-2 text-lg font-bold tabular-nums">{data.unreadNotifications}</p>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="space-y-4 p-6 lg:col-span-1">
          <p className="text-xs uppercase tracking-wide text-muted">Daily task</p>
          <h2 className="text-lg font-semibold">{data.dailyTask.task.title}</h2>
          <p className="text-sm text-muted line-clamp-2">{data.dailyTask.task.description}</p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">Streak</span>
            <span className="font-bold text-amber-400">{data.dailyTask.streak} day(s)</span>
          </div>
          <Link
            href="/daily-tasks"
            className={cn(buttonVariants({ variant: data.dailyTask.completedToday ? "outline" : "accent" }), "w-full")}
          >
            {data.dailyTask.completedToday ? "View task history" : "Complete today's task"}
          </Link>
        </Card>

        <motion.div className="lg:col-span-2">
          <TradingViewWidget />
        </motion.div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="flex h-[320px] flex-col p-4 lg:col-span-1">
          <p className="mb-2 font-semibold">Portfolio breakdown</p>
          <div className="min-h-0 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.portfolioBreakdown} dataKey="value" nameKey="name" outerRadius={90} innerRadius={50}>
                  {data.portfolioBreakdown.map((_, idx) => (
                    <Cell key={idx} fill={colors[idx % colors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="flex h-[320px] flex-col p-4 lg:col-span-2">
          <p className="mb-2 font-semibold">Earnings growth</p>
          <div className="min-h-0 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.earningsChart.length ? data.earningsChart : [{ month: "—", amount: 0 }]}>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => `${formatUsdt(Number(v))} USDT`} />
                <Area type="monotone" dataKey="amount" stroke="#f5b342" fill="#f5b34233" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="font-semibold">Recent activity</h2>
          <Link href="/earnings" className="text-sm text-primary hover:underline">
            View earnings
          </Link>
        </div>
        {data.recentTransactions.length === 0 ? (
          <p className="px-4 py-8 text-sm text-muted">
            No transactions yet.{" "}
            <Link href="/deposits" className="text-primary underline-offset-4 hover:underline">
              Make your first deposit
            </Link>
            .
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {data.recentTransactions.map((tx) => (
              <li key={tx.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
                <div>
                  <p className="font-medium text-foreground">{tx.description ?? tx.type.replaceAll("_", " ")}</p>
                  <p className="text-xs text-muted">
                    {formatDate(tx.createdAt)} · {tx.type}
                  </p>
                </div>
                <UsdtAmount
                  amount={tx.amount}
                  sign={tx.type === "WITHDRAWAL" ? "−" : "+"}
                  size="sm"
                  className={tx.type === "WITHDRAWAL" ? "text-red-400" : "text-green-400"}
                />
              </li>
            ))}
          </ul>
        )}
      </Card>

      <div className="flex flex-wrap gap-3">
        <Link href="/deposits" className={cn(buttonVariants({ variant: "accent" }))}>
          Deposit
        </Link>
        <Link href="/withdrawals" className={cn(buttonVariants({ variant: "outline" }))}>
          Withdraw
        </Link>
        <Link href="/referrals" className={cn(buttonVariants({ variant: "outline" }))}>
          Referrals
        </Link>
      </div>
    </div>
  );
}
