import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDuration } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { useGetAudioFeaturesQuery, useGetTrackQuery } from "@/services";

interface OtherFeaturesProps {
  trackId: string;
  className?: string;
}

/**
 * OtherFeatures Component
 *
 * Purpose: 顯示歌曲的其他相關特徵或資訊
 *
 * Features:
 * - 可擴展以包含更多特徵
 * - 與 TrackFeatures 組合使用
 *
 * Props:
 * - trackId: Spotify track ID
 * - className: Optional additional CSS classes
 *
 * Usage:
 *   `<OtherFeatures trackId="someTrackId" className="optional-class" />`
 */
export function OtherFeatures({ trackId, className }: OtherFeaturesProps) {
  const {
    data: features,
    isLoading: isFeatureLoading,
    error: featureError,
  } = useGetAudioFeaturesQuery(trackId);
  const {
    data: track,
    isLoading: isTrackLoading,
    error: trackError,
  } = useGetTrackQuery(trackId);

  const KEY_TEXT_MAP: Record<number, string> = {
    0: "C",
    1: "C♯/D♭",
    2: "D",
    3: "D♯/E♭",
    4: "E",
    5: "F",
    6: "F♯/G♭",
    7: "G",
    8: "G♯/A♭",
    9: "A",
    10: "A♯/B♭",
    11: "B",
  };

  const MODE_TEXT_MAP: Record<number, string> = {
    0: "Minor",
    1: "Major",
  };

  return (
    <div className={cn("grid grid-cols-2 gap-4 md:grid-cols-4", className)}>
      <Feature
        featureName="調性 (Key)"
        featureValue={features ? KEY_TEXT_MAP[features.key] : null}
        isLoading={isFeatureLoading}
        error={!!featureError}
      />
      <Feature
        featureName="調式 (Mode)"
        featureValue={features ? MODE_TEXT_MAP[features.mode] : null}
        isLoading={isFeatureLoading}
        error={!!featureError}
      />
      <Feature
        featureName="節奏 (Tempo)"
        featureValue={features ? features.tempo.toFixed(0).toString() : null}
        isLoading={isFeatureLoading}
        error={!!featureError}
      />
      <Feature
        featureName="時長 (Duration)"
        featureValue={track ? formatDuration(track.duration_ms) : null}
        isLoading={isTrackLoading}
        error={!!trackError}
      />
    </div>
  );
}

interface KeyProps {
  featureName: string;
  featureValue: string | null;
  isLoading: boolean;
  error: boolean;
  className?: string;
}

function Feature({
  featureName,
  featureValue,
  isLoading,
  error,
  className,
}: KeyProps) {
  if (isLoading) return <LoadingFallback className={className} />;

  if (!featureValue || error)
    return <ErrorFallback featureName={featureName} className={className} />;

  return (
    <Card className={cn("min-w-0 p-4 md:p-6", className)}>
      <h3 className="text-foreground mb-6 font-semibold">{featureName}</h3>
      <p className="mb-6 w-full truncate text-center text-5xl md:text-6xl lg:text-7xl">
        {featureValue}
      </p>
    </Card>
  );
}

interface LoadingFallbackProps {
  className?: string;
}

function LoadingFallback({ className }: LoadingFallbackProps) {
  return (
    <Card className={cn("p-4 md:p-6", className)}>
      <Skeleton className="mb-6 h-6 w-20" />
      <div className="flex justify-center">
        <Skeleton className="h-12 w-4/5" />
      </div>
    </Card>
  );
}

interface ErrorFallbackProps {
  featureName: string;
  className?: string;
}

function ErrorFallback({ featureName, className }: ErrorFallbackProps) {
  return (
    <Card className={cn("p-4 md:p-6", className)}>
      <h3 className="text-foreground mb-6 font-semibold">{featureName}</h3>
      <p className="text-muted-foreground mb-6 flex h-12 items-center justify-center text-center md:h-18">
        暫時沒有數據
      </p>
    </Card>
  );
}
