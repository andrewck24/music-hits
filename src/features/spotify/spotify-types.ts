/**
 * Spotify Feature State
 *
 * Purpose: Manages Spotify API authentication and token state
 *
 * State Structure:
 * - token: Current access token
 * - tokenExpiry: Token expiration timestamp
 * - tokenValid: Whether token is valid and not expired
 * - loading: Loading state for token requests
 * - error: Error message if authentication fails
 */

export interface SpotifyState {
  /** Current Spotify API access token */
  token: string | null;

  /** Token expiration timestamp (milliseconds since epoch) */
  tokenExpiry: number | null;

  /** Whether token is valid and not expired */
  tokenValid: boolean;

  /** Loading state for token initialization/refresh */
  loading: boolean;

  /** Error message if token request fails */
  error: string | null;
}

/** Initial state for the spotify slice */
export const initialSpotifyState: SpotifyState = {
  token: null,
  tokenExpiry: null,
  tokenValid: false,
  loading: false,
  error: null,
};
