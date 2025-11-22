import { ArtistCard } from "@/components/artist/card";
import { ArtistSkeleton } from "@/components/artist/skeleton";
import { Carousel } from "@/components/ui/carousel";
import { RECOMMENDED_ARTIST_IDS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useGetSeveralArtistsQuery } from "@/services";

interface PopularArtistsProps {
  className?: string;
}

export function PopularArtists({ className }: PopularArtistsProps) {
  // Batch fetch artist data
  // Note: data is not used directly - batch fetch populates cache via upsertQueryData
  // Child ArtistCard components then fetch from cache via useGetArtistQuery
  const { isLoading, isError, error } = useGetSeveralArtistsQuery([
    ...RECOMMENDED_ARTIST_IDS,
  ]);

  // Silent degradation: log error but continue with local data (ArtistCard handles fallback)
  if (isError && error) {
    // eslint-disable-next-line no-console
    console.error(
      "[PopularArtists] Batch fetch failed, using local data:",
      error,
    );
  }

  return (
    <section className={cn("", className)}>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-foreground text-2xl font-bold tracking-tight">
          Popular Artists
        </h2>
      </div>

      <Carousel>
        {isLoading
          ? // Render skeletons while batch fetching
            Array.from({ length: RECOMMENDED_ARTIST_IDS.length }).map(
              (_, index) => (
                <ArtistSkeleton
                  key={`skeleton-${index}`}
                  className="shrink-0 basis-[10rem] snap-start md:basis-[12rem]"
                />
              ),
            )
          : // Render artist cards (they will hit cache)
            RECOMMENDED_ARTIST_IDS.map((artistId) => (
              <ArtistCard
                key={artistId}
                artistId={artistId}
                artistName="" // Name will be fetched
                className="shrink-0 basis-[10rem] snap-start md:basis-[12rem]"
              />
            ))}
      </Carousel>
    </section>
  );
}
