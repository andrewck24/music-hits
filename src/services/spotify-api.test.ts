import { SpotifyApiService } from "@/services/spotify-api";
import { beforeEach, describe, it } from "vitest";

/**
 * Spotify API Service 測試
 *
 * 測試範圍：
 * - initialize(): Worker 模式下為 no-op
 *
 * Note: 認證和 token 管理現在完全由 Cloudflare Worker 處理
 * 前端只透過 Worker API endpoints 存取 Spotify 資料
 *
 * TODO: 新增 Worker API proxy 的整合測試
 * - getArtist() 透過 /api/spotify/artists/:id
 * - getTrack() 透過 /api/spotify/tracks/:id
 * - getAudioFeatures() 透過 /api/spotify/audio-features/:id
 * - getAudioFeaturesBatch() 透過 /api/spotify/audio-features?ids=...
 */

describe("SpotifyApiService", () => {
  let service: SpotifyApiService;

  beforeEach(() => {
    // 建立新的 service instance
    service = new SpotifyApiService();
  });

  describe("initialize()", () => {
    it("應該成功完成（Worker 模式下為 no-op）", async () => {
      // Act: 初始化 service（在 Worker 模式下這是 no-op）
      await service.initialize();

      // Assert: 應該順利完成，不拋出錯誤
      // Worker 處理所有認證，前端不需要初始化 token
    });
  });

  // Note: isTokenValid() 和 refreshToken() 方法已移除
  // 認證現在完全由 Cloudflare Worker 處理，前端不再管理 token
});
