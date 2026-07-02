"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  CreditCard,
  FileText,
  Pencil,
  RefreshCw,
  Users,
  Settings,
  Wallet,
  X,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { AdminData } from "@/lib/admin-data";
import { AdminSettingsPanel } from "@/features/admin/admin-settings-panel";
import { AdminBlogPanel } from "@/features/admin/admin-blog-panel";

type TabId = "overview" | "users" | "payments" | "withdrawals" | "blog" | "settings";

const tabs: { id: TabId; label: string; icon: typeof Activity }[] = [
  { id: "overview", label: "Overview", icon: Activity },
  { id: "users", label: "Users", icon: Users },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "withdrawals", label: "Withdrawals", icon: Wallet },
  { id: "blog", label: "Blog CMS", icon: FileText },
  { id: "settings", label: "Settings", icon: Settings },
];

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "COMPLETED" || status === "ACTIVE" || status === "APPROVED"
      ? "text-green-400 bg-green-500/10 border-green-500/20"
      : status === "PENDING"
        ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
        : status === "REJECTED" || status === "CANCELLED"
          ? "text-red-400 bg-red-500/10 border-red-500/20"
          : "text-muted bg-card border-border";
  return (
    <span className={cn("inline-flex rounded-full border px-2 py-0.5 text-xs font-medium", tone)}>{status}</span>
  );
}

function EditPanel({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-lg space-y-4 p-6 shadow-2xl">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-muted transition-colors hover:bg-card hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </Card>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium uppercase tracking-wide text-muted">{label}</label>
      {children}
    </div>
  );
}

function selectClassName() {
  return "w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground";
}

