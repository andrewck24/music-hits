import type { Env } from "../types/env";
import { getSpotifyToken } from "./token";

/**
 * Validates Spotify Track ID format.
 * Track IDs are 22 characters long and use base62 encoding (A-Za-z0-9).
 *
 * @param trackId - Track ID to validate
 * @returns true if valid, false otherwise
 */
function isValidTrackId(trackId: string): boolean {
  // Spotify track IDs are exactly 22 characters, base62 (alphanumeric)
  return /^[A-Za-z0-9]{22}$/.test(trackId);
}

/**
 * Fetch track information from Spotify API.
 *
 * @param trackId - Spotify Track ID (22 character base62 string)
 * @param env - Cloudflare Workers environment
 * @returns Track data from Spotify API
 * @throws Error with specific error codes for different failure scenarios
 */
export async function getTrackById(
  trackId: string,
  env: Env
): Promise<unknown> {
  // Validate track ID format
  if (!isValidTrackId(trackId)) {
    throw new Error(
      `INVALID_TRACK_ID: Track ID must be 22 alphanumeric characters, got: ${trackId}`
    );
  }

  // Get access token
  const accessToken = await getSpotifyToken(env);

  // Call Spotify API
  const trackUrl = `https://api.spotify.com/v1/tracks/${trackId}`;
  const response = await fetch(trackUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // Handle errors
  if (response.status === 404) {
    throw new Error(`TRACK_NOT_FOUND: Track with ID ${trackId} does not exist`);
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`SPOTIFY_API_ERROR: ${response.status} ${errorText}`);
  }

  // Return track data
  return await response.json();
}
