import React, { useState, useEffect } from "react";
import { MarketSymbol, Timeframe, ChartType, CandleData } from "../types";
import { generateCandleSeries } from "../data/marketData";
import { OrderBookWidget } from "./OrderBookWidget";
import {
  X,
  Star,
  Sparkles,
  TrendingUp,
  TrendingDown,
  BarChart2,
  LineChart as LineChartIcon,
  Activity,
  Layers,
  RefreshCw,
  AlertCircle,
  Briefcase,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface SymbolModalProps {
  symbol: MarketSymbol | null;
  onClose: () => void;
  watchlist: string[];
  onToggleWatchlist: (symbolStr: string, e: React.MouseEvent) => void;
  isDark?: boolean;
  onOpenPaperTrade?: (symbol: MarketSymbol) => void;
}

export const SymbolModal: React.FC<SymbolModalProps> = ({
  symbol,
  onClose,
  watchlist,
  onToggleWatchlist,
  isDark = false,
  onOpenPaperTrade,
}) => {
  if (!symbol) return null;

  const [timeframe, setTimeframe] = useState<Timeframe>("1D");
  const [chartType, setChartType] = useState<ChartType>("area");
  const [activeTab, setActiveTab] = useState<"chart" | "orderbook">("chart");

  // Indicator Toggles
  const [showMA20, setShowMA20] = useState(true);
  const [showMA50, setShowMA50] = useState(true);
  const [showVolume, setShowVolume] = useState(true);
  const [showMACD, setShowMACD] = useState(false);
  const [showBB, setShowBB] = useState(false);

  // Chart data state
  const [chartData, setChartData] = useState<CandleData[]>([]);

  // AI Analyst state
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Regenerate candle series when symbol or timeframe changes
  useEffect(() => {
    if (symbol) {
      const data = generateCandleSeries(symbol, timeframe);
      setChartData(data);
      setAiAnalysis(null);
      setAiError(null);
    }
  }, [symbol, timeframe]);

  const isStarred = watchlist.includes(symbol.symbol);
  const isPositive = symbol.change >= 0;

  // Handle server-side Gemini AI request
  const fetchAiInsight = async () => {
    setLoadingAi(true);
    setAiError(null);
    try {
      const res = await fetch("/api/ai-insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbol: symbol.symbol,
          name: symbol.name,
          price: symbol.price,
          change: symbol.changePercent,
          category: symbol.category,
          timeframe,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to fetch AI analysis.");
      }
      setAiAnalysis(json.analysis);
    } catch (err: any) {
      setAiError(err.message || "An unexpected error occurred.");
    } finally {
      setLoadingAi(false);
    }
  };

  // Min/Max bounds for YAxis scaling
  const prices = chartData.map((d) => d.close);
  const minPrice = Math.min(...prices, symbol.low) * 0.995;
  const maxPrice = Math.max(...prices, symbol.high) * 1.005;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 md:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className={`rounded-2xl border shadow-2xl w-full max-w-5xl my-auto overflow-hidden flex flex-col max-h-[92vh] ${
        isDark ? "bg-[#1e222d] border-[#2a2e39] text-white" : "bg-white border-[#E0E3EB] text-[#191b24]"
      }`}>
        {/* Modal Top Header */}
        <div className={`px-4 md:px-6 py-4 flex items-center justify-between gap-4 border-b ${
          isDark ? "bg-[#131722] border-[#2a2e39]" : "bg-[#FAF8FF] border-[#E0E3EB]"
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2962ff] text-white flex items-center justify-center font-bold text-xs font-mono shrink-0 shadow-sm">
              {symbol.badge}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg md:text-xl font-bold font-headline">
                  {symbol.name}
                </h2>
                <span className="text-xs font-mono bg-[#2962ff]/10 text-[#2962ff] px-2 py-0.5 rounded font-bold">
                  {symbol.symbol}
                </span>
              </div>
              <p className="text-xs text-[#6A6D78]">{symbol.category} Market</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Paper Trade Trigger */}
            {onOpenPaperTrade && (
              <button
                onClick={() => onOpenPaperTrade(symbol)}
                className="hidden sm:flex items-center gap-1.5 bg-[#089981] hover:bg-[#067a67] text-white px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all active:scale-95 shadow-sm"
              >
                <Briefcase className="w-4 h-4" />
                <span>Trade Order</span>
              </button>
            )}

            {/* Star Watchlist */}
            <button
              onClick={(e) => onToggleWatchlist(symbol.symbol, e)}
              className="p-2 text-[#6A6D78] hover:text-amber-500 hover:bg-[#2a2e39] rounded-full transition-colors"
              title={isStarred ? "Remove from Watchlist" : "Add to Watchlist"}
            >
              <Star
                className={`w-5 h-5 ${
                  isStarred ? "fill-amber-400 text-amber-500" : ""
                }`}
              />
            </button>

            {/* Close Modal */}
            <button
              onClick={onClose}
              className="p-2 text-[#6A6D78] hover:text-white rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 md:p-6 overflow-y-auto space-y-6">
          {/* Price Header & Tab Switcher */}
          <div className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
            isDark ? "bg-[#131722] border-[#2a2e39]" : "bg-[#F0F3FA] border-[#E0E3EB]"
          }`}>
            <div>
              <div className="text-2xl md:text-3xl font-bold font-mono">
                {symbol.unit === "%" ? "" : "$"}
                {symbol.price.toLocaleString(undefined, {
                  minimumFractionDigits: symbol.price < 10 ? 3 : 2,
                })}
                {symbol.unit ? ` ${symbol.unit}` : ""}
              </div>
              <div
                className={`text-sm font-semibold font-mono flex items-center gap-1 mt-0.5 ${
                  isPositive ? "text-[#089981]" : "text-[#F23645]"
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>
                  {isPositive ? "+" : ""}
                  {symbol.change} ({isPositive ? "+" : ""}
                  {symbol.changePercent}%)
                </span>
                <span className="text-[#6A6D78] text-xs ml-2 font-normal">
                  Real-Time Feed
                </span>
              </div>
            </div>

            {/* Main Tab Switcher (Interactive Chart vs Level 2 Order Book) */}
            <div className={`flex items-center p-1 rounded-xl border text-xs font-mono font-bold ${
              isDark ? "bg-[#1e222d] border-[#2a2e39]" : "bg-white border-[#E0E3EB]"
            }`}>
              <button
                onClick={() => setActiveTab("chart")}
                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                  activeTab === "chart"
                    ? "bg-[#2962ff] text-white shadow-sm"
                    : "text-[#6A6D78] hover:text-white"
                }`}
              >
                <BarChart2 className="w-4 h-4" />
                <span>Interactive Chart</span>
              </button>
              <button
                onClick={() => setActiveTab("orderbook")}
                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                  activeTab === "orderbook"
                    ? "bg-[#2962ff] text-white shadow-sm"
                    : "text-[#6A6D78] hover:text-white"
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Level 2 Depth</span>
              </button>
            </div>
          </div>

          {activeTab === "orderbook" ? (
            <OrderBookWidget symbol={symbol} isDark={isDark} />
          ) : (
            <>
              {/* Interactive Chart Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E0E3EB] dark:border-[#2a2e39] pb-3">
                {/* Timeframe Selectors */}
                <div className={`flex items-center gap-1 p-1 rounded-lg border font-mono text-xs ${
                  isDark ? "bg-[#131722] border-[#2a2e39]" : "bg-[#F0F3FA] border-[#E0E3EB]"
                }`}>
                  {(["1D", "5D", "1M", "6M", "YTD", "1Y", "5Y", "ALL"] as Timeframe[]).map(
                    (tf) => (
                      <button
                        key={tf}
                        onClick={() => setTimeframe(tf)}
                        className={`px-2.5 py-1 rounded-md text-xs font-mono font-semibold transition-all ${
                          timeframe === tf
                            ? "bg-[#2962ff] text-white shadow-xs"
                            : "text-[#6A6D78] hover:text-[#191b24] dark:hover:text-white"
                        }`}
                      >
                        {tf}
                      </button>
                    )
                  )}
                </div>

                {/* Technical Indicator Toggles */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => setShowMA20(!showMA20)}
                    className={`px-2 py-1 rounded-lg text-xs font-mono border transition-all ${
                      showMA20
                        ? "bg-[#2962ff]/20 border-[#2962ff] text-[#2962ff] font-bold"
                        : "bg-[#131722] border-[#2a2e39] text-[#6A6D78]"
                    }`}
                  >
                    MA20
                  </button>
                  <button
                    onClick={() => setShowMA50(!showMA50)}
                    className={`px-2 py-1 rounded-lg text-xs font-mono border transition-all ${
                      showMA50
                        ? "bg-purple-500/20 border-purple-500 text-purple-400 font-bold"
                        : "bg-[#131722] border-[#2a2e39] text-[#6A6D78]"
                    }`}
                  >
                    MA50
                  </button>
                  <button
                    onClick={() => setShowBB(!showBB)}
                    className={`px-2 py-1 rounded-lg text-xs font-mono border transition-all ${
                      showBB
                        ? "bg-cyan-500/20 border-cyan-500 text-cyan-400 font-bold"
                        : "bg-[#131722] border-[#2a2e39] text-[#6A6D78]"
                    }`}
                  >
                    Bollinger Bands
                  </button>
                  <button
                    onClick={() => setShowMACD(!showMACD)}
                    className={`px-2 py-1 rounded-lg text-xs font-mono border transition-all ${
                      showMACD
                        ? "bg-amber-500/20 border-amber-500 text-amber-400 font-bold"
                        : "bg-[#131722] border-[#2a2e39] text-[#6A6D78]"
                    }`}
                  >
                    MACD
                  </button>
                </div>
              </div>

              {/* Chart Canvas */}
              <div className={`w-full h-72 md:h-80 rounded-xl border p-2 relative ${
                isDark ? "bg-[#131722] border-[#2a2e39]" : "bg-white border-[#E0E3EB]"
              }`}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor={isPositive ? "#089981" : "#F23645"}
                          stopOpacity={0.35}
                        />
                        <stop
                          offset="95%"
                          stopColor={isPositive ? "#089981" : "#F23645"}
                          stopOpacity={0.0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#2a2e39" : "#f0f0f0"} />
                    <XAxis dataKey="time" stroke="#737687" fontSize={11} tickLine={false} />
                    <YAxis domain={[minPrice, maxPrice]} stroke="#737687" fontSize={11} orientation="right" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? "#1e222d" : "#191b24",
                        color: "#ffffff",
                        borderRadius: "8px",
                        fontSize: "12px",
                        border: "none",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="close"
                      stroke={isPositive ? "#089981" : "#F23645"}
                      fillOpacity={1}
                      fill="url(#priceGradient)"
                      strokeWidth={2}
                    />
                    {showMA20 && (
                      <Line type="monotone" dataKey="ma20" stroke="#2962ff" strokeWidth={1.5} dot={false} />
                    )}
                    {showMA50 && (
                      <Line type="monotone" dataKey="ma50" stroke="#a855f7" strokeWidth={1.5} dot={false} />
                    )}
                    {showBB && (
                      <>
                        <Line type="monotone" dataKey="bbUpper" stroke="#06b6d4" strokeDasharray="2 2" strokeWidth={1} dot={false} />
                        <Line type="monotone" dataKey="bbLower" stroke="#06b6d4" strokeDasharray="2 2" strokeWidth={1} dot={false} />
                      </>
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </>
          )}

          {/* Gemini AI Financial Analyst Section */}
          <div className={`p-5 rounded-2xl border space-y-4 ${
            isDark ? "bg-[#131722] border-[#2a2e39]" : "bg-gradient-to-r from-blue-50 to-indigo-50/50 border-blue-200"
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#2962ff] text-white rounded-lg">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-base font-headline flex items-center gap-2">
                    AI Institutional Strategist
                    <span className="text-[10px] font-mono uppercase bg-[#2962ff]/10 text-[#0049db] dark:text-[#2962ff] px-2 py-0.5 rounded font-bold">
                      Gemini 3.6 Flash
                    </span>
                  </h3>
                  <p className="text-xs text-[#6A6D78]">
                    Real-time technical indicators, fundamental catalysts & market sentiment breakdown.
                  </p>
                </div>
              </div>

              <button
                onClick={fetchAiInsight}
                disabled={loadingAi}
                className="flex items-center gap-2 bg-[#2962ff] hover:bg-[#0049db] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md active:scale-95 transition-all disabled:opacity-50"
              >
                {loadingAi ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{aiAnalysis ? "Refresh Analysis" : "Generate Institutional Analysis"}</span>
                  </>
                )}
              </button>
            </div>

            {/* Error view */}
            {aiError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{aiError}</span>
              </div>
            )}

            {/* AI Analysis Result */}
            {aiAnalysis ? (
              <div className={`rounded-xl p-4 border text-xs md:text-sm space-y-3 leading-relaxed whitespace-pre-wrap font-sans ${
                isDark ? "bg-[#1e222d] border-[#2a2e39] text-white" : "bg-white border-blue-100 text-[#191b24]"
              }`}>
                {aiAnalysis}
              </div>
            ) : !loadingAi && (
              <div className="text-center py-6 border border-dashed border-[#2a2e39] rounded-xl text-xs text-[#6A6D78] space-y-1">
                <p className="font-medium">Click to query Gemini for real-time market report on {symbol.name}</p>
                <p>Includes support & resistance levels, risk factors, and momentum ratings.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

