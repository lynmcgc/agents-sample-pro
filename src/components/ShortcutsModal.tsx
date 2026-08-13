import React from "react";
import { X, Command, Keyboard } from "lucide-react";

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose, isDark }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: "Ctrl + K / ⌘K", desc: "Global Market & Symbol Quick Search" },
    { key: "Esc", desc: "Close Modals or Drawers" },
    { key: "?", desc: "Toggle Keyboard Shortcuts Cheat Sheet" },
    { key: "1 / 2 / 3", desc: "Switch Tab Views in Symbol Detail" },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className={`rounded-2xl border shadow-2xl w-full max-w-md overflow-hidden ${
        isDark ? "bg-[#1e222d] border-[#2a2e39] text-white" : "bg-white border-[#E0E3EB] text-[#191b24]"
      }`}>
        <div className={`p-4 border-b flex items-center justify-between ${
          isDark ? "bg-[#131722] border-[#2a2e39]" : "bg-[#FAF8FF] border-[#E0E3EB]"
        }`}>
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-[#2962ff]" />
            <h3 className="font-bold text-base font-headline">Terminal Keyboard Shortcuts</h3>
          </div>
          <button onClick={onClose} className="p-1 text-[#6A6D78] hover:text-white rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-3">
          {shortcuts.map((sc, i) => (
            <div key={i} className="flex items-center justify-between text-xs py-1.5 border-b border-[#2a2e39]/30 last:border-0">
              <span className="text-[#6A6D78]">{sc.desc}</span>
              <kbd className="px-2 py-1 rounded font-mono font-bold text-[11px] bg-[#2962ff]/10 text-[#2962ff] border border-[#2962ff]/30">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
