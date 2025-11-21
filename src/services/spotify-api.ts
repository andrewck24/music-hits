import type {
  SpotifyArtist,
  SpotifyAudioFeatures,
  SpotifyTrack,
} from "@/types/spotify";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/** Maximum number of IDs per batch request (Spotify API limit) */
const BATCH_SIZE_LIMIT = 20;

/**
 * RTK Query API Slice for Spotify
 *
 * This module provides all Spotify API endpoints as hooks for automatic caching,
 * request deduplication, and normalized data management.
 *
 * Base URL: /api/spotify (proxied through Cloudflare Worker)
 * Cache Strategy: RTK Query automatic caching with tag-based invalidation
 *
 * Features:
 * - Automatic request deduplication
 * - Built-in caching with configurable TTL
 * - Tag-based cache invalidation
 * - Loading/error states
 * - AbortController support for request cancellation
 *
 * Usage:
 *   import { useGetArtistQuery, useGetTrackQuery } from '@/services'
 *   const { data, isLoading, error } = useGetArtistQuery(artistId)
 */

const WORKER_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/spotify";

export const spotifyApi = createApi({
  reducerPath: "spotifyApi",
  baseQuery: fetchBaseQuery({ baseUrl: WORKER_API_BASE_URL }),
  tagTypes: ["Artist", "Track", "AudioFeatures"],
  endpoints: (builder) => ({
    // Get Artist Information
    getArtist: builder.query<SpotifyArtist, string>({
      query: (artistId) => `/artists/${artistId}`,
      providesTags: (result, _error, artistId) =>
        result ? [{ type: "Artist", id: artistId }] : ["Artist"],
    }),

    // Get Track Information
    getTrack: builder.query<SpotifyTrack, string>({
      query: (trackId) => `/tracks/${trackId}`,
      providesTags: (result, _error, trackId) =>
        result ? [{ type: "Track", id: trackId }] : ["Track"],
    }),

    // Get Track Audio Features
    getAudioFeatures: builder.query<SpotifyAudioFeatures, string>({
      query: (trackId) => `/audio-features/${trackId}`,
      providesTags: (result, _error, trackId) =>
        result ? [{ type: "AudioFeatures", id: trackId }] : ["AudioFeatures"],
    }),

    // Get Several Artists (Batch)
    getSeveralArtists: builder.query<SpotifyArtist[], string[]>({
      query: (ids) => {
        if (ids.length === 0 || ids.length > BATCH_SIZE_LIMIT) {
          throw new Error(
            `Invalid ids length: ${ids.length}. Must be between 1 and ${BATCH_SIZE_LIMIT}.`,
          );
        }
        return `/artists?ids=${ids.join(",")}`;
      },
      transformResponse: (response: { artists: (SpotifyArtist | null)[] }) => {
        // Filter out null values (invalid/deleted IDs)
        return response.artists.filter(
          (artist): artist is SpotifyArtist => artist !== null,
        );
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Artist" as const, id })),
              "Artist",
            ]
          : ["Artist"],
      async onQueryStarted(_ids, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Populate individual artist caches
          data.forEach((artist) => {
            dispatch(
              spotifyApi.util.upsertQueryData("getArtist", artist.id, artist),
            );
          });
        } catch {
          // Error handled by RTK Query
        }
      },
    }),

    // Get Several Tracks (Batch)
    getSeveralTracks: builder.query<SpotifyTrack[], string[]>({
      query: (ids) => {
        if (ids.length === 0 || ids.length > BATCH_SIZE_LIMIT) {
          throw new Error(
            `Invalid ids length: ${ids.length}. Must be between 1 and ${BATCH_SIZE_LIMIT}.`,
          );
        }
        return `/tracks?ids=${ids.join(",")}`;
      },
      transformResponse: (response: { tracks: (SpotifyTrack | null)[] }) => {
        // Filter out null values (invalid/deleted IDs)
        return response.tracks.filter(
          (track): track is SpotifyTrack => track !== null,
        );
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Track" as const, id })),
              "Track",
            ]
          : ["Track"],
      async onQueryStarted(_ids, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Populate individual track caches
          data.forEach((track) => {
            dispatch(
              spotifyApi.util.upsertQueryData("getTrack", track.id, track),
            );
          });
        } catch {
          // Error handled by RTK Query
        }
      },
    }),
  }),
});

/**
 * Cache Configuration
 *
 * - refetchOnMountOrArgChange: false - Don't refetch on mount or argument change
 *   to avoid duplicate requests (we want to use cached data)
 * - refetchOnReconnect: true - Refetch when the app regains network connection
 *   to ensure data freshness after offline periods
 *
 * Notes:
 * - Session-based caching only (cleared when tab/browser is closed)
 * - No persistent caching (localStorage, IndexedDB)
 * - No automatic cache invalidation (manual invalidation via tags if needed)
 */
export const {
  useGetArtistQuery,
  useGetTrackQuery,
  useGetAudioFeaturesQuery,
  useGetSeveralArtistsQuery,
  useGetSeveralTracksQuery,
} = spotifyApi;

export default spotifyApi;
