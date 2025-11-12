import type { Env } from "../types/env";
import { getSpotifyToken } from "./token";

/**
 * Spotify API Base Utilities
 *
 * Purpose: 提供可重用的 Spotify API 呼叫邏輯
 *
 * Features:
 * - 統一的 ID 驗證
 * - 統一的 API 呼叫邏輯
 * - 統一的錯誤處理
 */

/**
 * 驗證 Spotify ID 格式
 * Spotify IDs are 22-character Base62 strings
 *
 * @throws Error if ID is invalid
 */
export function validateSpotifyId(
  id: string,
  resourceType: "track" | "artist"
): void {
  const isValid = /^[A-Za-z0-9]{22}$/.test(id);

  if (!isValid) {
    throw new Error(
      `INVALID_${resourceType.toUpperCase()}_ID: The ${resourceType} ID "${id}" is invalid. ` +
        `Spotify IDs must be 22 alphanumeric characters.`
    );
  }
}

/**
 * 呼叫 Spotify Web API
 *
 * @param path - API path (e.g., "/v1/tracks/123")
 * @param env - Cloudflare Worker environment
 * @param resourceType - Resource type for error messages
 * @returns Parsed JSON response
 * @throws Error on API errors
 */
export async function callSpotifyApi(
  path: string,
  env: Env,
  resourceType: string
): Promise<unknown> {
  // Get access token from cache or fetch new one
  const accessToken = await getSpotifyToken(env);

  // Call Spotify API
  const url = `https://api.spotify.com${path}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // Handle errors
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(
        `${resourceType.toUpperCase()}_NOT_FOUND: The ${resourceType} was not found on Spotify API.`
      );
    }

    if (response.status === 401) {
      throw new Error(
        `SPOTIFY_AUTH_ERROR: Authentication failed when accessing Spotify API.`
      );
    }

    if (response.status === 429) {
      throw new Error(
        `SPOTIFY_RATE_LIMIT: Spotify API rate limit exceeded. Please try again later.`
      );
    }

    // Generic API error
    let errorMessage = `SPOTIFY_API_ERROR: Failed to fetch ${resourceType} from Spotify API (HTTP ${response.status}).`;

    try {
      const errorData = (await response.json()) as {
        error?: { message?: string };
      };
      if (errorData.error?.message) {
        errorMessage += ` Details: ${errorData.error.message}`;
      }
    } catch {
      // Ignore JSON parse errors
    }

    throw new Error(errorMessage);
  }

  // Return parsed JSON
  return await response.json();
}
