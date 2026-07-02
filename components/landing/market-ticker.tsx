"use client";

import { cn } from "@/lib/utils";

type TickerItem = {
  id: string;
  label: string;
  price: string;
  change: string;
  pct: string;
  up: boolean;
  badge?: string;
};

const BASE_TICKERS: TickerItem[] = [
  { id: "cfd", label: "CFD", price: "—", change: "", pct: "", up: true, badge: "CFD" },
  { id: "eurusd", label: "EUR to USD", price: "1.16463", change: "+0.00", pct: "+0.20%", up: true },
  { id: "btc", label: "Bitcoin", price: "77,294.12", change: "-113.40", pct: "-0.15%", up: false },
  { id: "eth", label: "Ethereum", price: "3,842.55", change: "+28.10", pct: "+0.74%", up: true },
  { id: "gold", label: "Gold", price: "2,341.80", change: "+4.20", pct: "+0.18%", up: true },
  { id: "gbpusd", label: "GBP to USD", price: "1.27142", change: "-0.00", pct: "-0.08%", up: false },
  { id: "nasdaq", label: "NASDAQ 100", price: "21,842.30", change: "+62.15", pct: "+0.29%", up: true },
];

export function MarketTicker() {
  const loop = [...BASE_TICKERS, ...BASE_TICKERS];

  return (
    <div className="relative overflow-hidden border-t border-border/50 bg-[#0a0f1a]/95">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-[#0a0f1a] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-[#0a0f1a] to-transparent" />
      <div className="market-ticker-track flex w-max items-stretch gap-0 py-2.5">
        {loop.map((item, idx) => (
          <TickerCell key={`${item.id}-${idx}`} item={item} />
        ))}
      </div>
      <div className="absolute right-2 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-border/60 bg-card/90 px-2 py-0.5 text-[10px] font-medium text-muted sm:block">
        TradingView
      </div>
    </div>
  );
}

function TickerCell({ item }: { item: TickerItem }) {
  if (item.badge === "CFD") {
    return (
      <div className="flex shrink-0 items-center border-r border-border/40 px-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted">{item.label}</span>
      </div>
    );
  }

  return (
    <div className="flex min-w-[148px] shrink-0 flex-col justify-center border-r border-border/40 px-4 sm:min-w-[168px]">
      <span className="truncate text-xs font-medium text-foreground/90">{item.label}</span>
      <div className="mt-0.5 flex flex-wrap items-baseline gap-x-2 gap-y-0">
        <span className={cn("text-sm font-semibold tabular-nums", item.up ? "text-foreground" : "text-red-400")}>
          {item.price}
        </span>
        {item.change && (
          <span className={cn("text-[11px] tabular-nums", item.up ? "text-green-400" : "text-red-400")}>
            {item.change} ({item.pct})
          </span>
        )}
      </div>
    </div>
  );
}
