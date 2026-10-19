import React, { useState, useEffect, useCallback } from "react";
import {
  MessageSquare,
  Send,
  ThumbsUp,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Radio,
  User,
  Clock,
  Search,
  Sparkles,
} from "lucide-react";

export interface CommentData {
  id?: string | number;
  author: string;
  content: string;
  created_at?: string;
  likes?: number;
}

interface CommentsSectionProps {
  className?: string;
  isCompact?: boolean;
  onCommentPosted?: (comment: CommentData) => void;
}

// Cosmic gradient avatar generator based on author name
const AVATAR_GRADIENTS = [
  "from-cyan-400 to-blue-600",
  "from-indigo-400 to-cyan-500",
  "from-emerald-400 to-teal-600",
  "from-purple-400 to-pink-600",
  "from-amber-400 to-orange-600",
  "from-rose-400 to-amber-500",
  "from-violet-500 to-fuchsia-600",
];

function getAvatarGradient(author: string): string {
  let hash = 0;
  for (let i = 0; i < author.length; i++) {
    hash = author.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[index];
}

function formatRelativeTime(dateString?: string): string {
  if (!dateString) return "Just now";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Just now";
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSeconds < 45) return "Just now";
    if (diffSeconds < 3600) return `${Math.max(1, Math.floor(diffSeconds / 60))}m ago`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
    if (diffSeconds < 604800) return `${Math.floor(diffSeconds / 86400)}d ago`;
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  } catch {
    return "Just now";
  }
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({
  className = "",
  isCompact = false,
  onCommentPosted,
}) => {
  // Pure live state: strictly NO fake or hardcoded mock comments
  const [comments, setComments] = useState<CommentData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form states
  const [author, setAuthor] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Track liked status per comment in local session
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem("earthvision_liked_comments");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Dynamically load real comments via GET /api/comments
  const loadComments = useCallback(async (showLoadingSpinner = true) => {
    if (showLoadingSpinner) setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch("/api/comments", {
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const list: CommentData[] = Array.isArray(data)
        ? data
        : Array.isArray(data.results)
        ? data.results
        : [];

      // Set only genuine fetched comments from database
      setComments(list);
    } catch (err: any) {
      console.warn("Notice: Fetching comments via /api/comments encountered an issue:", err);
      setErrorMessage(
        err.message || "Could not retrieve comments."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadComments(true);
  }, [loadComments]);

  // Form submit handler: sends directly to backend API, clears inputs, updates feed immediately
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanContent = content.trim();
    if (!cleanContent) return;

    if (cleanContent.length > 500) {
      setErrorMessage("Comment exceeds 500 characters limit.");
      return;
    }

    const cleanAuthor = author.trim() || "Anonymous Explorer";
    if (cleanAuthor.length > 30) {
      setErrorMessage("Author name must be 30 characters or fewer.");
      return;
    }

    setIsPosting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          author: cleanAuthor,
          content: cleanContent,
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error || `HTTP ${response.status}: Failed to submit`);
      }

      const newEntry: CommentData = result.comment || {
        id: result.id || Date.now(),
        author: cleanAuthor,
        content: cleanContent,
        created_at: new Date().toISOString(),
        likes: 0,
      };

      // Clear the content input field immediately upon submission
      setContent("");
      setSuccessToast("Comment transmitted successfully!");
      setTimeout(() => setSuccessToast(null), 4000);

      // Prepend the new comment to the feed immediately so the user sees it in real-time
      setComments((prev) => [newEntry, ...prev]);

      if (onCommentPosted) {
        onCommentPosted(newEntry);
      }

      // Immediately re-fetch to ensure complete sync with database records
      loadComments(false);
    } catch (err: any) {
      console.error("Error posting comment:", err);
      setErrorMessage(err.message || "Failed to post comment. Please try again.");
    } finally {
      setIsPosting(false);
    }
  };

  // Interactive like button: increments likes in database and updates count on screen instantly
  const handleLike = async (commentId?: string | number) => {
    if (commentId === undefined || commentId === null) return;
    const key = String(commentId);

    // 1. Instantly update screen count (optimistic update)
    setComments((prev) =>
      prev.map((c) => {
        if (String(c.id) === key) {
          const currentLikes = typeof c.likes === "number" ? c.likes : 0;
          return { ...c, likes: currentLikes + 1 };
        }
        return c;
      })
    );

    // Mark as liked in local storage for visual accent
    setLikedMap((prev) => {
      const updated = { ...prev, [key]: true };
      try {
        localStorage.setItem("earthvision_liked_comments", JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // 2. Send request to backend API
    try {
      let res = await fetch("/api/comments/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ comment_id: commentId }),
      });

      // Fallback if /api/comments/like endpoint routes to /api/like
      if (!res.ok && res.status === 404) {
        res = await fetch("/api/like", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ comment_id: commentId }),
        });
      }

      // If backend returns updated like count, synchronize with state
      if (res.ok) {
        const data = await res.json().catch(() => null);
        if (data && typeof data.likes === "number") {
          setComments((prev) =>
            prev.map((c) =>
              String(c.id) === key ? { ...c, likes: data.likes } : c
            )
          );
        }
      }
    } catch (err) {
      console.warn("Could not sync like:", err);
    }
  };

  const filteredComments = comments.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.author.toLowerCase().includes(q) ||
      c.content.toLowerCase().includes(q)
    );
  });

  return (
    <div
      id="comments-box-section"
      className={`relative flex flex-col text-slate-100 ${className}`}
    >
      {/* Success Notification */}
      {successToast && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 text-xs font-medium flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Error Notification */}
      {errorMessage && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs font-medium flex items-center justify-between gap-2 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-slate-400 hover:text-slate-200 text-xs font-bold px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Real-Time Asynchronous Comment Submission Form */}
      <form
        onSubmit={handleSubmit}
        className="p-4 sm:p-5 rounded-2xl bg-slate-900/85 border border-slate-800/90 shadow-xl shadow-black/40 backdrop-blur-md flex flex-col gap-3.5 mb-5 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <label className="text-xs font-extrabold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Post a Community Comment</span>
          </label>
          <span className="text-[10px] font-mono text-cyan-400/80 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
            Live
          </span>
        </div>

        {/* Author Name Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <User className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Explorer name / alias (optional, max 30 chars)"
            maxLength={30}
            disabled={isPosting}
            className="w-full pl-9 pr-14 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition"
          />
          <span className="absolute right-3 top-2.5 text-[10px] font-mono text-slate-500">
            {author.length}/30
          </span>
        </div>

        {/* Content Textarea */}
        <div className="relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your feedback, observations, climate inquiries, or support message..."
            rows={isCompact ? 2 : 3}
            maxLength={500}
            required
            disabled={isPosting}
            className="w-full p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition resize-none custom-scrollbar"
          />
          <span className="absolute right-3 bottom-2.5 text-[10px] font-mono text-slate-500">
            {content.length}/500
          </span>
        </div>

        {/* Quick Reactions & Submit Button */}
        <div className="flex items-center justify-between gap-2 flex-wrap pt-0.5">
          <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
            <span className="text-[10px] text-slate-400 hidden sm:inline">Add reaction:</span>
            {["☕", "🌍", "🚀", "❤️", "🛰️", "✨"].map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setContent((prev) => `${prev} ${emoji}`)}
                className="px-2 py-1 rounded-lg bg-slate-800/70 hover:bg-slate-700/80 border border-slate-700/60 text-xs hover:scale-110 active:scale-95 transition cursor-pointer"
                title={`Add ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={!content.trim() || isPosting}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs transition-all shadow-lg shadow-cyan-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer ml-auto"
          >
            {isPosting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Transmitting...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Send Comment</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Community Feed Header */}
      <div className="flex items-center justify-between gap-2 mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
            <span>Community Feed</span>
          </span>
          <span className="text-[11px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
            {comments.length}
          </span>
          <button
            type="button"
            onClick={() => loadComments(true)}
            disabled={isLoading}
            className="p-1 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80 transition cursor-pointer disabled:opacity-50"
            title="Refresh comments"
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin text-cyan-400" : ""}`} />
          </button>
        </div>

        {comments.length > 5 && (
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search comments..."
              className="pl-8 pr-3 py-1 bg-slate-900/80 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>
        )}
      </div>

      {/* Dynamic Community Comments List */}
      <div className="flex flex-col gap-3 custom-scrollbar">
        {isLoading && comments.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-center flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin" />
            <p className="text-xs text-slate-400 font-mono">
              Loading live comments...
            </p>
          </div>
        ) : filteredComments.length === 0 ? (
          /* Empty state message when 0 comments exist in the database */
          <div
            id="comments-empty-state"
            className="p-8 sm:p-10 rounded-2xl bg-slate-900/40 border border-slate-800/70 text-center flex flex-col items-center justify-center gap-2.5"
          >
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-1">
              <Sparkles className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-200">
              {searchQuery ? "No comments matching your search" : "No comments yet. Be the first to share!"}
            </p>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              {searchQuery
                ? "Try searching for a different keyword or clear the search input."
                : "Transmit your thoughts, climate observations, or feedback above to get the community log started."}
            </p>
          </div>
        ) : (
          filteredComments.map((item, index) => {
            const commentKey = item.id ? String(item.id) : `idx-${index}`;
            const isLiked = !!likedMap[commentKey];
            const likesCount = typeof item.likes === "number" ? item.likes : 0;
            const gradient = getAvatarGradient(item.author || "Explorer");

            return (
              <div
                key={commentKey}
                className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/70 hover:bg-slate-900/90 border border-slate-800/80 hover:border-cyan-500/30 transition-all shadow-md group"
              >
                {/* Author Info & Interactive Like Button */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br ${gradient} text-slate-950 font-black text-xs flex items-center justify-center shadow-md`}
                    >
                      {(item.author || "A").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-slate-100">
                          {item.author || "Anonymous Explorer"}
                        </span>
                        <span className="text-[9px] font-mono text-cyan-300/80 bg-cyan-500/10 px-1.5 py-0.2 rounded border border-cyan-500/20">
                          Explorer
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                        <Clock className="w-2.5 h-2.5 text-slate-500" />
                        <span>{formatRelativeTime(item.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Like Button */}
                  <button
                    type="button"
                    onClick={() => handleLike(item.id ?? index)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs transition cursor-pointer select-none active:scale-95 ${
                      isLiked
                        ? "bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm shadow-rose-950/30"
                        : "bg-slate-800/70 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 border-slate-700/60"
                    }`}
                    title="Like this comment"
                  >
                    <ThumbsUp
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isLiked ? "fill-rose-400 text-rose-400 scale-110" : "group-hover:scale-110"
                      }`}
                    />
                    <span className="font-mono text-[11px] font-bold">{likesCount}</span>
                  </button>
                </div>

                {/* Comment Body */}
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed pl-1 whitespace-pre-wrap">
                  {item.content}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
