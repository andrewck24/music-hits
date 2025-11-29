import { Header } from "@/components/layout/header";
import { I18nBanner } from "@/components/layout/i18n-banner";
import { LanguageProvider } from "@/providers/language-provider";
import { Outlet, ScrollRestoration } from "react-router-dom";

/**
 * Layout Component
 *
 * Purpose: Main application layout with language management
 *
 * Features:
 * - Responsive layout (mobile-first design)
 * - Fixed Header with scroll restoration
 * - Language management via LanguageProvider:
 *   - Validates :lang parameter from route
 *   - Redirects to valid language if invalid (e.g., /fr/search → /en/search)
 *   - Uses browser language detection for optimal UX
 *   - Syncs URL language to i18next using official API
 *   - Provides language context to all child components
 * - Language suggestion banner (browser language detection)
 */

export function Layout() {
  return (
    <LanguageProvider>
      <div className="flex min-h-screen flex-col">
        <ScrollRestoration />
        <I18nBanner />
        <Header />
        <main className="pt-header-height">
          <Outlet />
        </main>
      </div>
    </LanguageProvider>
  );
}
