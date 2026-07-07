"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const dashboardMenu = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Investment plans", href: "/investment-plans" },
  { label: "Trading", href: "/trading" },
  { label: "Daily task", href: "/daily-tasks" },
  { label: "Earnings", href: "/earnings" },
  { label: "Deposits", href: "/deposits" },
  { label: "Withdrawals", href: "/withdrawals" },
  { label: "Referrals", href: "/referrals" },
  { label: "Notifications", href: "/notifications" },
  { label: "Support", href: "/support-center" },
  { label: "Settings", href: "/settings" },
] as const;

type DashboardLayoutProps = {
  user: { email?: string | null; role?: string | null };
  children: React.ReactNode;
};

export function DashboardLayout({ user, children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const showAdmin = user.role === "OWNER";

  return (
    <main className="grid min-h-screen md:grid-cols-[260px_1fr]">
      <aside className="flex flex-col border-r border-border p-4">
        <Link href="/" className="mb-1 text-lg font-bold transition-opacity hover:opacity-80">
          CapitalCore
        </Link>
        <p className="mb-4 truncate text-xs text-muted">{user.email}</p>
        <nav className="flex-1 space-y-1">
          {dashboardMenu.map((item) => {
            const active =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block rounded-lg px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-primary/15 font-medium text-foreground"
                    : "text-muted hover:bg-card hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
          {showAdmin ? (
            <Link
              href="/admin"
              className={cn(
                "mt-2 block rounded-lg border border-amber-500/30 px-3 py-2 text-sm text-amber-400 transition-colors hover:bg-amber-500/10",
                pathname.startsWith("/admin") && "bg-amber-500/15 font-medium",
              )}
            >
              Owner admin
            </Link>
          ) : null}
        </nav>
        <Button
          variant="outline"
          className="mt-4 w-full justify-start gap-2"
          type="button"
          onClick={() => signOut({ redirectUrl: "/" })}
        >
          <LogOut className="h-4 w-4" aria-hidden />
          Sign out
        </Button>
      </aside>
      <section className="min-w-0 p-4 md:p-8">{children}</section>
    </main>
  );
}
