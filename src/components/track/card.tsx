import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useGetTrackQuery } from "@/services";
import { RiMusic2Line } from "react-icons/ri";
import { Link } from "react-router-dom";

interface TrackCardProps {
  trackId: string;
  className?: string;
}

export function TrackCard({ trackId, className }: TrackCardProps) {
  // Fetch track data from cache (populated by parent's batch fetch)
  const { data: track } = useGetTrackQuery(trackId);

  // Fallback if data is missing (shouldn't happen if batch fetch works)
  if (!track) return null;

  const imageUrl = track.album.images[0]?.url;
  const artistName = track.artists.map((a) => a.name).join(", ");

  return (
    <Link to={`/track/${trackId}`} className={cn("block min-w-0", className)}>
      <Card className="bg-muted hover:bg-muted/80 cursor-pointer p-4 transition-colors">
        {/* Album Artwork */}
        <div className="mb-3">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={track.name}
              className="aspect-square w-full rounded-md object-cover"
            />
          ) : (
            <div className="bg-secondary flex aspect-square items-center justify-center rounded-md">
              <span
                className="text-muted-foreground text-4xl"
                aria-label={track.name}
              >
                <RiMusic2Line />
              </span>
            </div>
          )}
        </div>

        {/* Track Title */}
        <h3
          className="text-foreground truncate font-semibold"
          title={track.name}
        >
          {track.name}
        </h3>

        {/* Artist Name */}
        <p
          className="text-muted-foreground truncate text-sm"
          title={artistName}
        >
          {artistName}
        </p>
      </Card>
    </Link>
  );
}
