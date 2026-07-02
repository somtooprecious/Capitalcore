"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function TwoFactorPanel() {
  const [enabled, setEnabled] = useState(false);
  const [secret, setSecret] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/user/preferences");
      const data = (await res.json()) as { preferences?: { twoFactorEnabled?: boolean } };
      setEnabled(Boolean(data.preferences?.twoFactorEnabled));
    })();
  }, []);

  const startSetup = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/2fa/setup", { method: "POST" });
      const data = (await res.json()) as { secret?: string; qrDataUrl?: string; error?: string };
      if (!res.ok) {
        toast.error(data.error ?? "Could not start 2FA setup.");
        return;
      }
      setSecret(data.secret ?? null);
      setQrDataUrl(data.qrDataUrl ?? null);
    } finally {
      setLoading(false);
    }
  };

  const enable = async () => {
    if (!secret) return;
    setLoading(true);
    try {
      const res = await fetch("/api/auth/2fa/enable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret, token }),
      });
      if (!res.ok) {
        toast.error("Invalid code. Try again.");
        return;
      }
      toast.success("Two-factor authentication enabled.");
      setEnabled(true);
      setSecret(null);
      setQrDataUrl(null);
      setToken("");
    } finally {
      setLoading(false);
    }
  };

  const disable = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/2fa/disable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (!res.ok) {
        toast.error("Invalid code.");
        return;
      }
      toast.success("2FA disabled.");
      setEnabled(false);
      setToken("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="space-y-4 p-6">
      <div>
        <h2 className="font-semibold">Two-factor authentication</h2>
        <p className="text-sm text-muted">
          Protect your account with an authenticator app (Google Authenticator, Authy, etc.).
        </p>
      </div>

      {enabled ? (
        <div className="space-y-3">
          <p className="text-sm text-green-400">2FA is enabled on your account.</p>
          <Input
            placeholder="Enter 6-digit code to disable"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <Button variant="outline" onClick={disable} disabled={loading || token.length < 6}>
            Disable 2FA
          </Button>
        </div>
      ) : secret ? (
        <div className="space-y-3">
          {qrDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qrDataUrl} alt="2FA QR code" className="h-40 w-40 rounded-lg border border-border" />
          ) : null}
          <p className="text-xs text-muted break-all">Manual key: {secret}</p>
          <Input placeholder="6-digit code" value={token} onChange={(e) => setToken(e.target.value)} />
          <Button onClick={enable} disabled={loading || token.length < 6}>
            Confirm & enable
          </Button>
        </div>
      ) : (
        <Button onClick={startSetup} disabled={loading}>
          Enable 2FA
        </Button>
      )}
    </Card>
  );
}
