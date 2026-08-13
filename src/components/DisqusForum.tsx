import React, { useEffect, useState } from "react";
import { MessageSquare, AlertCircle } from "lucide-react";

interface DisqusForumProps {
  isDark: boolean;
}

export const DisqusForum: React.FC<DisqusForumProps> = ({ isDark }) => {
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const scriptId = "disqus-embed-script";
    const countScriptId = "dsq-count-scr";

    try {
      // Define disqus_config globally
      (window as any).disqus_config = function (this: any) {
        this.page.url = window.location.href;
        this.page.identifier = "tradingview-pro-forum";
      };

      if (!document.getElementById(scriptId)) {
        const d = document;
        const s = d.createElement("script");
        s.id = scriptId;
        s.src = "https://testing-mcp-genai.disqus.com/embed.js";
        s.setAttribute("data-timestamp", (+new Date()).toString());
        s.async = true;
        s.onerror = (e) => {
          console.warn("Disqus script failed to load:", e);
          setLoadError(true);
        };
        (d.head || d.body).appendChild(s);
      } else if ((window as any).DISQUS) {
        try {
          (window as any).DISQUS.reset({
            reload: true,
            config: function (this: any) {
              this.page.url = window.location.href;
              this.page.identifier = "tradingview-pro-forum";
            },
          });
        } catch (e) {
          console.warn("Disqus reset failed:", e);
        }
      }

      // Embed comment count script using explicit https protocol
      if (!document.getElementById(countScriptId)) {
        const countScript = document.createElement("script");
        countScript.id = countScriptId;
        countScript.src = "https://testing-mcp-genai.disqus.com/count.js";
        countScript.async = true;
        countScript.onerror = (e) => {
          console.warn("Disqus count script failed to load:", e);
        };
        (document.head || document.body).appendChild(countScript);
      }
    } catch (err) {
      console.warn("Error initializing Disqus:", err);
      setLoadError(true);
    }
  }, []);

  return (
    <div
      className={`rounded-2xl border p-6 space-y-4 shadow-sm ${
        isDark ? "bg-[#1e222d] border-[#2a2e39] text-white" : "bg-white border-[#E0E3EB] text-[#191b24]"
      }`}
    >
      <div className="flex items-center justify-between border-b pb-4 border-[#E0E3EB] dark:border-[#2a2e39]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#2962ff] text-white rounded-xl shadow-xs">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg font-headline flex items-center gap-2">
              Trader Community Forum
              <span className="text-[10px] font-mono uppercase bg-[#2962ff]/10 text-[#0049db] dark:text-[#2962ff] px-2 py-0.5 rounded font-bold">
                Live Disqus Feed
              </span>
            </h3>
            <p className="text-xs text-[#6A6D78]">
              Share market insights, ask questions, and engage with the trading community.
            </p>
          </div>
        </div>
      </div>

      {/* Disqus Thread Anchor */}
      {loadError ? (
        <div className="p-6 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>
            Disqus discussion thread could not be loaded in this sandbox environment. Check your adblocker or privacy settings.
          </span>
        </div>
      ) : (
        <div id="disqus_thread" className="min-h-[200px] pt-2" />
      )}

      <noscript>
        Please enable JavaScript to view the{" "}
        <a href="https://disqus.com/?ref_noscript" rel="noopener noreferrer" target="_blank" className="text-[#2962ff] underline">
          comments powered by Disqus.
        </a>
      </noscript>
    </div>
  );
};

