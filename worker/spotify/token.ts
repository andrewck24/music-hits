import type { Env } from "../types/env";

/**
 * Response from Spotify Token API
 */
interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number; // seconds
}

/**
 * Cached token with expiration timestamp
 */
interface CachedToken {
  accessToken: string;
  expiresAt: number; // Unix timestamp in milliseconds
}

/**
 * In-memory token cache (survives across requests within the same Worker instance)
 */
let tokenCache: CachedToken | null = null;

/**
 * Get Spotify access token using Client Credentials Flow.
 * Implements in-memory caching with 55-minute TTL to minimize API calls.
 *
 * @param env - Cloudflare Workers environment with Spotify credentials
 * @returns Access token for Spotify API requests
 * @throws Error if credentials are missing or authentication fails
 */
export async function getSpotifyToken(env: Env): Promise<string> {
  // Validate environment variables
  if (!env.SPOTIFY_CLIENT_ID || !env.SPOTIFY_CLIENT_SECRET) {
    throw new Error(
      "MISSING_ENV_VARS: SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET must be set"
    );
  }

  // Check cache validity (5 minute buffer before actual expiration)
  const now = Date.now();
  if (tokenCache && tokenCache.expiresAt > now) {
    return tokenCache.accessToken;
  }

  // Request new token from Spotify
  const tokenUrl = "https://accounts.spotify.com/api/token";
  const credentials = btoa(
    `${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`
  );

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`SPOTIFY_AUTH_FAILED: ${response.status} ${errorText}`);
  }

  const data = (await response.json()) as SpotifyTokenResponse;

  // Cache token with 55-minute TTL (5 minute buffer from the 60 minute expiration)
  const expiresIn = (data.expires_in - 300) * 1000; // Convert to milliseconds, subtract 5 min
  tokenCache = {
    accessToken: data.access_token,
    expiresAt: now + expiresIn,
  };

  return data.access_token;
}
