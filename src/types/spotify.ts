/**
 * Spotify Web API 型別定義
 *
 * 此檔案定義與 Spotify API 互動的合約介面，確保型別安全。
 * 基於 Spotify Web API Reference: https://developer.spotify.com/documentation/web-api
 * 以及 ReccoBeats Audio Features API: https://reccobeats.com/docs/apis/get-audio-features
 *
 * @version 1.1.0
 * @date 2025-10-08
 * @update 2025-11-24
 */

// ============================================================================
// Authentication (Client Credentials Flow)
// ============================================================================

/**
 * Request body for obtaining access token
 * POST https://accounts.spotify.com/api/token
 *
 * @interface SpotifyTokenRequest
 * @property {string} grant_type - Must be "client_credentials"
 * @property {string} client_id - Your Spotify Client ID
 * @property {string} client_secret - Your Spotify Client Secret
 */
export interface SpotifyTokenRequest {
  grant_type: "client_credentials";
  client_id: string;
  client_secret: string;
}

/**
 * Response from token endpoint
 *
 * @interface SpotifyTokenResponse
 * @property {string} access_token - The access token
 * @property {string} token_type - The type of token, typically "Bearer"
 * @property {number} expires_in - Seconds until token expiration
 */
export interface SpotifyTokenResponse {
  access_token: string;
  token_type: "Bearer";
  expires_in: number;
}

/**
 * Internal token state (with expiration tracking)
 *
 * @interface SpotifyToken
 * @property {string} accessToken - The access token
 * @property {string} tokenType - The type of token, typically "Bearer"
 * @property {number} expiresAt - Unix timestamp (ms)
 */
export interface SpotifyToken {
  accessToken: string;
  tokenType: "Bearer";
  expiresAt: number;
}

// ============================================================================
// GET /artists/{id}
// ============================================================================

/**
 * Request parameters for fetching artist details
 *
 * @interface GetArtistRequest
 * @property {string} id - Spotify Artist ID
 */
export interface GetArtistRequest {
  id: string;
}

/**
 * Spotify Artist Object (Full)
 * Reference: https://developer.spotify.com/documentation/web-api/reference/get-an-artist
 *
 * @interface SpotifyArtist
 * @property {string} id - Spotify Artist ID
 * @property {string} name - 藝人名稱
 * @property {"artist"} type - Always "artist"
 * @property {string} uri - Spotify URI (e.g., "spotify:artist:3WrFJ7ztbogyGnTHbHJFl2")
 * @property {string} href - API endpoint URL
 * @property {object} external_urls - External URLs
 * @property {string} external_urls.spotify - Spotify Web URL
 * @property {SpotifyImage[]} images - 藝人圖片 (按尺寸排序，[0] 為最大)
 * @property {number} popularity - 0-100，基於歌曲播放次數
 * @property {object} followers - Follower info
 * @property {null} followers.href - Always null (Spotify API 規範)
 * @property {number} followers.total - 追蹤人數
 * @property {string[]} genres - 音樂風格 (e.g., ["rock", "alternative rock"])
 */
export interface SpotifyArtist {
  id: string;
  name: string;
  type: "artist";
  uri: string;
  href: string;
  external_urls: {
    spotify: string;
  };
  images: SpotifyImage[];
  popularity: number;
  followers: {
    href: null;
    total: number;
  };
  genres: string[];
}

/**
 * Spotify Image Object
 *
 * @interface SpotifyImage
 * @property {string} url - 圖片 URL
 * @property {number|null} height - 高度 (px)
 * @property {number|null} width - 寬度 (px)
 */
export interface SpotifyImage {
  url: string;
  height: number | null;
  width: number | null;
}

// ============================================================================
// GET /tracks/{id}
// ============================================================================

/**
 * Request parameters for fetching track details
 *
 * @interface GetTrackRequest
 * @property {string} id - Spotify Track ID
 * @property {string} [market] - ISO 3166-1 alpha-2 country code (e.g., "TW")
 */
export interface GetTrackRequest {
  id: string;
  market?: string;
}

