"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { usePlatformStore } from "@/store/use-platform-store";
import { cn } from "@/lib/utils";

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, markAllRead } = usePlatformStore();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-card/80 text-foreground transition-colors hover:bg-card"
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open ? (
        <div className="absolute left-0 top-full z-50 mt-2 w-[min(100vw-2rem,320px)] overflow-hidden rounded-xl border border-border bg-card shadow-xl sm:left-auto sm:right-0">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="text-sm font-semibold">Notifications</p>
            {unreadCount > 0 ? (
              <button
                type="button"
                className="text-xs text-primary hover:underline"
                onClick={() => markAllRead()}
              >
                Mark all read
              </button>
            ) : null}
          </div>
          <ul className="max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <li className="px-4 py-6 text-center text-sm text-muted">No notifications yet.</li>
            ) : (
              notifications.map((n) => (
                <li
                  key={n.id}
                  className={cn(
                    "border-b border-border/50 px-4 py-3 last:border-0",
                    !n.read && "bg-primary/5",
                  )}
                >
                  <p className="text-sm font-medium text-foreground">{n.title}</p>
                  <p className="mt-0.5 text-xs text-muted">{n.body}</p>
                  <p className="mt-1 text-[10px] text-muted">{n.time}</p>
                </li>
              ))
            )}
          </ul>
          <div className="border-t border-border px-4 py-2">
            <Link href="/dashboard" className="text-xs text-primary hover:underline" onClick={() => setOpen(false)}>
              Open dashboard →
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
