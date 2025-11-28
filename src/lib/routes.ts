import { Layout } from "@/components/layout";
import { tracksLoader } from "@/loaders/tracks-loader";
import type { RouteObject } from "react-router-dom";

/**
 * Router Configuration for Music Hits
 *
 * Language Support (Updated):
 * - English: /en/* (with prefix)
 * - Traditional Chinese: /zh-TW/*
 * - Japanese: /jp/*
 * - Root redirect: / → /en/ (or browser language)
 *
 * Route Structure:
 * - `/en/` - English home page
 * - `/en/search` - English search results
 * - `/en/artist/:artistId` - English artist profile
 * - `/en/track/:trackId` - English track details
 * - All routes repeated for zh-TW and jp prefixes
 *
 * Data Loading:
 * - tracks.json loaded at root via tracksLoader
 * - Accessible in all routes via useRouteLoaderData("root")
 *
 * Language Sync:
 * - Language determined by URL prefix (en/zh-TW/jp)
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
      // Root redirect (/ → /en/ or browser language)
      {
        index: true,
        lazy: async () => {
          const { RootRedirect } = await import(
            "@/components/layout/root-redirect"
          );
          return { Component: RootRedirect };
        },
      },

      // English routes (with /en prefix)
      {
        path: "en",
        children: createPageRoutes(),
      },

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
    ],
  },
];
