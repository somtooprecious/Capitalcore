"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PlatformConfig } from "@/lib/platform-config";
import { toast } from "sonner";

export function AdminSettingsPanel({ config }: { config: PlatformConfig }) {
  const [form, setForm] = useState(config);
  const [loading, setLoading] = useState(false);

  const save = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        toast.error("Could not save settings.");
        return;
      }
      toast.success("Platform settings updated.");
    } finally {
      setLoading(false);
    }
  };

  const field = (key: keyof PlatformConfig, label: string, type: "number" | "text" = "number") => (
    <div className="space-y-1.5">
      <label className="text-xs font-medium uppercase text-muted">{label}</label>
      <Input
        type={type}
        value={String(form[key] ?? "")}
        onChange={(e) =>
          setForm({
            ...form,
            [key]: type === "number" ? Number(e.target.value) : e.target.value,
          })
        }
      />
    </div>
  );

  return (
    <Card className="space-y-6 p-6">
      <div>
        <h2 className="font-semibold">System settings</h2>
        <p className="text-sm text-muted">Configure deposit, withdrawal, and daily task reward rules.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {field("depositMin", "Minimum deposit (USD)")}
        {field("depositMax", "Maximum deposit (USD)")}
        {field("withdrawalMin", "Minimum withdrawal (USD)")}
        {field("withdrawalMax", "Maximum withdrawal (USD)")}
        {field("withdrawalCooldownHours", "Withdrawal cooldown (hours)")}
        {field("dailyTaskRewardValue", "Daily task reward value")}
        {field("dailyTaskTitle", "Daily task title", "text")}
        {field("referralCommissionPercent", "Referral commission (%)")}
        {field("platformName", "Platform name", "text")}
        {field("brokerApiKey", "Broker API key (Alpha Vantage)", "text")}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-xs font-medium uppercase text-muted">Broker mode</label>
          <select
            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm"
            value={form.brokerMode}
            onChange={(e) => setForm({ ...form, brokerMode: e.target.value as PlatformConfig["brokerMode"] })}
          >
            <option value="DEMO">Demo (simulated fills)</option>
            <option value="LIVE">Live (API quotes)</option>
          </select>
        </div>
        <label className="flex items-center gap-2 self-end text-sm">
          <input
            type="checkbox"
            checked={form.aiTradingEnabled}
            onChange={(e) => setForm({ ...form, aiTradingEnabled: e.target.checked })}
          />
          AI auto-trading enabled
        </label>
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-medium uppercase text-muted">Daily task description</label>
        <Input
          value={form.dailyTaskDescription}
          onChange={(e) => setForm({ ...form, dailyTaskDescription: e.target.value })}
        />
      </div>
      <Button onClick={save} disabled={loading}>
        {loading ? "Saving…" : "Save settings"}
      </Button>
    </Card>
  );
}
