"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { LayoutDashboard, LogOut, Settings, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const adminMenu = [
  { label: "Control center", href: "/admin", icon: Settings },
  { label: "User dashboard", href: "/dashboard", icon: LayoutDashboard },
] as const;

type AdminLayoutProps = {
  user: { email?: string | null };
  children: React.ReactNode;
};

export function AdminLayout({ user, children }: AdminLayoutProps) {
  const pathname = usePathname();
  const { signOut } = useClerk();

  return (
    <main className="grid min-h-screen md:grid-cols-[260px_1fr]">
      <aside className="flex flex-col border-r border-border bg-[#050810] p-4">
        <Link href="/" className="mb-4 flex items-center gap-2 transition-opacity hover:opacity-80">
          <Shield className="h-5 w-5 text-amber-400" aria-hidden />
          <span className="text-lg font-bold text-foreground">CapitalCore Admin</span>
        </Link>
        <p className="mb-4 truncate text-xs text-muted">{user.email}</p>
        <nav className="flex-1 space-y-1">
          {adminMenu.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-amber-500/15 font-medium text-foreground"
                    : "text-muted hover:bg-card hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden />
                {item.label}
              </Link>
            );
          })}
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
