"use client";

import Link from "next/link";
import {
  BarChart3,
  Bitcoin,
  CandlestickChart,
  Clock,
  Globe2,
  Landmark,
  Layers,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { TradingViewWidget } from "@/components/trading-view-widget";
import { useTranslations } from "@/hooks/use-translations";
import { cn } from "@/lib/utils";

const assetIcons = [Bitcoin, Globe2, Landmark, Layers] as const;

export function MarketsPageContent() {
  const { marketsDetail: m } = useTranslations();

  return (
    <article className="space-y-12">
      <div className="mx-auto max-w-3xl space-y-6">
        <p className="text-lg leading-relaxed text-foreground/90">{m.intro1}</p>
        <p className="leading-relaxed text-muted">{m.intro2}</p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {m.stats.map((stat) => (
          <Card key={stat.label} className="p-5">
            <p className="text-xs uppercase tracking-wide text-muted">{stat.label}</p>
            <p className="mt-2 text-2xl font-bold tabular-nums text-foreground">{stat.value}</p>
            <p className="mt-1 text-xs leading-snug text-muted">{stat.detail}</p>
          </Card>
        ))}
      </section>

      <section className="scroll-mt-24 space-y-5">
        <div className="flex items-center gap-2">
          <CandlestickChart className="h-5 w-5 text-primary" aria-hidden />
          <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">{m.assetClassesTitle}</h2>
        </div>
        <p className="max-w-3xl text-muted">{m.assetClassesIntro}</p>
        <div className="grid gap-4 md:grid-cols-2">
          {m.assetClasses.map(({ name, summary, facts, openPrefix }, i) => {
            const Icon = assetIcons[i] ?? Bitcoin;
            return (
              <Card key={name} className="flex flex-col gap-4 p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background/60 text-primary">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="text-lg font-semibold text-foreground">{name}</h3>
                </div>
                <p className="text-sm leading-relaxed text-muted">{summary}</p>
                <ul className="space-y-1.5 text-sm text-muted">
                  {facts.map((fact) => (
                    <li key={fact} className="flex gap-2">
                      <span className="text-primary">·</span>
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/trading" className={cn(buttonVariants({ variant: "outline" }), "mt-auto w-fit")}>
                  {openPrefix} {name.split(" ")[0]} →
                </Link>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="scroll-mt-24 space-y-5">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" aria-hidden />
          <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">{m.howMarketsMoveTitle}</h2>
        </div>
        <Card className="space-y-4 p-6">
          <p className="text-sm leading-relaxed text-muted md:text-base">{m.howMarketsMoveP1}</p>
          <p className="text-sm leading-relaxed text-muted md:text-base">{m.howMarketsMoveP2}</p>
        </Card>
      </section>

      <section className="scroll-mt-24 space-y-5">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" aria-hidden />
          <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">{m.sessionsTitle}</h2>
        </div>
        <p className="max-w-3xl text-muted">{m.sessionsIntro}</p>
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-card/80">
                  <th className="px-5 py-3 font-semibold text-foreground">{m.tableHeaders.region}</th>
                  <th className="px-5 py-3 font-semibold text-foreground">{m.tableHeaders.hours}</th>
                  <th className="px-5 py-3 font-semibold text-foreground">{m.tableHeaders.notes}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {m.sessions.map((row) => (
                  <tr key={row.region} className="bg-background/40">
                    <td className="px-5 py-3 font-medium text-foreground">{row.region}</td>
                    <td className="px-5 py-3 tabular-nums text-muted">{row.hours}</td>
                    <td className="px-5 py-3 text-muted">{row.focus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      <section className="scroll-mt-24 space-y-5">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" aria-hidden />
          <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">{m.tradingTitle}</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {m.steps.map((item) => (
            <Card key={item.step} className="p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-primary">{item.step}</p>
              <h3 className="mt-2 font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="scroll-mt-24 space-y-5">
        <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">{m.chartTitle}</h2>
        <p className="max-w-3xl text-muted">{m.chartIntro}</p>
        <TradingViewWidget />
      </section>

      <section className="scroll-mt-24 space-y-5">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-amber-400" aria-hidden />
          <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">{m.riskTitle}</h2>
        </div>
        <Card className="border-amber-500/20 bg-amber-500/5 p-6">
          <ul className="space-y-3 text-sm leading-relaxed text-muted">
            {m.riskFacts.map((fact) => (
              <li key={fact} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" aria-hidden />
                <span>{fact}</span>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <Card className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="font-semibold text-foreground">{m.ctaTitle}</p>
          <p className="text-sm text-muted">{m.ctaBody}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/signup" className={cn(buttonVariants({ variant: "accent" }), "shrink-0")}>
            {m.openAccount}
          </Link>
          <Link href="/trading" className={cn(buttonVariants({ variant: "default" }), "shrink-0")}>
            {m.goToTrading}
          </Link>
        </div>
      </Card>
    </article>
  );
}
