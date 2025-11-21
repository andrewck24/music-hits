import { Card } from "@/components/ui/card";
import { useGetTrackQuery } from "@/services";
import { RiMusic2Fill } from "react-icons/ri";
import { Link } from "react-router-dom";

/**
 * TrackItem Component
 *
 * Purpose: 可重用的歌曲列表項元件，透過 RTK Query hook 獲取快取資料
 *
 * Features:
 * - 水平佈局（[封面 48x48] [曲名/藝人] [年份]）
 * - 封面圓角 4px（Spotify 專輯封面標準）
 * - 藝人連結可選（showArtistLink prop）
 * - 漸進式增強：先顯示本地資料，API 返回後更新
 * - 無圖片時顯示 placeholder
 * - 遵循 Spotify Design Guidelines
 *
 * Props:
 * - trackId: 歌曲 ID（用於 RTK Query hook）
 * - trackName: 歌曲名稱（本地資料，作為 fallback）
 * - artistName: 藝人名稱（本地資料，作為 fallback）
 * - artistId: 藝人 ID（本地資料，作為 fallback）
 * - releaseYear: 發行年份（本地資料，Spotify API 無此欄位）
 * - showArtistLink: 是否顯示藝人連結（預設 true）
 *
 * Cache Strategy:
 * - 父元件先執行 batch fetch，透過 upsertQueryData 填充快取
 * - 父元件使用 isLoading 控制 skeleton 顯示
 * - 本元件的 useGetTrackQuery 會直接命中快取（無額外網路請求）
 *
 * Usage:
 *   <TrackItem
 *     trackId="3DXncPQOG4VBw3QHh3S817"
 *     trackName="Feel Good Inc."
 *     artistName="Gorillaz"
 *     artistId="3AA28KZvwAUcZuOKwyblJQ"
 *     releaseYear={2005}
 *     showArtistLink={true}
 *   />
 */

interface TrackItemProps {
  trackId: string;
  trackName: string;
  artistName: string;
  artistId: string;
  releaseYear?: number;
  showArtistLink?: boolean;
}

export function TrackItem({
  trackId,
  trackName,
  artistName,
  artistId,
  releaseYear,
  showArtistLink = true,
}: TrackItemProps) {
  // Fetch track data from cache (populated by parent's batch fetch)
  const { data: track } = useGetTrackQuery(trackId);

  // Progressive enhancement: use API data if available, fallback to local data
  const displayTrackName = track?.name ?? trackName;
  const displayArtistName = track?.artists[0]?.name ?? artistName;
  const displayArtistId = track?.artists[0]?.id ?? artistId;
  const imageUrl = track?.album?.images[0]?.url;

  return (
    <Card className="bg-muted hover:bg-muted/80 p-3 transition-colors">
      <div className="flex items-center gap-3">
        {/* Album Cover - placeholder if no image */}
        <Link to={`/track/${trackId}`} className="flex-shrink-0">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={displayTrackName}
              className="h-12 w-12 rounded object-cover"
            />
          ) : (
            <div className="bg-secondary flex h-12 w-12 items-center justify-center rounded">
              <span
                className="text-muted-foreground text-2xl"
                aria-label={displayTrackName}
              >
                <RiMusic2Fill />
              </span>
            </div>
          )}
        </Link>

        {/* Track Info - always visible (local or API data) */}
        <div className="min-w-0 flex-1">
          <Link to={`/track/${trackId}`}>
            <h4 className="truncate font-semibold text-white hover:underline">
              {displayTrackName}
            </h4>
          </Link>

          {showArtistLink ? (
            <Link to={`/artist/${displayArtistId}`}>
              <p className="hover:text-primary text-muted-foreground truncate text-sm hover:underline">
                {displayArtistName}
              </p>
            </Link>
          ) : (
            <p className="text-muted-foreground truncate text-sm">
              {displayArtistName}
            </p>
          )}
        </div>

        {/* Release Year - from local data */}
        {releaseYear && (
          <div className="text-muted-foreground flex-shrink-0 text-sm">
            {releaseYear}
          </div>
        )}
      </div>
    </Card>
  );
}
