import { FeatureChart } from "@/components/track/features/chart";
import { OtherFeatures } from "@/components/track/features/other";
import { PopularityChart } from "@/components/track/features/popularity";
import { cn } from "@/lib/utils";

interface TrackFeaturesProps {
  trackId: string;
  className?: string;
}

/**
 * FeatureChart Component
 *
 * Props:
 * - trackId: Spotify Track ID
 * - className: Optional additional CSS classes
 *
 * Renders a radar chart displaying the audio features of a track:
 * - Acousticness
 * - Danceability
 * - Energy
 * - Instrumentalness
 * - Liveness
 * - Speechiness
 * - Valence
 *
 * Chart styling:
 * - Filled with Spotify green color
 * - Labels in Chinese
 *
 * Usage:
 *  `<TrackFeatures trackId="someTrackId" className="optional-class" />`
 */

export function TrackFeatures({ trackId, className }: TrackFeaturesProps) {
  return (
    <section
      className={cn(
        "grid grid-cols-1 gap-4 md:grid-flow-row-dense md:grid-cols-2",
        className,
      )}
    >
      <FeatureChart trackId={trackId} />
      <OtherFeatures trackId={trackId} className="md:col-span-2" />
      <PopularityChart trackId={trackId} />
    </section>
  );
}
