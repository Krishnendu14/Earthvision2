import React, { useEffect } from "react";
import {
  X,
  Coffee,
  Heart,
  ExternalLink,
  ShieldCheck,
  Mail,
  Briefcase,
} from "lucide-react";

interface PayPalModalProps {
  isOpen: boolean;
  onClose: () => void;
  paypalUrl?: string;
  onOpenHireModal?: () => void;
}

export const PayPalModal: React.FC<PayPalModalProps> = ({
  isOpen,
  onClose,
  paypalUrl = "https://paypal.me/KrishnenduBar277",
  onOpenHireModal,
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      id="paypal-tip-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-amber-950/40 text-slate-100 flex flex-col gap-4 sm:gap-5 max-h-[92vh] overflow-y-auto custom-scrollbar ring-1 ring-amber-400/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Coffee Theme Branding (Top badge removed) */}
        <div className="flex items-center gap-3.5 pr-8">
          <div
            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 flex items-center justify-center text-2xl shadow-lg shadow-amber-500/30 border border-amber-300/40 shrink-0 animate-bounce"
            style={{ animationDuration: "3s" }}
          >
            ☕
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
              buy the dev a Co+2Fe☕
            </h2>
          </div>
        </div>

        {/* Description Message */}
        <div className="p-4 rounded-2xl bg-slate-800/60 border border-amber-500/20 shadow-inner">
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
            Hello! I&apos;m a student trying to cover my college tuition fees by sharing my creative projects here. If you&apos;re interested in working together, feel free to get in touch using the &apos;Hire Me&apos; option—I&apos;ll make sure to deliver great results
          </p>
        </div>

        {/* Action Button: Direct Link to PayPal Account */}
        <div className="flex flex-col gap-2.5">
          <a
            id="paypal-direct-donate-btn"
            href={paypalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:from-amber-300 hover:via-orange-400 hover:to-amber-400 text-slate-950 font-black text-sm sm:text-base transition-all duration-200 shadow-xl shadow-amber-500/30 hover:shadow-amber-500/40 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2.5 cursor-pointer group"
          >
            <Coffee className="w-5 h-5 text-slate-950 group-hover:rotate-12 transition-transform" />
            <span>Donate via PayPal</span>
            <ExternalLink className="w-4 h-4 text-slate-950/80" />
          </a>

          {/* Hire Me / Collaboration Option */}
          {onOpenHireModal ? (
            <button
              id="hire-me-contact-btn"
              type="button"
              onClick={() => {
                onClose();
                onOpenHireModal();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
              <span>Hire Me / Contact Developer</span>
            </button>
          ) : (
            <a
              id="hire-me-contact-btn"
              href="mailto:ranjitabar18@gmail.com?subject=Creative%20Project%20Inquiry%20/%20Hire%20Me"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              <span>Hire Me / Contact Developer</span>
            </a>
          )}
        </div>

        {/* Footer Security Badges */}
        <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-2 border-t border-slate-800">
          <span className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Direct PayPal Link</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-amber-300">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>100% Goes to Student Dev</span>
          </span>
        </div>
      </div>
    </div>
  );
};
