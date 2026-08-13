import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { IndicesGrid } from "./components/IndicesGrid";
import { MarketTables } from "./components/MarketTables";
import { NewsAndIdeas } from "./components/NewsAndIdeas";
import { SymbolModal } from "./components/SymbolModal";
import { SearchModal } from "./components/SearchModal";
import { WatchlistDrawer } from "./components/WatchlistDrawer";
import { MultiChartView } from "./components/MultiChartView";
import { ProPaperTradingModal } from "./components/ProPaperTradingModal";
import { PaperPortfolioDrawer } from "./components/PaperPortfolioDrawer";
import { ShortcutsModal } from "./components/ShortcutsModal";
import { DisqusForum } from "./components/DisqusForum";
import { Footer } from "./components/Footer";
import { MARKET_SYMBOLS } from "./data/marketData";
import { MarketCategory, MarketSymbol, ViewMode, PaperTrade } from "./types";

export default function App() {
  const [activeCategory, setActiveCategory] = useState<MarketCategory>("US stocks");
  const [selectedSymbol, setSelectedSymbol] = useState<MarketSymbol | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);

  // Pro Features State
  const [isDark, setIsDark] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<ViewMode>("overview");
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);

  // Paper Trading State
  const [paperTrades, setPaperTrades] = useState<PaperTrade[]>([]);
  const [paperModalSymbol, setPaperModalSymbol] = useState<MarketSymbol | null>(null);
  const [isPaperDrawerOpen, setIsPaperDrawerOpen] = useState<boolean>(false);

  // Sync Dark Mode class with root HTML document
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  // Watchlist persistent local storage
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("tradingview_watchlist");
      return saved ? JSON.parse(saved) : ["SPX", "NASDAQ:NDX", "BTCUSD", "AAPL", "NVDA"];
    } catch {
      return ["SPX", "NASDAQ:NDX", "BTCUSD", "AAPL", "NVDA"];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("tradingview_watchlist", JSON.stringify(watchlist));
    } catch (e) {
      console.error("Failed to save watchlist to localStorage:", e);
    }
  }, [watchlist]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (e.key === "?") {
        setIsShortcutsOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setIsSearchOpen(false);
        setIsWatchlistOpen(false);
        setSelectedSymbol(null);
        setPaperModalSymbol(null);
        setIsPaperDrawerOpen(false);
        setIsShortcutsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleWatchlist = (symbolStr: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setWatchlist((prev) =>
      prev.includes(symbolStr)
        ? prev.filter((s) => s !== symbolStr)
        : [...prev, symbolStr]
    );
  };

  const handleExecutePaperTrade = (trade: PaperTrade) => {
    setPaperTrades((prev) => [trade, ...prev]);
  };

  const handleClosePaperTrade = (id: string) => {
    setPaperTrades((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "CLOSED" } : t))
    );
  };

  return (
    <div className={`min-h-screen transition-colors font-body-md antialiased flex flex-col selection:bg-[#2962ff] selection:text-white ${
      isDark ? "bg-[#131722] text-white" : "bg-[#faf8ff] text-[#191b24]"
    }`}>
      {/* Top Navigation */}
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenWatchlist={() => setIsWatchlistOpen(true)}
        watchlistCount={watchlist.length}
        isDark={isDark}
        onToggleDark={() => setIsDark((prev) => !prev)}
        viewMode={viewMode}
        onSelectViewMode={setViewMode}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        paperTradeCount={paperTrades.filter((t) => t.status === "OPEN").length}
        onOpenPaperPortfolio={() => setIsPaperDrawerOpen(true)}
      />

      {/* Main Content Area */}
      <main className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8 flex-1">
        {viewMode === "multichart" ? (
          <MultiChartView
            symbols={MARKET_SYMBOLS}
            onSelectSymbol={setSelectedSymbol}
            isDark={isDark}
          />
        ) : (
          <>
            {/* Hero Section & Category Tabs */}
            <HeroSection
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
              symbols={MARKET_SYMBOLS}
              onSelectSymbol={setSelectedSymbol}
            />

            {/* Featured Indices / Instruments Grid */}
            <IndicesGrid
              activeCategory={activeCategory}
              symbols={MARKET_SYMBOLS}
              onSelectSymbol={setSelectedSymbol}
              watchlist={watchlist}
              onToggleWatchlist={toggleWatchlist}
            />

            {/* Screener & Leaderboard Tables */}
            <MarketTables
              symbols={MARKET_SYMBOLS}
              onSelectSymbol={setSelectedSymbol}
              watchlist={watchlist}
              onToggleWatchlist={toggleWatchlist}
            />

            {/* Market News & Trading Ideas */}
            <NewsAndIdeas />
          </>
        )}

        {/* Disqus Discussion Forum */}
        <DisqusForum isDark={isDark} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Overlays */}
      <SymbolModal
        symbol={selectedSymbol}
        onClose={() => setSelectedSymbol(null)}
        watchlist={watchlist}
        onToggleWatchlist={toggleWatchlist}
        isDark={isDark}
        onOpenPaperTrade={(sym) => setPaperModalSymbol(sym)}
      />

      <ProPaperTradingModal
        symbol={paperModalSymbol}
        onClose={() => setPaperModalSymbol(null)}
        onExecuteTrade={handleExecutePaperTrade}
        isDark={isDark}
      />

      <PaperPortfolioDrawer
        isOpen={isPaperDrawerOpen}
        onClose={() => setIsPaperDrawerOpen(false)}
        trades={paperTrades}
        onCloseTrade={handleClosePaperTrade}
        isDark={isDark}
      />

      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
        isDark={isDark}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        symbols={MARKET_SYMBOLS}
        onSelectSymbol={setSelectedSymbol}
      />

      <WatchlistDrawer
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        watchlist={watchlist}
        symbols={MARKET_SYMBOLS}
        onSelectSymbol={setSelectedSymbol}
        onRemoveFromWatchlist={(symbolStr) =>
          setWatchlist((prev) => prev.filter((s) => s !== symbolStr))
        }
      />
    </div>
  );
}

