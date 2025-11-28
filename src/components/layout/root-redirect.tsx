import type { SupportedLanguages } from "@/types/translations";
import { Navigate } from "react-router-dom";

/**
 * Root Redirect with Browser Language Detection
 *
 * SEO-optimized redirect strategy:
 * - Detects browser language preference from navigator.languages
 * - Redirects to matching language homepage
 * - Reduces bounce rate by showing relevant content
 * - Uses replace: true to avoid polluting browser history
 *
 * Language Detection Logic:
 * - Chinese (zh, zh-TW, zh-Hant) → /zh-TW/
 * - Japanese (ja, jp) → /jp/
 * - All others → /en/
 *
 * @component
 * @example
 * ```tsx
 * // In routes.ts
 * {
 *   index: true,
 *   lazy: async () => {
 *     const { RootRedirect } = await import("@/components/layout/root-redirect");
 *     return { Component: RootRedirect };
 *   },
 * }
 * ```
 */
export function RootRedirect() {
  const browserLang = getLangFromBrowser();
  const targetLang = ["zh-TW", "jp"].includes(browserLang) ? browserLang : "en";

  return <Navigate to={`/${targetLang}/`} replace />;
}

/**
 * Detect browser language for SEO-optimized routing
 *
 * Checks navigator.languages and navigator.language to determine
 * the user's preferred language, mapping to supported languages.
 *
 * @returns Detected language code, defaults to "en"
 *
 * @example
 * ```tsx
 * // Browser language: zh-TW
 * getLangFromBrowser() // "zh-TW"
 *
 * // Browser language: ja
 * getLangFromBrowser() // "jp"
 *
 * // Browser language: fr
 * getLangFromBrowser() // "en" (fallback)
 * ```
 */
function getLangFromBrowser(): SupportedLanguages {
  // Server-side rendering guard
  if (typeof navigator === "undefined") {
    return "en";
  }

  const languages = navigator.languages || [navigator.language];

  for (const lang of languages) {
    const normalized = lang.toLowerCase();

    // Traditional Chinese matching
    if (
      normalized.startsWith("zh-tw") ||
      normalized.startsWith("zh-hant") ||
      normalized === "zh"
    ) {
      return "zh-TW";
    }

    // Japanese matching
    if (normalized.startsWith("ja") || normalized.startsWith("jp")) {
      return "jp";
    }
  }

  return "en";
}
