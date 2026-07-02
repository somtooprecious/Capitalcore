"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type TaskStatus = {
  task: { id: string; title: string; description: string | null; rewardType: string; rewardValue: number };
  completedToday: boolean;
  streak: number;
  nextReset: string;
  history: { id: string; title: string; rewardAmount: number; dayKey: string; completedAt: string; streakCount: number }[];
};

function Countdown({ target }: { target: string }) {
  const [remaining, setRemaining] = useState("");

  useEffect(() => {
    const tick = () => {
      const diff = new Date(target).getTime() - Date.now();
      if (diff <= 0) {
        setRemaining("00:00:00");
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setRemaining(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  return <span className="font-mono text-lg font-bold tabular-nums text-amber-400">{remaining}</span>;
}

export function DailyTasksWorkspace() {
  const [data, setData] = useState<TaskStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    const res = await fetch("/api/daily-tasks");
    const json = (await res.json()) as TaskStatus;
    setData(json);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const complete = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/daily-tasks/complete", { method: "POST" });
      const json = (await res.json()) as { error?: string; rewardAmount?: number; streakCount?: number };
      if (!res.ok) {
        toast.error(json.error ?? "Could not complete task.");
        return;
      }
      toast.success(`Reward credited: $${json.rewardAmount?.toFixed(2)} · Streak ${json.streakCount} day(s)`);
      await load();
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !data) {
    return <Card className="animate-pulse p-8 text-muted">Loading daily task…</Card>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Daily trading task</h1>
        <p className="mt-1 max-w-2xl text-muted">
          Complete one configured task per day. Rewards are set by platform administration—not live AI trading profits.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="space-y-4 p-6 lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted">Today&apos;s task</p>
              <h2 className="mt-1 text-xl font-semibold">{data.task.title}</h2>
            </div>
            <span
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium",
                data.completedToday
                  ? "border-green-500/30 bg-green-500/10 text-green-400"
                  : "border-amber-500/30 bg-amber-500/10 text-amber-400",
              )}
            >
              {data.completedToday ? "Completed" : "Available"}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-muted">{data.task.description}</p>
          <p className="text-sm text-foreground">
            Reward:{" "}
            <span className="font-semibold text-amber-400">
              {data.task.rewardType === "PERCENT"
                ? `${data.task.rewardValue}% of balance`
                : `$${data.task.rewardValue.toFixed(2)}`}
            </span>
          </p>
          {!data.completedToday ? (
            <Button onClick={complete} disabled={submitting} className="w-full sm:w-auto">
              {submitting ? "Processing…" : "Complete today&apos;s task"}
            </Button>
          ) : null}
        </Card>

        <Card className="space-y-4 p-6">
          <p className="text-xs uppercase tracking-wide text-muted">Streak</p>
          <p className="text-4xl font-bold tabular-nums">{data.streak}</p>
          <p className="text-sm text-muted">consecutive day(s)</p>
          <div className="border-t border-border pt-4">
            <p className="text-xs text-muted">Next task in</p>
            <Countdown target={data.nextReset} />
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="border-b border-border px-5 py-4">
          <h3 className="font-semibold">Completion history</h3>
        </div>
        {data.history.length === 0 ? (
          <p className="px-5 py-8 text-sm text-muted">No completed tasks yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {data.history.map((h) => (
              <li key={h.id} className="flex items-center justify-between px-5 py-3 text-sm">
                <div>
                  <p className="font-medium">{h.title}</p>
                  <p className="text-xs text-muted">{h.dayKey}</p>
                </div>
                <span className="font-medium text-green-400">+${h.rewardAmount.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
