import { ArtistCard } from "@/components/artist/card";
import { LoadingFallback } from "@/components/layout/loading-fallback";
import { SearchBar } from "@/components/layout/search-bar";
import { TrackItem } from "@/components/track/item";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollableRow } from "@/components/ui/scrollable-row";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useSearch } from "@/hooks/use-search";
import type { tracksLoader } from "@/loaders/tracks-loader";
import { Suspense, useState } from "react";
import { useRouteLoaderData, useSearchParams } from "react-router-dom";

/**
 * SearchPage Component
 *
 * Purpose: 搜尋結果頁（藝人 + 歌曲）
 *
 * Features:
 * - 從 URL 讀取搜尋查詢 (?q=keyword)
 * - 使用 useSearch hook（一次搜尋，過濾顯示）
 * - 分類篩選（全部 / 藝人 / 歌曲）
 * - 使用 ArtistCard 和 TrackItem 元件渲染結果
 * - 動態頁面 title
 *
 * Route: /search?q=keyword
 */

type Category = "all" | "artists" | "tracks";

export function SearchPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SearchPageContent />
    </Suspense>
  );
}

function SearchPageContent() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [category, setCategory] = useState<Category>("all");

  // Set document title
  useDocumentTitle("搜尋 | Music Hits");

  // Get tracks from loader (loaded before page render)
  const { tracks: tracksDatabase } = useRouteLoaderData("root") as Awaited<
    ReturnType<typeof tracksLoader>
  >;

  // Use search hook (single search, filter display)
  const results = useSearch(tracksDatabase.tracks, query);

  // Filter results by category
  const displayResults =
    category === "artists"
      ? { artists: results.artists, tracks: [] }
      : category === "tracks"
        ? { artists: [], tracks: results.tracks }
        : results;

  // Helper to switch category
  const handleViewAllArtists = () => setCategory("artists");
  const handleViewAllTracks = () => setCategory("tracks");

  // Determine if we should show "View All" buttons (only in "all" category)
  const showViewAllArtists = category === "all" && results.artists.length > 5;
  const showViewAllTracks = category === "all" && results.tracks.length > 5;

  // Slice results for "all" category
  const artistsToShow =
    category === "all"
      ? displayResults.artists.slice(0, 5)
      : displayResults.artists;
  const tracksToShow =
    category === "all"
      ? displayResults.tracks.slice(0, 5)
      : displayResults.tracks;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 pt-20 pb-4">
      {/* SearchBar (visible on mobile devices) */}
      <div className="fixed top-18 right-0 left-0 z-40 px-6 py-2 sm:hidden">
        <SearchBar />
      </div>

      {/* Category Filters */}
      {query.trim() &&
        (results.artists.length > 0 || results.tracks.length > 0) && (
          <div className="flex gap-2">
            <Button
              variant={category === "all" ? "default" : "outline"}
              onClick={() => setCategory("all")}
            >
              全部
            </Button>
            <Button
              variant={category === "artists" ? "default" : "outline"}
              onClick={() => setCategory("artists")}
            >
              藝人 ({results.artists.length})
            </Button>
            <Button
              variant={category === "tracks" ? "default" : "outline"}
              onClick={() => setCategory("tracks")}
            >
              歌曲 ({results.tracks.length})
            </Button>
          </div>
        )}

      {/* Search Results */}
      {!query.trim() ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground text-lg">
            在上方搜尋框輸入藝人或歌曲名稱以開始搜尋
          </p>
        </Card>
      ) : results.artists.length === 0 && results.tracks.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground text-lg">
            未找到 &quot;{query}&quot; 相關結果
          </p>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Artists Section */}
          {artistsToShow.length > 0 && (
            <>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-foreground text-2xl font-semibold">藝人</h2>
                {showViewAllArtists && (
                  <Button variant="ghost" onClick={handleViewAllArtists}>
                    查看全部藝人
                  </Button>
                )}
              </div>
              <ScrollableRow>
                {artistsToShow.map((artist) => (
                  <ArtistCard
                    key={artist.artistId}
                    artistId={artist.artistId}
                    artistName={artist.artistName}
                    className="shrink-0 basis-[12rem]"
                  />
                ))}
              </ScrollableRow>
            </>
          )}

          {/* Tracks Section */}
          {tracksToShow.length > 0 && (
            <>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-foreground text-2xl font-semibold">歌曲</h2>
                {showViewAllTracks && (
                  <Button variant="ghost" onClick={handleViewAllTracks}>
                    查看全部歌曲
                  </Button>
                )}
              </div>
              <div className="space-y-2">
                {tracksToShow.map((track) => (
                  <TrackItem
                    key={track.trackId}
                    trackId={track.trackId}
                    trackName={track.trackName}
                    artistName={track.artistName}
                    artistId={track.artistId}
                    releaseYear={track.releaseYear}
                    showArtistLink={true}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
