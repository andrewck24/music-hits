import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * TrackSkeleton Component
 *
 * Skeleton loader for TrackItem component.
 * Matches exact dimensions to prevent layout shift (CLS < 0.1).
 *
 * Features:
 * - Square album cover placeholder (48x48, matches TrackItem)
 * - Text placeholders for track name and artist
 * - Accessible with aria-busy and aria-label
 * - Pulse animation via shadcn/ui Skeleton
 */

export function TrackSkeleton() {
  return (
    <Card
      className="bg-muted p-3"
      aria-busy="true"
      aria-label="載入歌曲資訊中"
    >
      <div className="flex items-center gap-3">
        {/* Album Cover Skeleton - matches h-12 w-12 rounded */}
        <Skeleton className="h-12 w-12 shrink-0 rounded" />

        {/* Track Info Skeleton */}
        <div className="min-w-0 flex-1 space-y-2">
          {/* Track Name - matches truncate font-semibold */}
          <Skeleton className="h-4 w-2/3" />

          {/* Artist Name - matches truncate text-sm */}
          <Skeleton className="h-3 w-1/2" />
        </div>

        {/* Release Year Skeleton */}
        <Skeleton className="h-4 w-10 shrink-0" />
      </div>
    </Card>
  );
}

/**
 * TrackSkeletonList Component
 *
 * Renders multiple TrackSkeleton components for loading states.
 *
 * @param count - Number of skeleton items to render
 */
interface TrackSkeletonListProps {
  count: number;
}

export function TrackSkeletonList({ count }: TrackSkeletonListProps) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, index) => (
        <TrackSkeleton key={index} />
      ))}
    </div>
  );
}