export function AdminConsole({ data }: { data: AdminData }) {
  const router = useRouter();
  const [tab, setTab] = useState<TabId>("overview");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const [editUser, setEditUser] = useState<AdminData["recentUsers"][number] | null>(null);

  const [userForm, setUserForm] = useState({ name: "", role: "USER", kycStatus: "PENDING", balance: "", cryptoBtc: "" });

  const notify = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const refresh = () => router.refresh();

  const openUserEdit = (user: AdminData["recentUsers"][number]) => {
    setEditUser(user);
    setUserForm({
      name: user.name ?? "",
      role: user.role,
      kycStatus: user.kycStatus,
      balance: String(user.balance),
      cryptoBtc: String(user.cryptoBtc),
    });
  };

  const saveUser = async () => {
    if (!editUser) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${editUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userForm.name,
          role: userForm.role,
          kycStatus: userForm.kycStatus,
        }),
      });
      const payload = (await res.json()) as { error?: string };
      if (!res.ok) {
        notify("error", payload.error ?? "Could not update user.");
        return;
      }

      const walletRes = await fetch(`/api/admin/users/${editUser.id}/wallet`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          balance: Number(userForm.balance),
          cryptoBtc: Number(userForm.cryptoBtc),
        }),
      });
      const walletPayload = (await walletRes.json()) as { error?: string };
      if (!walletRes.ok) {
        notify("error", walletPayload.error ?? "User updated but wallet save failed.");
        return;
      }

      notify("success", "User and wallet updated.");
      setEditUser(null);
      refresh();
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentStatus = async (id: string, status: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/payments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const payload = (await res.json()) as { error?: string };
      if (!res.ok) {
        notify("error", payload.error ?? "Could not update payment.");
        return;
      }
      notify("success", status === "COMPLETED" ? "Payment approved and wallet credited." : `Payment marked ${status}.`);
      refresh();
    } finally {
      setLoading(false);
    }
  };

  const updateTransactionStatus = async (id: string, status: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/transactions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const payload = (await res.json()) as { error?: string };
      if (!res.ok) {
        notify("error", payload.error ?? "Could not update transaction.");
        return;
      }
      notify("success", "Transaction status updated.");
      refresh();
    } finally {
      setLoading(false);
    }
  };

  const updateWithdrawalStatus = async (id: string, status: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/withdrawals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const payload = (await res.json()) as { error?: string };
      if (!res.ok) {
        notify("error", payload.error ?? "Could not update withdrawal.");
        return;
      }
      notify("success", `Withdrawal ${status.toLowerCase()}.`);
      refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground">Admin control center</h1>
          <p className="max-w-2xl text-sm text-muted">
            Manage users, approve crypto deposits, configure platform rules, and control withdrawals across CapitalCore AI.
          </p>
        </div>
        <Button variant="outline" onClick={refresh} disabled={loading} className="gap-2">
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          Refresh
        </Button>
      </header>

      {message ? (
        <div
          className={cn(
            "rounded-xl border px-4 py-3 text-sm",
            message.type === "success"
              ? "border-green-500/30 bg-green-500/10 text-green-400"
              : "border-red-500/30 bg-red-500/10 text-red-400",
          )}
        >
          {message.text}
        </div>
      ) : null}

      <nav className="flex flex-wrap gap-2 border-b border-border pb-4">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              tab === id
                ? "bg-amber-500/15 text-foreground"
                : "text-muted hover:bg-card hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </nav>

      {tab === "overview" ? (
        <section className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Total users", value: String(data.stats.totalUsers) },
              { label: "Pending payments", value: String(data.stats.pendingPayments) },
              { label: "Completed payments", value: String(data.stats.completedPayments) },
              { label: "Completed volume", value: formatMoney(data.stats.paymentVolume) },
            ].map((stat) => (
              <Card key={stat.label} className="p-5">
                <p className="text-xs uppercase tracking-wide text-muted">{stat.label}</p>
                <p className="mt-2 text-2xl font-bold tabular-nums">{stat.value}</p>
              </Card>
            ))}
          </div>
          <Card className="p-6">
            <h2 className="font-semibold text-foreground">Quick actions</h2>
            <p className="mt-1 text-sm text-muted">Jump to the sections where you can edit platform data.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button variant="outline" onClick={() => setTab("users")}>
                Manage users
              </Button>
              <Button variant="outline" onClick={() => setTab("payments")}>
                Review payments
              </Button>
              <Button variant="outline" onClick={() => setTab("blog")}>
                Blog CMS
              </Button>
              <a href="/api/exports/transactions?format=csv">
                <Button variant="outline" type="button">Export transactions CSV</Button>
              </a>
              <a href="/api/exports/transactions?format=pdf">
                <Button variant="outline" type="button">Export transactions PDF</Button>
              </a>
            </div>
          </Card>
        </section>
      ) : null}

      {tab === "users" ? (
        <Card className="overflow-hidden p-0">
          <div className="border-b border-border px-5 py-4">
            <h2 className="font-semibold">User management</h2>
            <p className="text-sm text-muted">Edit roles, KYC status, and wallet balances.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-card/60">
                  {["User", "Role", "KYC", "Balance", "Joined", "Actions"].map((col) => (
                    <th key={col} className="px-5 py-3 font-semibold">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.recentUsers.map((user) => (
                  <tr key={user.id} className="bg-background/40">
                    <td className="px-5 py-3">
                      <p className="font-medium text-foreground">{user.name ?? "—"}</p>
                      <p className="text-xs text-muted">{user.email}</p>
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={user.role} />
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={user.kycStatus} />
                    </td>
                    <td className="px-5 py-3 tabular-nums">{formatMoney(user.balance)}</td>
                    <td className="px-5 py-3 text-muted">{formatDate(user.createdAt)}</td>
                    <td className="px-5 py-3">
                      <Button variant="outline" className="gap-1.5" onClick={() => openUserEdit(user)}>
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : null}

      {tab === "payments" ? (
        <div className="space-y-6">
        <Card className="overflow-hidden p-0">
          <div className="border-b border-border px-5 py-4">
            <h2 className="font-semibold">Crypto payments</h2>
            <p className="text-sm text-muted">Approve deposits to credit user wallets, or reject invalid requests.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-card/60">
                  {["User", "Amount", "Reference", "Status", "Date", "Actions"].map((col) => (
                    <th key={col} className="px-5 py-3 font-semibold">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.recentPayments.map((payment) => (
                  <tr key={payment.id} className="bg-background/40">
                    <td className="px-5 py-3">
                      <p className="font-medium">{payment.user}</p>
                      <p className="text-xs text-muted">{payment.email}</p>
                    </td>
                    <td className="px-5 py-3 tabular-nums">{formatMoney(payment.amount)}</td>
                    <td className="px-5 py-3 font-mono text-xs">{payment.reference}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={payment.status} />
                    </td>
                    <td className="px-5 py-3 text-muted">{formatDate(payment.createdAt)}</td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-2">
                        {payment.status === "PENDING" ? (
                          <>
                            <Button
                              variant="accent"
                              disabled={loading}
                              onClick={() => updatePaymentStatus(payment.id, "COMPLETED")}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              disabled={loading}
                              onClick={() => updatePaymentStatus(payment.id, "REJECTED")}
                            >
                              Reject
                            </Button>
                          </>
                        ) : (
                          <select
                            className={cn(selectClassName(), "w-auto min-w-[120px]")}
                            value={payment.status}
                            disabled={loading}
                            onChange={(e) => updatePaymentStatus(payment.id, e.target.value)}
                          >
                            {["PENDING", "COMPLETED", "REJECTED"].map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

          <Card className="overflow-hidden p-0">
            <div className="border-b border-border px-5 py-4">
              <h2 className="font-semibold">Transactions</h2>
              <p className="text-sm text-muted">Adjust transaction status when reconciling activity.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-card/60">
                    {["User", "Type", "Amount", "Status", "Reference", "Actions"].map((col) => (
                      <th key={col} className="px-5 py-3 font-semibold">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.recentTransactions.map((tx) => (
                    <tr key={tx.id} className="bg-background/40">
                      <td className="px-5 py-3">
                        <p className="font-medium">{tx.user}</p>
                        <p className="text-xs text-muted">{tx.email}</p>
                      </td>
                      <td className="px-5 py-3">{tx.type}</td>
                      <td className="px-5 py-3 tabular-nums">{formatMoney(tx.amount)}</td>
                      <td className="px-5 py-3">
                        <StatusBadge status={tx.status} />
                      </td>
                      <td className="px-5 py-3 font-mono text-xs">{tx.reference}</td>
                      <td className="px-5 py-3">
                        <select
                          className={cn(selectClassName(), "w-auto min-w-[130px]")}
                          value={tx.status}
                          disabled={loading}
                          onChange={(e) => updateTransactionStatus(tx.id, e.target.value)}
                        >
                          {["PENDING", "COMPLETED", "REJECTED", "CANCELLED"].map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      ) : null}

      {tab === "withdrawals" ? (
        <Card className="overflow-hidden p-0">
          <div className="border-b border-border px-5 py-4">
            <h2 className="font-semibold">Withdrawal requests</h2>
            <p className="text-sm text-muted">Approve, complete, or reject user withdrawal requests.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-card/60">
                  {["User", "Amount", "Destination", "Status", "Reference", "Actions"].map((col) => (
                    <th key={col} className="px-5 py-3 font-semibold">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.withdrawalRequests.map((w) => (
                  <tr key={w.id} className="bg-background/40">
                    <td className="px-5 py-3">
                      <p className="font-medium">{w.user}</p>
                      <p className="text-xs text-muted">{w.email}</p>
                    </td>
                    <td className="px-5 py-3 tabular-nums">{formatMoney(w.amount)}</td>
                    <td className="max-w-[180px] truncate px-5 py-3 text-muted">{w.destination}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={w.status} />
                    </td>
                    <td className="px-5 py-3 font-mono text-xs">{w.reference}</td>
                    <td className="px-5 py-3">
                      {w.status === "PENDING" ? (
                        <div className="flex flex-wrap gap-2">
                          <Button disabled={loading} onClick={() => updateWithdrawalStatus(w.id, "APPROVED")}>
                            Approve
                          </Button>
                          <Button variant="outline" disabled={loading} onClick={() => updateWithdrawalStatus(w.id, "REJECTED")}>
                            Reject
                          </Button>
                        </div>
                      ) : w.status === "APPROVED" ? (
                        <Button disabled={loading} onClick={() => updateWithdrawalStatus(w.id, "COMPLETED")}>
                          Mark completed
                        </Button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : null}

      {tab === "blog" ? <AdminBlogPanel /> : null}

      {tab === "settings" ? <AdminSettingsPanel config={data.platformConfig} /> : null}

      {editUser ? (
        <EditPanel title="Edit user" onClose={() => setEditUser(null)}>
          <div className="space-y-4">
            <p className="text-sm text-muted">{editUser.email}</p>
            <Field label="Display name">
              <Input value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Role">
                <select
                  className={selectClassName()}
                  value={userForm.role}
                  onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                >
                  <option value="USER">USER</option>
                  <option value="OWNER">OWNER</option>
                </select>
              </Field>
              <Field label="KYC status">
                <select
                  className={selectClassName()}
                  value={userForm.kycStatus}
                  onChange={(e) => setUserForm({ ...userForm, kycStatus: e.target.value })}
                >
                  <option value="PENDING">PENDING</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </Field>
            </div>
            <div className="rounded-xl border border-border bg-background/60 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                <Wallet className="h-4 w-4 text-primary" />
                Wallet balances
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="USD balance">
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={userForm.balance}
                    onChange={(e) => setUserForm({ ...userForm, balance: e.target.value })}
                  />
                </Field>
                <Field label="Crypto (BTC)">
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={userForm.cryptoBtc}
                    onChange={(e) => setUserForm({ ...userForm, cryptoBtc: e.target.value })}
                  />
                </Field>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setEditUser(null)}>
                Cancel
              </Button>
              <Button onClick={saveUser} disabled={loading}>
                {loading ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </div>
        </EditPanel>
      ) : null}
    </div>
  );
}
