"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { Activity } from "lucide-react";
import { AnimatedSection } from "@/components/animated-section";
import { Card } from "@/components/ui/card";
import { useTranslations } from "@/hooks/use-translations";
import type { ExchangeId, SymbolQuote } from "@/lib/crypto-quotes";
import { cryptoIconUrl, formatQuotePrice } from "@/lib/crypto-quotes";
import { cn } from "@/lib/utils";

type QuotesResponse = {
  quotes: SymbolQuote[];
  updatedAt: string;
};

const EXCHANGE_STYLES: Record<ExchangeId, { bg: string; label: string }> = {
  binance: { bg: "bg-[#F0B90B]", label: "B" },
  okx: { bg: "bg-zinc-900 ring-1 ring-white/20", label: "O" },
  huobi: { bg: "bg-[#1B6DC1]", label: "H" },
  coinbase: { bg: "bg-[#0052FF]", label: "C" },
};

function ExchangeBadge({ id, name }: { id: ExchangeId; name: string }) {
  const style = EXCHANGE_STYLES[id];
  return (
    <div className="flex items-center gap-2.5">
      <span
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white",
          style.bg,
        )}
        aria-hidden
      >
        {style.label}
      </span>
      <span className="text-sm font-medium text-foreground/90">{name}</span>
    </div>
  );
}

function QuoteCard({ quote }: { quote: SymbolQuote }) {
  return (
    <Card className="overflow-hidden border-border/70 bg-[#12101f]/90 shadow-lg backdrop-blur-sm">
      <div className="flex items-center gap-2.5 border-b border-border/50 px-4 py-3.5">
        <Image
          src={cryptoIconUrl(quote.iconSlug)}
          alt=""
          width={28}
          height={28}
          className="rounded-full"
          unoptimized
        />
        <span className="text-sm font-semibold tracking-wide text-foreground">
          {quote.symbol} <span className="text-muted">/ USDT</span>
        </span>
      </div>
      <ul className="divide-y divide-border/40">
        {quote.exchanges.map((row) => (
          <li key={row.id} className="flex items-center justify-between gap-3 px-4 py-3">
            <ExchangeBadge id={row.id} name={row.name} />
            <span className="shrink-0 text-sm font-semibold tabular-nums text-emerald-400">
              {formatQuotePrice(row.price)}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function RealTimeQuotes() {
  const { home } = useTranslations();
  const q = home.realTimeQuotes;

  const { data, isLoading, isFetching, dataUpdatedAt } = useQuery<QuotesResponse>({
    queryKey: ["crypto-quotes"],
    queryFn: async () => {
      const res = await fetch("/api/quotes");
      if (!res.ok) throw new Error("Failed to load quotes");
      return res.json();
    },
    refetchInterval: 8000,
    staleTime: 5000,
  });

  const updatedLabel = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    : null;

  return (
    <AnimatedSection className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">{q.title}</h2>
          <p className="mt-1 text-sm text-muted">{q.subtitle}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted">
          <Activity className={cn("h-3.5 w-3.5", isFetching ? "animate-pulse text-emerald-400" : "text-emerald-400")} />
          <span>{q.live}</span>
          {updatedLabel ? <span className="text-muted/80">· {q.updated} {updatedLabel}</span> : null}
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-2xl border border-border/50 bg-card/40" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {data?.quotes.map((quote) => (
            <QuoteCard key={quote.symbol} quote={quote} />
          ))}
        </div>
      )}
    </AnimatedSection>
  );
}
