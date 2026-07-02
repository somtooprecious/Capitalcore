"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function SupportWorkspace() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState<
    { id: string; subject: string; message: string; status: string; createdAt: string }[]
  >([]);

  const load = async () => {
    const res = await fetch("/api/support/tickets");
    const data = (await res.json()) as { tickets: typeof tickets };
    setTickets(data.tickets ?? []);
  };

  useEffect(() => {
    void load();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/support/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        toast.error(data.error ?? "Could not submit ticket.");
        return;
      }
      toast.success("Support ticket submitted.");
      setSubject("");
      setMessage("");
      await load();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Support center</h1>
        <p className="mt-1 text-muted">Submit tickets and track responses from the CapitalCore AI team.</p>
      </div>
      <Card className="max-w-xl space-y-4 p-6">
        <form onSubmit={submit} className="space-y-4">
          <Input placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
          <textarea
            className="min-h-[120px] w-full rounded-xl border border-border bg-card px-4 py-3 text-sm"
            placeholder="Describe your issue…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Sending…" : "Submit ticket"}
          </Button>
        </form>
      </Card>
      <Card className="overflow-hidden p-0">
        <div className="border-b border-border px-5 py-4 font-semibold">Your tickets</div>
        <ul className="divide-y divide-border">
          {tickets.length === 0 ? (
            <li className="px-5 py-8 text-sm text-muted">No tickets yet.</li>
          ) : (
            tickets.map((t) => (
              <li key={t.id} className="px-5 py-4 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium">{t.subject}</p>
                  <span className="text-xs text-amber-400">{t.status}</span>
                </div>
                <p className="mt-1 text-muted">{t.message}</p>
                <p className="mt-2 text-xs text-muted">{new Date(t.createdAt).toLocaleString()}</p>
              </li>
            ))
          )}
        </ul>
      </Card>
    </div>
  );
}
