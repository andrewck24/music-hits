import { TrackItem } from "@/components/track/item";
import { TrackSkeleton } from "@/components/track/skeleton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useGetSeveralTracksQuery } from "@/services";
import type { LocalTrackData } from "@/types/data-schema";

interface TrackSearchResultsProps {
  tracks: LocalTrackData[];
  viewMode: "preview" | "full";
  onViewAll?: () => void;
  query: string;
}

export function TrackSearchResults({
  tracks,
  viewMode,
  onViewAll,
  query,
}: TrackSearchResultsProps) {
  // Get track IDs for batch fetch
  const displayTracks = viewMode === "preview" ? tracks.slice(0, 5) : tracks;
  const trackIds = displayTracks.map((t) => t.trackId);

  // Batch fetch track data (skip if no tracks)
  const { data: batchedTracks, isLoading } = useGetSeveralTracksQuery(trackIds, {
    skip: trackIds.length === 0,
  });

  // Create a map for quick lookup of batched track data
  const trackDataMap = new Map(
    batchedTracks?.map((track) => [track.id, track]) ?? [],
  );

  if (tracks.length === 0) {
    if (viewMode === "full") {
      return (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground text-lg">
            未找到 &quot;{query}&quot; 相關歌曲
          </p>
        </Card>
      );
    }
    return null;
  }

  const showViewAll = viewMode === "preview" && tracks.length > 5;

  // Render skeleton loading state
  const renderSkeletons = (count: number) =>
    Array.from({ length: count }).map((_, index) => (
      <TrackSkeleton key={`skeleton-${index}`} />
    ));

  // Render track items with batched data
  const renderTrackItems = () =>
    displayTracks.map((track) => {
      const batchedData = trackDataMap.get(track.trackId);
      return (
        <TrackItem
          key={track.trackId}
          trackId={track.trackId}
          trackName={batchedData?.name ?? track.trackName}
          artistName={batchedData?.artists[0]?.name ?? track.artistName}
          artistId={batchedData?.artists[0]?.id ?? track.artistId}
          releaseYear={track.releaseYear}
          imageUrl={batchedData?.album?.images[0]?.url}
          showArtistLink={true}
        />
      );
    });

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-foreground text-2xl font-semibold">歌曲</h2>
        {showViewAll && onViewAll && (
          <Button variant="ghost" onClick={onViewAll}>
            查看全部歌曲
          </Button>
        )}
      </div>
      <div className="space-y-2">
        {isLoading ? renderSkeletons(displayTracks.length) : renderTrackItems()}
      </div>
    </div>
  );
}