/**
 * Spotify Track Object (Full)
 * Reference: https://developer.spotify.com/documentation/web-api/reference/get-track
 *
 * @interface SpotifyTrack
 * @property {string} id - Spotify Track ID
 * @property {string} name - 歌曲名稱
 * @property {"track"} type - Always "track"
 * @property {string} uri - Spotify URI
 * @property {string} href - API endpoint URL
 * @property {object} external_urls - External URLs
 * @property {string} external_urls.spotify - Spotify Web URL
 * @property {object} external_ids - External IDs
 * @property {string} [external_ids.isrc] - International Standard Recording Code
 * @property {string} [external_ids.ean] - European Article Number
 * @property {string} [external_ids.upc] - Universal Product Code
 * @property {SpotifyArtistSimplified[]} artists - 演唱者清單 (主唱 + 合作藝人)
 * @property {SpotifyAlbumSimplified} album - 專輯資訊
 * @property {number} duration_ms - 時長 (毫秒)
 * @property {boolean} explicit - 是否包含露骨內容
 * @property {string|null} preview_url - 30 秒預覽 URL (可能為 null)
 * @property {number} popularity - 0-100
 * @property {boolean} [is_playable] - 是否可播放 (依市場而定)
 * @property {boolean} is_local - 是否為本地檔案
 * @property {number} disc_number - 光碟編號 (多光碟專輯)
 * @property {number} track_number - 曲目編號
 */
export interface SpotifyTrack {
  id: string;
  name: string;
  type: "track";
  uri: string;
  href: string;
  external_urls: {
    spotify: string;
  };
  external_ids: {
    isrc?: string;
    ean?: string;
    upc?: string;
  };
  artists: SpotifyArtistSimplified[];
  album: SpotifyAlbumSimplified;
  duration_ms: number;
  explicit: boolean;
  preview_url: string | null;
  popularity: number;
  is_playable?: boolean;
  is_local: boolean;
  disc_number: number;
  track_number: number;
}

/**
 * Simplified Artist Object (embedded in Track/Album)
 *
 * @interface SpotifyArtistSimplified
 * @property {string} id - Spotify Artist ID
 * @property {string} name - 藝人名稱
 * @property {"artist"} type - Always "artist"
 * @property {string} uri - Spotify URI
 * @property {string} href - API endpoint URL
 * @property {object} external_urls - External URLs
 * @property {string} external_urls.spotify - Spotify Web URL
 */
export interface SpotifyArtistSimplified {
  id: string;
  name: string;
  type: "artist";
  uri: string;
  href: string;
  external_urls: {
    spotify: string;
  };
}

/**
 * Simplified Album Object (embedded in Track)
 *
 * @interface SpotifyAlbumSimplified
 * @property {string} id - Spotify Album ID
 * @property {string} name - 專輯名稱
 * @property {"album"} type - Always "album"
 * @property {string} uri - Spotify URI
 * @property {string} href - API endpoint URL
 * @property {object} external_urls - External URLs
 * @property {string} external_urls.spotify - Spotify Web URL
 * @property {SpotifyImage[]} images - 專輯封面
 * @property {string} release_date - 發行日期 (格式: YYYY-MM-DD 或 YYYY)
 * @property {"year"|"month"|"day"} release_date_precision - 發行日期精確度
 * @property {SpotifyArtistSimplified[]} artists - 藝人清單
 * @property {"album"|"single"|"compilation"} album_type - 專輯類型
 * @property {number} total_tracks - 總曲目數
 * @property {string[]} [available_markets] - ISO 3166-1 alpha-2 country codes
 */
export interface SpotifyAlbumSimplified {
  id: string;
  name: string;
  type: "album";
  uri: string;
  href: string;
  external_urls: {
    spotify: string;
  };
  images: SpotifyImage[];
  release_date: string;
  release_date_precision: "year" | "month" | "day";
  artists: SpotifyArtistSimplified[];
  album_type: "album" | "single" | "compilation";
  total_tracks: number;
  available_markets?: string[];
}

// ============================================================================
// GET /audio-features/{id}
// ============================================================================

/**
 * Request parameters for fetching audio features
 *
 * @interface GetAudioFeaturesRequest
 * @property {string} id - Spotify Track ID
 */
export interface GetAudioFeaturesRequest {
  id: string;
}

