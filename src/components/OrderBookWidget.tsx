import React, { useState, useEffect } from "react";
import { MarketSymbol, OrderBookData } from "../types";
import { generateOrderBook } from "../data/marketData";
import { Layers, Activity, Zap } from "lucide-react";

interface OrderBookWidgetProps {
  symbol: MarketSymbol;
  isDark: boolean;
}

export const OrderBookWidget: React.FC<OrderBookWidgetProps> = ({ symbol, isDark }) => {
  const [orderBook, setOrderBook] = useState<OrderBookData>(() => generateOrderBook(symbol));

  // Simulate micro live updates in bid/ask depth
  useEffect(() => {
    const interval = setInterval(() => {
      setOrderBook(generateOrderBook(symbol));
    }, 2500);
    return () => clearInterval(interval);
  }, [symbol]);

  return (
    <div className={`rounded-xl border p-4 space-y-3 font-mono text-xs ${
      isDark ? "bg-[#1e222d] border-[#2a2e39] text-white" : "bg-white border-[#E0E3EB] text-[#191b24]"
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E0E3EB] dark:border-[#2a2e39] pb-2">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#2962ff]" />
          <h4 className="font-bold font-headline text-sm">Level 2 Order Book & Depth</h4>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-[#089981] font-bold">
          <span className="w-2 h-2 rounded-full bg-[#089981] animate-ping" />
          <span>LIVE TAPES</span>
        </div>
      </div>

      {/* Column Titles */}
      <div className="grid grid-cols-3 text-[10px] text-[#6A6D78] uppercase font-semibold">
        <span>Price ($)</span>
        <span className="text-right">Size</span>
        <span className="text-right">Total</span>
      </div>

      {/* Asks (Sell Orders) - Red */}
      <div className="space-y-1">
        {orderBook.asks.slice().reverse().map((ask, idx) => (
          <div key={`ask-${idx}`} className="grid grid-cols-3 relative py-0.5 items-center">
            <div
              className="absolute right-0 top-0 bottom-0 bg-[#F23645]/15 rounded-sm"
              style={{ width: `${ask.percent}%` }}
            />
            <span className="text-[#F23645] font-bold z-10">{ask.price.toLocaleString()}</span>
            <span className="text-right z-10 opacity-80">{ask.size.toLocaleString()}</span>
            <span className="text-right z-10 opacity-60 text-[10px]">{ask.total.toLocaleString()}</span>
          </div>
        ))}
      </div>

      {/* Current Spread Bar */}
      <div className="py-2 px-3 my-1 rounded-lg bg-[#FAF8FF] dark:bg-[#131722] border border-[#E0E3EB] dark:border-[#2a2e39] flex items-center justify-between text-xs font-bold">
        <span className="text-[#6A6D78] text-[11px]">Spread: ${orderBook.spread} ({orderBook.spreadPercent}%)</span>
        <span className="text-[#2962ff] flex items-center gap-1">
          <Zap className="w-3 h-3 animate-pulse" />
          Market Mid: ${symbol.price.toLocaleString()}
        </span>
      </div>

      {/* Bids (Buy Orders) - Green */}
      <div className="space-y-1">
        {orderBook.bids.map((bid, idx) => (
          <div key={`bid-${idx}`} className="grid grid-cols-3 relative py-0.5 items-center">
            <div
              className="absolute right-0 top-0 bottom-0 bg-[#089981]/15 rounded-sm"
              style={{ width: `${bid.percent}%` }}
            />
            <span className="text-[#089981] font-bold z-10">{bid.price.toLocaleString()}</span>
            <span className="text-right z-10 opacity-80">{bid.size.toLocaleString()}</span>
            <span className="text-right z-10 opacity-60 text-[10px]">{bid.total.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
