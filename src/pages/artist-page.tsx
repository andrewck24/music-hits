import { ArtistProfile } from "@/components/artist/profile";
import { LoadingFallback } from "@/components/layout/loading-fallback";
import { TrackItem } from "@/components/track/item";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useDocumentTitle } from "@/hooks/use-document-title";
import type { tracksLoader } from "@/loaders/tracks-loader";
import { useGetArtistQuery } from "@/services";
import { Suspense } from "react";
import { RiUserUnfollowLine } from "react-icons/ri";
import { Link, useParams, useRouteLoaderData } from "react-router-dom";

/**
 * ArtistPage Component
 *
 * Purpose: Display artist information and their tracks
 *
 * Features:
 * - Load artist data from RTK Query (via ArtistProfile component)
 * - Display artist profile with ArtistProfile component
 * - Show tracks from local database for this artist using TrackItem component
 * - Dynamic page title
 * - Link to track detail pages
 * - Support browser back/forward navigation
 * - Error handling for invalid artist ID
 *
 * Route: /artist/:artistId
 */

export function ArtistPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ArtistPageContent />
    </Suspense>
  );
}

function ArtistPageContent() {
  const { artistId } = useParams<{ artistId: string }>();

  // Get tracks from loader (loaded before page render)
  const { tracks: tracksDatabase } = useRouteLoaderData("root") as Awaited<
    ReturnType<typeof tracksLoader>
  >;

  // Get artist data for document title
  const { data: artist } = useGetArtistQuery(artistId || "", {
    skip: !artistId,
  });

  // Set document title
  useDocumentTitle(artist ? `${artist.name} | Music Hits` : "Music Hits");

  // Filter local tracks by artist
  const artistTracks = artistId
    ? tracksDatabase.tracks.filter((track) => track.artistId === artistId)
    : [];

  // Handle invalid artist ID
  if (!artistId || !artist) {
    return (
      <div className="m-auto max-w-7xl px-6 py-12">
        <Card className="p-8 text-center">
          <RiUserUnfollowLine className="text-muted-foreground mx-auto mb-4 size-16" />
          <h2 className="text-foreground mb-2 text-2xl font-bold">
            糟糕！找不到藝人...
          </h2>
          <p className="text-muted-foreground mb-6">請再嘗試重新搜尋藝人。</p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild>
              <Link to="/">返回首頁</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/search">搜尋藝人</Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 pb-20">
      {/* Artist Info Section */}
      <div className="mb-8">
        <ArtistProfile artistId={artistId} />
      </div>

      {/* Tracks Section */}
      <div>
        <h2 className="text-foreground mb-4 text-2xl font-bold">
          該藝人的歌曲
        </h2>

        {artistTracks.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground text-lg">
              本地資料庫中未找到該藝人的歌曲
            </p>
          </Card>
        ) : (
          <div className="space-y-2">
            {artistTracks.map((track) => (
              <TrackItem
                key={`${track.trackId}-${track.artistId}`}
                trackId={track.trackId}
                trackName={track.trackName}
                artistName={track.artistName}
                artistId={track.artistId}
                releaseYear={track.releaseYear}
                showArtistLink={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
