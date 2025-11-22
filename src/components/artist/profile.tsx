import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCompactNumber } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { useGetArtistQuery } from "@/services";

/**
 * ArtistProfile Component
 *
 * Purpose: 顯示藝人資訊卡片，自動載入藝人資料
 *
 * Features:
 * - 自動使用 RTK Query 載入藝人資料
 * - Artist image (RWD: 小螢幕置中，大螢幕左右並排)
 * - Name
 * - Follower count (使用緊湊格式)
 * - Genres
 * - Popularity progress bar
 *
 * Props:
 * - artistId: Spotify artist ID
 *
 * Usage:
 *   <ArtistProfile artistId="abc123" />
 */

interface ArtistProfileProps {
  artistId: string;
  className?: string;
}

export function ArtistProfile({ artistId, className }: ArtistProfileProps) {
  const { data: artist, isLoading } = useGetArtistQuery(artistId);

  if (isLoading) {
    return (
      <div
        className={cn(
          "flex flex-col items-center gap-6 sm:flex-row sm:items-end",
          className,
        )}
      >
        <Skeleton className="aspect-square w-full shrink-0 rounded-lg sm:w-48 lg:w-64" />
      </div>
    );
  }

  const image = artist?.images?.[0];
  const popularity = artist?.popularity || 0;

  return (
    <Card
      className={cn(
        "flex flex-col items-center gap-6 rounded-3xl p-4 sm:flex-row sm:items-end md:p-6",
        className,
      )}
    >
      {/* Artist Image */}
      {image && (
        <div className="w-full shrink-0 sm:w-48 lg:w-64">
          <img
            src={image.url}
            alt={artist.name}
            className="aspect-square w-full rounded-lg object-cover"
          />
        </div>
      )}

      {/* Artist Info */}
      <div className="flex w-full flex-1 flex-col items-center text-center sm:items-start sm:text-left">
        {/* Artist Name */}
        <h1 className="text-foreground mb-2 text-3xl font-bold md:text-4xl">
          {artist?.name}
        </h1>

        {/* Followers */}
        <div className="text-muted-foreground mb-4 text-sm">
          {formatCompactNumber(artist?.followers?.total)} 位追蹤者
        </div>

        {/* Genres */}
        {artist?.genres && artist.genres.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap justify-center gap-2 md:justify-start">
              {artist.genres.slice(0, 5).map((genre) => (
                <span
                  key={genre}
                  className="bg-primary text-primary-foreground rounded-full px-3 py-1 text-xs"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Popularity Bar */}
        <div className="w-full max-w-xs">
          <div className="text-muted-foreground mb-2 text-xs">人氣度</div>
          <div className="bg-secondary h-2 w-full overflow-hidden rounded-full">
            <div
              className="bg-primary h-full transition-all"
              style={{ width: `${popularity}%` }}
            />
          </div>
          <div className="text-muted-foreground mt-1 text-xs">
            {popularity}/100
          </div>
        </div>
      </div>
    </Card>
  );
}
