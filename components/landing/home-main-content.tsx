"use client";

import Link from "next/link";
import { Bot, LineChart, ShieldCheck, Wallet, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { TradingViewWidget } from "@/components/trading-view-widget";
import { AnimatedSection } from "@/components/animated-section";
import { LivePlatformActivity } from "@/components/landing/live-platform-activity";
import { ProText } from "@/components/landing/pro-text";
import { FaqAccordion } from "@/components/landing/faq-accordion";
import { AiPlatformSections } from "@/components/landing/ai-platform-sections";
import { useTranslations } from "@/hooks/use-translations";
import { cn } from "@/lib/utils";

const featureIcons = [Bot, LineChart, Zap, Wallet, ShieldCheck, Wallet] as const;
const featureHrefs = ["/dashboard", "/trading", "/daily-tasks", "/earnings", "/referrals", "/withdrawals"] as const;

export function HomeMainContent() {
  const { home } = useTranslations();
  const p = home.platform;

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pb-10 pt-6 md:pb-14 md:pt-10">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset] md:p-10 lg:border-l-4 lg:border-l-primary lg:pl-12">
          <div className="grid gap-10 md:grid-cols-[1.5fr_1fr] md:items-end md:gap-12">
            <AnimatedSection className="space-y-4">
              <p className="inline-flex w-fit rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs uppercase tracking-wide text-amber-300">
                {p.badge}
              </p>
              <ProText as="h2" text={p.title} className="max-w-3xl text-3xl font-bold leading-tight md:text-5xl" />
              <ProText as="p" text={p.body} className="max-w-2xl text-muted" delay={0.1} />
            </AnimatedSection>
            <AnimatedSection className="space-y-3">
              <Card className="glass p-4">
                <LivePlatformActivity />
              </Card>
              <div className="flex flex-wrap gap-3">
                <Link href="/signup" className={cn(buttonVariants({ variant: "accent" }))}>
                  {p.startTrading}
                </Link>
                <Link href="/signin" className={cn(buttonVariants({ variant: "outline" }))}>
                  {p.signIn}
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {p.features.map((label, i) => {
            const Icon = featureIcons[i] ?? Bot;
            const href = featureHrefs[i] ?? "/dashboard";
            return (
              <Link key={label} href={href}>
                <Card className="flex h-full items-center gap-3 p-5 transition-colors hover:border-primary/50 hover:bg-white/[0.03]">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="font-medium">{label}</span>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <AiPlatformSections />

      <AnimatedSection id="markets" className="scroll-mt-24 mx-auto max-w-7xl space-y-4 px-4 py-8">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">{home.liveMarkets.title}</h2>
          <p className="text-sm text-muted">{home.liveMarkets.body}</p>
        </div>
        <TradingViewWidget />
      </AnimatedSection>

      <section id="faq" className="scroll-mt-24 mx-auto max-w-7xl px-4 py-12">
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-bold">{home.faq.title}</h2>
            <Link href="/faq" className={cn(buttonVariants({ variant: "outline" }), "shrink-0")}>
              {home.faq.fullFaq}
            </Link>
          </div>
          <FaqAccordion />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12">
        <Card className="flex flex-col gap-4 p-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-lg font-semibold">{home.cta.title}</p>
            <p className="mt-1 text-sm text-muted">{home.cta.body}</p>
          </div>
          <Link href="/signup" className={cn(buttonVariants({ variant: "accent" }), "shrink-0")}>
            {home.cta.openAccount}
          </Link>
        </Card>
      </section>
    </>
  );
}
