import Spotify from "@/components/icons/spotify.svg?react";

/**
 * Loading Fallback Component
 *
 * Purpose: 在資料載入中顯示 loading 狀態
 *
 * Features:
 * - Spinner 動畫
 * - 載入訊息
 * - Dashboard 骨架預覽（skeleten）
 *
 * Usage:
 *   import { LoadingFallback } from '@/components/layout/loading-fallback'
 *   if (dataLoading) return <LoadingFallback />
 */

export function LoadingFallback() {
  return (
    <div className="flex h-[calc(100vh-var(--spacing-header-height))] w-screen items-center justify-center">
      <Spotify className="size-16 md:size-20" />
    </div>
  );
}
