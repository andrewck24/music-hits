# Implementation Plan: Audio Features Data Migration - ReccoBeats Integration

**Branch**: `003-spotify-api-audio` | **Date**: 2025-11-13 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-spotify-api-audio/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

將音樂特徵資料來源從已廢棄的 Spotify Audio Features API 遷移至 ReccoBeats API，以恢復歌曲詳情頁面的音樂特徵雷達圖顯示功能。同時移除從未使用的批次查詢功能，簡化程式碼架構。

**技術方法**：

1. 更新 Cloudflare Worker 端點 `/api/spotify/audio-features/:id`，從 Spotify API 改為呼叫 ReccoBeats API (`https://api.reccobeats.com/v1/audio-features?ids={id}`)
2. 移除批次查詢相關程式碼（前端 `getAudioFeaturesBatch` 方法、Worker 批次路由）
3. 保持前端 `FeatureChart` 元件相容性，無需修改圖表邏輯
4. 實作 ReccoBeats API 錯誤處理（404, 429, 500）與重試機制

## Technical Context

**Language/Version**: TypeScript 5.9.3
**Primary Dependencies**:

- Frontend: React 19.2.0, Redux Toolkit 2.9.0, Recharts (雷達圖), Vite 7.1.9
- Backend (Worker): Hono 4.10.5, Cloudflare Workers Runtime
- Testing: Vitest 3.2.4, Playwright 1.56.0

**Storage**: N/A (使用本地 JSON 資料檔案 `public/data/tracks.json` 提供 Spotify Track IDs)

**Testing**:

- 單元測試：Vitest (`npm run test`)
- E2E 測試：Playwright (`npm run test:e2e`)
- 型別檢查：TypeScript (`npm run type-check`)

**Target Platform**:

- Frontend: 現代瀏覽器 (Chrome, Firefox, Safari, Edge)
- Backend: Cloudflare Workers (V8 Isolates, Edge Runtime)

**Project Type**: Web Application with Edge Functions

**Performance Goals**:

- 雷達圖渲染時間 < 2 秒（從頁面載入到圖表完成）
- API 回應時間 < 500ms (P95 百分位數)
- ReccoBeats API 呼叫逾時設定：10 秒

**Constraints**:

- ReccoBeats API 無需認證，但有速率限制（具體數值未明）
- 需支援 Spotify Track ID (22 字元 base62 格式) 直接查詢
- Worker 必須處理 ReccoBeats 的錯誤情況（404, 429, 500）
- 前端必須顯示友善的錯誤訊息，而非技術性錯誤

**Scale/Scope**:

- 資料集：`public/data/tracks.json` 包含上萬首歌曲資料
- 單一使用者查詢模式（非批次）
- 預期使用量：小規模個人專案

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### I. TypeScript 生態系最佳實踐

- ✅ **TypeScript 型別安全**: 專案已使用 TypeScript 5.9.3，所有新增程式碼將遵循型別安全
- ✅ **ESLint 規則**: 已配置 ESLint，所有變更將通過 linting 檢查
- ✅ **函數式元件與 Hooks**: 前端使用 React 19 + Hooks，無需修改
- ✅ **現代化工具鏈**: 使用 Vite 7 + React 19，符合最佳實踐
- ✅ **Path alias 使用**: 所有 import 使用 `@/` alias（例如 `@/types/spotify`）

### II. MVP 優先原則（不可妥協）

- ✅ **核心功能優先**: US1 (P1) 為核心（恢復音樂特徵顯示），US2 (P2) 為清理
- ✅ **獨立交付**: 每個 User Story 可獨立測試與部署
- ✅ **避免過度設計**: 不實作快取、不保留 Spotify fallback、不支援 ReccoBeats 其他 API
- ✅ **拒絕 YAGNI**: 移除未使用的批次查詢功能
- ✅ **解決使用者痛點**: 直接解決「音樂特徵無法顯示」的問題

### III. 可測試性

- ✅ **關注點分離**:
  - API 呼叫層：Worker `spotify/base.ts` (可 mock ReccoBeats API)
  - 狀態管理：Redux Toolkit `track-slice.ts`
  - UI 呈現：`FeatureChart.tsx`
- ✅ **純函數設計**: Worker API 呼叫函數為純函數，便於測試
- ✅ **可 mock**: ReccoBeats API 呼叫可在測試中使用 fetch mock

