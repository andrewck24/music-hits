# Data Model: Audio Features Data Migration

**Feature**: Audio Features Data Migration - ReccoBeats Integration
**Date**: 2025-11-13
**Branch**: `003-spotify-api-audio`

## Overview

本功能涉及的資料模型主要為音樂特徵資料（Audio Features），用於在雷達圖中呈現歌曲的音樂特性。資料來源從 Spotify API 遷移至 ReccoBeats API，但資料結構保持相容。

## Entities

### 1. AudioFeatures

**描述**: 歌曲的音樂特徵分析資料，包含聲學程度、舞曲性、能量等 9 個核心指標

**來源**: ReccoBeats API `GET /v1/audio-features?ids={id}`

**Fields**:

| 欄位名稱         | 型別   | 範圍/格式   | 必填 | 描述                                                                                                     |
| ---------------- | ------ | ----------- | ---- | -------------------------------------------------------------------------------------------------------- |
| acousticness     | number | 0.0 - 1.0   | ✅   | 聲學程度：音樂是否為原聲樂器演奏。1.0 表示高度確信為原聲演奏                                             |
| danceability     | number | 0.0 - 1.0   | ✅   | 適合跳舞程度：基於節奏穩定性、速度、拍子強度等因素。1.0 表示最適合跳舞                                   |
| energy           | number | 0.0 - 1.0   | ✅   | 能量：音樂的強度與活力。1.0 表示高能量（快速、響亮、嘈雜）                                               |
| instrumentalness | number | 0.0 - 1.0   | ✅   | 器樂程度：音樂是否不含人聲。接近 1.0 表示高機率為器樂曲                                                  |
| liveness         | number | 0.0 - 1.0   | ✅   | 現場錄音可能性：音樂是否為現場演出錄音。>0.8 表示高機率為現場錄音                                        |
| loudness         | number | -60 to 0 dB | ✅   | 響度：整首歌曲的平均音量（分貝）。典型範圍為 -60 到 0 dB                                                 |
| speechiness      | number | 0.0 - 1.0   | ✅   | 語音內容比例：音樂中語音（非歌唱）的比例。>0.66 表示可能為 podcast 或有聲書                              |
| tempo            | number | BPM         | ✅   | 速度：每分鐘拍數（Beats Per Minute），表示音樂的節奏快慢                                                 |
| valence          | number | 0.0 - 1.0   | ✅   | 音樂正向度（快樂度）：音樂傳達的情緒正向程度。1.0 表示非常正向（快樂、愉悅），0.0 表示負向（悲傷、憤怒） |

**Validation Rules**:

- `acousticness`, `danceability`, `energy`, `instrumentalness`, `liveness`, `speechiness`, `valence`: 必須為 0.0 到 1.0 之間的數值
- `loudness`: 必須為 -60 到 0 之間的數值（dB）
- `tempo`: 必須為正數（BPM，通常 40-200 之間）

**Usage Context**:

- 用於 `FeatureChart` 元件的雷達圖顯示
- 7 個特徵（acousticness, danceability, energy, instrumentalness, liveness, speechiness, valence）顯示在雷達圖軸上
- `tempo` 以數值方式單獨顯示（非雷達圖）
- `loudness` 目前未在 UI 中顯示，但保留於資料結構中

### 2. TrackIdentifier

**描述**: 歌曲唯一識別碼，用於查詢音樂特徵資料

**來源**: 本地 JSON 檔案 `public/data/tracks.json`

**Format**: Spotify Track ID (Base-62, 22 字元)

**Example**: `06HL4z0CvFAxyc27GXpf02`

**Validation Rules**:

- 必須為 22 字元長度
- 只包含 Base-62 字元（a-z, A-Z, 0-9）
- 不可為空值

**Usage Context**:

- 作為 ReccoBeats API 查詢參數 `GET /v1/audio-features?ids={trackId}`
- 作為 Worker API 路由參數 `GET /api/spotify/audio-features/:id`
- 從本地 tracks.json 資料中取得

## Data Flow

```plaintext
1. 使用者訪問歌曲詳情頁面
   └─> Track ID from tracks.json

2. Frontend dispatches Redux action
   └─> fetchAudioFeatures(trackId)

3. Frontend calls Worker API
   └─> GET /api/spotify/audio-features/{trackId}

4. Worker validates Track ID format
   ├─> Invalid: Return 400 error
   └─> Valid: Continue

5. Worker calls ReccoBeats API
   └─> GET https://api.reccobeats.com/v1/audio-features?ids={trackId}

6. ReccoBeats API responds
   ├─> 200: Audio Features data (9 fields)
   ├─> 404: Audio features not found
   ├─> 429: Rate limit exceeded (retry with backoff)
   └─> 500: Server error

7. Worker processes response
   ├─> Success: Return AudioFeatures to frontend
   └─> Error: Return error response

8. Frontend processes data
   ├─> Success: Display in FeatureChart (radar chart)
   └─> Error: Display user-friendly error message
```

## State Transitions

### AudioFeatures Loading States