/**
 * Audio Features from ReccoBeats API
 *
 * Migrated from Spotify Audio Features API which is now deprecated.
 * See: data-model.md for field descriptions and validation rules
 *
 * @interface SpotifyAudioFeatures
 * @property {string} id - 曲目的唯一識別碼
 * @property {string} href - 該曲目的 Spotify API URL
 * @property {number} acousticness - 聲學程度 (0.0-1.0): 音樂是否為原聲樂器演奏。1.0 表示高度確信為原聲演奏
 * @property {number} danceability - 適合跳舞程度 (0.0-1.0): 基於節奏穩定性、速度、拍子強度。1.0 表示最適合跳舞
 * @property {number} energy - 能量 (0.0-1.0): 音樂的強度與活力。1.0 表示高能量（快速、響亮、嘈雜）
 * @property {number} instrumentalness - 器樂程度 (0.0-1.0): 音樂是否不含人聲。接近 1.0 表示高機率為器樂曲
 * @property {number} liveness - 現場錄音可能性 (0.0-1.0): 音樂是否為現場演出錄音。>0.8 表示高機率為現場錄音
 * @property {number} loudness - 響度 (dB, -60 to 0): 整首歌曲的平均音量
 * @property {number} speechiness - 語音內容比例 (0.0-1.0): 音樂中語音（非歌唱）的比例。>0.66 表示可能為 podcast 或有聲書
 * @property {number} tempo - 速度 (BPM): 每分鐘拍數，表示音樂的節奏快慢
 * @property {number} valence - 音樂正向度/快樂度 (0.0-1.0): 音樂傳達的情緒正向程度。1.0 = 快樂，0.0 = 悲傷
 * @property {number} key - 調性 (0-11 或 -1): 使用 Pitch Class 表示法。0=C, 1=C♯/D♭, 2=D... -1 表示未偵測到調性
 * @property {number} mode - 調式 (0 或 1): 大調=1，小調=0
 */
export interface SpotifyAudioFeatures {
  id: string;
  href: string;
  acousticness: number;
  danceability: number;
  energy: number;
  instrumentalness: number;
  liveness: number;
  loudness: number;
  speechiness: number;
  tempo: number;
  valence: number;
  key: number;
  mode: number;
}

// ============================================================================
// Error Handling
// ============================================================================

/**
 * Spotify API Error Response
 * Reference: https://developer.spotify.com/documentation/web-api/concepts/api-calls#regular-error-object
 *
 * @interface SpotifyErrorResponse
 * @property {object} error - Error object
 * @property {number} error.status - HTTP status code
 * @property {string} error.message - 錯誤訊息
 */
export interface SpotifyErrorResponse {
  error: {
    status: number;
    message: string;
  };
}

/**
 * Common Spotify API error types
 *
 * - "INVALID_TOKEN" - 401: Token expired or invalid
 * - "RATE_LIMIT" - 429: Too many requests
 * - "NOT_FOUND" - 404: Resource not found
 * - "BAD_REQUEST" - 400: Invalid request parameters
 * - "SERVER_ERROR" - 5xx: Spotify server error
 * - "NETWORK_ERROR" - Client-side network failure
 */
export type SpotifyErrorType =
  | "INVALID_TOKEN"
  | "RATE_LIMIT"
  | "NOT_FOUND"
  | "BAD_REQUEST"
  | "SERVER_ERROR"
  | "NETWORK_ERROR";

/**
 * Typed error for better error handling
 */
export class SpotifyApiError extends Error {
  constructor(
    public type: SpotifyErrorType,
    public status: number,
    message: string,
    public originalError?: unknown,
  ) {
    super(message);
    this.name = "SpotifyApiError";
  }
}

// ============================================================================
// Service Interface (契約定義)
// ============================================================================

/**
 * Spotify API Service 契約
 *
 * 所有與 Spotify API 互動的 service 必須實作此介面
 *
 * Note: 認證由 Cloudflare Worker 處理，前端服務不需要 initialize 方法
 */
export interface ISpotifyApiService {
  /**
   * 取得藝人資訊
   * @param artistId Spotify Artist ID
   * @throws {SpotifyApiError} 當 API 呼叫失敗時
   */
  getArtist(artistId: string): Promise<SpotifyArtist>;

  /**
   * 取得歌曲詳細資訊
   * @param trackId Spotify Track ID
   * @param market ISO 3166-1 alpha-2 country code (optional)
   * @throws {SpotifyApiError} 當 API 呼叫失敗時
   */
  getTrack(trackId: string, market?: string): Promise<SpotifyTrack>;

