import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { callSpotifyApi } from "./spotify/base";
import { getSpotifyToken } from "./spotify/token";
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
 * Spotify ID validation regex (22 alphanumeric characters)
 */
const SPOTIFY_ID_REGEX = /^[A-Za-z0-9]{22}$/;

/**
 * Validate Spotify ID format and throw HTTPException if invalid
 */
function validateSpotifyId(id: string, type: "track" | "artist"): void {
  if (!SPOTIFY_ID_REGEX.test(id)) {
    throw new HTTPException(400, {
      message: `${
        type.charAt(0).toUpperCase() + type.slice(1)
      } ID must be 22 alphanumeric characters, got: "${id}"`,
    });
  }
}

/**
 * Main Hono application
 */
const app = new Hono<{ Bindings: Env }>();

// Global CORS middleware
app.use("/*", cors());

// Global error handler
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    // Handle HTTPException with custom response
    return c.json(
      {
        error: err.message || "HTTP_ERROR",
        message: err.message,
        status: err.status,
      } satisfies ErrorResponse,
      err.status
    );
  }

  // Handle unexpected errors
  return c.json(
    {
      error: "INTERNAL_ERROR",
      message: err.message || "An unexpected error occurred",
      status: 500,
    } satisfies ErrorResponse,
    500
  );
});

/**
 * Route: POST /api/spotify/token
 * Returns a fresh Spotify access token
 */
app.post("/api/spotify/token", async (c) => {
  try {
    const accessToken = await getSpotifyToken(c.env);
    return c.json({ access_token: accessToken, token_type: "Bearer" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    if (message.includes("MISSING_ENV_VARS")) {
      return c.json(
        {
          error: "MISSING_ENV_VARS",
          message,
          status: 500,
        } satisfies ErrorResponse,
        500
      );
    }

    if (message.includes("SPOTIFY_AUTH_FAILED")) {
      return c.json(
        {
          error: "SPOTIFY_AUTH_FAILED",
          message,
          status: 502,
        } satisfies ErrorResponse,
        502
      );
    }

    throw new HTTPException(500, { message });
  }
});

/**
 * Route: GET /api/spotify/tracks/:id
 * Returns track information from Spotify API
 */
app.get("/api/spotify/tracks/:id", async (c) => {
  const trackId = c.req.param("id");
  validateSpotifyId(trackId, "track");

  try {
    const trackData = await callSpotifyApi(
      `/v1/tracks/${trackId}`,
      c.env,
      "track"
    );
    return c.json(trackData);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    if (message.includes("TRACK_NOT_FOUND")) {
      return c.json(
        {
          error: "TRACK_NOT_FOUND",
          message,
          status: 404,
        } satisfies ErrorResponse,
        404
      );
    }

    if (message.includes("SPOTIFY_API_ERROR")) {
      return c.json(
        {
          error: "SPOTIFY_API_ERROR",
          message,
          status: 502,
        } satisfies ErrorResponse,
        502
      );
    }

    throw new HTTPException(500, { message });
  }
});

/**
 * Route: GET /api/spotify/artists/:id
 * Returns artist information from Spotify API
 */
app.get("/api/spotify/artists/:id", async (c) => {
  const artistId = c.req.param("id");
  validateSpotifyId(artistId, "artist");

  try {
    const artistData = await callSpotifyApi(
      `/v1/artists/${artistId}`,
      c.env,
      "artist"
    );
    return c.json(artistData);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    if (message.includes("ARTIST_NOT_FOUND")) {
      return c.json(
        {
          error: "ARTIST_NOT_FOUND",
          message,
          status: 404,
        } satisfies ErrorResponse,
        404
      );
    }

    if (message.includes("SPOTIFY_API_ERROR")) {
      return c.json(
        {
          error: "SPOTIFY_API_ERROR",
          message,
          status: 502,
        } satisfies ErrorResponse,
        502
      );
    }

    throw new HTTPException(500, { message });
  }
});

/**
 * Route: GET /api/spotify/audio-features/:id
 * Returns audio features for a single track
 */
app.get("/api/spotify/audio-features/:id", async (c) => {
  const trackId = c.req.param("id");
  validateSpotifyId(trackId, "track");

  try {
    const audioFeatures = await callSpotifyApi(
      `/v1/audio-features/${trackId}`,
      c.env,
      "audio features"
    );
    return c.json(audioFeatures);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    if (message.includes("NOT_FOUND")) {
      return c.json(
        {
          error: "AUDIO_FEATURES_NOT_FOUND",
          message,
          status: 404,
        } satisfies ErrorResponse,
        404
      );
    }

    if (message.includes("SPOTIFY_API_ERROR")) {
      return c.json(
        {
          error: "SPOTIFY_API_ERROR",
          message,
          status: 502,
        } satisfies ErrorResponse,
        502
      );
    }

    throw new HTTPException(500, { message });
  }
});

/**
 * Route: GET /api/spotify/audio-features?ids=...
 * Returns audio features for multiple tracks (batch)
 */
app.get("/api/spotify/audio-features", async (c) => {
  const idsParam = c.req.query("ids");

  if (!idsParam) {
    return c.json(
      {
        error: "BAD_REQUEST",
        message:
          "Missing 'ids' query parameter. Use /api/spotify/audio-features?ids=id1,id2,id3 for batch request.",
        status: 400,
      } satisfies ErrorResponse,
      400
    );
  }

  const trackIds = idsParam.split(",").map((id) => id.trim());

  // Validate batch size
  if (trackIds.length === 0) {
    return c.json(
      {
        error: "INVALID_BATCH_REQUEST",
        message: "At least one track ID is required.",
        status: 400,
      } satisfies ErrorResponse,
      400
    );
  }

  if (trackIds.length > 100) {
    return c.json(
      {
        error: "INVALID_BATCH_REQUEST",
        message: `Maximum 100 track IDs allowed per batch request, got ${trackIds.length}.`,
        status: 400,
      } satisfies ErrorResponse,
      400
    );
  }

  // Validate each track ID
  for (const trackId of trackIds) {
    if (!SPOTIFY_ID_REGEX.test(trackId)) {
      return c.json(
        {
          error: "INVALID_BATCH_REQUEST",
          message: `Invalid track ID: "${trackId}". All IDs must be 22 alphanumeric characters.`,
          status: 400,
        } satisfies ErrorResponse,
        400
      );
    }
  }

  try {
    const ids = trackIds.join(",");
    const audioFeatures = await callSpotifyApi(
      `/v1/audio-features?ids=${encodeURIComponent(ids)}`,
      c.env,
      "audio features batch"
    );
    return c.json(audioFeatures);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    if (message.includes("SPOTIFY_API_ERROR")) {
      return c.json(
        {
          error: "SPOTIFY_API_ERROR",
          message,
          status: 502,
        } satisfies ErrorResponse,
        502
      );
    }

    throw new HTTPException(500, { message });
  }
});

/**
 * Fallback: Serve static assets for all other routes
 * This handles SPA routing by serving index.html for non-API routes
 */
app.get("/*", (c) => {
  return c.env.ASSETS.fetch(c.req.raw);
});

export default app;