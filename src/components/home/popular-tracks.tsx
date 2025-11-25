import { TrackCard } from "@/components/track/card";
import { TrackCardSkeleton } from "@/components/track/skeleton";
import { Carousel } from "@/components/ui/carousel";
import { RECOMMENDED_TRACK_IDS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useGetSeveralTracksQuery } from "@/services";
import { useTranslation } from "react-i18next";

interface PopularTracksProps {
  className?: string;
}

export function PopularTracks({ className }: PopularTracksProps) {
  const { t } = useTranslation("home");
  // Batch fetch track data
  // Note: data is not used directly - batch fetch populates cache via upsertQueryData
  // Child TrackCard components then fetch from cache via useGetTrackQuery
  const { isLoading, isError, error } = useGetSeveralTracksQuery([
    ...RECOMMENDED_TRACK_IDS,
  ]);

  // Silent degradation: log error but continue with local data
  if (isError && error) {
    // eslint-disable-next-line no-console
    console.error(
      "[PopularTracks] Batch fetch failed, using local data:",
      error,
    );
  }

  return (
    <section className={cn("", className)}>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-foreground text-2xl font-bold tracking-tight">
          {t("popularTracks.title")}
        </h2>
      </div>

      <Carousel>
        {isLoading
          ? // Render skeletons while batch fetching
            Array.from({ length: RECOMMENDED_TRACK_IDS.length }).map(
              (_, index) => (
                <TrackCardSkeleton
                  key={`skeleton-${index}`}
                  className="shrink-0 basis-40 snap-start md:basis-48"
                />
              ),
            )
          : // Render track cards (they will hit cache)
            RECOMMENDED_TRACK_IDS.map((trackId) => (
              <TrackCard
                key={trackId}
                trackId={trackId}
                className="shrink-0 basis-40 snap-start md:basis-48"
              />
            ))}
      </Carousel>
    </section>
  );
}
