# Technical Research: Audio Features Data Migration - ReccoBeats Integration

**Date**: 2025-11-13
**Feature**: Audio Features Data Migration - ReccoBeats Integration
**Branch**: `003-spotify-api-audio`

## Research Context

本研究旨在確保順利將音樂特徵資料來源從 Spotify Audio Features API 遷移至 ReccoBeats API，並安全地移除未使用的批次查詢功能。

## 1. ReccoBeats API 整合研究

### Decision: 使用 ReccoBeats API v1 單一查詢端點

**端點**: `GET https://api.reccobeats.com/v1/audio-features?ids={id}`

**Rationale**:

- Spotify Audio Features API 已廢棄（返回 403 錯誤），需要替代方案
- ReccoBeats 提供免費、無需認證的音樂特徵查詢服務
- 支援 Spotify Track ID 直接查詢，無需額外轉換
- 回傳的 9 個音樂特徵欄位與前端 `FeatureChart` 完全相容

**支援的 ID 格式**:

- Spotify ID (Base-62, 22 字元)：例如 `06HL4z0CvFAxyc27GXpf02`
- ReccoBeats ID (UUID v4)：例如 `2670c328-c40f-45f4-80df-f48b29296deb`

**回應格式**:

```json
{
  "acousticness": 0.3287,
  "danceability": 0.4065,
  "energy": 0.6529,
  "instrumentalness": 0.0269,
  "liveness": 0.131,
  "loudness": -6.5329,
  "speechiness": 0.0493,
  "tempo": 140.7761,
  "valence": 0.3396
}
```

**HTTP 狀態碼**:

- 200: 成功
- 400: 無效請求（ID 格式錯誤）
- 404: Audio features 不存在
- 429: 超過速率限制
- 500: 伺服器錯誤

**Alternatives Considered**:

1. **保留 Spotify API + fallback 機制**: 捨棄原因 - Spotify API 已廢棄，無法使用
2. **使用其他音樂資料 API (Last.fm, MusicBrainz)**: 捨棄原因 - 不提供詳細的音樂特徵數值（acousticness, danceability 等）
3. **自建音樂分析服務 (Essentia, Librosa)**: 捨棄原因 - 需要音訊檔案、運算資源、維護成本高，違反 MVP 原則

### Decision: 不使用 ReccoBeats 批次查詢端點

**Rationale**:

- spec.md US2 明確要求移除批次查詢功能
- 批次功能在專案中從未被使用（檢查程式碼確認）
- 簡化程式碼架構，降低維護成本
- 前端改用逐一查詢（使用者一次只查看一首歌曲詳情）

**批次端點資訊** (記錄供未來參考):

- `GET https://api.reccobeats.com/v1/audio-features?ids=id1,id2,id3`
- 支援逗號分隔的多個 ID
- 未來若有批次需求可考慮重新啟用

## 2. Worker API 錯誤處理研究

### Decision: 實作分層錯誤處理與重試機制

**錯誤處理策略**:

1. **ID 驗證層** (Worker 端立即驗證)

   - 驗證 Spotify Track ID 格式（22 字元 base62）
   - 格式錯誤立即返回 400，不呼叫 ReccoBeats

2. **ReccoBeats API 呼叫層** (Worker)

   - 404: 回傳錯誤，前端顯示「此歌曲的音樂特徵分析暫時無法使用」
   - 429: 自動重試機制（Exponential Backoff，最多 3 次）
   - 500: 回傳錯誤，前端顯示「服務暫時無法使用，請稍後再試」
   - Timeout: 10 秒逾時，回傳錯誤

3. **前端錯誤處理層**
   - Redux thunk `fetchAudioFeatures` catch errors
   - 顯示使用者友善訊息（不顯示技術性錯誤碼）
   - 保持頁面其他功能正常（雷達圖區域顯示錯誤訊息，不影響歌曲基本資訊顯示）

**Exponential Backoff 實作**:

```typescript
async function fetchWithRetry(url: string, maxRetries: number = 3) {
  for (let i = 0; i < maxRetries; i++) {
    const response = await fetch(url, { signal: AbortSignal.timeout(10000) });

    if (response.status === 429) {
      const retryAfter = response.headers.get("Retry-After");
      const delay = retryAfter
        ? parseInt(retryAfter) * 1000
        : Math.pow(2, i) * 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));
      continue;
    }

    return response;
  }

  throw new Error("Max retries exceeded");
}
```