### IV. 靜態部署優先

- ✅ **符合原則**: 使用 Cloudflare Workers (Serverless Edge Functions) 而非完整後端
- ✅ **靜態資料**: 歌曲清單來自 `public/data/tracks.json`，無需資料庫
- ✅ **簡單部署**: Cloudflare Workers 自動部署，無需複雜基礎建設

### V. 命名與文件撰寫規則

- ✅ **檔案命名**: 英文 kebab-case（例如 `audio-features.ts`）
- ✅ **變數/函數**: 英文（例如 `getAudioFeatures`, `ReccoBeatsAudioFeatures`）
- ✅ **文件**: 繁體中文（本 plan.md, spec.md, research.md）
- ✅ **註解**: 繁體中文（僅在極複雜邏輯使用）
- ✅ **Commit message**: 英文 Angular Convention with scope（例如 `feat(audio-features): migrate to ReccoBeats API`）

### 🚨 Gate 評估

**Status**: ✅ **PASS** - 所有憲章原則皆符合，無違規項目

**理由**:

- 本功能遷移符合 MVP 原則（解決核心痛點，移除無用功能）
- 使用現有技術棧（TypeScript, React, Workers），無新增依賴
- 保持靜態部署架構（Serverless Functions）
- 程式碼架構支援測試（關注點分離）

## Project Structure

### Documentation (this feature)

```plaintext
specs/003-spotify-api-audio/
├── spec.md              # 功能規格（已完成）
├── plan.md              # 本檔案（實作計劃）
├── research.md          # Phase 0 輸出（技術研究）
├── data-model.md        # Phase 1 輸出（資料模型）
├── quickstart.md        # Phase 1 輸出（快速開始指南）
├── contracts/           # Phase 1 輸出（API 契約）
│   └── reccobeats-audio-features-api.yaml
├── checklists/
│   └── requirements.md  # 規格品質檢查（已完成）
└── tasks.md             # Phase 2 輸出（/speckit.tasks 指令）
```

### Source Code (repository root)

本專案採用 **Web Application with Edge Functions** 架構：

```plaintext
# Frontend (React SPA)
src/
├── components/
│   └── track/
│       └── feature-chart.tsx          # 雷達圖元件（保持不變）
├── features/
│   └── track/
│       ├── track-slice.ts             # Redux thunks (fetchAudioFeatures)
│       └── track-types.ts             # TypeScript 型別定義
├── services/
│   └── spotify-api.ts                 # 🔧 需修改：移除 getAudioFeaturesBatch
├── types/
│   └── spotify.ts                     # 🔧 需修改：更新 SpotifyAudioFeatures 型別
└── hooks/
    └── use-track.ts                   # 使用 fetchAudioFeatures thunk

# Backend (Cloudflare Workers)
worker/
├── index.ts                           # 🔧 需修改：移除批次路由
├── spotify/
│   ├── base.ts                        # 🔧 需修改：支援 ReccoBeats API
│   └── token.ts                       # Token 管理（ReccoBeats 不需要，可能移除）
└── types/
    └── env.ts                         # Cloudflare Workers 環境型別

# Testing
tests/
├── unit/
│   └── services/
│       └── spotify-api.test.ts        # 🔧 需更新：移除批次測試
└── e2e/
    └── track-details.spec.ts          # E2E 測試（驗證雷達圖顯示）

# Static Data
public/
└── data/
    └── tracks.json                    # Spotify Track IDs 資料來源
```

**Structure Decision**: 採用現有的 **Web Application with Edge Functions** 架構（Frontend + Worker），無需新增目錄。主要變更集中在：

1. Worker API 路由與 API 呼叫邏輯（`worker/`）
2. Frontend 服務介面與型別定義（`src/services/`, `src/types/`）
3. 移除批次查詢相關程式碼

## Complexity Tracking

**Status**: N/A - 無憲章違規項目

本實作完全符合憲章所有原則：

- 遵循 MVP 原則：只實作必要功能（單一查詢），移除無用功能（批次查詢）
- 保持架構簡單：使用現有技術棧，無新增依賴或複雜模式
- 可測試性：關注點分離，API 呼叫可 mock
- 靜態部署：使用 Serverless Edge Functions
