"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NotificationItem = {
  id: string;
  title: string;
  body: string;
  type: string;
  read: boolean;
  createdAt: string;
};

export function NotificationsWorkspace() {
  const [items, setItems] = useState<NotificationItem[]>([]);

  const load = async () => {
    const res = await fetch("/api/notifications");
    const json = (await res.json()) as { notifications: NotificationItem[] };
    setItems(json.notifications);
  };

  useEffect(() => {
    void load();
  }, []);

  const markAllRead = async () => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAllRead: true }),
    });
    await load();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="mt-1 text-muted">Deposits, withdrawals, tasks, and platform announcements.</p>
        </div>
        <Button variant="outline" type="button" onClick={markAllRead}>
          Mark all read
        </Button>
      </div>

      <Card className="divide-y divide-border p-0">
        {items.length === 0 ? (
          <p className="px-5 py-8 text-sm text-muted">No notifications yet.</p>
        ) : (
          items.map((n) => (
            <div
              key={n.id}
              className={cn("px-5 py-4", !n.read && "bg-primary/5")}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{n.title}</p>
                  <p className="mt-1 text-sm text-muted">{n.body}</p>
                  <p className="mt-2 text-xs text-muted">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
                {!n.read ? <span className="h-2 w-2 shrink-0 rounded-full bg-amber-400" /> : null}
              </div>
            </div>
          ))
        )}
      </Card>
    </div>
  );
}
