"use client";

import { Globe } from "lucide-react";
import { useLocale } from "@/components/providers";
import { LOCALES, CURRENCIES } from "@/lib/i18n";

export function LocaleSwitcher() {
  const { locale, currency, setLocale, setCurrency } = useLocale();

  return (
    <div className="flex items-center gap-2">
      <Globe className="hidden h-4 w-4 text-muted sm:block" aria-hidden />
      <select
        className="rounded-lg border border-border bg-card px-2 py-1.5 text-xs"
        value={locale}
        onChange={(e) => setLocale(e.target.value as typeof locale)}
        aria-label="Language"
      >
        {LOCALES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
      <select
        className="rounded-lg border border-border bg-card px-2 py-1.5 text-xs"
        value={currency}
        onChange={(e) => setCurrency(e.target.value as typeof currency)}
        aria-label="Currency"
      >
        {CURRENCIES.map((c) => (
          <option key={c.code} value={c.code}>
            {c.code}
          </option>
        ))}
      </select>
    </div>
  );
}
