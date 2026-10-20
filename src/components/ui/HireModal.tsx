import React, { useState, useEffect } from "react";
import {
  X,
  Send,
  Briefcase,
  Mail,
  User,
  DollarSign,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  MessageSquare,
} from "lucide-react";

interface HireModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HireModal: React.FC<HireModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState<string>("");
  const [contactInfo, setContactInfo] = useState<string>("");
  const [budget, setBudget] = useState<string>("");
  const [projectDetails, setProjectDetails] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

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

  // Reset form when modal opens anew
  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanContact = contactInfo.trim();
    const cleanDetails = projectDetails.trim();

    if (!cleanContact) {
      setErrorMessage("Please provide an email or social handle so I can reply to you.");
      return;
    }

    if (!cleanDetails) {
      setErrorMessage("Please describe your project or collaboration idea.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/hire", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: name.trim() || undefined,
          contact_info: cleanContact,
          budget: budget.trim() || undefined,
          project_details: cleanDetails,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || data.details || `Error ${response.status}: Failed to send inquiry.`);
      }

      setIsSuccess(true);
      // Clear inputs
      setName("");
      setContactInfo("");
      setBudget("");
      setProjectDetails("");
    } catch (err: any) {
      console.error("Hire request submission error:", err);
      setErrorMessage(err.message || "Failed to submit inquiry. Please try again or reach out directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setErrorMessage(null);
  };

  return (
    <div
      id="hire-me-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border-2 border-cyan-500/40 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-cyan-950/50 text-slate-100 flex flex-col gap-4 max-h-[92vh] overflow-y-auto custom-scrollbar ring-1 ring-cyan-400/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Futuristic Top Glowing Orbs */}
        <div className="absolute -top-24 -left-24 w-52 h-52 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-52 h-52 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/80 transition cursor-pointer z-10"
          title="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-3.5 pr-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-600 to-indigo-600 flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-500/30 border border-cyan-300/40 shrink-0">
            <Briefcase className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded-full font-mono">
                Direct Inquiries • Fast Response
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight mt-1">
              Hire Me / Collaborate
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
              Need a 3D web experience, creative frontend, or custom development? Send your project details below and I will get back to you promptly.
            </p>
          </div>
        </div>

        {/* Success State */}
        {isSuccess ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 flex flex-col items-center text-center gap-3.5 my-2">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-emerald-300">
                Inquiry Dispatched Successfully! 🚀
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-sm">
                Thank you! Your project request has been received. I will review your details and get back to your contact handle promptly.
              </p>
            </div>
            <div className="flex items-center gap-3 mt-2 w-full">
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer border border-slate-700"
              >
                Send Another Message
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 text-xs font-black transition cursor-pointer shadow-md"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Form State */
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 mt-1">
            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs font-medium flex items-center justify-between gap-2 animate-in fade-in duration-150">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setErrorMessage(null)}
                  className="text-slate-400 hover:text-slate-200 text-xs font-bold px-1"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Row 1: Name & Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Name / Company */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Your Name / Company</span>
                  <span className="text-[10px] text-slate-500 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Smith / Studio Labs"
                  disabled={isSubmitting}
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition disabled:opacity-50"
                />
              </div>

              {/* Contact Email / Social [Required] */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Email or Social Handle</span>
                  <span className="text-[10px] text-cyan-400 font-bold">*Required</span>
                </label>
                <input
                  type="text"
                  required
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  placeholder="e.g. alex@example.com or @alex_tg"
                  disabled={isSubmitting}
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition disabled:opacity-50"
                />
              </div>
            </div>

            {/* Row 2: Estimated Budget */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Estimated Budget</span>
                  <span className="text-[10px] text-slate-500 font-normal">(Optional)</span>
                </span>
                <span className="text-[10px] font-mono text-cyan-400">Flexible rates</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {["< $500", "$500 - $1.5k", "$1.5k - $3k+", "Flexible / Hourly"].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBudget(budget === b ? "" : b)}
                    disabled={isSubmitting}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition border cursor-pointer text-center ${
                      budget === b
                        ? "bg-cyan-500/20 text-cyan-300 border-cyan-400/80 shadow-sm shadow-cyan-500/20"
                        : "bg-slate-950/60 hover:bg-slate-800/80 text-slate-300 border-slate-800"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="Or specify custom budget / details..."
                disabled={isSubmitting}
                className="w-full mt-1 px-3.5 py-2 bg-slate-950/60 border border-slate-800/80 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition"
              />
            </div>

            {/* Row 3: Project Details & Scope [Required] */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Project Vision & Deliverables</span>
                  <span className="text-[10px] text-cyan-400 font-bold">*Required</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  {projectDetails.length}/1000
                </span>
              </label>
              <textarea
                required
                rows={4}
                maxLength={1000}
                value={projectDetails}
                onChange={(e) => setProjectDetails(e.target.value)}
                placeholder="Briefly describe what you'd like to build (e.g., 3D Earth visualizations, custom web applications, creative UI, timelines, design ideas)..."
                disabled={isSubmitting}
                className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition resize-none disabled:opacity-50"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || !contactInfo.trim() || !projectDetails.trim()}
                className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white font-black text-sm sm:text-base transition-all duration-200 shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 cursor-pointer group"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-cyan-200" />
                    <span>Sending Inquiry...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-cyan-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    <span>Send Project Inquiry</span>
                  </>
                )}
              </button>
              <p className="text-[11px] text-slate-400 text-center mt-2 font-mono">
                🔒 Strictly private & confidential • Direct developer response
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
