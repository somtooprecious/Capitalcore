"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { TradingViewWidget } from "@/components/trading-view-widget";
import { ClerkSecurityPanel } from "@/components/auth/clerk-security-panel";
import {
  WITHDRAWAL_ASSETS,
  WITHDRAWAL_FLAT_FEE_USD,
  calculateWithdrawalFees,
  type WithdrawalAssetCode,
} from "@/lib/withdrawals";
import { cn } from "@/lib/utils";

function WorkspaceHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6 space-y-1">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="max-w-2xl text-muted">{description}</p>
    </div>
  );
}

function StatusMessage({ message, type }: { message: string; type: "success" | "error" }) {
  return (
    <p className={cn("text-sm", type === "success" ? "text-green-400" : "text-red-400")}>{message}</p>
  );
}

export function DepositsWorkspace() {
  const [amount, setAmount] = useState("");
  const [asset, setAsset] = useState("BTC");
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [depositInfo, setDepositInfo] = useState<{
    reference: string;
    depositAddress: string;
    asset: string;
    amount: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    setDepositInfo(null);
    const value = Number(amount);
    if (!value || value < 10) {
      setStatus({ type: "error", text: "Enter an amount of at least $10." });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/payments/crypto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: value, asset }),
      });
      const data = (await res.json()) as {
        reference?: string;
        depositAddress?: string;
        asset?: string;
        amount?: number;
        error?: string;
        message?: string;
      };
      if (!res.ok) {
        setStatus({ type: "error", text: data.error ?? "Could not create crypto deposit." });
        return;
      }
      if (data.reference && data.depositAddress && data.asset && data.amount) {
        setDepositInfo({
          reference: data.reference,
          depositAddress: data.depositAddress,
          asset: data.asset,
          amount: data.amount,
        });
        setStatus({
          type: "success",
          text: data.message ?? "Crypto deposit initiated. Send funds to the address below.",
        });
        setAmount("");
      }
    } catch {
      setStatus({ type: "error", text: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const assetLabel =
    depositInfo?.asset === "USDT" ? "USDT BEP 20" : depositInfo?.asset ?? "";

  return (
    <>
      <WorkspaceHeader
        title="Deposits"
        description="Fund your wallet with cryptocurrency. Deposits appear in your balance after on-chain confirmation."
      />
      <Card className="max-w-xl space-y-4 p-6">
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Amount (USD equivalent)</label>
            <Input
              type="number"
              min="10"
              step="0.01"
              placeholder="250.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Crypto asset</label>
            <select
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm"
              value={asset}
              onChange={(e) => setAsset(e.target.value)}
            >
              <option value="BTC">Bitcoin (BTC)</option>
              <option value="USDT">USDT BEP 20</option>
              <option value="ETH">Ethereum (ETH)</option>
            </select>
          </div>
          {status ? <StatusMessage message={status.text} type={status.type} /> : null}
          {depositInfo ? (
            <div className="space-y-2 rounded-xl border border-border bg-background/60 p-4 text-sm">
              <p>
                <span className="text-muted">Reference:</span>{" "}
                <span className="font-mono font-medium text-foreground">{depositInfo.reference}</span>
              </p>
              <p>
                <span className="text-muted">Send {assetLabel} to:</span>
              </p>
              <p className="break-all font-mono text-xs text-foreground">{depositInfo.depositAddress}</p>
              <p className="text-xs text-muted">
                Amount: ${depositInfo.amount.toFixed(2)} USD equivalent. Include your reference in the memo if the
                network supports it.
              </p>
            </div>
          ) : null}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Processing…" : "Generate deposit details"}
          </Button>
        </form>
      </Card>
    </>
  );
}

export function WithdrawalsWorkspace() {
  const [amount, setAmount] = useState("");
  const [asset, setAsset] = useState<WithdrawalAssetCode>("USDT");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<
    { id: string; amount: number; destination: string; status: string; reference: string; createdAt: string }[]
  >([]);

  const amountValue = Number(amount);
  const feePreview =
    amountValue > 0
      ? calculateWithdrawalFees(amountValue)
      : { percentFee: 0, flatFee: WITHDRAWAL_FLAT_FEE_USD, totalFee: 0, netPayout: 0 };

  const loadHistory = async () => {
    const res = await fetch("/api/withdrawals");
    const data = (await res.json()) as { withdrawals: typeof history };
    setHistory(data.withdrawals ?? []);
  };

  useEffect(() => {
    void loadHistory();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    const value = Number(amount);
    if (!value || value < 20) {
      setStatus({ type: "error", text: "Enter a valid withdrawal amount (minimum $20)." });
      return;
    }
    if (!address.trim() || address.trim().length < 8) {
      setStatus({ type: "error", text: "Enter a valid wallet address for the selected asset." });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/withdrawals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: value, asset, address: address.trim() }),
      });
      const data = (await res.json()) as {
        error?: string;
        reference?: string;
        fees?: { totalFee: number; netPayout: number };
      };
      if (!res.ok) {
        setStatus({ type: "error", text: data.error ?? "Could not submit withdrawal." });
        return;
      }
      const feeNote =
        data.fees
          ? ` Fees $${data.fees.totalFee.toFixed(2)}. Net payout $${data.fees.netPayout.toFixed(2)}.`
          : "";
      setStatus({
        type: "success",
        text: `Withdrawal queued (ref ${data.reference}).${feeNote} Pending admin approval.`,
      });
      setAmount("");
      setAddress("");
      await loadHistory();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <WorkspaceHeader
        title="Withdrawals"
        description="Request a payout to your crypto wallet. A 10% fee plus a $5 processing fee applies to every withdrawal. Most requests are reviewed within 24 hours."
      />
      <Card className="max-w-xl space-y-4 p-6">
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Amount (USD)</label>
            <Input
              type="number"
              min="20"
              step="0.01"
              placeholder="100.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Destination asset</label>
            <select
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm"
              value={asset}
              onChange={(e) => setAsset(e.target.value as WithdrawalAssetCode)}
            >
              {WITHDRAWAL_ASSETS.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Wallet address</label>
            <Input
              placeholder={
                asset === "BTC"
                  ? "Your Bitcoin address"
                  : asset === "ETH"
                    ? "Your Ethereum address (0x…)"
                    : "Your USDT BEP 20 address (0x…)"
              }
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          {amountValue > 0 ? (
            <div className="space-y-1.5 rounded-xl border border-border bg-background/60 px-4 py-3 text-sm">
              <div className="flex justify-between gap-3 text-muted">
                <span>10% fee</span>
                <span className="tabular-nums">−${feePreview.percentFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between gap-3 text-muted">
                <span>Withdrawal fee</span>
                <span className="tabular-nums">−${feePreview.flatFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between gap-3 border-t border-border pt-2 font-medium text-foreground">
                <span>You receive</span>
                <span className="tabular-nums text-emerald-400">
                  ${Math.max(0, feePreview.netPayout).toFixed(2)}
                </span>
              </div>
            </div>
          ) : null}
          {status ? <StatusMessage message={status.text} type={status.type} /> : null}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting…" : "Submit withdrawal"}
          </Button>
        </form>
      </Card>
      <Card className="mt-6 overflow-hidden p-0">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-semibold">Withdrawal history</h2>
        </div>
        <ul className="divide-y divide-border">
          {history.length === 0 ? (
            <li className="px-5 py-8 text-sm text-muted">No withdrawal requests yet.</li>
          ) : (
            history.map((w) => (
              <li key={w.id} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 text-sm">
                <div>
                  <p className="font-medium">${w.amount.toFixed(2)} · {w.status}</p>
                  <p className="text-xs text-muted">{w.reference} · {new Date(w.createdAt).toLocaleString()}</p>
                </div>
                <span className="max-w-[200px] truncate text-xs text-muted">{w.destination}</span>
              </li>
            ))
          )}
        </ul>
      </Card>
    </>
  );
}

export function TransfersWorkspace() {
  const [tab, setTab] = useState<"local" | "international" | "user">("local");
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = Number(amount);
    if (!value || value <= 0) {
      setStatus({ type: "error", text: "Enter a valid transfer amount." });
      return;
    }
    if (!recipient.trim()) {
      setStatus({ type: "error", text: "Enter a recipient account or email." });
      return;
    }
    if (otp.length < 4) {
      setStatus({ type: "error", text: "Enter the OTP sent to your email (demo: any 4+ digits)." });
      return;
    }
    setStatus({
      type: "success",
      text: `${tab === "local" ? "Local" : tab === "international" ? "International" : "User-to-user"} transfer of $${value.toFixed(2)} submitted successfully.`,
    });
    setAmount("");
    setRecipient("");
    setOtp("");
  };

  const tabs = [
    { id: "local" as const, label: "Local transfer" },
    { id: "international" as const, label: "International" },
    { id: "user" as const, label: "User to user" },
  ];

  return (
    <>
      <WorkspaceHeader
        title="Transfers"
        description="Send funds locally, internationally, or to another CapitalCore account. OTP verification is required for each transfer."
      />
      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            className={cn(
              buttonVariants({ variant: tab === t.id ? "default" : "outline" }),
              "text-xs sm:text-sm",
            )}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <Card className="max-w-xl space-y-4 p-6">
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Amount (USD)</label>
            <Input
              type="number"
              min="1"
              step="0.01"
              placeholder="50.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              {tab === "user" ? "Recipient email" : "Recipient account / IBAN"}
            </label>
            <Input
              placeholder={tab === "user" ? "user@example.com" : "Account number or IBAN"}
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">OTP code</label>
            <Input
              placeholder="Enter verification code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
          {status ? <StatusMessage message={status.text} type={status.type} /> : null}
          <Button type="submit" className="w-full">
            Confirm transfer
          </Button>
        </form>
      </Card>
    </>
  );
}

export function TradingWorkspace() {
  const [symbol, setSymbol] = useState("BTCUSD");
  const [side, setSide] = useState<"BUY" | "SELL">("BUY");
  const [amount, setAmount] = useState("100");
  const [orders, setOrders] = useState<
    { id: string; symbol: string; side: string; amount: number; price: number | null; status: string; mode: string; createdAt: string }[]
  >([]);
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const loadOrders = async () => {
    const res = await fetch("/api/trades");
    const data = (await res.json()) as { orders: typeof orders };
    setOrders(data.orders ?? []);
  };

  useEffect(() => {
    void loadOrders();
  }, []);

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/trades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol, side, amount: Number(amount) }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setStatus({ type: "error", text: data.error ?? "Order failed." });
        return;
      }
      setStatus({ type: "success", text: "Order filled via broker API." });
      await loadOrders();
    } finally {
      setLoading(false);
    }
  };

  const runAiTrade = async () => {
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/trades/ai", { method: "POST" });
      const data = (await res.json()) as { error?: string; order?: { symbol: string; side: string } };
      if (!res.ok) {
        setStatus({ type: "error", text: data.error ?? "AI trade failed." });
        return;
      }
      setStatus({
        type: "success",
        text: `AI auto-trade executed: ${data.order?.side} ${data.order?.symbol}`,
      });
      await loadOrders();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <WorkspaceHeader
        title="AI Trading Workspace"
        description="Place manual orders or run autonomous AI trades through the broker integration. Demo mode uses simulated fills unless a live API key is configured in admin settings."
      />
      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        <Card className="space-y-4 p-6 lg:col-span-1">
          <h2 className="font-semibold">Place order</h2>
          <form onSubmit={placeOrder} className="space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium">Symbol</label>
              <select
                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
              >
                <option value="BTCUSD">BTC/USD</option>
                <option value="ETHUSD">ETH/USD</option>
                <option value="EURUSD">EUR/USD</option>
                <option value="AAPL">AAPL</option>
                <option value="XAUUSD">Gold (XAU/USD)</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button type="button" variant={side === "BUY" ? "default" : "outline"} onClick={() => setSide("BUY")}>
                Buy
              </Button>
              <Button type="button" variant={side === "SELL" ? "default" : "outline"} onClick={() => setSide("SELL")}>
                Sell
              </Button>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Amount (USD)</label>
              <Input type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            {status ? <StatusMessage message={status.text} type={status.type} /> : null}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Executing…" : "Execute manual trade"}
            </Button>
          </form>
          <Button variant="accent" className="w-full" type="button" disabled={loading} onClick={runAiTrade}>
            Run AI auto-trade
          </Button>
        </Card>
        <Card className="overflow-hidden p-0 lg:col-span-2">
          <div className="border-b border-border px-5 py-4">
            <h3 className="font-semibold">Recent orders</h3>
          </div>
          <div className="max-h-64 overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-card/60 text-left text-xs uppercase text-muted">
                <tr>
                  <th className="px-4 py-2">Symbol</th>
                  <th className="px-4 py-2">Side</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Price</th>
                  <th className="px-4 py-2">Mode</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted">
                      No trades yet.
                    </td>
                  </tr>
                ) : (
                  orders.map((o) => (
                    <tr key={o.id} className="border-t border-border">
                      <td className="px-4 py-2 font-medium">{o.symbol}</td>
                      <td className="px-4 py-2">{o.side}</td>
                      <td className="px-4 py-2 tabular-nums">${o.amount.toFixed(2)}</td>
                      <td className="px-4 py-2 tabular-nums">{o.price ? `$${o.price.toFixed(2)}` : "—"}</td>
                      <td className="px-4 py-2">{o.mode}</td>
                      <td className="px-4 py-2">{o.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
      <TradingViewWidget />
    </>
  );
}

export function SettingsWorkspace() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    void fetch("/api/user/preferences")
      .then((r) => r.json())
      .then((data: { preferences?: { emailNotifications?: boolean } }) => {
        if (data.preferences) setEmailNotifications(Boolean(data.preferences.emailNotifications));
      });
  }, []);

  const saveNotifications = async () => {
    const res = await fetch("/api/user/preferences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emailNotifications }),
    });
    setMessage(res.ok ? "Notification preferences saved." : "Could not save preferences.");
  };

  return (
    <>
      <WorkspaceHeader
        title="Settings"
        description="Security preferences, notifications, and account controls."
      />
      <div className="grid max-w-2xl gap-4">
        <ClerkSecurityPanel />
        <Card className="space-y-3 p-6">
          <h2 className="font-semibold">Email notifications</h2>
          <p className="text-sm text-muted">
            Receive email alerts for deposits, withdrawals, and trade confirmations when SMTP is configured.
          </p>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
            />
            Send email notifications
          </label>
          <Button variant="outline" type="button" onClick={saveNotifications}>
            Save preferences
          </Button>
        </Card>
        {message ? <p className="text-sm text-green-400">{message}</p> : null}
        <Link href="/kyc-verification" className={cn(buttonVariants({ variant: "default" }), "w-fit")}>
          Complete KYC verification
        </Link>
      </div>
    </>
  );
}
