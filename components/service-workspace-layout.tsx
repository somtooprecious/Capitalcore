import Link from "next/link";
import { Activity, BarChart3, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HashScrollIntoView } from "@/components/hash-scroll";
import { PublicPageLayout } from "@/components/landing/public-page-layout";
import { SiteHeader } from "@/components/landing/site-header";
import { TradingViewWidget } from "@/components/trading-view-widget";

const quickNav = [
  {
    id: "analytics-widget" as const,
    label: "Analytics widget",
    description: "Performance, exposure, and risk snapshot",
    icon: BarChart3,
  },
  {
    id: "action-panel" as const,
    label: "Action panel",
    description: "Deposits, transfers, and shortcuts",
    icon: Zap,
  },
  {
    id: "recent-activity" as const,
    label: "Recent activity",
    description: "Latest movements on your account",
    icon: Activity,
  },
];

function AnalyticsBody({ slug }: { slug: string }) {
  if (slug === "trading") {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted">Live markets — symbol search and intervals in the widget.</p>
        <TradingViewWidget />
      </div>
    );
  }
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {[
        { label: "30d PnL", value: "+4.2%" },
        { label: "Exposure", value: "Balanced" },
        { label: "Risk band", value: "Moderate" },
      ].map((x) => (
        <Card key={x.label} className="p-4">
          <p className="text-xs text-muted">{x.label}</p>
          <p className="text-xl font-bold text-foreground">{x.value}</p>
        </Card>
      ))}
    </div>
  );
}

export function ServiceWorkspaceLayout({
  slug,
  title,
  description,
}: {
  slug: string;
  title: string;
  description: string;
}) {
  const base = `/${slug}`;

  if (
    slug === "about" ||
    slug === "services" ||
    slug === "markets" ||
    slug === "how-it-works" ||
    slug === "ai-technology" ||
    slug === "features" ||
    slug === "risk-disclosure" ||
    slug === "cookie-policy" ||
    slug === "blog" ||
    slug === "faq" ||
    slug === "contact"
  ) {
    return <PublicPageLayout slug={slug} />;
  }

  return (
    <>
      <SiteHeader />
      <HashScrollIntoView />
      <main className="mx-auto max-w-6xl space-y-10 px-4 py-12">
        <header className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">{title}</h1>
          <p className="max-w-3xl text-base text-muted">{description}</p>
        </header>

        <nav aria-label="Workspace sections" className="grid gap-4 md:grid-cols-3">
          {quickNav.map((item) => (
            <Link
              key={item.id}
              href={`${base}#${item.id}`}
              scroll={false}
              className="group block rounded-2xl outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Card className="h-full p-5 transition-colors group-hover:border-primary/50 group-hover:bg-white/[0.03]">
                <div className="mb-3 flex items-center gap-2 text-primary">
                  <item.icon className="size-5" aria-hidden />
                  <span className="font-semibold text-foreground">{item.label}</span>
                </div>
                <p className="text-sm text-muted">{item.description}</p>
                <p className="mt-3 text-xs font-medium text-accent">View section →</p>
              </Card>
            </Link>
          ))}
        </nav>

        <section id="analytics-widget" className="scroll-mt-28 space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Analytics widget</h2>
          <Card className="p-6">
            <AnalyticsBody slug={slug} />
          </Card>
        </section>

        <section id="action-panel" className="scroll-mt-28 space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Action panel</h2>
          <Card className="p-6">
            <p className="mb-4 text-sm text-muted">Quick actions for this area of your account.</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/wallet" className={cn(buttonVariants({ variant: "default" }))}>
                Wallet
              </Link>
              <Link href="/deposits" className={cn(buttonVariants({ variant: "outline" }))}>
                Deposit
              </Link>
              <Link href="/withdrawals" className={cn(buttonVariants({ variant: "outline" }))}>
                Withdraw
              </Link>
              <Link href="/trading" className={cn(buttonVariants({ variant: "accent" }))}>
                Open trading
              </Link>
              <Link href="/support-center" className={cn(buttonVariants({ variant: "outline" }))}>
                Support
              </Link>
            </div>
          </Card>
        </section>

        <section id="recent-activity" className="scroll-mt-28 space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Recent activity</h2>
          <Card className="divide-y divide-border p-0">
            {[
              { t: "Deposit confirmed", d: "Crypto (BTC) · $250.00", time: "2h ago" },
              { t: "Daily task completed", d: "Reward credited · $5.00", time: "Yesterday" },
              { t: "AI trade filled", d: "BTCUSD · BUY · $120.00", time: "2d ago" },
              { t: "Withdrawal approved", d: "Crypto · $120.00", time: "3d ago" },
              { t: "Login (new device)", d: "Chrome · Windows", time: "5d ago" },
            ].map((row) => (
              <div key={row.t} className="flex flex-wrap items-center justify-between gap-2 px-5 py-4">
                <div>
                  <p className="font-medium text-foreground">{row.t}</p>
                  <p className="text-sm text-muted">{row.d}</p>
                </div>
                <span className="text-xs text-muted">{row.time}</span>
              </div>
            ))}
          </Card>
        </section>

        <p className="text-center text-sm text-muted">
          <Link href="/" className="underline-offset-4 hover:underline">
            ← Back to home
          </Link>
        </p>
      </main>
    </>
  );
}
