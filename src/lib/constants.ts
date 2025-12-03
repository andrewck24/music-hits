/**
 * Recommended Artists for Home Page
 *
 * Predefined list of 8 high-popularity Spotify artists displayed on the home page.
 * These artists are selected for their popularity and diversity across genres.
 *
 * No dynamic calculation is performed - this is a static list.
 * Artists are sourced from Spotify's popularity charts.
 *
 * Artist Details:
 * 1. Taylor Swift - American singer-songwriter, pop/country
 * 2. TWICE - South Korean girl group, K-pop
 * 3. Hans Zimmer - German film score composer
 * 4. Billie Eilish - American singer-songwriter, alternative/pop
 * 5. Bruno Mars - American singer, pop/R&B/funk
 * 6. Ariana Grande - American singer, pop
 * 7. YOASOBI - Japanese Band, J-pop
 * 8. Adele - British singer, pop/soul
 */

export const RECOMMENDED_ARTIST_IDS = [
  "06HL4z0CvFAxyc27GXpf02", // Taylor Swift
  "7n2Ycct7Beij7Dj7meI4X0", // TWICE
  "0YC192cP3KPCRWx8zr8MfZ", // Hans Zimmer
  "6qqNVTkY8uBg9cP3Jd7DAH", // Billie Eilish
  "0du5cEVh5yTK9QJze8zA0C", // Bruno Mars
  "66CXWjxzNUsdJxJ2JdwvnR", // Ariana Grande
  "64tJ2EAv1R6UaZqc4iOCyj", // YOASOBI
  "4dpARuHxo51G3z768sgnrY", // Adele
] as const;

export type RecommendedArtistId = (typeof RECOMMENDED_ARTIST_IDS)[number];

/**
 * Recommended Tracks for Home Page
 *
 * Predefined list of 8 high-popularity Spotify tracks.
 */
export const RECOMMENDED_TRACK_IDS = [
  "3zhbXKFjUDw40pTYyCgt1Y", // What is Love - TWICE
  "7qiZfU4dY1lWllzX7mPBI3", // Shape of You - Ed Sheeran
  "6ocbgoVGwYJhOv1GgI9NsF", // 7 Rings - Ariana Grande
  "1zwMYTA5nlNjZxYrvBB2pV", // Someone Like You - Adele
  "2tJulUYLDKOg9XrtVkMgcJ", // Grenade - Bruno Mars
  "3AJwUDP919kvQ9QcozQPxg", // Yellow - Coldplay
  "6MCjmGYlw6mQVWRFVgBRvB", // 夜に駆ける - YOASOBI
  "1p80LdxRV74UKvL8gnD7ky", // Blank Space - Taylor Swift
] as const;

export type RecommendedTrackId = (typeof RECOMMENDED_TRACK_IDS)[number];

// 統計數據來自 scripts/analyze-popularity.ts 的分析結果
export const POPULARITY_STATS = {
  playCount: {
    min: 0,
    max: 3548193328,
    mean: 168245940,
    median: 68709599,
  },
  youtubeViews: {
    min: 0,
    max: 8166607032,
    mean: 111391385,
    median: 22089508,
  },
  youtubeLikes: {
    min: 0,
    max: 51492034,
    mean: 778060,
    median: 178218,
  },
  youtubeComments: {
    min: 0,
    max: 15971231,
    mean: 31671,
    median: 4491,
  },
};
