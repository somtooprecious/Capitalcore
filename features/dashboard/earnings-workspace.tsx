"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type EarningsData = {
  total: number;
  bySource: Record<string, number>;
  earnings: { id: string; amount: number; source: string; reference: string | null; createdAt: string }[];
};

export function EarningsWorkspace() {
  const [data, setData] = useState<EarningsData | null>(null);

  useEffect(() => {
    void fetch("/api/earnings")
      .then((r) => r.json())
      .then((json: EarningsData) => setData(json));
  }, []);

  if (!data) return <Card className="animate-pulse p-8 text-muted">Loading earnings…</Card>;

  const chartData = Object.entries(data.bySource).map(([source, amount]) => ({ source, amount }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Earnings</h1>
        <p className="mt-1 text-muted">Track configured rewards, daily tasks, and referral income.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <a href="/api/exports/earnings?format=csv" className="rounded-xl border border-border px-3 py-1.5 text-sm hover:bg-white/5">
            Export CSV
          </a>
          <a href="/api/exports/earnings?format=pdf" className="rounded-xl border border-border px-3 py-1.5 text-sm hover:bg-white/5">
            Export PDF
          </a>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-xs uppercase text-muted">Total earnings</p>
          <p className="mt-2 text-2xl font-bold tabular-nums">${data.total.toFixed(2)}</p>
        </Card>
        {Object.entries(data.bySource).map(([source, amount]) => (
          <Card key={source} className="p-5">
            <p className="text-xs uppercase text-muted">{source.replaceAll("_", " ")}</p>
            <p className="mt-2 text-2xl font-bold tabular-nums">${amount.toFixed(2)}</p>
          </Card>
        ))}
      </div>

      {chartData.length > 0 ? (
        <Card className="flex h-72 flex-col p-4">
          <p className="mb-2 font-semibold">Earnings by source</p>
          <div className="min-h-0 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="source" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => `$${Number(v).toFixed(2)}`} />
                <Bar dataKey="amount" fill="#f5b342" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      ) : null}

      <Card className="overflow-hidden p-0">
        <div className="border-b border-border px-5 py-4">
          <h3 className="font-semibold">Earnings history</h3>
        </div>
        <ul className="divide-y divide-border">
          {data.earnings.length === 0 ? (
            <li className="px-5 py-8 text-sm text-muted">No earnings recorded yet.</li>
          ) : (
            data.earnings.map((e) => (
              <li key={e.id} className="flex items-center justify-between px-5 py-3 text-sm">
                <div>
                  <p className="font-medium">{e.source.replaceAll("_", " ")}</p>
                  <p className="text-xs text-muted">{new Date(e.createdAt).toLocaleString()}</p>
                </div>
                <span className="font-medium text-green-400">+${e.amount.toFixed(2)}</span>
              </li>
            ))
          )}
        </ul>
      </Card>
    </div>
  );
}
