import { Header } from "@/components/layout/header";
import { I18nBanner } from "@/components/layout/i18n-banner";
import { useLanguageSync } from "@/hooks/use-language-sync";
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
 * - Language synchronization:
 *   - rootLoader: 首次載入時預載翻譯（避免閃爍）
 *   - useLanguageSync: 監聽路由變化並同步語言（處理瀏覽器前進/後退）
 *   - 使用 react-i18next 的 ready state 控制渲染（官方推薦做法）
 * - Language suggestion banner
 */

export function Layout() {
  useLanguageSync();

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollRestoration />
      <I18nBanner />
      <Header />
      <main className="pt-header-height">
        <Outlet />
      </main>
    </div>
  );
}
