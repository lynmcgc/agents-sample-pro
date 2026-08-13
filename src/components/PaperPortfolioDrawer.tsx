import React from "react";
import { PaperTrade } from "../types";
import { X, Briefcase, TrendingUp, TrendingDown, CheckCircle } from "lucide-react";

interface PaperPortfolioDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  trades: PaperTrade[];
  onCloseTrade: (id: string) => void;
  isDark: boolean;
}

export const PaperPortfolioDrawer: React.FC<PaperPortfolioDrawerProps> = ({
  isOpen,
  onClose,
  trades,
  onCloseTrade,
  isDark,
}) => {
  if (!isOpen) return null;

  const openTrades = trades.filter((t) => t.status === "OPEN");
  const closedTrades = trades.filter((t) => t.status === "CLOSED");

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className={`w-full max-w-md h-full border-l shadow-2xl flex flex-col ${
        isDark ? "bg-[#131722] border-[#2a2e39] text-white" : "bg-white border-[#E0E3EB] text-[#191b24]"
      }`}>
        {/* Header */}
        <div className={`p-4 border-b flex items-center justify-between ${
          isDark ? "bg-[#1e222d] border-[#2a2e39]" : "bg-[#FAF8FF] border-[#E0E3EB]"
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#089981] text-white rounded-lg">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base font-headline">Simulated Paper Portfolio</h3>
              <p className="text-xs text-[#6A6D78]">{openTrades.length} Active Positions</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 text-[#6A6D78] hover:text-white rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Trades */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3">
          {trades.length === 0 ? (
            <div className="text-center py-12 text-[#6A6D78] space-y-2">
              <Briefcase className="w-12 h-12 mx-auto text-[#2a2e39]" />
              <p className="text-xs font-semibold">No open paper positions</p>
              <p className="text-[11px]">Click on any instrument in the market table to place a simulated order.</p>
            </div>
          ) : (
            trades.map((t) => {
              const isBuy = t.type === "BUY";
              return (
                <div
                  key={t.id}
                  className={`p-3.5 rounded-xl border space-y-2 font-mono text-xs ${
                    isDark ? "bg-[#1e222d] border-[#2a2e39]" : "bg-[#FAF8FF] border-[#E0E3EB]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        isBuy ? "bg-[#089981]/20 text-[#089981]" : "bg-[#F23645]/20 text-[#F23645]"
                      }`}>
                        {t.type}
                      </span>
                      <span className="font-bold text-sm">{t.symbol}</span>
                    </div>
                    <span className="text-[10px] text-[#6A6D78]">{t.timestamp}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                    <div>
                      <span className="text-[#6A6D78] block">Entry Price</span>
                      <span className="font-bold">${t.entryPrice.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[#6A6D78] block">Quantity</span>
                      <span className="font-bold">{t.amount}</span>
                    </div>
                  </div>

                  {t.status === "OPEN" ? (
                    <button
                      onClick={() => onCloseTrade(t.id)}
                      className="w-full mt-2 py-1.5 bg-[#F23645]/10 hover:bg-[#F23645] text-[#F23645] hover:text-white rounded-lg text-xs font-bold transition-all"
                    >
                      Close Position
                    </button>
                  ) : (
                    <div className="text-center py-1 bg-gray-500/10 text-gray-400 rounded text-[10px] font-bold">
                      POSITION CLOSED
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
