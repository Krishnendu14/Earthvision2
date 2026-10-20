import React, { useState, useRef, useEffect } from "react";
import {
  Coffee,
  Tv,
  MessageSquare,
  ChevronDown,
  MousePointerClick,
  HeartHandshake,
  ExternalLink,
  Gift,
  Briefcase,
  Send,
} from "lucide-react";

interface SupportMenuProps {
  onBuyCoffee: () => void;
  onSupportWithTime: () => void;
  onLeaveComment: () => void;
  onHireMe?: () => void;
  className?: string;
  commentsCount?: number;
}

export const SupportMenu: React.FC<SupportMenuProps> = ({
  onBuyCoffee,
  onSupportWithTime,
  onLeaveComment,
  onHireMe,
  className = "",
  commentsCount,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <div ref={menuRef} className={`relative inline-block text-left ${className}`}>
      {/* Textured Main Trigger Button: "support and comments" */}
      <button
        id="support-and-comments-main-btn"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="group relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-black tracking-wide text-slate-900 transition-all duration-300 shadow-xl overflow-hidden cursor-pointer select-none active:scale-[0.98] border border-white/90"
        style={{
          background:
            "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #e2e8f0 75%, #f1f5f9 100%)",
          boxShadow:
            "0 4px 15px -1px rgba(148, 163, 184, 0.35), 0 2px 6px -1px rgba(0, 0, 0, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.95), inset 0 -1px 2px 0 rgba(100, 116, 139, 0.3)",
        }}
        title="Support and Comments"
      >
        {/* Subtle Brushed Steel Texture lines */}
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 4px)",
          }}
        />

        {/* Shimmer Light Bar */}
        <div className="absolute -top-1/2 -bottom-1/2 -left-full w-2/3 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 group-hover:left-[150%] transition-all duration-1000 ease-out pointer-events-none" />

        {/* Icon with subtle metallic ring */}
        <div className="relative flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded-lg bg-slate-900/10 border border-slate-900/15 shadow-inner shrink-0">
          <HeartHandshake className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-900 transition-transform group-hover:scale-110" />
        </div>

        {/* Responsive Text: adapts cleanly to mobile without overflowing the top header */}
        <span className="relative font-black tracking-tight text-slate-900 drop-shadow-xs whitespace-nowrap hidden sm:inline">
          support and comments
        </span>
        <span className="relative font-black tracking-tight text-slate-900 drop-shadow-xs whitespace-nowrap sm:hidden">
          Support & Comments
        </span>

        {/* Chevron */}
        <ChevronDown
          className={`w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-700 transition-transform duration-300 shrink-0 ${
            isOpen ? "rotate-180 text-slate-950" : "group-hover:translate-y-0.5"
          }`}
        />
      </button>

      {/* Mobile Backdrop to catch outside clicks anywhere on touchscreens */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 sm:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Dropdown Menu with the 3 required buttons */}
      {isOpen && (
        <div
          id="support-comments-dropdown-menu"
          className="fixed sm:absolute right-2 sm:right-0 top-14 sm:top-full sm:mt-2 w-[calc(100vw-1rem)] sm:w-80 max-w-[340px] rounded-2xl bg-slate-900/98 backdrop-blur-2xl border-2 border-slate-700/90 p-3 sm:p-3.5 shadow-2xl shadow-slate-950 z-50 animate-in fade-in zoom-in-95 duration-150 flex flex-col gap-2.5 max-h-[calc(100vh-4.5rem)] overflow-y-auto custom-scrollbar"
        >
          {/* Header Tag - Replaced Gemini-like Sparkles with MousePointerClick */}
          <div className="flex items-center justify-between px-1 pb-1 border-b border-slate-800">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              <MousePointerClick className="w-3.5 h-3.5 text-cyan-400" />
              <span>Choose an action</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
              {onHireMe ? "4 Options" : "3 Options"}
            </span>
          </div>

          {/* Button 1: Buy the dev a Co+2Fe☕ (PayPal tip) */}
          <button
            id="btn-buy-dev-coffee"
            onClick={() => {
              setIsOpen(false);
              onBuyCoffee();
            }}
            className="group w-full p-2.5 sm:p-3 rounded-xl bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-amber-600/15 hover:from-amber-500/25 hover:via-orange-500/25 hover:to-amber-600/25 border border-amber-500/40 hover:border-amber-400/70 transition-all duration-200 text-left flex items-center justify-between gap-2.5 shadow-md shadow-amber-950/20 active:scale-[0.99] cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center font-bold text-base sm:text-lg shadow-md shrink-0 group-hover:scale-105 transition-transform">
                ☕
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs sm:text-sm font-extrabold text-amber-200 group-hover:text-amber-100 flex items-center gap-1 truncate">
                  buy the dev a Co+2Fe☕
                </span>
                <span className="text-[10px] text-amber-300/70 truncate">
                  Tip directly via PayPal account
                </span>
              </div>
            </div>
            <Gift className="w-4 h-4 text-amber-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Explicit "OR" statement divider between 1st and 2nd button */}
          <div className="flex items-center gap-3 py-0.5 select-none" aria-hidden="true">
            <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-slate-600 flex-1" />
            <span className="px-2.5 py-0.5 rounded-full bg-slate-800/90 border border-slate-700 text-[10px] font-black tracking-widest text-slate-400 uppercase shadow-inner">
              or
            </span>
            <div className="h-px bg-gradient-to-r from-slate-600 via-slate-700 to-transparent flex-1" />
          </div>

          {/* Button 2: Support with your time (Watch Ads & Silver Page) */}
          <button
            id="btn-support-with-time"
            onClick={() => {
              setIsOpen(false);
              onSupportWithTime();
            }}
            className="group w-full p-2.5 sm:p-3 rounded-xl bg-gradient-to-r from-slate-800/90 via-zinc-800/90 to-slate-800/90 hover:from-slate-700 hover:via-zinc-700 hover:to-slate-700 border border-slate-600/60 hover:border-slate-400/80 transition-all duration-200 text-left flex items-center justify-between gap-2.5 shadow-md active:scale-[0.99] cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-slate-200 via-slate-300 to-zinc-400 text-slate-950 flex items-center justify-center font-bold shadow-md shrink-0 group-hover:scale-105 transition-transform">
                <Tv className="w-4 h-4 text-slate-950" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs sm:text-sm font-extrabold text-slate-100 group-hover:text-white flex items-center gap-1 truncate">
                  support with your time
                </span>
                <span className="text-[10px] text-slate-400 truncate">
                  Support for free • Keep us online
                </span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Divider between 2nd and 3rd button */}
          <div className="h-px bg-slate-800 my-0.5" />

          {/* Button 3: Leave a comment */}
          <button
            id="btn-leave-a-comment"
            onClick={() => {
              setIsOpen(false);
              onLeaveComment();
            }}
            className="group w-full p-2.5 sm:p-3 rounded-xl bg-gradient-to-r from-cyan-500/15 via-blue-500/15 to-indigo-500/15 hover:from-cyan-500/25 hover:via-blue-500/25 hover:to-indigo-500/25 border border-cyan-500/40 hover:border-cyan-400/70 transition-all duration-200 text-left flex items-center justify-between gap-2.5 shadow-md shadow-cyan-950/20 active:scale-[0.99] cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 text-slate-950 flex items-center justify-center font-bold shadow-md shrink-0 group-hover:scale-105 transition-transform">
                <MessageSquare className="w-4 h-4 text-slate-950" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs sm:text-sm font-extrabold text-cyan-200 group-hover:text-cyan-100 flex items-center gap-1.5 truncate">
                  leave a comment
                  {typeof commentsCount === "number" && commentsCount > 0 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold">
                      {commentsCount}
                    </span>
                  )}
                </span>
                <span className="text-[10px] text-cyan-300/70 truncate">
                  Community Log • Share feedback & ideas
                </span>
              </div>
            </div>
            <MessageSquare className="w-4 h-4 text-cyan-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Button 4: Hire Me / Collaborate */}
          {onHireMe && (
            <>
              <div className="h-px bg-slate-800 my-0.5" />
              <button
                id="btn-hire-me-menu"
                onClick={() => {
                  setIsOpen(false);
                  onHireMe();
                }}
                className="group w-full p-2.5 sm:p-3 rounded-xl bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-cyan-500/15 hover:from-emerald-500/25 hover:via-teal-500/25 hover:to-cyan-500/25 border border-emerald-500/40 hover:border-emerald-400/70 transition-all duration-200 text-left flex items-center justify-between gap-2.5 shadow-md shadow-emerald-950/20 active:scale-[0.99] cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-slate-950 flex items-center justify-center font-bold shadow-md shrink-0 group-hover:scale-105 transition-transform">
                    <Briefcase className="w-4 h-4 text-slate-950" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs sm:text-sm font-extrabold text-emerald-200 group-hover:text-emerald-100 flex items-center gap-1.5 truncate">
                      hire me / collaborate
                    </span>
                    <span className="text-[10px] text-emerald-300/70 truncate">
                      Freelance & project inquiries
                    </span>
                  </div>
                </div>
                <Send className="w-4 h-4 text-emerald-400 shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
