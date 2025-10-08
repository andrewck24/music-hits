/**
 * Application Constants
 */

export const SEARCH_LIMIT = 12;
export const DATA_VERSION = '2023.1';

export const SPOTIFY_API_ENDPOINTS = {
  token: 'https://accounts.spotify.com/api/token',
  artist: (id: string) => `https://api.spotify.com/v1/artists/${id}`,
  track: (id: string) => `https://api.spotify.com/v1/tracks/${id}`,
  audioFeatures: (id: string) =>
    `https://api.spotify.com/v1/audio-features/${id}`,
} as const;
