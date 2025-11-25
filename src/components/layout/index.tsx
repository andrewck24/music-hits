import { LanguageSync } from "@/components/layout/language-sync";
import { Header } from "@/components/layout/header";
import { I18nBanner } from "@/components/layout/i18n-banner";
import { Outlet, ScrollRestoration } from "react-router-dom";

/**
 * Layout Component
 *
 * Purpose: Main application layout (Header + Main)
 *
 * Features:
 * - Responsive layout
 * - Mobile-first design
 * - Fixed Header
 * - Scroll Restoration
 * - Language synchronization from URL
 * - Language suggestion banner
 */

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollRestoration />
      <LanguageSync />
      <I18nBanner />
      <Header />
      <main className="pt-header-height">
        <Outlet />
      </main>
    </div>
  );
}
