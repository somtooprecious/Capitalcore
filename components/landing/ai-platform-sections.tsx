"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Bot, Brain, LineChart, Shield, Sparkles, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { AnimatedSection } from "@/components/animated-section";
import { RealTimeQuotes } from "@/components/landing/real-time-quotes";
import { useTranslations } from "@/hooks/use-translations";
import { cn } from "@/lib/utils";

const featureIcons = [Brain, LineChart, Shield, Zap] as const;

export function AiPlatformSections() {
  const { home } = useTranslations();
  const s = home.aiSections;

  return (
    <>
      <AnimatedSection className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {s.stats.map((stat) => (
            <Card key={stat.label} className="border-border/60 bg-card/60 p-5 backdrop-blur">
              <p className="text-2xl font-bold tabular-nums text-amber-400">{stat.value}</p>
              <p className="mt-1 text-sm text-muted">{stat.label}</p>
            </Card>
          ))}
        </div>
      </AnimatedSection>

      <RealTimeQuotes />

      <AnimatedSection className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-400" />
          <h2 className="text-2xl font-bold md:text-3xl">{s.whyTitle}</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {s.features.map(({ title, body }, i) => {
            const Icon = featureIcons[i] ?? Brain;
            return (
              <Card key={title} className="group p-6 transition-colors hover:border-amber-500/30">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
              </Card>
            );
          })}
        </div>
      </AnimatedSection>

      <AnimatedSection className="mx-auto max-w-6xl px-4 py-16">
        <Card className="overflow-hidden border-amber-500/20 bg-gradient-to-br from-[#0b1020] via-card to-[#121a2e] p-8 md:p-12">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs text-amber-300">
                <Bot className="h-3.5 w-3.5" />
                {s.techBadge}
              </div>
              <h2 className="text-3xl font-bold">{s.techTitle}</h2>
              <p className="text-muted">{s.techBody}</p>
              <Link href="/ai-technology" className={cn(buttonVariants({ variant: "accent" }))}>
                {s.exploreTech}
              </Link>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-border/60 bg-black/30 p-6 font-mono text-xs text-muted"
            >
              <p className="text-amber-400">platform.config</p>
              <p className="mt-2">daily_task.reward = admin_configured</p>
              <p>withdrawal.rules = admin_configured</p>
              <p>deposit.limits = admin_configured</p>
              <p className="mt-4 text-green-400">status: operational</p>
            </motion.div>
          </div>
        </Card>
      </AnimatedSection>

      <AnimatedSection className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="mb-6 text-2xl font-bold">{s.testimonialsTitle}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {s.testimonials.map((t) => (
            <Card key={t.name} className="p-6">
              <p className="text-sm leading-relaxed text-muted">&ldquo;{t.quote}&rdquo;</p>
              <p className="mt-4 text-sm font-medium text-foreground">{t.name}</p>
            </Card>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection className="mx-auto max-w-6xl px-4 py-16">
        <Card className="flex flex-col items-center gap-4 p-10 text-center md:p-14">
          <h2 className="text-3xl font-bold">{s.ctaTitle}</h2>
          <p className="max-w-xl text-muted">{s.ctaBody}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/signup" className={cn(buttonVariants({ variant: "accent" }))}>
              {s.getStarted}
            </Link>
            <Link href="/how-it-works" className={cn(buttonVariants({ variant: "outline" }))}>
              {s.howItWorks}
            </Link>
          </div>
        </Card>
      </AnimatedSection>
    </>
  );
}
