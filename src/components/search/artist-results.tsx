import { ArtistCard } from "@/components/artist/card";
import { ArtistSkeleton } from "@/components/artist/skeleton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollableRow } from "@/components/ui/scrollable-row";
import type { UniqueArtist } from "@/hooks/use-search";
import { useGetSeveralArtistsQuery } from "@/services";

interface ArtistSearchResultsProps {
  artists: UniqueArtist[];
  viewMode: "preview" | "full";
  onViewAll?: () => void;
  query: string;
}

export function ArtistSearchResults({
  artists,
  viewMode,
  onViewAll,
  query,
}: ArtistSearchResultsProps) {
  // Get artist IDs for batch fetch
  const displayArtists = viewMode === "preview" ? artists.slice(0, 8) : artists;
  const artistIds = displayArtists.map((a) => a.artistId);

  // Batch fetch artist data (skip if no artists)
  const { data: batchedArtists, isLoading } = useGetSeveralArtistsQuery(
    artistIds,
    { skip: artistIds.length === 0 },
  );

  // Create a map for quick lookup of batched artist data
  const artistDataMap = new Map(
    batchedArtists?.map((artist) => [artist.id, artist]) ?? [],
  );

  if (artists.length === 0) {
    if (viewMode === "full") {
      return (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground text-lg">
            未找到 &quot;{query}&quot; 相關藝人
          </p>
        </Card>
      );
    }
    return null;
  }

  const showViewAll = viewMode === "preview" && artists.length > 4;

  // Render skeleton loading state
  const renderSkeletons = (count: number, className?: string) =>
    Array.from({ length: count }).map((_, index) => (
      <ArtistSkeleton key={`skeleton-${index}`} className={className} />
    ));

  // Render artist cards with batched data
  const renderArtistCards = (className?: string) =>
    displayArtists.map((artist) => {
      const batchedData = artistDataMap.get(artist.artistId);
      return (
        <ArtistCard
          key={artist.artistId}
          artistId={artist.artistId}
          artistName={batchedData?.name ?? artist.artistName}
          imageUrl={batchedData?.images[0]?.url}
          className={className}
        />
      );
    });

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-foreground text-2xl font-semibold">藝人</h2>
        {showViewAll && onViewAll && (
          <Button variant="ghost" onClick={onViewAll}>
            查看全部藝人
          </Button>
        )}
      </div>

      {viewMode === "preview" ? (
        <ScrollableRow>
          {isLoading
            ? renderSkeletons(
                displayArtists.length,
                "shrink-0 basis-[12rem] snap-start",
              )
            : renderArtistCards("shrink-0 basis-[12rem] snap-start")}
        </ScrollableRow>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {isLoading
            ? renderSkeletons(displayArtists.length)
            : renderArtistCards()}
        </div>
      )}
    </div>
  );
}
