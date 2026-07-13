"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type ReferralData = {
  code: string;
  link: string;
  bonusPerReferral: number;
  totalReferrals: number;
  totalEarnings: number;
  referrals: { id: string; name: string; email: string; joinedAt: string }[];
  earnings: { id: string; amount: number; createdAt: string }[];
};

export function ReferralsWorkspace() {
  const [data, setData] = useState<ReferralData | null>(null);

  useEffect(() => {
    void fetch("/api/referrals")
      .then((r) => r.json())
      .then((json: ReferralData) => setData(json));
  }, []);

  const copyLink = async () => {
    if (!data?.link) return;
    await navigator.clipboard.writeText(data.link);
    toast.success("Referral link copied.");
  };

  if (!data) return <Card className="animate-pulse p-8 text-muted">Loading referrals…</Card>;

  const bonus = data.bonusPerReferral ?? 5;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Referrals</h1>
        <p className="mt-1 text-muted">
          Invite friends with your link. Earn <span className="font-semibold text-amber-400">${bonus.toFixed(2)}</span>{" "}
          when a new user signs up with your referral and deposits for any investment plan.
        </p>
      </div>

      <Card className="space-y-3 border-amber-500/30 bg-amber-500/5 p-6">
        <p className="text-xs uppercase tracking-wide text-amber-400">Offer</p>
        <p className="text-2xl font-bold tabular-nums text-foreground">${bonus.toFixed(2)} per referral</p>
        <p className="text-sm text-muted">
          Your ${bonus.toFixed(2)} bonus is credited after the invited user deposits for an investment plan
          (once per referred user).
        </p>
      </Card>

      <Card className="space-y-4 p-6">
        <p className="text-sm text-muted">Your referral link</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input readOnly value={data.link} className="font-mono text-xs" />
          <Button type="button" onClick={copyLink}>
            Copy link
          </Button>
        </div>
        <p className="text-xs text-muted">Code: {data.code}</p>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="p-5">
          <p className="text-xs uppercase text-muted">Total referrals</p>
          <p className="mt-2 text-2xl font-bold">{data.totalReferrals}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase text-muted">Referral earnings</p>
          <p className="mt-2 text-2xl font-bold tabular-nums">${data.totalEarnings.toFixed(2)}</p>
        </Card>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="border-b border-border px-5 py-4">
          <h3 className="font-semibold">Invited users</h3>
        </div>
        <ul className="divide-y divide-border">
          {data.referrals.length === 0 ? (
            <li className="px-5 py-8 text-sm text-muted">No referrals yet. Share your link to get started.</li>
          ) : (
            data.referrals.map((r) => (
              <li key={r.id} className="flex items-center justify-between px-5 py-3 text-sm">
                <div>
                  <p className="font-medium">{r.name}</p>
                  <p className="text-xs text-muted">{r.email}</p>
                </div>
                <span className="text-xs text-muted">{new Date(r.joinedAt).toLocaleDateString()}</span>
              </li>
            ))
          )}
        </ul>
      </Card>
    </div>
  );
}
