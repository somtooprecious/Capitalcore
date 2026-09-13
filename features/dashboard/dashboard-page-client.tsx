"use client";

import { useCallback, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardHome } from "@/features/dashboard/dashboard-home";
import type { DashboardData } from "@/lib/dashboard-data";

type DashboardPayload = {
  user: {
    name?: string | null;
    email?: string | null;
    kycStatus: string;
  };
  data: DashboardData;
};

export function DashboardPageClient() {
  const [payload, setPayload] = useState<DashboardPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/dashboard", { cache: "no-store" });
      const json = (await res.json()) as DashboardPayload & { error?: string };
      if (!res.ok) {
        setError(json.error ?? "Could not load dashboard.");
        setPayload(null);
        return;
      }
      setPayload(json);
    } catch {
      setError("Network error. Check your connection and try again.");
      setPayload(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-24 animate-pulse rounded-2xl bg-card/60" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-card/60" />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-2xl bg-card/60" />
      </div>
    );
  }

  if (error || !payload) {
    return (
      <Card className="mx-auto max-w-lg space-y-4 p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">Dashboard</p>
        <h1 className="text-xl font-bold">Could not load dashboard data</h1>
        <p className="text-sm text-muted">{error ?? "Something went wrong."}</p>
        <Button type="button" variant="accent" onClick={() => void load()}>
          Try again
        </Button>
      </Card>
    );
  }

  return <DashboardHome user={payload.user} data={payload.data} />;
}
