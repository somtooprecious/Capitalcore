"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useUserSession } from "@/hooks/use-user-session";
import { CheckCircle2, ChevronDown, Menu, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { MarketTicker } from "@/components/landing/market-ticker";
import { NotificationBell } from "@/components/landing/notification-bell";
import { useTranslations } from "@/hooks/use-translations";
import { useWalletBalance } from "@/hooks/use-wallet-balance";
import { useLocale } from "@/components/providers";
import { formatCurrency, type Currency } from "@/lib/i18n";
import { isOwner } from "@/lib/roles";
import { cn } from "@/lib/utils";

const navHrefs = [
  { key: "home", href: "/" },
  { key: "howItWorks", href: "/how-it-works" },
  { key: "aiTechnology", href: "/ai-technology" },
  { key: "markets", href: "/markets" },
  { key: "features", href: "/features" },
  { key: "faq", href: "/faq" },
  { key: "contact", href: "/contact" },
] as const;

function getInitials(name?: string | null, email?: string | null) {
  const source = name?.trim() || email?.split("@")[0] || "U";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

export function SiteHeader() {
  const { messages } = useTranslations();
  const nav = messages.nav;
  const h = messages.header;
  const [open, setOpen] = useState(false);
  const [balanceOpen, setBalanceOpen] = useState(false);
  const balanceRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated } = useUserSession();
  const { currency: localeCurrency } = useLocale();
  const { balance, availableBalance, lockedBalance, isLoading } = useWalletBalance();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (balanceRef.current && !balanceRef.current.contains(e.target as Node)) {
        setBalanceOpen(false);
      }
    };
    if (balanceOpen) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [balanceOpen]);

  const isAuthenticatedResolved = isAuthenticated && !!user;
  const initials = getInitials(user?.name, user?.email);
  const activeCurrency = localeCurrency as Currency;
  const displayBalance = isAuthenticatedResolved
    ? isLoading
      ? "···"
      : formatCurrency(balance, activeCurrency)
    : "—";
  const ownerAccess = isAuthenticatedResolved && isOwner(user?.role);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur">
      <div className="border-b border-border/50 bg-[#050810]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-2 sm:px-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/70 bg-card/60 text-foreground md:hidden"
              aria-expanded={open}
              aria-label={open ? h.closeMenu : h.openMenu}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
            <NotificationBell />
            <span
              className="hidden h-7 w-7 items-center justify-center rounded-full border border-green-500/30 bg-green-500/10 sm:inline-flex"
              title="Markets connected"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-green-400" aria-hidden />
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative" ref={balanceRef}>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card/80 px-3 py-1.5 text-sm font-semibold tabular-nums text-foreground transition-colors hover:bg-card"
                aria-expanded={balanceOpen}
                onClick={() => setBalanceOpen((v) => !v)}
              >
                {displayBalance}
                <ChevronDown className="h-3.5 w-3.5 text-muted" aria-hidden />
              </button>
              {balanceOpen ? (
                <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-card shadow-xl">
                  <div className="border-b border-border px-3 py-2.5">
                    <p className="text-xs text-muted">{h.balance}</p>
                    <p className="mt-1 text-base font-semibold tabular-nums text-foreground">
                      {isLoading ? "···" : formatCurrency(balance, activeCurrency)}
                    </p>
                  </div>
                  {isAuthenticatedResolved ? (
                    <>
                      <div className="space-y-1 border-b border-border px-3 py-2 text-xs">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-muted">Available</span>
                          <span className="font-medium tabular-nums text-foreground">
                            {isLoading ? "—" : formatCurrency(availableBalance, activeCurrency)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-muted">Locked</span>
                          <span className="font-medium tabular-nums text-foreground">
                            {isLoading ? "—" : formatCurrency(lockedBalance, activeCurrency)}
                          </span>
                        </div>
                      </div>
                      <Link href="/deposits" className="block px-3 py-2 text-sm hover:bg-white/5" onClick={() => setBalanceOpen(false)}>
                        {h.wallet}
                      </Link>
                      <Link href="/dashboard" className="block px-3 py-2 text-sm hover:bg-white/5" onClick={() => setBalanceOpen(false)}>
                        {h.dashboard}
                      </Link>
                    </>
                  ) : (
                    <Link href="/signin" className="block px-3 py-2 text-sm hover:bg-white/5" onClick={() => setBalanceOpen(false)}>
                      {h.signInBalance}
                    </Link>
                  )}
                </div>
              ) : null}
            </div>

            <Link
              href={isAuthenticatedResolved ? "/dashboard" : "/signin"}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-xs font-bold text-white transition-opacity hover:opacity-90"
              title={isAuthenticatedResolved ? h.yourAccount : h.signIn}
            >
              {initials}
            </Link>
          </div>
        </div>
        <MarketTicker />
      </div>

      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="text-xl font-bold text-foreground">
          CapitalCore <span className="text-amber-400">AI</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {navHrefs.map(({ key, href }) => (
            <Link key={key} href={href} className="text-sm text-muted transition-colors hover:text-foreground">
              {nav[key]}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <ThemeToggle />
          {ownerAccess ? (
            <Link href="/admin" className={cn(buttonVariants({ variant: "outline" }), "hidden sm:inline-flex border-amber-500/40 text-amber-400")}>
              {h.admin}
            </Link>
          ) : null}
          {isAuthenticatedResolved ? (
            <Link href="/dashboard" className={cn(buttonVariants({ variant: "accent" }), "hidden sm:inline-flex")}>
              {h.dashboard}
            </Link>
          ) : (
            <>
              <Link href="/signin" className={cn(buttonVariants({ variant: "outline" }), "hidden sm:inline-flex")}>
                {h.signIn}
              </Link>
              <Link href="/signup" className={cn(buttonVariants({ variant: "accent" }), "hidden sm:inline-flex")}>
                {h.getStarted}
              </Link>
            </>
          )}
        </div>
      </nav>

      {open ? (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {navHrefs.map(({ key, href }) => (
              <Link key={key} href={href} className="text-sm text-muted hover:text-foreground" onClick={() => setOpen(false)}>
                {nav[key]}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-border pt-4">
              {ownerAccess ? (
                <Link href="/admin" className={cn(buttonVariants({ variant: "outline" }), "w-full border-amber-500/40 text-amber-400")} onClick={() => setOpen(false)}>
                  {h.admin}
                </Link>
              ) : null}
              {isAuthenticatedResolved ? (
                <Link href="/dashboard" className={cn(buttonVariants({ variant: "accent" }), "w-full")} onClick={() => setOpen(false)}>
                  {h.dashboard}
                </Link>
              ) : (
                <>
                  <Link href="/signin" className={cn(buttonVariants({ variant: "outline" }), "w-full")} onClick={() => setOpen(false)}>
                    {h.signIn}
                  </Link>
                  <Link href="/signup" className={cn(buttonVariants({ variant: "accent" }), "w-full")} onClick={() => setOpen(false)}>
                    {h.getStarted}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
