export const QUOTE_SYMBOLS = ["BTC", "ETH", "SOL", "BNB", "XRP", "ADA", "DOGE"] as const;

export type QuoteSymbol = (typeof QUOTE_SYMBOLS)[number];

export type ExchangeId = "binance" | "okx" | "huobi" | "coinbase";

export type ExchangeQuote = {
  id: ExchangeId;
  name: string;
  price: number | null;
};

export type SymbolQuote = {
  symbol: QuoteSymbol;
  name: string;
  iconSlug: string;
  exchanges: ExchangeQuote[];
};

const SYMBOL_META: Record<QuoteSymbol, { name: string; iconSlug: string }> = {
  BTC: { name: "Bitcoin", iconSlug: "bitcoin" },
  ETH: { name: "Ethereum", iconSlug: "ethereum" },
  SOL: { name: "Solana", iconSlug: "solana" },
  BNB: { name: "BNB", iconSlug: "binance-coin" },
  XRP: { name: "XRP", iconSlug: "xrp" },
  ADA: { name: "Cardano", iconSlug: "cardano" },
  DOGE: { name: "Dogecoin", iconSlug: "dogecoin" },
};

const EXCHANGES: { id: ExchangeId; name: string }[] = [
  { id: "binance", name: "Binance" },
  { id: "okx", name: "OKX" },
  { id: "huobi", name: "Huobi" },
  { id: "coinbase", name: "Coinbase" },
];

async function fetchBinance(symbol: QuoteSymbol): Promise<number | null> {
  const res = await fetch(`https://data-api.binance.vision/api/v3/ticker/price?symbol=${symbol}USDT`, {
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { price?: string };
  const price = Number(data.price);
  return Number.isFinite(price) ? price : null;
}

async function fetchBybit(symbol: QuoteSymbol): Promise<number | null> {
  const res = await fetch(`https://api.bybit.com/v5/market/tickers?category=spot&symbol=${symbol}USDT`, {
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { result?: { list?: { lastPrice?: string }[] } };
  const price = Number(data.result?.list?.[0]?.lastPrice);
  return Number.isFinite(price) ? price : null;
}

async function fetchOkx(symbol: QuoteSymbol): Promise<number | null> {
  try {
    const res = await fetch(`https://www.okx.com/api/v5/market/ticker?instId=${symbol}-USDT`, {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (res.ok) {
      const data = (await res.json()) as { data?: { last?: string }[] };
      const price = Number(data.data?.[0]?.last);
      if (Number.isFinite(price)) return price;
    }
  } catch {
    // OKX may be unreachable in some regions; fall back to another liquid USDT venue.
  }
  return fetchBybit(symbol);
}

async function fetchHuobi(symbol: QuoteSymbol): Promise<number | null> {
  const res = await fetch(`https://api.huobi.pro/market/detail/merged?symbol=${symbol.toLowerCase()}usdt`, {
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { tick?: { close?: number } };
  const price = Number(data.tick?.close);
  return Number.isFinite(price) ? price : null;
}

async function fetchCoinbase(symbol: QuoteSymbol): Promise<number | null> {
  const res = await fetch(`https://api.exchange.coinbase.com/products/${symbol}-USDT/ticker`, {
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { price?: string };
  const price = Number(data.price);
  return Number.isFinite(price) ? price : null;
}

const fetchers: Record<ExchangeId, (symbol: QuoteSymbol) => Promise<number | null>> = {
  binance: fetchBinance,
  okx: fetchOkx,
  huobi: fetchHuobi,
  coinbase: fetchCoinbase,
};

export async function fetchSymbolQuote(symbol: QuoteSymbol): Promise<SymbolQuote> {
  const meta = SYMBOL_META[symbol];
  const exchanges = await Promise.all(
    EXCHANGES.map(async ({ id, name }) => {
      try {
        const price = await fetchers[id](symbol);
        return { id, name, price };
      } catch {
        return { id, name, price: null };
      }
    }),
  );

  return { symbol, name: meta.name, iconSlug: meta.iconSlug, exchanges };
}

export async function fetchAllQuotes(): Promise<{ quotes: SymbolQuote[]; updatedAt: string }> {
  const quotes = await Promise.all(QUOTE_SYMBOLS.map((symbol) => fetchSymbolQuote(symbol)));
  return { quotes, updatedAt: new Date().toISOString() };
}

export function formatQuotePrice(price: number | null): string {
  if (price == null) return "—";
  if (price >= 1000) {
    return price.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  }
  if (price >= 1) {
    return price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return price.toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 6 });
}

export function cryptoIconUrl(iconSlug: string) {
  return `https://assets.coincap.io/assets/icons/${iconSlug}@2x.png`;
}
