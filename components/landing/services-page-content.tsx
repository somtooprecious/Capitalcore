import Link from "next/link";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const offeringBlocks = [
  {
    title: "Live trading & market access",
    body: [
      "Access crypto, forex, stocks, and commodities through integrated TradingView charting and order workflows. Manual and AI-assisted trades are supported where enabled by platform administration.",
      "Move between market views and your wallet without losing context—research and execution stay in one workspace.",
    ],
  },
  {
    title: "Daily tasks & configured rewards",
    body: [
      "Complete admin-configured daily tasks to earn platform rewards. Rates and rules are set transparently in your dashboard—not marketed as guaranteed trading profits.",
      "Track streaks, earnings history, and referral commissions from dedicated workspace pages.",
    ],
  },
  {
    title: "Crypto treasury",
    body: [
      "Fund your account with Bitcoin, USDT, or Ethereum. Withdrawals follow controlled approval paths with clear status updates.",
      "Balance history and exports support reconciliation and record-keeping.",
    ],
  },
  {
    title: "Referrals & community growth",
    body: [
      "Share your referral link and earn commissions when invited users meet activity conditions. All referral earnings are tracked in your dashboard.",
    ],
  },
  {
    title: "Identity, security & support",
    body: [
      "KYC verification unlocks higher limits. Two-factor authentication and notification controls add depth to account protection.",
      "Support tickets and live chat provide documented channels when you need assistance.",
    ],
  },
] as const;

const platformPillars = [
  {
    name: "AI-assisted trading",
    summary: "Run manual orders or AI auto-trades through the broker integration. Demo mode uses simulated fills unless a live API key is configured.",
    href: "/trading",
  },
  {
    name: "Multi-asset markets",
    summary: "Crypto, forex, equities, and commodities in one charting environment with responsive layouts across devices.",
    href: "/markets",
  },
  {
    name: "Treasury & withdrawals",
    summary: "Crypto deposits, withdrawal requests, and admin approval flows with full audit trails.",
    href: "/withdrawals",
  },
] as const;

export function ServicesPageContent() {
  return (
    <article className="space-y-12">
      <div className="mx-auto max-w-3xl space-y-6">
        <p className="text-lg leading-relaxed text-foreground/90">
          CapitalCore AI combines trading, treasury, daily rewards, referrals, and support in one professional
          workspace—not a patchwork of disconnected tools.
        </p>
        <p className="leading-relaxed text-muted">
          Every capability follows the same principles: clear terms before you confirm, visible history after you act,
          and escalation paths when you need help.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {offeringBlocks.map((block) => (
          <Card key={block.title} className="space-y-3 p-6">
            <h2 className="text-lg font-semibold">{block.title}</h2>
            {block.body.map((paragraph) => (
              <p key={paragraph} className="text-sm leading-relaxed text-muted">
                {paragraph}
              </p>
            ))}
          </Card>
        ))}
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Platform pillars</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {platformPillars.map((item) => (
            <Link key={item.name} href={item.href}>
              <Card className="flex h-full flex-col gap-3 p-5 transition-colors hover:border-primary/50">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="flex-1 text-sm text-muted">{item.summary}</p>
                <span className={cn(buttonVariants({ variant: "outline" }), "w-full justify-center text-xs")}>
                  Explore →
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <Card className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
        <p className="text-muted">Ready to explore the platform?</p>
        <Link href="/signup" className={cn(buttonVariants({ variant: "accent" }), "shrink-0")}>
          Create account
        </Link>
      </Card>
    </article>
  );
}
