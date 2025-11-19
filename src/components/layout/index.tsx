import { Header } from "@/components/layout/header";
import { Outlet } from "react-router-dom";

/**
 * Layout Component
 *
 * Purpose: 主應用布局（Header + Main）
 *
 * Features:
 * - Responsive layout
 * - Mobile-first design
 * - Spotify 主題
 */

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#121212] to-[#0a0a0a] text-white">
      <Header />

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
