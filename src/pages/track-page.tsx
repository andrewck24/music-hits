import { LoadingFallback } from "@/components/layout/loading-fallback";
import { ArtistsList } from "@/components/track/artists";
import { TrackFeatures } from "@/components/track/features";
import { TrackInfo } from "@/components/track/info";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useGetTrackQuery } from "@/services";
import { Suspense } from "react";
import { RiErrorWarningFill } from "react-icons/ri";
import { Link, useParams } from "react-router-dom";

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

  if (!trackId || !track) {
    return (
      <div className="m-auto max-w-7xl px-6 py-12">
        <Card className="p-8 text-center">
          <RiErrorWarningFill className="text-muted-foreground mx-auto mb-4 size-16" />
          <h2 className="text-foreground mb-2 text-2xl font-bold">
            糟糕！找不到歌曲...
          </h2>
          <p className="text-muted-foreground mb-6">請再嘗試重新搜尋歌曲。</p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild>
              <Link to="/">返回首頁</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/search">搜尋歌曲</Link>
            </Button>
          </div>
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
