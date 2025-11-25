import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useGetAudioFeaturesQuery } from "@/services";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

/**
 * FeatureChart Component
 *
 * Purpose: 使用雷達圖顯示歌曲的音樂特徵
 *
 * Features:
 * - 7 個音樂特徵指標 (0-1 標準化)
 *   - Acousticness (聲學程度)
 *   - Danceability (適合跳舞)
 *   - Energy (能量)
 *   - Instrumentalness (器樂程度)
 *   - Liveness (現場感)
 *   - Speechiness (語音內容)
 *   - Valence (正向度)
 * - 使用 Spotify 綠色填充
 * - 中文標籤
 *
 * Props:
 * - trackId: Spotify Track ID
 * - className: Optional additional CSS classes
 *
 * Usage:
 *   `<FeatureChart trackId="someTrackId" className="optional-class" />`
 */

interface FeatureChartProps {
  trackId: string;
  className?: string;
}

export function FeatureChart({ trackId, className }: FeatureChartProps) {
  const { t } = useTranslation("track");
  const {
    data: features,
    isLoading,
    error,
  } = useGetAudioFeaturesQuery(trackId);

  const chartData = useMemo(() => {
    if (!features) {
      return [];
    }

    return [
      {
        name: t("featureChart.labels.acousticness"),
        value: features.acousticness,
        fullMark: 1,
      },
      {
        name: t("featureChart.labels.danceability"),
        value: features.danceability,
        fullMark: 1,
      },
      {
        name: t("featureChart.labels.energy"),
        value: features.energy,
        fullMark: 1,
      },
      {
        name: t("featureChart.labels.instrumentalness"),
        value: features.instrumentalness,
        fullMark: 1,
      },
      {
        name: t("featureChart.labels.liveness"),
        value: features.liveness,
        fullMark: 1,
      },
      {
        name: t("featureChart.labels.speechiness"),
        value: features.speechiness,
        fullMark: 1,
      },
      {
        name: t("featureChart.labels.valence"),
        value: features.valence,
        fullMark: 1,
      },
    ];
  }, [features, t]);

  if (isLoading) return <FeatureChartSkeleton className={className} />;

  if (!features || error) return <FeatureChartError className={className} />;

  return (
    <Card className={cn("flex h-full flex-col gap-4 p-4 md:p-6", className)}>
      <h3 className="text-foreground font-semibold">
        {t("featureChart.title")}
      </h3>
      <ResponsiveContainer width="100%" height="100%" className="min-h-80">
        <RadarChart
          data={chartData}
          // margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          aria-label={t("featureChart.title")}
        >
          <PolarGrid stroke="#404040" />
          <PolarAngleAxis
            dataKey="name"
            tick={{ fill: "#B3B3B3", fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 1]}
            tick={{ fill: "#B3B3B3", fontSize: 10 }}
          />
          <Radar
            name={t("featureChart.featureValue")}
            dataKey="value"
            stroke="#1DB954"
            fill="#1DB954"
            fillOpacity={0.6}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#181818",
              border: "1px solid #404040",
              borderRadius: "4px",
            }}
            labelStyle={{ color: "#B3B3B3" }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </Card>
  );
}

interface FeatureChartSkeletonProps {
  className?: string;
}

function FeatureChartSkeleton({ className }: FeatureChartSkeletonProps) {
  const { t } = useTranslation("track");

  return (
    <Card className={cn("flex h-full flex-col gap-4 p-4 md:p-6", className)}>
      <h3 className="text-foreground font-semibold">
        {t("featureChart.title")}
      </h3>
      <Skeleton className="h-full min-h-80" />
    </Card>
  );
}

interface FeatureChartSkeletonProps {
  className?: string;
}

function FeatureChartError({ className }: FeatureChartSkeletonProps) {
  const { t } = useTranslation("track");

  return (
    <Card className={cn("flex h-full flex-col gap-4 p-4 md:p-6", className)}>
      <h3 className="text-foreground font-semibold">
        {t("featureChart.title")}
      </h3>
      <p className="text-muted-foreground flex h-full min-h-80 items-center justify-center">
        {t("featureChart.loadError")}
      </p>
    </Card>
  );
}
