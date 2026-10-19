/**
 * Serverless API Function: /api/hire
 * Receives collaboration / hire inquiries and securely dispatches them to Telegram.
 * Cloudflare Pages Function binding:
 *   - TELEGRAM_BOT_TOKEN
 *   - TELEGRAM_CHAT_ID
 */

const CORS_HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept",
};

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function onRequestPost(context) {
  const headers = CORS_HEADERS;

  try {
    let body;
    try {
      body = await context.request.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON payload in request body." }),
        { status: 400, headers }
      );
    }

    const { name, contact_info, project_details, budget } = body || {};

    // Validate required fields
    if (!contact_info || typeof contact_info !== "string" || !contact_info.trim()) {
      return new Response(
        JSON.stringify({ error: "Contact information (Email or Social handle) is required." }),
        { status: 400, headers }
      );
    }

    if (!project_details || typeof project_details !== "string" || !project_details.trim()) {
      return new Response(
        JSON.stringify({ error: "Project details are required." }),
        { status: 400, headers }
      );
    }

    // Verify Telegram environment variables
    const botToken = context.env?.TELEGRAM_BOT_TOKEN;
    const chatId = context.env?.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return new Response(
        JSON.stringify({
          error: "Telegram notification service is not configured on the server (missing credentials).",
        }),
        { status: 500, headers }
      );
    }

    const safeName = escapeHtml(name?.trim() || "Anonymous / Not specified");
    const safeContact = escapeHtml(contact_info.trim());
    const safeBudget = escapeHtml(budget?.trim() || "Not specified / Flexible");
    const safeDetails = escapeHtml(project_details.trim());

    const telegramText = [
      `🚀 <b>New Hire Request on EarthVision!</b>`,
      ``,
      `<b>Name:</b> ${safeName}`,
      `<b>Contact:</b> ${safeContact}`,
      `<b>Budget:</b> ${safeBudget}`,
      `<b>Details:</b>`,
      safeDetails,
    ].join("\n");

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: telegramText,
          parse_mode: "HTML",
        }),
      }
    );

    if (!telegramResponse.ok) {
      const errBody = await telegramResponse.json().catch(() => ({}));
      return new Response(
        JSON.stringify({
          error: "Failed to dispatch notification to Telegram.",
          description: errBody?.description || "Telegram gateway returned an error.",
        }),
        { status: 502, headers }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Your inquiry has been successfully sent directly to the developer!",
      }),
      { status: 200, headers }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message || "Failed to process hire request.",
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