**Rationale**:

- 429 錯誤（rate limiting）可能是暫時性的，自動重試可提升成功率
- Exponential backoff 避免持續攻擊 ReccoBeats API
- 尊重 `Retry-After` header（若提供）
- 最多 3 次重試，避免無限等待

**Alternatives Considered**:

1. **無重試機制**: 捨棄原因 - 429 錯誤可能只是暫時性限流，重試可提升使用者體驗
2. **無限重試**: 捨棄原因 - 可能造成長時間等待，影響使用者體驗
3. **僅前端重試**: 捨棄原因 - Worker 層重試更有效率，減少前端重試邏輯複雜度

## 3. 型別定義與資料轉換研究

### Decision: 保留 `SpotifyAudioFeatures` 型別，新增最小化轉換邏輯

**Rationale**:

- 前端元件（`FeatureChart`）已使用 `SpotifyAudioFeatures` 型別
- ReccoBeats 回傳的 9 個欄位與 Spotify 核心欄位相同
- 僅需補充 Spotify 特有的 metadata 欄位（id, type, uri 等）為預設值或移除

**型別對照**:

| Spotify 欄位     | ReccoBeats 欄位 | 處理方式                             |
| ---------------- | --------------- | ------------------------------------ |
| id               | ❌              | 從請求參數取得 trackId               |
| type             | ❌              | 固定值 "audio_features"              |
| uri              | ❌              | 從 trackId 組合 `spotify:track:{id}` |
| track_href       | ❌              | 從 trackId 組合 API URL (可選)       |
| analysis_url     | ❌              | 空字串或移除 (不可用)                |
| acousticness     | ✅              | 直接對應                             |
| danceability     | ✅              | 直接對應                             |
| energy           | ✅              | 直接對應                             |
| instrumentalness | ✅              | 直接對應                             |
| liveness         | ✅              | 直接對應                             |
| loudness         | ✅              | 直接對應                             |
| speechiness      | ✅              | 直接對應                             |
| tempo            | ✅              | 直接對應                             |
| valence          | ✅              | 直接對應                             |
| key              | ❌              | 預設值 -1 (unknown) 或移除           |
| mode             | ❌              | 預設值 1 (Major) 或移除              |
| time_signature   | ❌              | 預設值 4 或移除                      |
| duration_ms      | ❌              | 0 或從 Track API 取得（已有）或移除  |

**轉換策略**:

**選項 A**: 移除未使用欄位（推薦）

- 檢查 `FeatureChart` 實際使用的欄位
- 移除 `SpotifyAudioFeatures` 型別中未使用的欄位（key, mode, time_signature, duration_ms 等）
- 簡化型別定義，提升可維護性

**選項 B**: 保留完整型別，填入預設值

- 保持 `SpotifyAudioFeatures` 型別完整
- Worker 在回傳時補充預設值
- 優點：向後相容；缺點：增加轉換邏輯複雜度

**最終決策**: **選項 A**（移除未使用欄位）

**Rationale**:

- 檢查 `FeatureChart.tsx` 確認只使用 9 個核心音樂特徵
- 移除未使用欄位符合 YAGNI 原則
- 簡化型別定義，降低維護成本
- 未來若需要可再新增

## 4. 批次功能移除策略研究

### Decision: 完全移除批次查詢程式碼與介面定義

**移除範圍**:

1. **Frontend**:

   - `src/types/spotify.ts`: 移除 `getAudioFeaturesBatch` 介面定義
   - `src/services/spotify-api.ts`: 移除 `getAudioFeaturesBatch` 實作方法
   - `tests/unit/services/spotify-api.test.ts`: 移除批次測試相關註解

2. **Worker**:
   - `worker/index.ts`: 移除 `GET /api/spotify/audio-features?ids=...` 路由（批次查詢）
   - 保留 `GET /api/spotify/audio-features/:id` 路由（單一查詢）

**驗證步驟**:

1. 全域搜尋 `getAudioFeaturesBatch` 確認所有引用已移除
2. 全域搜尋 `?ids=` 確認批次路由已移除
3. 執行 `npm run type-check` 確認無型別錯誤
4. 執行測試套件確認所有測試通過

**Rationale**:

- 批次功能從未被使用（程式碼搜尋確認）
- 移除後簡化程式碼，降低維護負擔
- 符合 spec.md US2 要求

