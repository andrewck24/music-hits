import { useLanguage } from "@/hooks/use-language";
import type { SupportedLanguages } from "@/types/translations";

/**
 * Hook to generate language-aware paths for navigation.
 *
 * Automatically prepends the current language prefix to paths.
 * This ensures all internal navigation maintains the current language context.
 *
 * @param path - The base path without language prefix (e.g., "/search", "/artist/123")
 * @returns The localized path with language prefix
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const localizedPath = useLocalizedPath("/search");
 *   // When current language is 'en': returns "/en/search"
 *   // When current language is 'zh-TW': returns "/zh-TW/search"
 *   // When current language is 'jp': returns "/jp/search"
 *
 *   return <Link to={localizedPath}>Search</Link>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With dynamic paths
 * function ArtistCard({ artistId }: { artistId: string }) {
 *   const localizedPath = useLocalizedPath(`/artist/${artistId}`);
 *
 *   return <Link to={localizedPath}>View Artist</Link>;
 * }
 * ```
 */
export function useLocalizedPath(path: string): string {
  const { language } = useLanguage();

  if (!path.startsWith("/")) {
    path = "/" + path;
  }

  // All languages use prefix (including English)
  return `/${language}${path}`;
}

/**
 * Utility function to generate a localized path for a specific language.
 *
 * Useful for generating links to switch between languages or for SSG/SSR scenarios.
 *
 * @param path - The base path without language prefix
 * @param lang - The target language
 * @returns The localized path with language prefix if needed
 *
 * @example
 * ```tsx
 * const enPath = getLocalizedPath("/search", "en");    // "/search"
 * const zhPath = getLocalizedPath("/search", "zh-TW"); // "/zh-TW/search"
 * const jpPath = getLocalizedPath("/search", "jp");    // "/jp/search"
 * ```
 */
export function getLocalizedPath(
  path: string,
  lang: SupportedLanguages,
): string {
  if (!path.startsWith("/")) {
    path = "/" + path;
  }

  // All languages use prefix (including English)
  return `/${lang}${path}`;
}
