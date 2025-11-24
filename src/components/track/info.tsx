import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useGetTrackQuery } from "@/services";
import { Link } from "react-router-dom";

interface TrackInfoProps {
  trackId: string;
  className?: string;
}

/**
 * TrackInfo Component
 *
 * Purpose: 顯示歌曲詳細資訊卡片
 *
 * Features:
 * - Album cover
 * - Track info (name, artist, album, year)
 * - Responsive layout
 * - 內建 loading/error 狀態處理
 *
 * Props:
 * - trackId: Spotify track ID
 * - className: Optional additional CSS classes
 *
 * Usage:
 *  `<TrackInfo trackId="someTrackId" className="optional-class" />`
 */

export function TrackInfo({ trackId, className }: TrackInfoProps) {
  const { data: track, isLoading, error } = useGetTrackQuery(trackId);

  // Loading 狀態
  if (isLoading) return <TrackInfoSkeleton className={className} />;

  // Error 狀態
  if (!track || error) return <TrackInfoError className={className} />;

  const albumCover = track.album?.images?.[0];

  return (
    <Card className={cn("flex flex-col gap-6 p-6 md:flex-row", className)}>
      {/* Album Cover */}
      {albumCover && (
        <div className="bg-muted size-40 flex-shrink-0 rounded-md">
          <img
            src={albumCover.url}
            alt={track.album?.name}
            className="size-40 rounded-lg object-cover"
          />
        </div>
      )}

      {/* Track Info */}
      <div className="flex flex-1 flex-col gap-2">
        {/* Track Name */}
        <h2 className="text-foreground text-3xl font-bold">{track.name}</h2>

        {/* Artist */}
        <div className="text-primary text-lg">
          {track.artists?.map((a) => a.name).join(", ")}
        </div>

        {/* Album Info */}
        <div className="text-muted-foreground space-y-2 text-sm">
          <div>
            <span className="font-semibold">專輯</span>: {track.album?.name}
          </div>
          <div>
            <span className="font-semibold">發行年份</span>:{" "}
            {track.album?.release_date?.split("-")[0]}
          </div>
          <div className="w-full md:max-w-xs">
            <div className="text-muted-foreground mb-2 text-xs">人氣度</div>
            <div className="bg-secondary h-2 w-full overflow-hidden rounded-full">
              <div
                className="bg-primary h-full transition-all"
                style={{ width: `${track.popularity}%` }}
              />
            </div>
            <div className="text-muted-foreground mt-1 text-xs">
              {track.popularity}/100
            </div>
          </div>
        </div>

        {/* Spotify Link */}
        {track.external_urls?.spotify && (
          <Button asChild>
            <Link
              to={track.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="md:w-36"
            >
              在 Spotify 上開啟
            </Link>
          </Button>
        )}
      </div>
    </Card>
  );
}

interface TrackInfoSkeletonProps {
  className?: string;
}

/**
 * TrackInfoSkeleton
 */
function TrackInfoSkeleton({ className }: TrackInfoSkeletonProps) {
  return (
    <Card className={cn("flex flex-col gap-6 p-6 md:flex-row", className)}>
      <Skeleton className="size-40 rounded-lg" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-7 w-36" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-52" />
          <Skeleton className="h-4 w-32" />
          <div className="w-full md:max-w-xs">
            <Skeleton className="mb-2 h-4 w-12" />
            <Skeleton className="h-2 w-full rounded-full" />
            <Skeleton className="mt-1 h-4 w-14" />
          </div>
        </div>
        <Skeleton className="h-9 rounded-full md:w-36" />
      </div>
    </Card>
  );
}

interface TrackInfoErrorProps {
  className?: string;
}

/**
 * TrackInfoError
 */
function TrackInfoError({ className }: TrackInfoErrorProps) {
  return (
    <Card className={cn("flex flex-col gap-6 p-6 md:flex-row", className)}>
      <p className="text-destructive mb-4 text-lg">無法載入歌曲資訊</p>
      <p className="text-muted-foreground text-sm">
        請稍後再試或檢查您的網路連線。
      </p>
    </Card>
  );
}
