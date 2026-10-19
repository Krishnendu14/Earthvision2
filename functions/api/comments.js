/**
 * Serverless API Function: /api/comments
 * Serverless API handler connected to database
 * Database Binding: DB
 */

const CORS_HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept",
};

// GET /api/comments - Fetch 50 most recent comments
export async function onRequestGet(context) {
  const headers = {
    ...CORS_HEADERS,
    "Cache-Control": "no-cache, no-store, must-revalidate",
  };

  try {
    if (!context.env || !context.env.DB) {
      return new Response(
        JSON.stringify({
          error: "Database service binding 'DB' is not configured in this environment.",
          results: [],
        }),
        { status: 500, headers }
      );
    }

    let results;
    try {
      // Query 50 most recent comments including id and likes
      const query = await context.env.DB.prepare(
        "SELECT id, author, content, created_at, COALESCE(likes, 0) AS likes FROM comments ORDER BY id DESC LIMIT 50"
      ).all();
      results = query.results;
    } catch {
      // Fallback query if 'likes' column has not been added to comments table yet
      const query = await context.env.DB.prepare(
        "SELECT id, author, content, created_at FROM comments ORDER BY id DESC LIMIT 50"
      ).all();
      results = (query.results || []).map((row) => ({
        ...row,
        likes: 0,
      }));
    }

    return new Response(JSON.stringify(results || []), {
      status: 200,
      headers,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message || "Failed to fetch comments",
      }),
      { status: 500, headers }
    );
  }
}

// POST /api/comments (also handles POST /api/comments/like if routed here)
export async function onRequestPost(context) {
  const headers = CORS_HEADERS;

  try {
    if (!context.env || !context.env.DB) {
      return new Response(
        JSON.stringify({
          error: "Database service binding 'DB' is not configured.",
        }),
        { status: 500, headers }
      );
    }

    let body;
    try {
      body = await context.request.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON payload in request body." }),
        { status: 400, headers }
      );
    }

    const url = new URL(context.request.url);

    // Route: Like increment (POST /api/comments/like or POST /api/comments with { comment_id })
    if (url.pathname.endsWith("/like") || body?.comment_id) {
      const commentId = body?.comment_id || body?.id;
      if (!commentId) {
        return new Response(
          JSON.stringify({ error: "Missing required parameter: comment_id" }),
          { status: 400, headers }
        );
      }

      try {
        await context.env.DB.prepare(
          "UPDATE comments SET likes = COALESCE(likes, 0) + 1 WHERE id = ?"
        )
          .bind(commentId)
          .run();
      } catch {
        // Fallback standard SQL update
        await context.env.DB.prepare(
          "UPDATE comments SET likes = likes + 1 WHERE id = ?"
        )
          .bind(commentId)
          .run();
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: "Comment like recorded successfully.",
          comment_id: commentId,
        }),
        { status: 200, headers }
      );
    }

    // Route: Create Comment (POST /api/comments)
    let { author, content } = body || {};

    // Validate author (optional, defaults to Anonymous Explorer, max 30 chars)
    author = typeof author === "string" ? author.trim() : "";
    if (!author) {
      author = "Anonymous Explorer";
    }

    if (author.length > 30) {
      return new Response(
        JSON.stringify({
          error: "Author name must be 30 characters or fewer.",
        }),
        { status: 400, headers }
      );
    }

    // Validate content (required, not empty, under 500 chars)
    if (typeof content !== "string" || !content.trim()) {
      return new Response(
        JSON.stringify({ error: "Comment content cannot be empty." }),
        { status: 400, headers }
      );
    }

    content = content.trim();
    if (content.length > 500) {
      return new Response(
        JSON.stringify({
          error: "Comment content must be under 500 characters.",
        }),
        { status: 400, headers }
      );
    }

    // Insert into comments table
    const result = await context.env.DB.prepare(
      "INSERT INTO comments (author, content) VALUES (?, ?)"
    )
      .bind(author, content)
      .run();

    const insertedId = result.meta?.last_row_id || Date.now();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Comment submitted successfully.",
        comment: {
          id: insertedId,
          author,
          content,
          created_at: new Date().toISOString(),
          likes: 0,
        },
      }),
      { status: 201, headers }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message || "Failed to process request.",
      }),
      { status: 500, headers }
    );
  }
}

// OPTIONS /api/comments - CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}
