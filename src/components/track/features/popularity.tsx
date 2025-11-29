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
import { useTranslation } from "react-i18next";
import { useRouteLoaderData } from "react-router-dom";

interface PopularityChartProps {
  trackId: string;
  className?: string;
}

interface PopularityStats {
  min: number;
  max: number;
  mean: number;
  median: number;
}

/**
 * PopularityChart Component
 *
 * Purpose: Display track popularity statistics chart
 *
 * Features:
 * - Spotify Play Count (Primary Green)
 * - YouTube Views (Destructive Red)
 * - YouTube Likes (Destructive Red)
 * - YouTube Comments (Destructive Red)
 * - Display median and mean indicator lines
 * - Uses logarithmic scale for better visualization of wide-range data
 * - Hover to show detailed statistics
 *
 * Props:
 * - trackId: Spotify track ID
 * - className: Optional additional CSS classes
 *
 * Data Sources:
 * - localTrack: LocalTrackData object (contains popularity data)
 * - STATS: Statistical data calculated from analyze-popularity.ts
 *
 * Usage:
 *   `<PopularityChart trackId={trackId} />`
 */
export function PopularityChart({ trackId, className }: PopularityChartProps) {
  const { t } = useTranslation("track");
  const { tracks: tracksDatabase } = useRouteLoaderData("root") as Awaited<
    ReturnType<typeof tracksLoader>
  >;
  const localTrack = tracksDatabase.tracks.find((t) => t.trackId === trackId);

  if (!localTrack) return <PopularityChartError className={className} />;

  return (
    <Card className={cn("flex h-full flex-col gap-4 p-4 md:p-6", className)}>
      <h3 className="text-foreground font-semibold">{t("popularity.title")}</h3>
      <BarWithStats
        label={t("popularity.labels.playCount")}
        value={localTrack.popularity.playCount}
        stats={POPULARITY_STATS.playCount}
        className="bg-primary shadow-[0_0_10px_var(--color-primary)/0.25]"
      />
      <BarWithStats
        label={t("popularity.labels.youtubeViews")}
        value={localTrack.popularity.youtubeViews}
        stats={POPULARITY_STATS.youtubeViews}
        className="bg-destructive shadow-[0_0_10px_var(--color-destructive)/0.25]"
      />
      <BarWithStats
        label={t("popularity.labels.youtubeLikes")}
        value={localTrack.popularity.youtubeLikes}
        stats={POPULARITY_STATS.youtubeLikes}
        className="bg-destructive shadow-[0_0_10px_var(--color-destructive)/0.25]"
      />
      <BarWithStats
        label={t("popularity.labels.youtubeComments")}
        value={localTrack.popularity.youtubeComments}
        stats={POPULARITY_STATS.youtubeComments}
        className="bg-destructive shadow-[0_0_10px_var(--color-destructive)/0.25]"
      />

      {/* Legend */}
      <div className="border-border text-muted-foreground flex flex-wrap gap-4 border-t pt-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="bg-foreground/60 h-3 w-3 rounded-full" />
          <span>{t("popularity.legend.median")}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-chart-3/60 h-3 w-3 rounded-full" />
          <span>{t("popularity.legend.mean")}</span>
        </div>
        <div className="text-muted-foreground/60 flex-1 text-right">
          {t("popularity.legend.note")}
        </div>
      </div>
    </Card>
  );
}

interface BarWithStatsProps {
  label: string;
  value: number;
  stats: PopularityStats;
  className?: string;
  unit?: string;
}

function BarWithStats({
  label,
  value,
  stats,
  className,
  unit = "",
}: BarWithStatsProps) {
  const { t } = useTranslation("track");
  const { min, max, mean, median } = stats;

  // Calculate percentage position (using logarithmic scale for better visualization of wide-range data)
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
      {/* Label and Value */}
      <div className="flex items-baseline justify-between">
        <span className="text-foreground text-sm font-medium">{label}</span>
        <span className="text-muted-foreground text-sm">
          {formatCompactNumber(value)}
          {unit}
        </span>
      </div>

      {/* Bar Chart Container with Tooltip */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="bg-secondary relative h-8 w-full cursor-pointer rounded-full">
            {/* Bar */}
            <div
              className={cn(
                "absolute top-0 left-0 h-full rounded-full transition-all duration-500",
                className,
              )}
              style={{
                width: `${valuePosition}%`,
              }}
            />

            {/* Median Marker Line */}
            <div
              className="bg-foreground/60 absolute top-0 h-full w-0.5"
              style={{ left: `${medianPosition}%` }}
            >
              <div className="absolute -top-1 left-1/2 -translate-x-1/2">
                <div className="border-foreground/60 h-2 w-2 rotate-45 border-t-2 border-l-2" />
              </div>
            </div>

            {/* Mean Marker Line */}
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
            <span className="text-muted-foreground">
              {t("popularity.stats.median")}
            </span>
            <span className="text-right">
              {formatNumber(median)}
              {unit}
            </span>
            <span className="text-muted-foreground">
              {t("popularity.stats.mean")}
            </span>
            <span className="text-right">
              {formatNumber(mean)}
              {unit}
            </span>
            <span className="text-muted-foreground">
              {t("popularity.stats.range")}
            </span>
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
  const { t } = useTranslation("track");

  return (
    <Card className={cn("flex h-full flex-col gap-4 p-4 md:p-6", className)}>
      <h3 className="text-foreground font-semibold">{t("popularity.title")}</h3>
      <p className="text-muted-foreground flex h-full min-h-80 items-center justify-center">
        {t("popularity.loadError")}
      </p>
    </Card>
  );
}
