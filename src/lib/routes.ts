import { Layout } from "@/components/layout";
import { tracksLoader } from "@/loaders/tracks-loader";
import type { RouteObject } from "react-router-dom";

/**
 * Router Configuration for Music Hits
 *
 * Language Support (Updated):
 * - Uses dynamic :lang parameter for all languages
 * - Supported: en, zh-TW, jp
 * - Invalid/missing language → auto-redirect to browser language or English
 *
 * Route Structure:
 * - `/:lang/` - Language-prefixed home page
 * - `/:lang/search` - Language-prefixed search results
 * - `/:lang/artist/:artistId` - Language-prefixed artist profile
 * - `/:lang/track/:trackId` - Language-prefixed track details
 * - `/` or `/:invalidLang/*` → auto-redirect with language detection
 *
 * Data Loading:
 * - tracks.json loaded at root via tracksLoader
 * - Accessible in all routes via useRouteLoaderData("root")
 *
 * Language Validation:
 * - Language validated in Layout component
 * - Invalid languages trigger redirect to same page with valid language
 * - LanguageSync component syncs i18n.language with URL :lang parameter
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
      // Root redirect (/ → browser language or /en/)
      {
        index: true,
        lazy: async () => {
          const { RootRedirect } = await import(
            "@/components/layout/root-redirect"
          );
          return { Component: RootRedirect };
        },
      },

      // Dynamic language routes (handles all languages with :lang parameter)
      {
        path: ":lang",
        children: createPageRoutes(),
      },
    ],
  },
];
