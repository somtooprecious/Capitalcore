"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/hooks/use-translations";

export function SiteFooter() {
  const { messages } = useTranslations();
  const f = messages.footer;

  return (
    <footer id="contact" className="scroll-mt-24 border-t border-border bg-[#050810] py-12">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <p className="text-lg font-bold text-foreground">CapitalCore AI</p>
          <p className="mt-2 max-w-sm text-sm text-muted">{f.tagline}</p>
          <Link href="/signup" className={cn(buttonVariants({ variant: "accent" }), "mt-4 inline-flex")}>
            {f.openAccount}
          </Link>
        </div>
        <Card className="border-border/60 bg-card/40 p-4">
          <p className="mb-3 font-semibold">{f.platform}</p>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link href="/how-it-works" className="hover:text-foreground">{f.howItWorks}</Link></li>
            <li><Link href="/ai-technology" className="hover:text-foreground">{f.aiTechnology}</Link></li>
            <li><Link href="/features" className="hover:text-foreground">{f.features}</Link></li>
            <li><Link href="/markets" className="hover:text-foreground">{f.markets}</Link></li>
            <li><Link href="/trading" className="hover:text-foreground">{f.trading}</Link></li>
            <li><Link href="/daily-tasks" className="hover:text-foreground">{f.dailyTasks}</Link></li>
          </ul>
        </Card>
        <Card className="border-border/60 bg-card/40 p-4">
          <p className="mb-3 font-semibold">{f.legal}</p>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link href="/terms-and-conditions" className="hover:text-foreground">{f.terms}</Link></li>
            <li><Link href="/privacy-policy" className="hover:text-foreground">{f.privacy}</Link></li>
            <li><Link href="/risk-disclosure" className="hover:text-foreground">{f.risk}</Link></li>
            <li><Link href="/cookie-policy" className="hover:text-foreground">{f.cookies}</Link></li>
          </ul>
        </Card>
        <Card className="border-border/60 bg-card/40 p-4">
          <p className="mb-3 font-semibold">{f.support}</p>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link href="/faq" className="hover:text-foreground">{f.faq}</Link></li>
            <li><Link href="/blog" className="hover:text-foreground">{f.blog}</Link></li>
            <li><Link href="/contact" className="hover:text-foreground">{f.contact}</Link></li>
            <li><Link href="/support-center" className="hover:text-foreground">{f.supportCenter}</Link></li>
          </ul>
        </Card>
      </div>
      <p className="mx-auto mt-10 max-w-7xl px-4 text-center text-xs text-muted">
        © {new Date().getFullYear()} CapitalCore AI · {f.disclaimer}
      </p>
    </footer>
  );
}
