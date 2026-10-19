import React, { useEffect } from "react";
import { X, MessageSquare } from "lucide-react";
import { CommentsSection } from "./CommentsSection";

interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCommentPosted?: () => void;
}

export const CommentsModal: React.FC<CommentsModalProps> = ({
  isOpen,
  onClose,
  onCommentPosted,
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
      id="comments-ui-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-cyan-500/30 rounded-3xl p-4 sm:p-6 shadow-2xl shadow-cyan-950/50 text-slate-100 flex flex-col gap-4 max-h-[92vh] overflow-hidden ring-1 ring-cyan-400/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer z-10"
          title="Close Comments"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pr-8 shrink-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-500/30 shrink-0">
            <MessageSquare className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded-full font-mono">
                Community Hub
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-100 tracking-tight mt-0.5">
              Leave a Comment & Feedback
            </h2>
          </div>
        </div>

        {/* Scrollable Comments Box Section */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
          <CommentsSection onCommentPosted={onCommentPosted} />
        </div>
      </div>
    </div>
  );
};
