import { Layout } from "@/components/layout";
import { tracksLoader } from "@/loaders/tracks-loader";
import type { RouteObject } from "react-router-dom";

/**
 * Router Configuration for Music Hits
 *
 * This module defines all routes for the application using react-router v7.
 * Routes are organized to support deep linking, browser history navigation,
 * and multi-language support via URL prefixes.
 *
 * Language Support:
 * - English (default): / (no prefix)
 * - Traditional Chinese: /zh-TW/*
 * - Japanese: /jp/*
 *
 * Route Structure:
 * - Root loader: Loads tracks.json before any page renders (shared across all routes)
 * - `/` - Home page with artist recommendations
 * - `/search` - Search results page (with query parameter: ?q=keyword)
 * - `/artist/:artistId` - Artist information page
 * - `/track/:trackId` - Track information page (flat structure, no artistId in URL)
 * - Same structure repeated for /zh-TW/* and /jp/* prefixes
 * - `/en/*` - Redirects to /* (handle edge case where users visit /en/ paths)
 *
 * Data Loading:
 * - tracks.json is loaded at root level via tracksLoader
 * - All child routes can access loader data via useRouteLoaderData("root")
 * - sessionStorage caching ensures single load per session
 *
 * Language Sync:
 * - LanguageSync component (integrated in Layout) ensures i18n.language matches URL-based language
 * - Language is determined solely by URL, not localStorage or cookies
 *
 * Notes:
 * - Track URL uses flat structure (/track/:trackId) because Spotify track API
 *   responses already contain complete artist information
 * - All routes are lazy-loaded for optimal code splitting
 * - Each page component can define its own Suspense fallback for customization
 */

// Helper to create page routes for a given language prefix
function createPageRoutes(prefix: string = "") {
  const basePath = prefix ? `/${prefix}` : "";

  return [
    {
      index: true,
      lazy: async () => {
        const { HomePage } = await import("@/pages/home-page");
        return { Component: HomePage };
      },
    },
    {
      path: `${basePath}/search`.replace(/^\/+/, ""),
      lazy: async () => {
        const { SearchPage } = await import("@/pages/search-page");
        return { Component: SearchPage };
      },
    },
    {
      path: `${basePath}/artist/:artistId`.replace(/^\/+/, ""),
      lazy: async () => {
        const { ArtistPage } = await import("@/pages/artist-page");
        return { Component: ArtistPage };
      },
    },
    {
      path: `${basePath}/track/:trackId`.replace(/^\/+/, ""),
      lazy: async () => {
        const { TrackPage } = await import("@/pages/track-page");
        return { Component: TrackPage };
      },
    },
  ];
}

// Route definitions
export const routes: RouteObject[] = [
  {
    id: "root",
    path: "/",
    loader: tracksLoader,
    Component: Layout,
    children: [
      // English routes (default, no prefix)
      ...createPageRoutes(),

      // Traditional Chinese routes
      {
        path: "zh-TW",
        children: createPageRoutes("zh-TW"),
      },

      // Japanese routes
      {
        path: "jp",
        children: createPageRoutes("jp"),
      },

      // Redirect /en/* to /* (handle edge case)
      {
        path: "en/*",
        lazy: async () => {
          const { Navigate } = await import("react-router-dom");
          return { Component: () => Navigate({ to: "/", replace: true }) };
        },
      },
    ],
  },
];