  /**
   * 取得歌曲音樂特徵
   * @param trackId Spotify Track ID
   * @throws {SpotifyApiError} 當 API 呼叫失敗時
   */
  getAudioFeatures(trackId: string): Promise<SpotifyAudioFeatures>;
}

// ============================================================================
// Type Guards (執行時型別檢查)
// ============================================================================

/**
 * 檢查是否為 Spotify API 錯誤回應
 */
export function isSpotifyErrorResponse(
  data: unknown,
): data is SpotifyErrorResponse {
  return (
    typeof data === "object" &&
    data !== null &&
    "error" in data &&
    typeof (data as SpotifyErrorResponse).error === "object" &&
    "status" in (data as SpotifyErrorResponse).error &&
    "message" in (data as SpotifyErrorResponse).error
  );
}

/**
 * 檢查是否為有效的 Spotify Artist
 */
export function isValidSpotifyArtist(data: unknown): data is SpotifyArtist {
  return (
    typeof data === "object" &&
    data !== null &&
    "id" in data &&
    "name" in data &&
    "type" in data &&
    (data as SpotifyArtist).type === "artist"
  );
}

/**
 * 檢查是否為有效的 Spotify Track
 */
export function isValidSpotifyTrack(data: unknown): data is SpotifyTrack {
  return (
    typeof data === "object" &&
    data !== null &&
    "id" in data &&
    "name" in data &&
    "type" in data &&
    (data as SpotifyTrack).type === "track"
  );
}

/**
 * 檢查是否為有效的 Audio Features (ReccoBeats API)
 *
 * Validates all 13 required fields:
 * - id, href (識別資訊)
 * - acousticness, danceability, energy, instrumentalness, liveness
 * - loudness, speechiness, tempo, valence (音樂特徵)
 * - key, mode (音樂理論屬性)
 *
 * Validation ranges per data-model.md:
 * - [0.0 - 1.0]: acousticness, danceability, energy, instrumentalness, liveness, speechiness, valence
 * - [-60 to 0]: loudness (dB)
 * - positive number: tempo (BPM)
 * - [-1 to 11]: key (Pitch Class, -1 表示未偵測到)
 * - [0 or 1]: mode (0=小調, 1=大調)
 */
export function isValidAudioFeatures(
  data: unknown,
): data is SpotifyAudioFeatures {
  if (typeof data !== "object" || data === null) return false;

  const af = data as Record<string, unknown>;

  // Check all 13 required fields exist and have correct types
  return (
    // 識別資訊
    typeof af.id === "string" &&
    typeof af.href === "string" &&
    // 音樂特徵
    typeof af.acousticness === "number" &&
    af.acousticness >= 0 &&
    af.acousticness <= 1 &&
    typeof af.danceability === "number" &&
    af.danceability >= 0 &&
    af.danceability <= 1 &&
    typeof af.energy === "number" &&
    af.energy >= 0 &&
    af.energy <= 1 &&
    typeof af.instrumentalness === "number" &&
    af.instrumentalness >= 0 &&
    af.instrumentalness <= 1 &&
    typeof af.liveness === "number" &&
    af.liveness >= 0 &&
    af.liveness <= 1 &&
    typeof af.loudness === "number" &&
    af.loudness >= -60 &&
    af.loudness <= 0 &&
    typeof af.speechiness === "number" &&
    af.speechiness >= 0 &&
    af.speechiness <= 1 &&
    typeof af.tempo === "number" &&
    af.tempo > 0 &&
    typeof af.valence === "number" &&
    af.valence >= 0 &&
    af.valence <= 1 &&
    // 音樂理論屬性
    typeof af.key === "number" &&
    af.key >= -1 &&
    af.key <= 11 &&
    typeof af.mode === "number" &&
    (af.mode === 0 || af.mode === 1)
  );
}

/**
 * 檢查是否為有效的 Spotify Track ID 格式
 *
 * Format: 22 characters, Base-62 (a-z, A-Z, 0-9)
 * Example: "06HL4z0CvFAxyc27GXpf02"
 *
 * See: data-model.md for format specification
 */
export function isValidTrackId(id: unknown): id is string {
  return typeof id === "string" && /^[a-zA-Z0-9]{22}$/.test(id);
}
