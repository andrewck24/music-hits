import { LoadingFallback } from "@/components/layout/loading-fallback";
import { ArtistsList } from "@/components/track/artists";
import { TrackFeatures } from "@/components/track/features";
import { TrackInfo } from "@/components/track/info";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useLocalizedPath } from "@/hooks/use-localized-path";
import { useGetTrackQuery } from "@/services";
import { Suspense } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation("track");
  const { trackId } = useParams<{ trackId: string }>();
  const homePath = useLocalizedPath("/");
  const searchPath = useLocalizedPath("/search");

  // Get track data from Spotify API
  const { data: track, isLoading } = useGetTrackQuery(trackId || "", {
    skip: !trackId,
  });

  // Set document title
  useDocumentTitle(track ? t("pageTitle", { name: track.name }) : "Music Hits");

  if (!trackId || (!track && !isLoading)) {
    return (
      <div className="m-auto max-w-7xl px-6 py-12">
        <Card className="p-8 text-center">
          <RiErrorWarningFill className="text-muted-foreground mx-auto mb-4 size-16" />
          <h2 className="text-foreground mb-2 text-2xl font-bold">
            {t("notFound.title")}
          </h2>
          <p className="text-muted-foreground mb-6">{t("notFound.message")}</p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild>
              <Link to={homePath}>{t("notFound.backToHome")}</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to={searchPath}>{t("notFound.searchTrack")}</Link>
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
