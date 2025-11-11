import { getSpotifyToken } from "./spotify/token";
import { getTrackById } from "./spotify/tracks";
import type { Env } from "./types/env";

/**
 * Standardized error response format
 */
interface ErrorResponse {
  error: string;
  message: string;
  status: number;
}

/**
 * Add CORS headers to response
 */
function corsHeaders(): HeadersInit {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

/**
 * Create standardized error response
 */
function errorResponse(
  error: string,
  message: string,
  status: number
): Response {
  const body: ErrorResponse = { error, message, status };
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(),
    },
  });
}

/**
 * Create successful JSON response
 */
function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(),
    },
  });
}

/**
 * Handle POST /api/spotify/token
 * Returns a fresh Spotify access token
 */
async function handleTokenRequest(env: Env): Promise<Response> {
  try {
    const accessToken = await getSpotifyToken(env);
    return jsonResponse({ access_token: accessToken, token_type: "Bearer" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    if (message.includes("MISSING_ENV_VARS")) {
      return errorResponse("MISSING_ENV_VARS", message, 500);
    }

    if (message.includes("SPOTIFY_AUTH_FAILED")) {
      return errorResponse("SPOTIFY_AUTH_FAILED", message, 502);
    }

    return errorResponse("INTERNAL_ERROR", message, 500);
  }
}

/**
 * Handle GET /api/spotify/tracks/:id
 * Returns track information from Spotify API
 */
async function handleTrackRequest(
  trackId: string,
  env: Env
): Promise<Response> {
  try {
    const trackData = await getTrackById(trackId, env);
    return jsonResponse(trackData);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    if (message.includes("INVALID_TRACK_ID")) {
      return errorResponse("INVALID_TRACK_ID", message, 400);
    }

    if (message.includes("TRACK_NOT_FOUND")) {
      return errorResponse("TRACK_NOT_FOUND", message, 404);
    }

    if (message.includes("SPOTIFY_API_ERROR")) {
      return errorResponse("SPOTIFY_API_ERROR", message, 502);
    }

    return errorResponse("INTERNAL_ERROR", message, 500);
  }
}

/**
 * Main Worker fetch handler
 */
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(),
      });
    }

    // Route: POST /api/spotify/token
    if (url.pathname === "/api/spotify/token" && request.method === "POST") {
      return handleTokenRequest(env);
    }

    // Route: GET /api/spotify/tracks/:id
    const trackMatch = url.pathname.match(
      /^\/api\/spotify\/tracks\/([A-Za-z0-9]{22})$/
    );
    if (trackMatch && request.method === "GET") {
      const trackId = trackMatch[1];
      return handleTrackRequest(trackId, env);
    }

    // All other routes: serve static assets
    return env.ASSETS.fetch(request);
  },
};
