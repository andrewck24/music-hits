import { Card } from "@/components/ui/card";
import { useGetTrackQuery } from "@/services";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface ArtistsListProps {
  trackId: string;
  className?: string;
}

/**
 * ArtistsList Component
 *
 * Purpose: 顯示歌曲的藝術家列表
 *
 * Features:
 * - 列出所有參與藝術家
 * - 每個藝術家名稱可點擊，導向其 Artist 頁面
 *
 * Props:
 * - trackId: Spotify track ID
 * - className: Optional additional CSS classes
 *
 * Usage:
 *   `<ArtistsList trackId="someTrackId" className="optional-class" />`
 */
export function ArtistsList({ trackId, className }: ArtistsListProps) {
  const { data: track, isLoading, error } = useGetTrackQuery(trackId);

  if (isLoading || error || !track) return null;

  return (
    <section className={cn("border-border border-t pt-8", className)}>
      <h2 className="text-foreground mb-4 text-2xl font-bold">藝人資訊</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {track.artists.map((artist) => (
          <Link key={artist.id} to={`/artist/${artist.id}`} className="group">
            <Card className="hover:bg-secondary h-full cursor-pointer p-6 transition-colors">
              <h3 className="text-foreground group-hover:text-primary text-lg font-semibold transition-colors">
                {artist.name}
              </h3>
              <p className="text-muted-foreground mt-2 text-sm">
                點擊查看藝人詳細資訊
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
