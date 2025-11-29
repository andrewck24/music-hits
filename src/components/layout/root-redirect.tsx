import { getLangFromBrowser } from "@/lib/i18n-utils";
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
