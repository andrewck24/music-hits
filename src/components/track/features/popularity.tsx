import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { POPULARITY_STATS } from "@/lib/constants";
import { formatCompactNumber, formatNumber } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { tracksLoader } from "@/loaders/tracks-loader";
import { useRouteLoaderData } from "react-router-dom";

interface PopularityChartProps {
  trackId: string;
  className?: string;
}

/**
 * PopularityChart Component
 *
 * Purpose: 顯示歌曲的人氣度統計圖表
 *
 * Features:
 * - Spotify 播放次數 (Primary Green)
 * - YouTube 觀看次數 (Destructive Red)
 * - YouTube 按讚數 (Destructive Red)
 * - YouTube 留言數 (Destructive Red)
 * - 顯示中位數和平均值標記線
 * - 使用對數刻度以更好地展示大範圍數據
 * - Hover 顯示詳細統計數據
 *
 * Props:
 * - trackId: Spotify track ID
 * - className: Optional additional CSS classes
 *
 * Data Sources:
 * - localTrack: LocalTrackData object (包含人氣度數據)
 * - STATS: 從 analyze-popularity.ts 計算得出的統計數據
 *
 * Usage:
 *   `<PopularityChart trackId={trackId} />`
 */
export function PopularityChart({ trackId, className }: PopularityChartProps) {
  const { tracks: tracksDatabase } = useRouteLoaderData("root") as Awaited<
    ReturnType<typeof tracksLoader>
  >;
  const localTrack = tracksDatabase.tracks.find((t) => t.trackId === trackId);

  if (!localTrack) return <PopularityChartError className={className} />;

  return (
    <Card className={cn("flex h-full flex-col gap-4 p-4 md:p-6", className)}>
      <h3 className="text-foreground font-semibold">人氣度分析</h3>
      {/* Spotify 播放次數 */}
      <BarWithStats
        label="Spotify 播放次數"
        value={localTrack.popularity.playCount}
        min={POPULARITY_STATS.playCount.min}
        max={POPULARITY_STATS.playCount.max}
        mean={POPULARITY_STATS.playCount.mean}
        median={POPULARITY_STATS.playCount.median}
        colorClass="bg-primary shadow-[0_0_10px_var(--color-primary)/0.25]"
      />

      {/* YouTube 觀看次數 */}
      <BarWithStats
        label="YouTube 觀看次數"
        value={localTrack.popularity.youtubeViews}
        min={POPULARITY_STATS.youtubeViews.min}
        max={POPULARITY_STATS.youtubeViews.max}
        mean={POPULARITY_STATS.youtubeViews.mean}
        median={POPULARITY_STATS.youtubeViews.median}
        colorClass="bg-destructive shadow-[0_0_10px_var(--color-destructive)/0.25]"
      />

      {/* YouTube 按讚數 */}
      <BarWithStats
        label="YouTube 按讚數"
        value={localTrack.popularity.youtubeLikes}
        min={POPULARITY_STATS.youtubeLikes.min}
        max={POPULARITY_STATS.youtubeLikes.max}
        mean={POPULARITY_STATS.youtubeLikes.mean}
        median={POPULARITY_STATS.youtubeLikes.median}
        colorClass="bg-destructive shadow-[0_0_10px_var(--color-destructive)/0.25]"
      />

      {/* YouTube 留言數 */}
      <BarWithStats
        label="YouTube 留言數"
        value={localTrack.popularity.youtubeComments}
        min={POPULARITY_STATS.youtubeComments.min}
        max={POPULARITY_STATS.youtubeComments.max}
        mean={POPULARITY_STATS.youtubeComments.mean}
        median={POPULARITY_STATS.youtubeComments.median}
        colorClass="bg-destructive shadow-[0_0_10px_var(--color-destructive)/0.25]"
      />

      {/* 圖例說明 */}
      <div className="border-border text-muted-foreground flex flex-wrap gap-4 border-t pt-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="bg-foreground/60 h-3 w-3 rounded-full" />
          <span>中位數</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-chart-3/60 h-3 w-3 rounded-full" />
          <span>平均值</span>
        </div>
        <div className="text-muted-foreground/60 flex-1 text-right">
          * 使用對數刻度展示，上限為本資料庫 (2023) 最大值
        </div>
      </div>
    </Card>
  );
}

interface BarWithStatsProps {
  label: string;
  value: number;
  min: number;
  max: number;
  mean: number;
  median: number;
  colorClass: string;
  unit?: string;
}

function BarWithStats({
  label,
  value,
  min,
  max,
  mean,
  median,
  colorClass,
  unit = "",
}: BarWithStatsProps) {
  // 計算百分比位置（使用對數刻度以更好地展示大範圍數據）
  const calculateLogPosition = (val: number) => {
    if (val <= min) return 0;
    if (val >= max) return 100;
    const logMin = Math.log10(min + 1);
    const logMax = Math.log10(max + 1);
    const logVal = Math.log10(val + 1);
    return ((logVal - logMin) / (logMax - logMin)) * 100;
  };

  const valuePosition = calculateLogPosition(value);
  const meanPosition = calculateLogPosition(mean);
  const medianPosition = calculateLogPosition(median);

  return (
    <div className="space-y-2">
      {/* 標籤與數值 */}
      <div className="flex items-baseline justify-between">
        <span className="text-foreground text-sm font-medium">{label}</span>
        <span className="text-muted-foreground text-sm">
          {formatCompactNumber(value)}
          {unit}
        </span>
      </div>

      {/* 條狀圖容器 - 包含 Tooltip */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="bg-secondary relative h-8 w-full cursor-pointer rounded-full">
            {/* 條狀圖 */}
            <div
              className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${colorClass}`}
              style={{
                width: `${valuePosition}%`,
              }}
            />

            {/* 中位數標記線 */}
            <div
              className="bg-foreground/60 absolute top-0 h-full w-0.5"
              style={{ left: `${medianPosition}%` }}
            >
              <div className="absolute -top-1 left-1/2 -translate-x-1/2">
                <div className="border-foreground/60 h-2 w-2 rotate-45 border-t-2 border-l-2" />
              </div>
            </div>

            {/* 平均值標記線 */}
            <div
              className="bg-chart-3/60 absolute top-0 h-full w-0.5"
              style={{ left: `${meanPosition}%` }}
            >
              <div className="absolute -top-1 left-1/2 -translate-x-1/2">
                <div className="bg-chart-3/60 h-2 w-2 rounded-full" />
              </div>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent className="space-y-1">
          <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs">
            <span className="font-medium">{label}</span>
            <span className="text-right font-medium">
              {formatNumber(value)}
              {unit}
            </span>
            <span className="text-muted-foreground">中位數：</span>
            <span className="text-right">
              {formatNumber(median)}
              {unit}
            </span>
            <span className="text-muted-foreground">平均值：</span>
            <span className="text-right">
              {formatNumber(mean)}
              {unit}
            </span>
            <span className="text-muted-foreground">範圍：</span>
            <span className="text-right">
              {formatNumber(min)} - {formatNumber(max)}
            </span>
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

interface PopularityChartErrorProps {
  className?: string;
}

function PopularityChartError({ className }: PopularityChartErrorProps) {
  return (
    <Card className={cn("flex h-full flex-col gap-4 p-4 md:p-6", className)}>
      <h3 className="text-foreground font-semibold">人氣度分析</h3>
      <p className="text-muted-foreground flex h-full min-h-80 items-center justify-center">
        無法獲取人氣度數據
      </p>
    </Card>
  );
}
