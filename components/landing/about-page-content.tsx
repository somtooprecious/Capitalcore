import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AboutPageContent() {
  return (
    <article className="space-y-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <p className="text-lg leading-relaxed text-foreground/90">
          CapitalCore AI is a modern trading and treasury platform built for individuals who expect institutional-grade
          tooling—live market data, secure crypto funding, configurable daily rewards, and transparent admin rules.
        </p>
        <p className="leading-relaxed text-muted">
          We bring together crypto, forex, stocks, and commodities in one workspace. Trade from professional charts,
          complete daily tasks, track earnings and referrals, and request withdrawals through a clear approval flow.
          Rewards are configured by platform administration—not presented as guaranteed autonomous AI trading profits.
        </p>
        <p className="leading-relaxed text-muted">
          Our mission is to remove friction between you and the tools you need: verified onboarding, consolidated
          balances, actionable analytics, and a consistent path to deposits, withdrawals, and support.
        </p>
        <Card className="overflow-hidden border-border/70 bg-card/60 p-0 shadow-sm">
          <div className="grid gap-0 md:grid-cols-[1.15fr_1fr]">
            <div className="relative min-h-[260px] md:min-h-[320px]">
              <Image
                src="/images/about-team-meeting.png"
                alt="CapitalCore team in a strategy meeting"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 55vw"
                priority={false}
              />
            </div>
            <div className="space-y-3 p-5 md:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">Built for traders</p>
              <h3 className="text-lg font-semibold leading-snug text-foreground">
                Process, security, and transparent platform rules
              </h3>
              <p className="text-sm leading-relaxed text-muted">
                Every workflow is shaped around risk controls, clear communication, and audit-friendly history—so your
                trading activity stays organized as you scale.
              </p>
            </div>
          </div>
        </Card>
        <h2 className="scroll-mt-24 text-xl font-semibold text-foreground md:text-2xl">Compliance, identity, and trust</h2>
        <p className="leading-relaxed text-muted">
          KYC verification supports secure account recovery, fraud prevention, and regulatory alignment. Crypto
          deposits and controlled withdrawals keep funding and payouts inside one documented trail.
        </p>
        <p className="leading-relaxed text-muted">
          Security extends beyond payments: two-factor authentication, session awareness, and role-based admin permissions
          help protect accounts and treasury operations.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link href="/how-it-works" className={cn(buttonVariants({ variant: "outline" }))}>
            How it works
          </Link>
          <Link href="/trading" className={cn(buttonVariants({ variant: "accent" }))}>
            Open trading workspace
          </Link>
        </div>
      </div>
    </article>
  );
}
