/**
 * Cloudflare Workers Environment Interface
 *
 * Defines the shape of the `env` parameter passed to the Worker's fetch handler.
 */
export interface Env {
  /**
   * Binding to serve static assets from the `dist/` directory.
   * This allows the Worker to handle both API requests and serve static files.
   */
  ASSETS: Fetcher;

  /**
   * Spotify Client ID for API authentication.
   * Set via Cloudflare Dashboard: Settings → Variables and Secrets → Variable
   */
  SPOTIFY_CLIENT_ID: string;

  /**
   * Spotify Client Secret for API authentication.
   * Set via Cloudflare Dashboard: Settings → Variables and Secrets → Secret
   *
   * IMPORTANT: Must be stored as a Secret (not Variable) for encryption.
   */
  SPOTIFY_CLIENT_SECRET: string;
}
