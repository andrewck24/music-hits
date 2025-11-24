import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useGetAudioFeaturesQuery } from "@/services";
import { useMemo } from "react";
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
  const { data: features, isLoading } = useGetAudioFeaturesQuery(trackId);

  const chartData = useMemo(() => {
    if (!features) {
      return [];
    }

    return [
      {
        name: "聲學",
        value: features.acousticness,
        fullMark: 1,
      },
      {
        name: "舞蹈",
        value: features.danceability,
        fullMark: 1,
      },
      {
        name: "能量",
        value: features.energy,
        fullMark: 1,
      },
      {
        name: "器樂",
        value: features.instrumentalness,
        fullMark: 1,
      },
      {
        name: "現場",
        value: features.liveness,
        fullMark: 1,
      },
      {
        name: "語音",
        value: features.speechiness,
        fullMark: 1,
      },
      {
        name: "正向",
        value: features.valence,
        fullMark: 1,
      },
    ];
  }, [features]);

  if (isLoading) {
    return (
      <Card className={cn("flex h-80 items-center justify-center", className)}>
        載入中...
      </Card>
    );
  }

  if (!features) {
    return (
      <Card className={cn("p-4 md:p-6", className)}>無法獲取音樂特徵數據</Card>
    );
  }

  return (
    <Card className={cn("p-4 md:p-6", className)}>
      <h3 className="text-foreground mb-6 font-semibold">音樂特徵分析</h3>
      <ResponsiveContainer width="100%" height="100%" className="min-h-80 pb-10">
        <RadarChart
          data={chartData}
          // margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          aria-label="音樂特徵雷達圖"
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
            name="特徵值"
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
