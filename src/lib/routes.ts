import { Layout } from "@/components/layout";
import { tracksLoader } from "@/loaders/tracks-loader";
import type { RouteObject } from "react-router-dom";

/**
 * Router Configuration for Music Hits
 *
 * Language Support:
 * - English (default): / (no prefix)
 * - Traditional Chinese: /zh-TW/*
 * - Japanese: /jp/*
 * - Redirect: /en/* → /* (preserve full path)
 *
 * Route Structure:
 * - `/` - Home page
 * - `/search` - Search results (query: ?q=keyword)
 * - `/artist/:artistId` - Artist profile
 * - `/track/:trackId` - Track details
 * - All routes repeated for each language prefix
 *
 * Data Loading:
 * - tracks.json loaded at root via tracksLoader
 * - Accessible in all routes via useRouteLoaderData("root")
 *
 * Language Sync:
 * - Language determined by URL only (not localStorage/cookies)
 * - LanguageSync component in Layout syncs i18n.language with URL
 */

// Helper to create page routes (used as children routes, so paths are relative)
function createPageRoutes() {
  return [
    {
      index: true,
      lazy: async () => {
        const { HomePage } = await import("@/pages/home-page");
        return { Component: HomePage };
      },
    },
    {
      path: "search",
      lazy: async () => {
        const { SearchPage } = await import("@/pages/search-page");
        return { Component: SearchPage };
      },
    },
    {
      path: "artist/:artistId",
      lazy: async () => {
        const { ArtistPage } = await import("@/pages/artist-page");
        return { Component: ArtistPage };
      },
    },
    {
      path: "track/:trackId",
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
        children: createPageRoutes(),
      },

      // Japanese routes
      {
        path: "jp",
        children: createPageRoutes(),
      },

      // Redirect /en/* to /* (handle edge case)
      {
        path: "en/*",
        lazy: async () => {
          const { Navigate } = await import("react-router-dom");
          // Extract the path after /en/ and redirect to the same path without /en prefix
          const path = window.location.pathname.replace(/^\/en/, "") || "/";
          return {
            Component: () =>
              Navigate({
                to: path + window.location.search + window.location.hash,
                replace: true,
              }),
          };
        },
      },
    ],
  },
];
