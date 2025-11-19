import { Header } from "@/components/layout/header";
import { Outlet } from "react-router-dom";

/**
 * Layout Component
 *
 * Purpose: Main application layout (Header + Main)
 *
 * Features:
 * - Responsive layout
 * - Mobile-first design
 * - Fixed Header
 */

export function Layout() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <Header />

      {/* Main Content */}
      <main className="flex-[1_1_auto] overflow-y-auto pt-16 pb-24 sm:pb-0">
        <Outlet />
      </main>
    </div>
  );
}
