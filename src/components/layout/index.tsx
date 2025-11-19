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
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
}
