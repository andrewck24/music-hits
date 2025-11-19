import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";

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
    <div className="flex flex-col bg-gradient-to-b from-[#121212] to-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-[#282828] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold">Music Hits</div>
          <Skeleton className="h-10 w-64 rounded" />
        </div>
      </div>

      {/* Main content with loading state */}
      <div className="flex-1 p-6">
        <div className="grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-[400px_1fr]">
          {/* Sidebar skeleton */}
          <div className="space-y-6">
            {/* Artist card skeleton */}
            <div className="space-y-4 rounded-lg bg-[#282828] p-4">
              <Skeleton className="h-48 w-full rounded" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>

            {/* Track list skeleton */}
            <div className="space-y-3 rounded-lg bg-[#282828] p-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded" />
              ))}
            </div>
          </div>

          {/* Main content skeleton */}
          <div className="space-y-6">
            {/* Track detail skeleton */}
            <div className="space-y-4 rounded-lg bg-[#282828] p-6">
              <div className="flex gap-4">
                <Skeleton className="h-32 w-32 rounded" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </div>

            {/* Charts skeleton */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Skeleton className="h-64 rounded" />
              <Skeleton className="h-64 rounded" />
            </div>
          </div>
        </div>

        {/* Loading indicator */}
        <div className="mt-12 flex flex-col items-center justify-center gap-4">
          <Spinner />
          <p className="animate-pulse text-[#B3B3B3]">載入音樂資料庫...</p>
        </div>
      </div>
    </div>
  );
}
