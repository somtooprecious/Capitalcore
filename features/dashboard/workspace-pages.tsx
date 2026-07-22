"use client";

import { useEffect, useState } from "react";
import { Copy, Hash, Share2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { TradingViewWidget } from "@/components/trading-view-widget";
import { ClerkSecurityPanel } from "@/components/auth/clerk-security-panel";
import {
  WITHDRAWAL_ASSETS,
  calculateWithdrawalFees,
  type WithdrawalAssetCode,
} from "@/lib/withdrawal-fees";
import { UsdtIcon, UsdtAmount } from "@/components/usdt-amount";
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
  const [depositAddress, setDepositAddress] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [showAmount, setShowAmount] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [confirmedAmount, setConfirmedAmount] = useState<number | null>(null);
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/payments/crypto");
        const data = (await res.json()) as { depositAddress?: string; error?: string };
        if (!res.ok || !data.depositAddress) {
          setStatus({ type: "error", text: data.error ?? "Could not load deposit address." });
          return;
        }
        setDepositAddress(data.depositAddress);
        const QRCode = (await import("qrcode")).default;
        const url = await QRCode.toDataURL(data.depositAddress, {
          width: 280,
          margin: 2,
          color: { dark: "#111111", light: "#ffffff" },
        });
        setQrDataUrl(url);
      } catch {
        setStatus({ type: "error", text: "Could not load deposit address." });
      } finally {
        setLoadingAddress(false);
      }
    })();
  }, []);

  const copyAddress = async () => {
    if (!depositAddress) return;
    try {
      await navigator.clipboard.writeText(depositAddress);
      setStatus({ type: "success", text: "USDT BEP 20 address copied." });
    } catch {
      setStatus({ type: "error", text: "Could not copy address." });
    }
  };

  const shareAddress = async () => {
    if (!depositAddress) return;
    const text = `USDT (BEP20) deposit address:\n${depositAddress}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "USDT BEP 20 deposit", text });
        return;
      }
      await navigator.clipboard.writeText(text);
      setStatus({ type: "success", text: "Deposit details copied to share." });
    } catch {
      // User cancelled share — ignore.
    }
  };

  const confirmAmount = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    const value = Number(amount);
    if (!value || value < 10) {
      setStatus({ type: "error", text: "Enter an amount of at least 10 USDT." });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/payments/crypto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: value, asset: "USDT" }),
      });
      const data = (await res.json()) as {
        reference?: string;
        amount?: number;
        error?: string;
        message?: string;
      };
      if (!res.ok) {
        setStatus({ type: "error", text: data.error ?? "Could not create deposit request." });
        return;
      }
      setReference(data.reference ?? null);
      setConfirmedAmount(data.amount ?? value);
      setShowAmount(false);
      setAmount("");
      setStatus({
        type: "success",
        text: data.message ?? "Deposit request created. Send USDT BEP 20 to the address above.",
      });
    } catch {
      setStatus({ type: "error", text: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <WorkspaceHeader
        title="Deposits"
        description="Fund your wallet with USDT on the BEP 20 network. Deposits appear after confirmation."
      />

      <div className="mx-auto w-full max-w-md space-y-5">
        <div className="flex items-center justify-center gap-2.5">
          <UsdtIcon size={28} />
          <span className="text-xl font-bold tracking-wide text-foreground">USDT</span>
          <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-muted">
            BEP20
          </span>
        </div>

        <div className="rounded-2xl bg-white p-5 text-center shadow-xl sm:p-6">
          {loadingAddress ? (
            <div className="flex h-64 items-center justify-center text-sm text-slate-500">Loading…</div>
          ) : (
            <>
              {qrDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qrDataUrl}
                  alt="USDT BEP 20 deposit QR code"
                  className="mx-auto h-56 w-56 sm:h-64 sm:w-64"
                />
              ) : (
                <div className="mx-auto flex h-56 w-56 items-center justify-center rounded-lg bg-slate-100 text-sm text-slate-500 sm:h-64 sm:w-64">
                  QR unavailable
                </div>
              )}
              <p className="mt-4 break-all px-1 font-mono text-sm font-medium leading-relaxed text-slate-900">
                {depositAddress || "—"}
              </p>
            </>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={copyAddress}
            disabled={!depositAddress}
            className="flex flex-col items-center gap-2 rounded-xl border border-border/70 bg-card/80 px-2 py-3 text-foreground transition hover:bg-card disabled:opacity-50"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5">
              <Copy className="h-5 w-5" aria-hidden />
            </span>
            <span className="text-xs font-medium">Copy</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setShowAmount((v) => !v);
              setStatus(null);
            }}
            className="flex flex-col items-center gap-2 rounded-xl border border-border/70 bg-card/80 px-2 py-3 text-foreground transition hover:bg-card"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5">
              <Hash className="h-5 w-5" aria-hidden />
            </span>
            <span className="text-xs font-medium">Set Amount</span>
          </button>
          <button
            type="button"
            onClick={shareAddress}
            disabled={!depositAddress}
            className="flex flex-col items-center gap-2 rounded-xl border border-border/70 bg-card/80 px-2 py-3 text-foreground transition hover:bg-card disabled:opacity-50"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5">
              <Share2 className="h-5 w-5" aria-hidden />
            </span>
            <span className="text-xs font-medium">Share</span>
          </button>
        </div>

        {showAmount ? (
          <Card className="space-y-3 p-5">
            <p className="text-sm font-medium">Set deposit amount (USDT)</p>
            <form onSubmit={confirmAmount} className="space-y-3">
              <Input
                type="number"
                min="10"
                step="0.01"
                placeholder="250.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                autoFocus
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating…" : "Confirm amount"}
              </Button>
            </form>
          </Card>
        ) : null}

        {confirmedAmount && reference ? (
          <Card className="space-y-2 border-green-500/30 bg-green-500/5 p-4 text-sm">
            <p className="font-medium text-foreground">Deposit request ready</p>
            <p className="flex flex-wrap items-center gap-2 text-muted">
              Send exactly <UsdtAmount amount={confirmedAmount} size="sm" className="text-foreground" /> on BEP 20.
            </p>
            <p>
              <span className="text-muted">Reference:</span>{" "}
              <span className="font-mono font-medium text-foreground">{reference}</span>
            </p>
          </Card>
        ) : null}

        {status ? <StatusMessage message={status.text} type={status.type} /> : null}

        <p className="text-center text-xs text-muted">
          Only send USDT on the BEP 20 network. Sending any other asset or network may result in lost funds.
        </p>
      </div>
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
      : { percentFee: 0, flatFee: 0, totalFee: 0, netPayout: 0 };

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
        description="Request a payout to your crypto wallet. A 10% withdrawal fee applies to every request. Most requests are reviewed within 24 hours."
      />
      <Card className="max-w-xl space-y-4 p-6">
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Amount (USDT)</label>
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
            <label className="mb-1.5 flex items-center gap-2 text-sm font-medium">
              Destination asset
              {asset === "USDT" ? <UsdtIcon size={16} /> : null}
            </label>
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
              <div className="flex items-center justify-between gap-3 text-muted">
                <span>10% withdrawal fee</span>
                <UsdtAmount amount={feePreview.percentFee} sign="−" size="sm" className="font-medium text-muted" />
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-border pt-2 font-medium text-foreground">
                <span>You receive</span>
                <UsdtAmount
                  amount={Math.max(0, feePreview.netPayout)}
                  size="sm"
                  className="text-emerald-400"
                />
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
                  <div className="flex flex-wrap items-center gap-2 font-medium">
                    <UsdtAmount amount={w.amount} size="sm" />
                    <span>· {w.status}</span>
                  </div>
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

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [kycStatus, setKycStatus] = useState<string>("PENDING");
  const [profileMessage, setProfileMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [completingKyc, setCompletingKyc] = useState(false);

  useEffect(() => {
    void fetch("/api/user/preferences")
      .then((r) => r.json())
      .then((data: { preferences?: { emailNotifications?: boolean } }) => {
        if (data.preferences) setEmailNotifications(Boolean(data.preferences.emailNotifications));
      });

    void fetch("/api/user/kyc")
      .then((r) => r.json())
      .then((data: { name?: string; email?: string; kycStatus?: string }) => {
        const parts = (data.name ?? "").trim().split(/\s+/).filter(Boolean);
        setFirstName(parts[0] ?? "");
        setLastName(parts.slice(1).join(" ") ?? "");
        setEmail(data.email ?? "");
        setKycStatus(data.kycStatus ?? "PENDING");
      });
  }, []);

  const saveProfile = async () => {
    setProfileMessage(null);
    setSavingProfile(true);
    try {
      const res = await fetch("/api/user/kyc", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName: firstName.trim(), lastName: lastName.trim() }),
      });
      const data = (await res.json()) as { error?: string; message?: string };
      if (!res.ok) {
        setProfileMessage({ type: "error", text: data.error ?? "Could not save profile." });
        return;
      }
      setProfileMessage({ type: "success", text: data.message ?? "Profile saved." });
    } finally {
      setSavingProfile(false);
    }
  };

  const completeKyc = async () => {
    setProfileMessage(null);
    setCompletingKyc(true);
    try {
      const res = await fetch("/api/user/kyc", { method: "POST" });
      const data = (await res.json()) as { error?: string; message?: string; kycStatus?: string };
      if (!res.ok) {
        setProfileMessage({ type: "error", text: data.error ?? "Could not complete KYC." });
        return;
      }
      setKycStatus(data.kycStatus ?? "APPROVED");
      setProfileMessage({ type: "success", text: data.message ?? "KYC verification completed." });
    } finally {
      setCompletingKyc(false);
    }
  };

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
        <Card className="space-y-4 p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-semibold">Profile &amp; KYC verification</h2>
            <span
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wide",
                kycStatus === "APPROVED"
                  ? "border-green-500/40 bg-green-500/10 text-green-400"
                  : "border-amber-500/40 bg-amber-500/10 text-amber-400",
              )}
            >
              KYC: {kycStatus.replaceAll("_", " ")}
            </span>
          </div>
          <p className="text-sm text-muted">
            Add your first and last name, save your profile, then complete KYC to verify your account.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">First name</label>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                autoComplete="given-name"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Last name</label>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                autoComplete="family-name"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Email</label>
            <Input value={email} readOnly disabled className="opacity-70" />
          </div>
          {profileMessage ? (
            <StatusMessage message={profileMessage.text} type={profileMessage.type} />
          ) : null}
          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="outline" onClick={saveProfile} disabled={savingProfile}>
              {savingProfile ? "Saving…" : "Save profile"}
            </Button>
            {kycStatus === "APPROVED" ? (
              <Button type="button" variant="outline" disabled>
                KYC verified ✓
              </Button>
            ) : (
              <Button type="button" onClick={completeKyc} disabled={completingKyc}>
                {completingKyc ? "Verifying…" : "Complete KYC"}
              </Button>
            )}
          </div>
        </Card>
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
      </div>
    </>
  );
}
