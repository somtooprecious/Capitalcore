"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function AnnouncementBanner() {
  const [message, setMessage] = useState<string | null>(null);
  const [maintenance, setMaintenance] = useState(false);

  useEffect(() => {
    void fetch("/api/platform/config")
      .then((r) => r.json())
      .then((data: { announcementBanner?: string; maintenanceMode?: boolean }) => {
        if (data.announcementBanner?.trim()) setMessage(data.announcementBanner.trim());
        setMaintenance(Boolean(data.maintenanceMode));
      })
      .catch(() => undefined);
  }, []);

  if (maintenance) {
    return (
      <div className="border-b border-amber-500/30 bg-amber-500/10 px-4 py-2 text-center text-sm text-amber-200">
        Platform is in maintenance mode. Some features may be unavailable.{" "}
        <Link href="/contact" className="underline underline-offset-2">
          Contact support
        </Link>
      </div>
    );
  }

  if (!message) return null;

  return (
    <div className="border-b border-primary/20 bg-primary/10 px-4 py-2 text-center text-sm text-foreground">
      {message}
    </div>
  );
}
