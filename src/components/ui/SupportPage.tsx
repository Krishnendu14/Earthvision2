import React, { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Heart,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Tv,
  Clock,
  Gift,
  Flame,
  Award,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

interface SupportPageProps {
  onBack: () => void;
}

export const SupportPage: React.FC<SupportPageProps> = ({ onBack }) => {
  const adIframeRef1 = useRef<HTMLIFrameElement>(null);
  const adIframeRef2 = useRef<HTMLIFrameElement>(null);
  const adIframeRef3 = useRef<HTMLIFrameElement>(null);

  // Time spent supporting counter
  const [secondsSupported, setSecondsSupported] = useState<number>(0);
  const [adsClickedCount, setAdsClickedCount] = useState<number>(0);

  // Increment support timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsSupported((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Allow ESC key to return back to Globe
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onBack();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onBack]);

  // Inject ad scripts inside isolated iframes so popups NEVER leak to the 3D Globe
  useEffect(() => {
    const populateFrame = (
      iframe: HTMLIFrameElement | null,
      adScripts: string,
      label: string
    ) => {
      if (!iframe) return;
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (doc) {
          doc.open();
          doc.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <style>
                  body {
                    margin: 0;
                    padding: 8px;
                    background: #0f172a;
                    color: #cbd5e1;
                    font-family: system-ui, -apple-system, sans-serif;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    box-sizing: border-box;
                    height: 100%;
                  }
                  .ad-tag-badge {
                    font-size: 10px;
                    color: #94a3b8;
                    border: 1px solid #334155;
                    padding: 2px 8px;
                    border-radius: 9999px;
                    margin-bottom: 4px;
                    background: #1e293b;
                  }
                </style>
                ${adScripts}
              </head>
              <body>
                <div class="ad-tag-badge">${label}</div>
              </body>
            </html>
          `);
          doc.close();
        }
      } catch (e) {
        console.warn("Support ad frame setup notice:", e);
      }
    };

    // Slot 1: Immortal Tag & Multitag
    populateFrame(
      adIframeRef1.current,
      `
        <!-- Push · Immortal tag (zone 11581750) -->
        <script src="https://5gvci.com/act/files/tag.min.js?z=11581750" data-cfasync="false" async></script>
        <!-- Multitag · Fabulous tag (zone 270202) -->
        <script src="https://quge5.com/88/tag.min.js" data-zone="270202" async data-cfasync="false"></script>
      `,
      "Sponsored Stream #1 Active"
    );

    // Slot 2: In-Page Push & Vignette
    populateFrame(
      adIframeRef2.current,
      `
        <!-- In-Page Push · Pleasant tag (zone 11581771) -->
        <script>
          (function(s){s.dataset.zone='11581771',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')));
        </script>
        <!-- Vignette · Magnificent tag (zone 11578682) -->
        <script>
          (function(s){s.dataset.zone='11578682',s.src='https://n6wxm.com/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')));
        </script>
      `,
      "Sponsored Stream #2 Active"
    );

    // Slot 3: Direct Multitag Display Zone
    populateFrame(
      adIframeRef3.current,
      `
        <!-- Multitag Partner Tag (zone 270202) -->
        <script src="https://quge5.com/88/tag.min.js" data-zone="270202" async data-cfasync="false"></script>
      `,
      "Interactive Sponsor Zone #3"
    );
  }, []);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins < 10 ? "0" : ""}${mins}:${remainder < 10 ? "0" : ""}${remainder}`;
  };

  return (
    <div
      id="silver-support-page"
      className="fixed inset-0 z-50 overflow-y-auto bg-gradient-to-b from-slate-950 via-zinc-900 to-slate-950 text-slate-100 flex flex-col font-sans select-text"
    >
      {/* 1. Silver Top Navbar */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-xl border-b border-slate-700/80 px-4 py-3 flex items-center justify-between max-w-5xl w-full mx-auto shadow-2xl">
        <button
          id="back-to-globe-top-btn"
          onClick={onBack}
          className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-slate-200 via-slate-300 to-zinc-300 hover:from-white hover:via-slate-200 hover:to-slate-300 text-slate-950 font-black rounded-xl text-xs border border-white/80 transition-all shadow-md shadow-slate-400/20 hover:scale-[1.02] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-slate-900" />
          <span>Back to 3D Globe</span>
        </button>

        {/* Silver Theme & Timer Status */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/90 border border-slate-600/70 text-slate-300 text-xs font-mono">
            <Clock className="w-3.5 h-3.5 text-slate-300 animate-pulse" />
            <span>Time Supporting: {formatTime(secondsSupported)}</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-slate-300/20 via-zinc-200/20 to-slate-400/20 border border-slate-300/40 text-slate-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-slate-200" />
            <span>Silver Edition</span>
          </div>
        </div>
      </header>

      {/* 2. Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:py-8 flex flex-col items-center gap-6 sm:gap-8">
        
        {/* Header Hero Section */}
        <div className="flex flex-col items-center text-center gap-3">
          {/* Silver Appreciation Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-slate-300/15 via-zinc-200/20 to-slate-400/15 border border-slate-300/40 text-slate-200 text-xs font-bold shadow-lg shadow-slate-500/10">
            <Sparkles className="w-4 h-4 text-slate-300" />
            <span>Support with Your Time · Watch Ads & Keep Us Free</span>
            <Sparkles className="w-4 h-4 text-slate-300" />
          </div>

          {/* Silver Gradient Heading: love you man 😘 */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-zinc-400 bg-clip-text text-transparent drop-shadow-md">
              love you man
            </h1>
            <span className="text-4xl sm:text-5xl md:text-6xl select-none inline-block animate-bounce drop-shadow-lg">
              😘
            </span>
          </div>

          <p className="max-w-xl text-xs sm:text-sm text-slate-300 leading-relaxed">
            By spending a few moments on this page and engaging with our sponsor ads, you are directly paying for the 3D physics servers and satellite weather computing. Thank you!
          </p>
        </div>

        {/* 3. Sticker Showcase in Polished Silver Chrome Frame */}
        <div className="relative group p-3 sm:p-4 rounded-3xl bg-gradient-to-b from-slate-800/90 via-slate-900/95 to-zinc-950 border-2 border-slate-300/50 shadow-2xl shadow-slate-500/15 max-w-xs sm:max-w-sm w-full flex flex-col items-center overflow-hidden ring-1 ring-white/20">
          {/* Ambient Silver Shimmer Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-slate-200/25 via-zinc-400/20 to-slate-300/25 rounded-3xl blur-xl opacity-75 -z-10" />

          {/* Top Label */}
          <div className="w-full flex items-center justify-between px-2 pb-2 text-[11px] font-semibold text-slate-300 border-b border-slate-700/60 mb-2">
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 fill-slate-300 text-slate-300" />
              <span>Official Supporter Sticker</span>
            </span>
          </div>

          <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-2xl overflow-hidden bg-slate-950 border border-slate-700/60 flex items-center justify-center p-2 group-hover:scale-105 transition-transform duration-300 shadow-inner">
            <img
              id="support-page-sticker-img"
              src="/STK-20250314-WA0000.webp"
              alt="Love you man sticker"
              className="w-full h-full object-contain select-none"
              loading="eager"
            />
          </div>
        </div>

        {/* 4. Real-Time Support Impact Meter (Silver Box) */}
        <div className="w-full max-w-2xl p-4 rounded-2xl bg-gradient-to-r from-slate-900/95 via-zinc-900/90 to-slate-900/95 border border-slate-400/30 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-slate-200 to-zinc-300 text-slate-950 font-black shadow-md">
              <TrendingUp className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200">Session Support Meter</div>
              <div className="text-xs text-slate-400">
                Time Active: <span className="text-slate-100 font-mono font-bold">{formatTime(secondsSupported)}</span> • Sponsor Clicks: <span className="text-slate-100 font-mono font-bold">{adsClickedCount}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-slate-200"></span>
            </span>
            <span className="text-xs font-semibold text-slate-300">Live Ad Channels Active</span>
          </div>
        </div>

        {/* 5. ADS HUB - FULL OF ADS (Silver Themed Cards) */}
        <div className="w-full max-w-2xl flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-2">
            <div className="flex items-center gap-2 text-sm font-extrabold text-slate-200 uppercase tracking-wider">
              <Tv className="w-4 h-4 text-slate-300" />
              <span>Sponsor Ads & Direct Support Links</span>
            </div>
            <span className="text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">
              Multiple Ad Formats
            </span>
          </div>

          {/* AD 1: Golden Sponsor Direct Action Link */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-800/95 via-zinc-900/90 to-slate-950 border-2 border-slate-300/40 shadow-2xl shadow-slate-500/10 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-slate-200 text-slate-950 font-bold">
                  <Award className="w-4 h-4" />
                </span>
                <span className="text-sm font-extrabold text-slate-100">
                  Primary Sponsor · Direct Partner Link
                </span>
              </div>
              <span className="text-[10px] font-mono bg-slate-700/80 text-slate-300 px-2 py-0.5 rounded border border-slate-600">
                Zone: 11581761
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Clicking this sponsor link opens our partner portal in a new tab. Each visit directly funds our server maintenance!
            </p>

            <a
              id="sponsor-direct-link-1"
              href="https://omg10.com/4/11581761"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setAdsClickedCount((c) => c + 1)}
              className="w-full py-3 px-5 bg-gradient-to-r from-slate-100 via-slate-200 to-zinc-300 hover:from-white hover:via-slate-100 hover:to-slate-200 text-slate-950 font-black rounded-xl text-xs sm:text-sm transition-all shadow-lg shadow-slate-400/25 hover:shadow-slate-300/40 hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer border border-white/80"
            >
              <Gift className="w-4 h-4 text-slate-950" />
              <span>Click to Visit Sponsor (Support with 1 Click)</span>
              <ExternalLink className="w-4 h-4 text-slate-950 ml-1" />
            </a>

            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Clean Ad Network</span>
              </span>
              <span>Opens safely in new tab</span>
            </div>
          </div>

          {/* AD 2: Embedded Display Stream #1 */}
          <div className="rounded-2xl overflow-hidden bg-slate-900/90 border border-slate-400/30 shadow-xl p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between px-1 text-[11px] text-slate-300">
              <span className="flex items-center gap-1.5 font-bold">
                <Flame className="w-3.5 h-3.5 text-slate-300" />
                <span>Sponsored Partner Stream #1</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">● Active</span>
            </div>

            <div className="w-full h-28 sm:h-32 rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
              <iframe
                ref={adIframeRef1}
                title="Sponsored Stream 1"
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              />
            </div>
          </div>

          {/* AD 3: Embedded Display Stream #2 */}
          <div className="rounded-2xl overflow-hidden bg-slate-900/90 border border-slate-400/30 shadow-xl p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between px-1 text-[11px] text-slate-300">
              <span className="flex items-center gap-1.5 font-bold">
                <Tv className="w-3.5 h-3.5 text-slate-300" />
                <span>Sponsored Partner Stream #2</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">● Active</span>
            </div>

            <div className="w-full h-28 sm:h-32 rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
              <iframe
                ref={adIframeRef2}
                title="Sponsored Stream 2"
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              />
            </div>
          </div>

          {/* AD 4: Bonus Partner Link */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-zinc-900 to-slate-900 border border-slate-400/30 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-slate-800 border border-slate-600 text-slate-200">
                <Sparkles className="w-4 h-4 text-slate-200" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-200">Want to help even more?</div>
                <div className="text-[11px] text-slate-400">Visit our partner offer for 15 seconds</div>
              </div>
            </div>

            <a
              id="bonus-sponsor-link"
              href="https://omg10.com/4/11581761"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setAdsClickedCount((c) => c + 1)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold rounded-xl text-xs border border-slate-600 transition flex items-center gap-1.5 shadow"
            >
              <span>Visit Partner</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
            </a>
          </div>

          {/* AD 5: Interactive Banner Unit */}
          <div className="rounded-2xl overflow-hidden bg-slate-900/90 border border-slate-400/30 shadow-xl p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between px-1 text-[11px] text-slate-300">
              <span className="flex items-center gap-1.5 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-slate-300" />
                <span>Sponsored Partner Stream #3</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">● Active</span>
            </div>

            <div className="w-full h-24 rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
              <iframe
                ref={adIframeRef3}
                title="Sponsored Stream 3"
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              />
            </div>
          </div>
        </div>

        {/* 6. Bottom Return Button in Lustrous Silver Metallic */}
        <div className="pt-2 pb-8 flex flex-col items-center gap-3">
          <button
            id="back-to-globe-bottom-btn"
            onClick={onBack}
            className="px-8 sm:px-10 py-3.5 bg-gradient-to-r from-slate-100 via-slate-200 to-zinc-300 hover:from-white hover:via-slate-100 hover:to-slate-200 text-slate-950 font-black rounded-2xl text-sm transition-all shadow-2xl shadow-slate-300/30 hover:shadow-slate-200/50 hover:scale-[1.02] flex items-center gap-2.5 cursor-pointer border border-white/80"
          >
            <ArrowLeft className="w-4 h-4 text-slate-950" />
            <span>Return to 3D Earth Globe</span>
          </button>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Your ad views are counted. Thank you for supporting!</span>
          </span>
        </div>
      </main>
    </div>
  );
};
