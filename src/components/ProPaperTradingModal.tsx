import React, { useState } from "react";
import { MarketSymbol, PaperTrade } from "../types";
import { X, ShieldCheck, DollarSign, TrendingUp, TrendingDown, CheckCircle2, ArrowRight } from "lucide-react";

interface ProPaperTradingModalProps {
  symbol: MarketSymbol | null;
  onClose: () => void;
  onExecuteTrade: (trade: PaperTrade) => void;
  isDark: boolean;
}

export const ProPaperTradingModal: React.FC<ProPaperTradingModalProps> = ({
  symbol,
  onClose,
  onExecuteTrade,
  isDark,
}) => {
  if (!symbol) return null;

  const [tradeType, setTradeType] = useState<"BUY" | "SELL">("BUY");
  const [amount, setAmount] = useState<number>(1);
  const [useStopLoss, setUseStopLoss] = useState<boolean>(true);
  const [useTakeProfit, setUseTakeProfit] = useState<boolean>(true);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Auto-calculate risk parameters
  const entryPrice = symbol.price;
  const stopLossPrice = tradeType === "BUY" ? entryPrice * 0.97 : entryPrice * 1.03;
  const takeProfitPrice = tradeType === "BUY" ? entryPrice * 1.06 : entryPrice * 0.94;

  const totalCost = Number((entryPrice * amount).toFixed(2));
  const estimatedProfit = Number((Math.abs(takeProfitPrice - entryPrice) * amount).toFixed(2));
  const maxRisk = Number((Math.abs(entryPrice - stopLossPrice) * amount).toFixed(2));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTrade: PaperTrade = {
      id: "trade-" + Date.now(),
      symbol: symbol.symbol,
      type: tradeType,
      entryPrice,
      amount,
      stopLoss: useStopLoss ? Number(stopLossPrice.toFixed(2)) : undefined,
      takeProfit: useTakeProfit ? Number(takeProfitPrice.toFixed(2)) : undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "OPEN",
      pnl: 0,
    };

    onExecuteTrade(newTrade);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className={`rounded-2xl border shadow-2xl w-full max-w-lg overflow-hidden flex flex-col ${
        isDark ? "bg-[#1e222d] border-[#2a2e39] text-white" : "bg-white border-[#E0E3EB] text-[#191b24]"
      }`}>
        {/* Header */}
        <div className={`p-4 border-b flex items-center justify-between ${
          isDark ? "bg-[#131722] border-[#2a2e39]" : "bg-[#FAF8FF] border-[#E0E3EB]"
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#2962ff] text-white flex items-center justify-center font-bold text-xs font-mono">
              {symbol.badge}
            </div>
            <div>
              <h3 className="font-bold text-base font-headline flex items-center gap-2">
                Order Ticket: {symbol.symbol}
              </h3>
              <p className="text-xs text-[#6A6D78]">Pro Simulated Paper Execution</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#6A6D78] hover:text-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {isSubmitted ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-[#089981] mx-auto animate-bounce" />
            <h4 className="font-bold text-lg font-headline">Simulated Order Executed!</h4>
            <p className="text-xs text-[#6A6D78]">
              {tradeType} {amount} shares of {symbol.symbol} @ ${entryPrice.toLocaleString()} added to portfolio.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* BUY / SELL Switcher */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-[#131722] rounded-xl border border-[#2a2e39]">
              <button
                type="button"
                onClick={() => setTradeType("BUY")}
                className={`py-2 rounded-lg font-bold text-xs font-mono transition-all flex items-center justify-center gap-1.5 ${
                  tradeType === "BUY"
                    ? "bg-[#089981] text-white shadow-md"
                    : "text-[#6A6D78] hover:text-white"
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                BUY / LONG
              </button>
              <button
                type="button"
                onClick={() => setTradeType("SELL")}
                className={`py-2 rounded-lg font-bold text-xs font-mono transition-all flex items-center justify-center gap-1.5 ${
                  tradeType === "SELL"
                    ? "bg-[#F23645] text-white shadow-md"
                    : "text-[#6A6D78] hover:text-white"
                }`}
              >
                <TrendingDown className="w-4 h-4" />
                SELL / SHORT
              </button>
            </div>

            {/* Inputs: Units / Amount */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-[#6A6D78] uppercase font-semibold flex justify-between">
                <span>Quantity (Units)</span>
                <span>Current Price: ${entryPrice.toLocaleString()}</span>
              </label>
              <input
                type="number"
                min="0.01"
                step="any"
                value={amount}
                onChange={(e) => setAmount(Math.max(0.01, parseFloat(e.target.value) || 1))}
                className={`w-full p-2.5 rounded-xl border text-sm font-mono font-bold outline-none ${
                  isDark
                    ? "bg-[#131722] border-[#2a2e39] text-white"
                    : "bg-[#F0F3FA] border-[#E0E3EB] text-[#191b24]"
                }`}
              />
            </div>

            {/* Risk Control Toggles */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className={`p-3 rounded-xl border space-y-1 ${
                isDark ? "bg-[#131722] border-[#2a2e39]" : "bg-[#FAF8FF] border-[#E0E3EB]"
              }`}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[#F23645] font-bold">Stop Loss</span>
                  <input
                    type="checkbox"
                    checked={useStopLoss}
                    onChange={(e) => setUseStopLoss(e.target.checked)}
                    className="accent-[#F23645]"
                  />
                </div>
                <div className="text-sm font-bold font-mono text-red-500">
                  ${stopLossPrice.toFixed(2)} (-3%)
                </div>
                <div className="text-[10px] text-[#6A6D78]">Max Risk: ${maxRisk}</div>
              </div>

              <div className={`p-3 rounded-xl border space-y-1 ${
                isDark ? "bg-[#131722] border-[#2a2e39]" : "bg-[#FAF8FF] border-[#E0E3EB]"
              }`}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[#089981] font-bold">Take Profit</span>
                  <input
                    type="checkbox"
                    checked={useTakeProfit}
                    onChange={(e) => setUseTakeProfit(e.target.checked)}
                    className="accent-[#089981]"
                  />
                </div>
                <div className="text-sm font-bold font-mono text-emerald-500">
                  ${takeProfitPrice.toFixed(2)} (+6%)
                </div>
                <div className="text-[10px] text-[#6A6D78]">Target Profit: ${estimatedProfit}</div>
              </div>
            </div>

            {/* Total Order Summary */}
            <div className={`p-3 rounded-xl border flex items-center justify-between font-mono text-xs ${
              isDark ? "bg-[#131722] border-[#2a2e39]" : "bg-[#F0F3FA] border-[#E0E3EB]"
            }`}>
              <span className="text-[#6A6D78]">Total Order Value:</span>
              <span className="font-bold text-sm text-[#2962ff]">${totalCost.toLocaleString()}</span>
            </div>

            {/* Execute Button */}
            <button
              type="submit"
              className={`w-full py-3 rounded-xl font-bold font-mono text-xs uppercase text-white shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2 ${
                tradeType === "BUY" ? "bg-[#089981] hover:bg-[#067a67]" : "bg-[#F23645] hover:bg-[#c92a37]"
              }`}
            >
              <span>Execute Simulated {tradeType} Order</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
