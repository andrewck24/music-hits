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
 * 3. Jay Chou - Taiwanese singer, pop/R&B/funk
 * 4. Billie Eilish - American singer-songwriter, alternative/pop
 * 5. Bruno Mars - American singer, pop/R&B/funk
 * 6. Ariana Grande - American singer, pop
 * 7. YOASOBI - Japanese Band, J-pop
 * 8. Adele - British singer, pop/soul
 */

export const RECOMMENDED_ARTIST_IDS = [
  "06HL4z0CvFAxyc27GXpf02", // Taylor Swift
  "7n2Ycct7Beij7Dj7meI4X0", // TWICE
  "2elBjNSdBE2Y3f0j1mjrql", // Jay Chou
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
  "4Rt9k4SE8dbfKzngxKJPq9", // 擱淺 - Jay Chou
  "1zwMYTA5nlNjZxYrvBB2pV", // Someone Like You - Adele
  "2tJulUYLDKOg9XrtVkMgcJ", // Grenade - Bruno Mars
  "0bYg9bo50gSsH3LtXe2SQn", // All I Want for Christmas is You - Mariah Carey
  "6MCjmGYlw6mQVWRFVgBRvB", // 夜に駆ける - YOASOBI
  "1p80LdxRV74UKvL8gnD7ky", // Blank Space - Taylor Swift
] as const;

export type RecommendedTrackId = (typeof RECOMMENDED_TRACK_IDS)[number];
