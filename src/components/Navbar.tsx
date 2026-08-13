import React, { useState } from "react";
import { Search, Globe, User, Star, Moon, Sun, LayoutGrid, Monitor, HelpCircle, Briefcase } from "lucide-react";
import { ViewMode } from "../types";

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenWatchlist: () => void;
  watchlistCount: number;
  isDark: boolean;
  onToggleDark: () => void;
  viewMode: ViewMode;
  onSelectViewMode: (mode: ViewMode) => void;
  onOpenShortcuts: () => void;
  paperTradeCount: number;
  onOpenPaperPortfolio: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSearch,
  onOpenWatchlist,
  watchlistCount,
  isDark,
  onToggleDark,
  viewMode,
  onSelectViewMode,
  onOpenShortcuts,
  paperTradeCount,
  onOpenPaperPortfolio,
}) => {
  const [activeNav, setActiveNav] = useState("Markets");
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [currentLang, setCurrentLang] = useState("EN");

  const languages = [
    { code: "EN", name: "English" },
    { code: "ES", name: "Español" },
    { code: "DE", name: "Deutsch" },
    { code: "FR", name: "Français" },
    { code: "JP", name: "日本語" },
  ];

  return (
    <header
      className={`border-b flex justify-between items-center w-full px-4 md:px-8 h-13 sticky top-0 z-40 transition-colors ${
        isDark
          ? "bg-[#131722] border-[#2a2e39] text-white"
          : "bg-[#faf8ff] border-[#c3c5d8] text-[#191b24]"
      }`}
    >
      {/* Left section: Logo, Pro Badge, View Selector, Search */}
      <div className="flex items-center gap-4 lg:gap-6">
        <a
          href="/"
          onClick={(e) => e.preventDefault()}
          className="text-xl font-bold font-headline flex items-center gap-1.5 hover:opacity-90 transition-opacity shrink-0"
        >
          <span className="material-symbols-outlined text-[#0049db] dark:text-[#2962ff] font-bold text-2xl">
            stacked_line_chart
          </span>
          <span className="tracking-tight hidden sm:inline">TradingView</span>
          <span className="bg-[#2962ff] text-white text-[10px] font-mono uppercase font-extrabold px-1.5 py-0.5 rounded tracking-widest shadow-xs">
            PRO
          </span>
        </a>

        {/* View Mode Toolbar */}
        <div className={`hidden md:flex items-center p-1 rounded-xl border text-xs font-mono ${
          isDark ? "bg-[#1e222d] border-[#2a2e39]" : "bg-[#F0F3FA] border-[#E0E3EB]"
        }`}>
          <button
            onClick={() => onSelectViewMode("overview")}
            className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              viewMode === "overview"
                ? "bg-[#2962ff] text-white shadow-xs"
                : "text-[#6A6D78] hover:text-[#191b24] dark:hover:text-white"
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Markets</span>
          </button>
          <button
            onClick={() => onSelectViewMode("multichart")}
            className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              viewMode === "multichart"
                ? "bg-[#2962ff] text-white shadow-xs"
                : "text-[#6A6D78] hover:text-[#191b24] dark:hover:text-white"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Multi-Chart</span>
          </button>
        </div>

        {/* Quick Search Trigger */}
        <div className="relative hidden xl:flex items-center">
          <button
            onClick={onOpenSearch}
            className={`flex items-center gap-2 pl-3 pr-4 py-1.5 border rounded-full text-xs transition-all w-60 text-left group ${
              isDark
                ? "bg-[#1e222d] border-[#2a2e39] text-gray-300 hover:border-[#2962ff]"
                : "bg-[#F0F3FA] border-[#E0E3EB] text-[#434656] hover:border-[#0049db] hover:bg-white"
            }`}
          >
            <Search className="w-4 h-4 text-[#6A6D78] group-hover:text-[#2962ff] transition-colors" />
            <span className="flex-1 text-[#6A6D78]">Search (Ctrl+K)</span>
            <kbd className="text-[10px] font-mono px-1.5 py-0.5 border rounded text-[#6A6D78] bg-transparent">
              ⌘K
            </kbd>
          </button>
        </div>
      </div>

      {/* Right section: Theme Toggle, Paper Portfolio, Watchlist, Shortcuts */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Pro Theme Switcher Button */}
        <button
          onClick={onToggleDark}
          className={`p-2 rounded-full border transition-all ${
            isDark
              ? "bg-[#1e222d] border-[#2a2e39] text-amber-400 hover:bg-[#2a2e39]"
              : "bg-[#F0F3FA] border-[#E0E3EB] text-[#434656] hover:bg-[#E0E3EB]"
          }`}
          title={isDark ? "Switch to Pro Light Theme" : "Switch to Pro Dark Terminal Theme"}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Paper Trade Portfolio Button */}
        <button
          onClick={onOpenPaperPortfolio}
          className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
            isDark
              ? "bg-[#1e222d] border-[#2a2e39] text-emerald-400 hover:border-emerald-500"
              : "bg-[#089981]/10 border-[#089981]/30 text-[#089981] hover:bg-[#089981]/20"
          }`}
          title="Paper Trading Portfolio"
        >
          <Briefcase className="w-4 h-4" />
          <span className="hidden sm:inline">Paper Trade</span>
          {paperTradeCount > 0 && (
            <span className="bg-[#089981] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full font-mono">
              {paperTradeCount}
            </span>
          )}
        </button>

        {/* Mobile Search Button */}
        <button
          onClick={onOpenSearch}
          className="xl:hidden p-2 text-[#6A6D78] hover:text-[#2962ff] transition-colors rounded-full hover:bg-[#F0F3FA] dark:hover:bg-[#1e222d]"
          title="Search Markets"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Watchlist Drawer Button */}
        <button
          onClick={onOpenWatchlist}
          className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
            isDark
              ? "bg-[#1e222d] text-white hover:bg-[#2a2e39]"
              : "bg-[#F0F3FA] text-[#434656] hover:text-[#0049db] hover:bg-[#E0E3EB]"
          }`}
          title="My Watchlist"
        >
          <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
          <span className="hidden sm:inline">Watchlist</span>
          {watchlistCount > 0 && (
            <span className="bg-[#2962ff] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full font-mono">
              {watchlistCount}
            </span>
          )}
        </button>

        {/* Shortcuts Cheat Sheet */}
        <button
          onClick={onOpenShortcuts}
          className="p-2 text-[#6A6D78] hover:text-[#2962ff] transition-colors rounded-full hover:bg-[#F0F3FA] dark:hover:bg-[#1e222d]"
          title="Keyboard Shortcuts (?)"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* User Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            aria-label="User Profile"
            className="text-[#6A6D78] hover:text-[#2962ff] transition-colors p-1.5 rounded-full hover:bg-[#F0F3FA] dark:hover:bg-[#1e222d]"
          >
            <User className="w-5 h-5" />
          </button>

          {showUserMenu && (
            <div className={`absolute right-0 mt-2 w-52 border rounded-xl shadow-2xl py-2 z-50 ${
              isDark ? "bg-[#1e222d] border-[#2a2e39] text-white" : "bg-white border-[#E0E3EB] text-[#191b24]"
            }`}>
              <div className="px-4 py-2 border-b border-[#E0E3EB] dark:border-[#2a2e39]">
                <p className="text-xs font-bold font-headline flex items-center gap-1.5">
                  Trader Pro Institutional
                  <span className="bg-amber-400 text-black text-[9px] font-mono px-1 py-0.2 rounded font-extrabold">
                    PRO+
                  </span>
                </p>
                <p className="text-[11px] text-[#6A6D78]">rhondamcgladdery@gmail.com</p>
              </div>
              <a
                href="#profile"
                onClick={(e) => { e.preventDefault(); setShowUserMenu(false); }}
                className="block px-4 py-2 text-xs hover:bg-[#2962ff]/10 text-inherit"
              >
                Pro Terminal Preferences
              </a>
              <a
                href="#alerts"
                onClick={(e) => { e.preventDefault(); setShowUserMenu(false); }}
                className="block px-4 py-2 text-xs hover:bg-[#2962ff]/10 text-inherit"
              >
                Level 2 Price Alerts
              </a>
              <a
                href="#billing"
                onClick={(e) => { e.preventDefault(); setShowUserMenu(false); }}
                className="block px-4 py-2 text-xs hover:bg-[#2962ff]/10 text-inherit"
              >
                Subscription: <span className="text-[#089981] font-bold">Active Pro+</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

