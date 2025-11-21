import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * ArtistSkeleton Component
 *
 * Skeleton loader for ArtistCard component.
 * Matches exact dimensions to prevent layout shift (CLS < 0.1).
 *
 * Features:
 * - Circular image placeholder (matches Spotify artist style)
 * - Text placeholder for artist name
 * - Accessible with aria-busy and aria-label
 * - Pulse animation via shadcn/ui Skeleton
 */

interface ArtistSkeletonProps {
  className?: string;
}

export function ArtistSkeleton({ className }: ArtistSkeletonProps) {
  return (
    <Card
      className={`bg-muted p-4 ${className ?? ""}`}
      aria-busy="true"
      aria-label="載入藝人資訊中"
    >
      {/* Artist Image Skeleton - matches aspect-square w-full rounded-full */}
      <Skeleton className="mb-3 aspect-square w-full rounded-full" />

      {/* Artist Name Skeleton - matches text-center font-semibold */}
      <Skeleton className="mx-auto h-5 w-3/4" />
    </Card>
  );
}

/**
 * ArtistSkeletonList Component
 *
 * Renders multiple ArtistSkeleton components for loading states.
 *
 * @param count - Number of skeleton items to render
 */
interface ArtistSkeletonListProps {
  count: number;
  className?: string;
}

export function ArtistSkeletonList({
  count,
  className,
}: ArtistSkeletonListProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <ArtistSkeleton key={index} className={className} />
      ))}
    </>
  );
}
