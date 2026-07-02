import { prisma } from "@/lib/prisma";
import { getPlatformConfig } from "@/lib/platform-config";
import { sendTradeEmail } from "@/lib/email";

export type BrokerOrderInput = {
  userId: string;
  symbol: string;
  side: "BUY" | "SELL";
  amount: number;
  mode?: "MANUAL" | "AI_AUTO";
};

type BrokerQuote = {
  symbol: string;
  price: number;
  source: string;
};

const DEMO_PRICES: Record<string, number> = {
  "BTCUSD": 67250,
  "ETHUSD": 3450,
  "EURUSD": 1.0842,
  "AAPL": 198.5,
  "XAUUSD": 2345,
};

async function fetchLiveQuote(symbol: string, apiKey: string): Promise<BrokerQuote | null> {
  if (!apiKey) return null;
  try {
    const res = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${apiKey}`,
      { next: { revalidate: 60 } },
    );
    const data = (await res.json()) as { "Global Quote"?: { "05. price"?: string } };
    const price = Number(data["Global Quote"]?.["05. price"]);
    if (!price || Number.isNaN(price)) return null;
    return { symbol, price, source: "alphavantage" };
  } catch {
    return null;
  }
}

export async function getBrokerQuote(symbol: string): Promise<BrokerQuote> {
  const config = await getPlatformConfig();
  const normalized = symbol.toUpperCase().replace("/", "");

  if (config.brokerMode === "LIVE" && config.brokerApiKey) {
    const live = await fetchLiveQuote(normalized, config.brokerApiKey);
    if (live) return live;
  }

  const demoPrice = DEMO_PRICES[normalized] ?? 100 + Math.random() * 50;
  return { symbol: normalized, price: demoPrice, source: "demo" };
}

export async function placeBrokerOrder(input: BrokerOrderInput) {
  const config = await getPlatformConfig();
  if (!config.aiTradingEnabled && input.mode === "AI_AUTO") {
    throw new Error("AI trading is disabled by platform administration.");
  }

  const quote = await getBrokerQuote(input.symbol);
  const reference = `TRD-${Date.now().toString(36).toUpperCase()}`;

  const order = await prisma.tradeOrder.create({
    data: {
      userId: input.userId,
      symbol: quote.symbol,
      side: input.side,
      amount: input.amount,
      price: quote.price,
      status: "FILLED",
      mode: input.mode ?? "MANUAL",
      brokerRef: reference,
      metadata: {
        quoteSource: quote.source,
        brokerMode: config.brokerMode,
        filledAt: new Date().toISOString(),
      },
    },
  });

  const user = await prisma.user.findUnique({
    where: { id: input.userId },
    select: { email: true, emailNotifications: true },
  });

  if (user?.emailNotifications && user.email) {
    await sendTradeEmail(user.email, quote.symbol, input.side, "FILLED");
  }

  return order;
}

export async function runAiAutoTrade(userId: string) {
  const symbols = ["BTCUSD", "ETHUSD", "EURUSD", "AAPL"];
  const symbol = symbols[Math.floor(Math.random() * symbols.length)];
  const side = Math.random() > 0.45 ? "BUY" : "SELL";
  const amount = Math.round((50 + Math.random() * 200) * 100) / 100;

  return placeBrokerOrder({
    userId,
    symbol,
    side,
    amount,
    mode: "AI_AUTO",
  });
}
