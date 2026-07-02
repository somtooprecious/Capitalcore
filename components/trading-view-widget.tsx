"use client";

import { useEffect, useRef } from "react";

export function TradingViewWidget() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = "";
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: "BINANCE:BTCUSDT",
      interval: "60",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      allow_symbol_change: true,
      watchlist: ["BINANCE:BTCUSDT", "BINANCE:ETHUSDT", "FX:EURUSD", "OANDA:XAUUSD", "NASDAQ:AAPL"],
    });
    ref.current.appendChild(script);
  }, []);

  return (
    <div className="glass h-[420px] w-full overflow-hidden rounded-2xl">
      <div className="tradingview-widget-container h-full w-full" ref={ref}>
        <div className="tradingview-widget-container__widget h-full w-full" />
      </div>
    </div>
  );
}
