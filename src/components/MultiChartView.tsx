import React, { useState } from "react";
import { MarketSymbol, Timeframe } from "../types";
import { generateCandleSeries } from "../data/marketData";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Maximize2, TrendingUp, TrendingDown, RefreshCw, LayoutGrid, Layers } from "lucide-react";

interface MultiChartViewProps {
  symbols: MarketSymbol[];
  onSelectSymbol: (symbol: MarketSymbol) => void;
  isDark: boolean;
}

export const MultiChartView: React.FC<MultiChartViewProps> = ({
  symbols,
  onSelectSymbol,
  isDark,
}) => {
  const [gridCount, setGridCount] = useState<2 | 4>(4);
  const [timeframe, setTimeframe] = useState<Timeframe>("1D");

  // Pick top benchmark instruments for multi-chart
  const selectedSymbols = symbols.slice(0, gridCount);

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Controls Bar */}
      <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
        isDark ? "bg-[#1e222d] border-[#2a2e39] text-white" : "bg-white border-[#E0E3EB] text-[#191b24]"
      }`}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#2962ff] text-white rounded-lg">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-base md:text-lg font-headline flex items-center gap-2">
              Multi-Chart Pro Terminal View
              <span className="text-[10px] font-mono uppercase bg-[#2962ff]/10 text-[#0049db] dark:text-[#2962ff] px-2 py-0.5 rounded font-bold">
                Level 2 Feed
              </span>
            </h2>
            <p className="text-xs text-[#6A6D78]">
              Simultaneous real-time multi-asset monitoring
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Timeframe Selector */}
          <div className={`flex items-center gap-1 p-1 rounded-lg border text-xs font-mono font-bold ${
            isDark ? "bg-[#131722] border-[#2a2e39]" : "bg-[#F0F3FA] border-[#E0E3EB]"
          }`}>
            {(["1D", "5D", "1M", "1Y"] as Timeframe[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 rounded transition-all ${
                  timeframe === tf
                    ? "bg-[#2962ff] text-white shadow-xs"
                    : "text-[#6A6D78] hover:text-[#191b24] dark:hover:text-white"
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Grid Layout Switcher */}
          <div className={`flex items-center gap-1 p-1 rounded-lg border text-xs font-mono ${
            isDark ? "bg-[#131722] border-[#2a2e39]" : "bg-[#F0F3FA] border-[#E0E3EB]"
          }`}>
            <button
              onClick={() => setGridCount(2)}
              className={`px-3 py-1 rounded font-bold transition-all ${
                gridCount === 2
                  ? "bg-[#2962ff] text-white"
                  : "text-[#6A6D78] hover:text-[#191b24] dark:hover:text-white"
              }`}
            >
              1x2 Split
            </button>
            <button
              onClick={() => setGridCount(4)}
              className={`px-3 py-1 rounded font-bold transition-all ${
                gridCount === 4
                  ? "bg-[#2962ff] text-white"
                  : "text-[#6A6D78] hover:text-[#191b24] dark:hover:text-white"
              }`}
            >
              2x2 Grid
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Chart Canvases */}
      <div className={`grid gap-4 ${
        gridCount === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-2"
      }`}>
        {selectedSymbols.map((item) => {
          const chartData = generateCandleSeries(item, timeframe);
          const isPositive = item.change >= 0;
          const prices = chartData.map((d) => d.close);
          const minP = Math.min(...prices) * 0.998;
          const maxP = Math.max(...prices) * 1.002;

          return (
            <div
              key={item.symbol}
              className={`rounded-2xl border p-4 flex flex-col space-y-3 transition-all ${
                isDark
                  ? "bg-[#1e222d] border-[#2a2e39] hover:border-[#2962ff]/50"
                  : "bg-white border-[#E0E3EB] hover:border-[#2962ff]/50 shadow-xs"
              }`}
            >
              {/* Tile Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#2962ff] text-white flex items-center justify-center font-bold text-xs font-mono shrink-0">
                    {item.badge}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm font-mono dark:text-white text-[#191b24]">
                        {item.symbol}
                      </span>
                      <span className="text-[10px] font-mono text-[#6A6D78]">
                        {item.category}
                      </span>
                    </div>
                    <div className="text-xs text-[#6A6D78] line-clamp-1">
                      {item.name}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-mono font-bold text-sm dark:text-white text-[#191b24]">
                      ${item.price.toLocaleString()}
                    </div>
                    <div
                      className={`text-xs font-mono font-semibold flex items-center justify-end gap-0.5 ${
                        isPositive ? "text-[#089981]" : "text-[#F23645]"
                      }`}
                    >
                      {isPositive ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      <span>
                        {isPositive ? "+" : ""}
                        {item.changePercent}%
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectSymbol(item)}
                    className="p-2 bg-[#2962ff]/10 text-[#0049db] dark:text-[#2962ff] hover:bg-[#2962ff] hover:text-white rounded-lg transition-colors"
                    title="Expand Full Terminal View"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Chart Body */}
              <div className="h-56 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id={`grad-${item.symbol}`} x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor={isPositive ? "#089981" : "#F23645"}
                          stopOpacity={0.4}
                        />
                        <stop
                          offset="95%"
                          stopColor={isPositive ? "#089981" : "#F23645"}
                          stopOpacity={0.0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#2a2e39" : "#f0f0f0"} />
                    <XAxis dataKey="time" stroke="#737687" fontSize={10} tickLine={false} />
                    <YAxis domain={[minP, maxP]} stroke="#737687" fontSize={10} orientation="right" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? "#131722" : "#191b24",
                        color: "#ffffff",
                        borderRadius: "8px",
                        fontSize: "11px",
                        border: "none",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="close"
                      stroke={isPositive ? "#089981" : "#F23645"}
                      fillOpacity={1}
                      fill={`url(#grad-${item.symbol})`}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
