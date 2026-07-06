"use client";

import { useEffect } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[dashboard]", error);
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center bg-background px-6 py-16">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">Dashboard</p>
        <h1 className="mt-3 text-2xl font-bold text-foreground">We couldn&apos;t load your dashboard</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {error.message || "A temporary server error occurred. Please try again."}
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={reset}
            className={cn(buttonVariants({ variant: "accent" }), "w-full sm:w-auto")}
          >
            Try again
          </button>
          <Link href="/" className={cn(buttonVariants({ variant: "outline" }), "w-full sm:w-auto")}>
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
