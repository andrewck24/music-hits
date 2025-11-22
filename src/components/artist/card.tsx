import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useGetArtistQuery } from "@/services";
import { RiUser3Line } from "react-icons/ri";
import { Link } from "react-router-dom";

/**
 * ArtistCard Component
 *
 * Purpose: 可重用的藝人卡片元件，透過 RTK Query hook 獲取快取資料
 *
 * Features:
 * - 圓形頭像（Spotify 藝人頭像標準）
 * - 整卡可點擊，導航至 /artist/:artistId
 * - 支援 grid 佈局（響應式）
 * - 漸進式增強：先顯示本地資料，API 返回後更新
 * - 無圖片時顯示 placeholder
 * - 遵循 Spotify Design Guidelines
 *
 * Props:
 * - artistId: 藝人 ID（用於 RTK Query hook）
 * - artistName: 藝人名稱（本地資料，作為 fallback）
 *
 * Cache Strategy:
 * - 父元件先執行 batch fetch，透過 upsertQueryData 填充快取
 * - 父元件使用 isLoading 控制 skeleton 顯示
 * - 本元件的 useGetArtistQuery 會直接命中快取（無額外網路請求）
 *
 * Usage:
 *   <ArtistCard
 *     artistId="3AA28KZvwAUcZuOKwyblJQ"
 *     artistName="Gorillaz"
 *   />
 */

interface ArtistCardProps {
  artistId: string;
  artistName: string;
  className?: string;
}

export function ArtistCard({
  artistId,
  artistName,
  className,
}: ArtistCardProps) {
  // Fetch artist data from cache (populated by parent's batch fetch)
  const { data: artist } = useGetArtistQuery(artistId);

  // Progressive enhancement: use API data if available, fallback to local data
  const displayName = artist?.name ?? artistName;
  const imageUrl = artist?.images[0]?.url;

  return (
    <Link to={`/artist/${artistId}`} className={cn("block min-w-0", className)}>
      <Card className="bg-muted hover:bg-muted/80 cursor-pointer p-4 transition-colors">
        {/* Artist Image - placeholder if no image */}
        <div className="mb-3">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={displayName}
              className="aspect-square w-full rounded-full object-cover"
            />
          ) : (
            <div className="bg-secondary flex aspect-square items-center justify-center rounded-full">
              <span
                className="text-muted-foreground text-4xl"
                aria-label={displayName}
              >
                <RiUser3Line />
              </span>
            </div>
          )}
        </div>

        {/* Artist Name - always visible (local or API data) */}
        <h3 className="truncate text-center font-semibold text-white">
          {displayName}
        </h3>
      </Card>
    </Link>
  );
}
