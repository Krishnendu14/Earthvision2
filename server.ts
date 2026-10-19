import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Real-time in-memory comments store for local development (starts empty: NO mock/fake comments)
interface DevComment {
  id: number;
  author: string;
  content: string;
  created_at: string;
  likes: number;
}

let devCommentsIdCounter = 0;
const devComments: DevComment[] = [];

// GET /api/comments: Fetch 50 most recent comments (ORDER BY id DESC LIMIT 50)
app.get("/api/comments", (req, res) => {
  const sorted = [...devComments]
    .sort((a, b) => b.id - a.id)
    .slice(0, 50)
    .map(({ id, author, content, created_at, likes }) => ({
      id,
      author,
      content,
      created_at,
      likes: typeof likes === "number" ? likes : 0,
    }));
  res.json(sorted);
});

// POST /api/comments: Insert new comment into store
app.post("/api/comments", (req, res) => {
  // If request contains comment_id or is routed as like, handle like
  if (req.body?.comment_id) {
    const commentId = Number(req.body.comment_id);
    const comment = devComments.find((c) => c.id === commentId);
    if (comment) {
      comment.likes = (comment.likes || 0) + 1;
      return res.json({
        success: true,
        message: "Comment like recorded successfully.",
        comment_id: comment.id,
        likes: comment.likes,
      });
    }
    return res.status(404).json({ error: "Comment not found." });
  }

  let { author, content } = req.body || {};

  author = typeof author === "string" ? author.trim() : "";
  if (!author) {
    author = "Anonymous Explorer";
  }

  if (author.length > 30) {
    return res.status(400).json({ error: "Author name must be 30 characters or fewer." });
  }

  if (typeof content !== "string" || !content.trim()) {
    return res.status(400).json({ error: "Comment content cannot be empty." });
  }

  content = content.trim();
  if (content.length > 500) {
    return res.status(400).json({ error: "Comment content must be under 500 characters." });
  }

  const newComment: DevComment = {
    id: ++devCommentsIdCounter,
    author,
    content,
    created_at: new Date().toISOString(),
    likes: 0,
  };

  devComments.push(newComment);

  return res.status(201).json({
    success: true,
    message: "Comment saved successfully",
    comment: {
      id: newComment.id,
      author: newComment.author,
      content: newComment.content,
      created_at: newComment.created_at,
      likes: 0,
    },
  });
});

// POST /api/comments/like & POST /api/like: Increment likes in database
const handleLike = (req: express.Request, res: express.Response) => {
  const commentId = Number(req.body?.comment_id ?? req.body?.id);
  if (!commentId || isNaN(commentId)) {
    return res.status(400).json({ error: "comment_id is required." });
  }

  const comment = devComments.find((c) => c.id === commentId);
  if (!comment) {
    return res.status(404).json({ error: "Comment not found." });
  }

  comment.likes = (comment.likes || 0) + 1;

  return res.json({
    success: true,
    message: "Comment like recorded successfully.",
    comment_id: comment.id,
    likes: comment.likes,
  });
};

app.post("/api/comments/like", handleLike);
app.post("/api/like", handleLike);

// POST /api/hire: Send Telegram notification
app.post("/api/hire", async (req, res) => {
  const { name, contact_info, project_details, budget } = req.body || {};

  if (!contact_info || typeof contact_info !== "string" || !contact_info.trim()) {
    return res.status(400).json({ error: "Contact information (Email or Social handle) is required." });
  }

  if (!project_details || typeof project_details !== "string" || !project_details.trim()) {
    return res.status(400).json({ error: "Project details are required." });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (botToken && chatId) {
    try {
      const escapeHtml = (str: string) =>
        str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

      const telegramText = [
        `🚀 <b>New Hire Request on EarthVision!</b>`,
        ``,
        `<b>Name:</b> ${escapeHtml((name || "Anonymous").trim())}`,
        `<b>Contact:</b> ${escapeHtml(contact_info.trim())}`,
        `<b>Budget:</b> ${escapeHtml((budget || "Not specified / Flexible").trim())}`,
        `<b>Details:</b>`,
        escapeHtml(project_details.trim()),
      ].join("\n");

      const teleRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: telegramText,
          parse_mode: "HTML",
        }),
      });

      if (!teleRes.ok) {
        const errJson = await teleRes.json().catch(() => ({}));
        return res.status(502).json({
          error: "Failed to dispatch notification to Telegram.",
          details: errJson?.description,
        });
      }
    } catch (teleErr: any) {
      console.error("Telegram dispatch error:", teleErr);
      return res.status(500).json({ error: "Telegram dispatch failed: " + teleErr.message });
    }
  } else {
    console.log("ℹ️ [Local Dev] Hire Inquiry received:", {
      name: name?.trim() || "Anonymous",
      contact_info: contact_info.trim(),
      budget: budget?.trim() || "Flexible",
      project_details: project_details.trim(),
    });
  }

  return res.status(200).json({
    success: true,
    message: "Your inquiry has been sent directly to the developer!",
  });
});

async function startServer() {
  // Vite middleware in dev mode
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`EarthVision server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
