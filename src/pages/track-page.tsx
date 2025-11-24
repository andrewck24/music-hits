import { LoadingFallback } from "@/components/layout/loading-fallback";
import { ArtistsList } from "@/components/track/artists";
import { TrackFeatures } from "@/components/track/features";
import { TrackInfo } from "@/components/track/info";
import { Card } from "@/components/ui/card";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useGetTrackQuery } from "@/services";
import { Suspense } from "react";
import { useParams } from "react-router-dom";

/**
 * TrackPage Component
 *
 * Purpose: Display track information and audio features
 *
 * Features:
 * - Load track data and audio features from RTK Query
 * - Display track details with TrackDetail component
 * - Show artist link
 * - Dynamic page title
 * - Support browser back/forward navigation
 *
 * Route: /track/:trackId (flat structure, no artistId in URL)
 */

export function TrackPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <TrackPageContent />
    </Suspense>
  );
}
function TrackPageContent() {
  const { trackId } = useParams<{ trackId: string }>();

  // Get track data from Spotify API
  const { data: track } = useGetTrackQuery(trackId || "", { skip: !trackId });

  // Set document title
  useDocumentTitle(track ? `${track.name} | Music Hits` : "Music Hits");

  if (!trackId) {
    return (
      <div className="p-6">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground text-lg">找不到歌曲ID</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 pb-20">
      <TrackInfo trackId={trackId} className="mb-8" />
      <TrackFeatures trackId={trackId} className="mb-8" />
      <ArtistsList trackId={trackId} />
    </div>
  );
}
