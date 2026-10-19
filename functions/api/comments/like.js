/**
 * Serverless API Function: /api/comments/like
 * Handles like increments on comments
 */

const CORS_HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept",
};

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

    const commentId = body?.comment_id || body?.id;
    if (!commentId) {
      return new Response(
        JSON.stringify({ error: "Missing required parameter: comment_id" }),
        { status: 400, headers }
      );
    }

    // Execute like increment
    try {
      await context.env.DB.prepare(
        "UPDATE comments SET likes = COALESCE(likes, 0) + 1 WHERE id = ?"
      )
        .bind(commentId)
        .run();
    } catch {
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
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message || "Failed to update comment like.",
      }),
      { status: 500, headers }
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}
