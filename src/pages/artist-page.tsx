import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { useGetArtistQuery } from "@/services";
import { selectTracks } from "@/features/data/data-selectors";
import { loadLocalData } from "@/features/data/data-slice";
import { ArtistProfile } from "@/components/artist/artist-profile";
import { Spinner } from "@/components/ui/spinner";
import { Card } from "@/components/ui/card";

/**
 * ArtistPage Component
 *
 * Purpose: Display artist information and their tracks
 *
 * Features:
 * - Load artist data from RTK Query
 * - Display artist profile with ArtistProfile component
 * - Show tracks from local database for this artist
 * - Link to track detail pages
 * - Support browser back/forward navigation
 *
 * Route: /artist/:artistId
 */

export default function ArtistPage() {
  const { artistId } = useParams<{ artistId: string }>();
  const dispatch = useAppDispatch();

  // Load local data on mount to get artist tracks
  useEffect(() => {
    dispatch(loadLocalData());
  }, [dispatch]);

  // Get artist data from Spotify API
  const { data: artist, isLoading, error } = useGetArtistQuery(
    artistId || "",
    { skip: !artistId }
  );

  // Get local tracks and filter by artist
  const tracks = useAppSelector(selectTracks);
  const artistTracks = tracks.filter(
    (track) => track.artistId === artistId
  );

  if (!artistId) {
    return (
      <div className="min-h-screen bg-background p-6">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground text-lg">
            找不到藝人ID
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="text-primary hover:text-primary/80 mb-4 inline-block"
          >
            ← 返回首頁
          </Link>
          <h1 className="text-4xl font-bold text-foreground">藝人詳情</h1>
        </div>

        {/* Artist Info Section */}
        <div className="mb-8">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner />
            </div>
          ) : error ? (
            <Card className="p-8 text-center">
              <p className="text-destructive text-lg mb-4">
                無法載入藝人資訊
              </p>
              <p className="text-muted-foreground text-sm">
                {error && typeof error === 'object' && 'message' in error
                  ? (error.message as string)
                  : String(error)}
              </p>
            </Card>
          ) : (
            <ArtistProfile artist={artist} />
          )}
        </div>

        {/* Tracks Section */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">
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
                <Link
                  key={`${track.trackId}-${track.artistId}`}
                  to={`/track/${track.trackId}`}
                  className="block"
                >
                  <Card className="p-4 hover:bg-secondary transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">
                          {track.trackName}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {track.releaseYear}
                        </p>
                      </div>
                      <div className="ml-4 text-sm text-primary">
                        人氣度: {(track.popularity.playCount || 0).toLocaleString()}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