```plaintext
[Initial] ---fetchAudioFeatures---> [Loading]
                                         |
                                         |
              +--------------------------+---------------------------+
              |                          |                           |
              v                          v                           v
          [Success]                  [Error:404]              [Error:429/500]
              |                          |                           |
              |                          |                           |
              v                          v                           v
    Display radar chart      Show "不可用" message      Show "暫時無法使用" message
```

**States**:

1. **Initial**: 尚未載入音樂特徵資料
2. **Loading**: 正在查詢 ReccoBeats API
3. **Success**: 成功載入，資料可用於顯示
4. **Error:404**: ReccoBeats 無此歌曲的音樂特徵資料
5. **Error:429/500**: ReccoBeats API 暫時無法使用（速率限制或伺服器錯誤）

## Type Definitions

### TypeScript Interface

```typescript
/**
 * 音樂特徵資料結構（ReccoBeats API 回應）
 */
export interface AudioFeatures {
  /** 聲學程度 (0.0-1.0) */
  acousticness: number;

  /** 適合跳舞程度 (0.0-1.0) */
  danceability: number;

  /** 能量 (0.0-1.0) */
  energy: number;

  /** 器樂程度 (0.0-1.0) */
  instrumentalness: number;

  /** 現場錄音可能性 (0.0-1.0) */
  liveness: number;

  /** 響度 (dB, -60 to 0) */
  loudness: number;

  /** 語音內容比例 (0.0-1.0) */
  speechiness: number;

  /** 速度 (BPM) */
  tempo: number;

  /** 音樂正向度/快樂度 (0.0-1.0) */
  valence: number;
}

/**
 * 歌曲識別碼型別
 */
export type TrackId = string; // Spotify Track ID (Base-62, 22 字元)
```

### Validation Guards

```typescript
/**
 * 驗證 AudioFeatures 資料完整性
 */
export function isValidAudioFeatures(data: any): data is AudioFeatures {
  return (
    typeof data === "object" &&
    typeof data.acousticness === "number" &&
    data.acousticness >= 0 &&
    data.acousticness <= 1 &&
    typeof data.danceability === "number" &&
    data.danceability >= 0 &&
    data.danceability <= 1 &&
    typeof data.energy === "number" &&
    data.energy >= 0 &&
    data.energy <= 1 &&
    typeof data.instrumentalness === "number" &&
    data.instrumentalness >= 0 &&
    data.instrumentalness <= 1 &&
    typeof data.liveness === "number" &&
    data.liveness >= 0 &&
    data.liveness <= 1 &&
    typeof data.loudness === "number" &&
    data.loudness >= -60 &&
    data.loudness <= 0 &&
    typeof data.speechiness === "number" &&
    data.speechiness >= 0 &&
    data.speechiness <= 1 &&
    typeof data.tempo === "number" &&
    data.tempo > 0 &&
    typeof data.valence === "number" &&
    data.valence >= 0 &&
    data.valence <= 1
  );
}

/**
 * 驗證 Spotify Track ID 格式
 */
export function isValidTrackId(id: string): boolean {
  return /^[a-zA-Z0-9]{22}$/.test(id);
}
```

## Migration Notes

### 從 Spotify API 遷移至 ReccoBeats API

**相容性**:

- ✅ ReccoBeats 提供的 9 個音樂特徵欄位與 Spotify 完全相同（欄位名稱、數值範圍）
- ✅ 前端 `FeatureChart` 元件無需修改（使用相同的 9 個欄位）
- ✅ 資料驗證邏輯保持不變

**差異**:

- ❌ ReccoBeats 不提供 Spotify 特有的 metadata（id, type, uri, track_href, analysis_url）
- ❌ ReccoBeats 不提供音樂理論欄位（key, mode, time_signature）
- ❌ ReccoBeats 不提供 duration_ms（可從 Track API 獲取）

**處理方式**:

- **選項 A** (推薦): 移除未使用的欄位，簡化型別定義為 `AudioFeatures`
- **選項 B**: 保留完整的 `SpotifyAudioFeatures` 型別，在 Worker 補充預設值

根據 research.md 決策，採用 **選項 A**。

## Data Relationships

本功能不涉及複雜的資料關聯，主要為單向查詢：

```plaintext
Track (tracks.json)
  └─> has trackId (Spotify Track ID)
        └─> queries AudioFeatures (ReccoBeats API)
              └─> displays in FeatureChart
```

**No Database**: 本功能不使用資料庫，所有資料來自：

- Track IDs: 本地 JSON 檔案 (`public/data/tracks.json`)
- Audio Features: ReccoBeats API（即時查詢，無快取）

## Summary

本資料模型設計保持簡潔，專注於核心的音樂特徵資料結構。遷移至 ReccoBeats API 後，資料結構保持向後相容，前端元件無需修改。移除未使用的欄位符合 YAGNI 原則，降低維護成本。

**Key Points**:

- 9 個核心音樂特徵欄位
- Spotify Track ID (22 字元 Base-62) 作為查詢識別碼
- 無資料庫、無快取（即時查詢 ReccoBeats API）
- 型別安全驗證（TypeScript interfaces + validation guards)