**Alternatives Considered**:

1. **保留批次功能但不維護**: 捨棄原因 - 無用程式碼增加維護成本，違反 YAGNI 原則
2. **註解掉而非移除**: 捨棄原因 - 註解掉的程式碼仍會增加閱讀負擔，使用 git history 即可追溯

## 5. Cloudflare Workers 與 ReccoBeats 整合模式研究

### Decision: 直接在 Hono 路由中呼叫 ReccoBeats API，移除 Spotify Token 邏輯

**實作模式**:

```typescript
// worker/index.ts
app.get("/api/spotify/audio-features/:id", async (c) => {
  const trackId = c.req.param("id");

  // 驗證 Spotify Track ID 格式
  if (!validateSpotifyId(trackId, "track")) {
    return c.json({ error: "Invalid track ID" }, 400);
  }

  try {
    // 直接呼叫 ReccoBeats API (無需認證)
    // 注意：ReccoBeats 使用 query parameter ?ids=
    const response = await fetchWithRetry(
      `https://api.reccobeats.com/v1/audio-features?ids=${trackId}`
    );

    if (!response.ok) {
      // 處理錯誤...
    }

    const reccoFeatures = await response.json();

    // 轉換為前端相容格式（如需要）
    return c.json(reccoFeatures);
  } catch (error) {
    // 錯誤處理...
  }
});
```

**Token 管理清理**:

- ReccoBeats API 無需認證，可移除 Spotify Token 管理邏輯
- 保留 `worker/spotify/token.ts` 供其他 Spotify API 使用（Artists, Tracks）
- 或評估是否仍需要 token.ts（若其他 Spotify API 也不再使用）

**Rationale**:

- ReccoBeats 無需認證，簡化實作
- 直接在路由中處理，保持程式碼簡潔
- 使用現有的 `validateSpotifyId` 驗證邏輯（Worker 已實作）
- 使用 Hono 的錯誤處理機制（HTTPException）

**Alternatives Considered**:

1. **建立新的 `reccobeats/` 模組**: 捨棄原因 - 過度設計，ReccoBeats 只有一個 API 呼叫
2. **重用 `spotify/base.ts`**: 捨棄原因 - ReccoBeats 與 Spotify 認證邏輯不同，混合在一起會增加複雜度

## 6. 測試策略研究

### Decision: 更新現有測試，移除批次測試，新增 ReccoBeats mock

**測試層級**:

1. **單元測試** (`spotify-api.test.ts`)

   - Mock `fetch` 回傳 ReccoBeats 回應格式
   - 測試 `getAudioFeatures` 方法
   - 移除 `getAudioFeaturesBatch` 測試
   - 測試錯誤處理（404, 429, 500）

2. **E2E 測試** (`track-details.spec.ts`)
   - 驗證雷達圖顯示
   - 驗證 7 個音樂特徵軸正確渲染
   - 驗證錯誤訊息顯示（mock ReccoBeats 404）

**Mock 策略**:

```typescript
// Mock ReccoBeats API 回應
vi.mock("global", () => ({
  fetch: vi.fn((url) => {
    if (url.includes("/audio-features/")) {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            acousticness: 0.3287,
            danceability: 0.4065,
            energy: 0.6529,
            // ... 其他欄位
          }),
      });
    }
  }),
}));
```

**Rationale**:

- 保持測試覆蓋率，確保功能正常
- Mock ReccoBeats API 避免依賴外部服務
- E2E 測試驗證完整使用者流程

## Summary

本研究確認了以下關鍵決策：

1. ✅ 使用 ReccoBeats API v1 單一查詢端點（免費、無需認證、支援 Spotify ID）
2. ✅ 不使用批次查詢，完全移除相關程式碼
3. ✅ 實作分層錯誤處理與 429 自動重試機制（Exponential Backoff）
4. ✅ 保留 `SpotifyAudioFeatures` 型別，移除未使用欄位
5. ✅ 直接在 Hono 路由呼叫 ReccoBeats API，無需額外模組
6. ✅ 更新測試以 mock ReccoBeats API

所有決策符合憲章原則：

- MVP 優先（使用免費 API、移除無用功能）
- 可測試性（關注點分離、可 mock）
- 靜態部署（Serverless Functions）
- TypeScript 最佳實踐（型別安全、path alias）

**Ready for Phase 1**: 資料模型定義與 API 契約產生
