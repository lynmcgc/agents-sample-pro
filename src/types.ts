export type MarketCategory =
  | "US stocks"
  | "World stocks"
  | "Crypto"
  | "Futures"
  | "Forex"
  | "Government bonds"
  | "Corporate bonds"
  | "ETFs"
  | "Economy";

export type Timeframe = "1D" | "5D" | "1M" | "6M" | "YTD" | "1Y" | "5Y" | "ALL";

export type ChartType = "area" | "line" | "candlestick";

export type ViewMode = "overview" | "multichart" | "screener" | "depth";

export interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  ma20?: number;
  ma50?: number;
  rsi?: number;
  macd?: number;
  signal?: number;
  hist?: number;
  bbUpper?: number;
  bbLower?: number;
}

export interface OrderBookEntry {
  price: number;
  size: number;
  total: number;
  percent: number;
}

export interface OrderBookData {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  spread: number;
  spreadPercent: number;
}

export interface MarketSymbol {
  symbol: string;
  name: string;
  badge: string;
  badgeColor?: "red" | "blue" | "green" | "orange" | "purple" | "gray";
  category: MarketCategory;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: string;
  marketCap?: string;
  peRatio?: number;
  yearHigh?: number;
  yearLow?: number;
  unit?: string;
  sparkline: number[];
  description: string;
  bid?: number;
  ask?: number;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  timeAgo: string;
  category: string;
  sentiment: "bullish" | "bearish" | "neutral";
  relatedSymbol?: string;
}

export interface MarketIdea {
  id: string;
  author: string;
  authorAvatar: string;
  title: string;
  symbol: string;
  timeframe: string;
  likes: number;
  comments: number;
  timeAgo: string;
  direction: "Long" | "Short" | "Neutral";
  summary: string;
}

export interface PaperTrade {
  id: string;
  symbol: string;
  type: "BUY" | "SELL";
  entryPrice: number;
  amount: number;
  stopLoss?: number;
  takeProfit?: number;
  timestamp: string;
  status: "OPEN" | "CLOSED";
  pnl?: number;
}

