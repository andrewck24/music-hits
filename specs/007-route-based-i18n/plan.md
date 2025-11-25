# Implementation Plan: Route-Based 多語言系統

**Branch**: `007-route-based-i18n` | **Date**: 2025-11-25 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/007-route-based-i18n/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

建立一個基於路由的多語言系統，支援英文（預設，無路由前綴）、繁體中文（`/zh-TW/*`）、日文（`/jp/*`）。系統使用 i18next 進行多語言管理，支援按頁面類型載入命名空間（common, artist, track），並提供語言切換器（桌面版顯示於 Header 右側，手機版收納至 menu）及瀏覽器語言偵測功能。需注意 Cloudflare Workers 部署環境對 i18next-http-backend 的設定要求。所有 UI 元件使用 shadcn/ui 和 `@/globals.css` 變數實作。

## Technical Context

**Language/Version**: TypeScript 5.9.3 (strict mode, strictNullChecks enabled)
**Primary Dependencies**:

- React 19.2.0 + React DOM 19.2.0
- React Router 7.9.6
- i18next ^23.11.5 (核心國際化框架)
- i18next-browser-languagedetector ^7.2.0 (瀏覽器語言偵測，僅用於 Banner 提示)
- i18next-http-backend ^2.5.0 (HTTP 動態載入翻譯檔案)
- react-i18next ^14.0.0 (React 整合，hooks-based API)
- shadcn/ui (Radix UI components)
- Tailwind CSS 4.1.17
- Redux Toolkit 2.11.0 (現有狀態管理)

**Storage**: localStorage (僅用於儲存 Banner 關閉狀態，不儲存語言偏好)
**Testing**: vitest (unit tests), Playwright (e2e tests)
**Target Platform**: Web (部署於 Cloudflare Workers)
**Project Type**: web (frontend SPA)
**Performance Goals**: 語言切換完成時間 < 3 秒（SC-001）
**Constraints**:

- Cloudflare Workers 環境限制（翻譯檔案需放置於 `public/locales/`，透過 i18next-http-backend 以 HTTP 請求動態載入）
- 語言判定完全基於 URL 路由，不使用 localStorage 或 cookie 快取語言偏好
- i18next-browser-languagedetector 僅用於偵測瀏覽器語言以顯示 Banner 提示，不影響實際語言選擇
- 響應式設計（桌面版 vs. 手機版的 language-switch 顯示方式不同）
- TypeScript 類型安全：使用 Module Augmentation 與 CustomTypeOptions 確保翻譯 key 的型別檢查
- **翻譯 fallback 機制**：i18next 設定 `fallbackLng: 'en'`，當目標語言的翻譯 key 不存在時，自動使用英文翻譯。若翻譯檔案載入失敗，透過 error handler 降級至英文版本（詳見 T037）

**Scale/Scope**:

- 3 種語言（en, zh-TW, jp）
- 3 個命名空間（common, artist, track）
- 12 個頁面路由（4 paths × 3 languages）:
  - en: `/`, `/search`, `/artist/:id`, `/track/:id`
  - zh-TW: `/zh-TW/`, `/zh-TW/search`, `/zh-TW/artist/:id`, `/zh-TW/track/:id`
  - jp: `/jp/`, `/jp/search`, `/jp/artist/:id`, `/jp/track/:id`

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### ✅ I. TypeScript 生態系最佳實踐

- **TypeScript 使用**: ✅ 專案已使用 TypeScript 5.9.3，strict mode 與 strictNullChecks 啟用
- **TypeScript 類型安全**: ✅ 使用 Module Augmentation 與 CustomTypeOptions 確保 i18next 的型別檢查
- **ESLint 規則**: ✅ 配置完整（`npm run lint` 可用）
- **函數式元件與 Hooks**: ✅ 現有程式碼遵循此模式
- **現代化工具鏈**: ✅ Vite 7.2.4 + React 19.2
- **Path Alias**: ✅ 專案已配置 `@/` 別名
- **新依賴**: ✅ i18next ^23.11.5, react-i18next ^14.0.0, i18next-browser-languagedetector ^7.2.0, i18next-http-backend ^2.5.0（版本已確認，參考 research.md）

**結論**: ✅ 通過

### ✅ II. MVP 優先原則

- **核心功能優先**: ✅ User Story 按優先級分為 P1（路由）、P2（UI 切換）、P3（自動偵測）
- **可獨立交付**: ✅ 每個 User Story 可獨立測試與交付
- **避免過度設計**: ✅ 僅實作 spec 要求的功能，無額外複雜度
- **解決使用者痛點**: ✅ 直接滿足多語言需求

**結論**: ✅ 通過

### ✅ III. 可測試性

- **純函數**: ✅ i18n 相關 utility functions 可保持純粹
- **關注點分離**: ✅ i18n 設定（lib/）、語言偵測邏輯（hooks/）、UI 元件（components/）分離
- **可 mock 測試**: ✅ i18next 提供 mock 工具，localStorage 可 mock
- **單一職責**: ✅ 語言切換器、Banner 提示、路由處理各自獨立

**結論**: ✅ 通過

### ✅ IV. 標準化前端元件開發

- **Design Guidelines**: ✅ 遵循現有 design guidelines（參考 constitution）
- **shadcn/ui 優先**: ✅ 語言切換器使用 shadcn/ui dropdown/select，menu 使用 popover
- **使用 globals.css 變數**: ✅ 所有樣式使用 Tailwind 與 `@/globals.css` 變數
- **元件拆分**: ✅ language-switch、menu、banner 各自獨立元件

**結論**: ✅ 通過

### ✅ V. 命名與文件撰寫規則

- **檔案命名**: ✅ 英文 kebab-case（例如 `language-switch.tsx`, `i18n-banner.tsx`）
- **變數與函數**: ✅ 英文命名
- **文件**: ✅ 本計劃與 spec 使用繁體中文
- **程式碼註解**: ✅ 避免註解，優先使用敘述性函數名稱
- **Commit Message**: ✅ 英文（遵循 Angular Convention）

**結論**: ✅ 通過

### 總結

**所有 Gates 通過** ✅

無違反憲章原則的情況，無需填寫 Complexity Tracking 表格。

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── layout/
│   │   ├── header.tsx                      # [MODIFY] 整合 language-switch 與 menu
│   │   ├── language-switch.tsx             # [NEW] 語言切換器元件
│   │   ├── menu.tsx                        # [NEW] Menu popover (取代 dialog)
│   │   └── i18n-banner.tsx                 # [NEW] 語言提示 Banner
│   ├── ui/
│   │   └── popover.tsx                     # [NEW] shadcn/ui popover 元件
│   └── ...
├── hooks/
│   ├── use-language-detection.ts           # [NEW] 瀏覽器語言偵測 hook
│   └── use-banner-state.ts                 # [NEW] Banner 狀態管理 hook
├── lib/
│   ├── i18n.ts                             # [NEW] i18next 核心設定（export defaultNS 與 resources）
│   └── utils.ts
├── types/
│   ├── i18next.d.ts                        # [NEW] i18next Module Augmentation（CustomTypeOptions）
│   └── translations.ts                     # [NEW] 翻譯結構介面定義（CommonTranslations 等）
├── routes.tsx                               # [MODIFY] 路由設定（新增語言前綴路由）
└── main.tsx                                 # [MODIFY] 初始化 i18next

public/
├── locales/                                 # [NEW] 翻譯資源目錄（由 i18next-http-backend 透過 HTTP 載入）
│   ├── en/
│   │   ├── common.json
│   │   ├── artist.json
│   │   └── track.json
│   ├── zh-TW/
│   │   ├── common.json
│   │   ├── artist.json
│   │   └── track.json
│   └── jp/
│       ├── common.json
│       ├── artist.json
│       └── track.json
└── ...

tests/
├── e2e/
│   └── i18n.spec.ts                        # [NEW] e2e 測試（語言切換、路由）
└── unit/
    ├── use-language-detection.test.ts      # [NEW] 語言偵測 hook 測試
    └── i18n-config.test.ts                 # [NEW] i18n 設定測試
```

**Structure Decision**:

此專案為 **Web SPA** 架構，所有原始碼位於 `src/` 目錄。本功能新增以下檔案與目錄：

1. **TypeScript 類型定義**: `src/types/` - i18next Module Augmentation 與翻譯結構介面
   - `i18next.d.ts`: 使用 `declare module "i18next"` 擴充 CustomTypeOptions
   - `translations.ts`: CommonTranslations、ArtistTranslations、TrackTranslations 介面
2. **i18n 核心設定**: `src/lib/i18n.ts` - 單一檔案集中管理 i18next 設定（export defaultNS 與 resources 並使用 `as const`）
3. **翻譯資源**: `public/locales/` - 按語言與命名空間組織翻譯檔案（由 i18next-http-backend 透過 HTTP 動態載入）
4. **UI 元件**: `src/components/layout/` - 新增 language-switch、menu、i18n-banner
5. **自訂 Hooks**: `src/hooks/` - 語言偵測與 Banner 狀態管理
6. **路由修改**: `src/routes.tsx` - 新增多語言路由支援
7. **測試**: `tests/` - 單元測試與 e2e 測試

現有檔案僅修改：

- `src/components/layout/header.tsx`（整合新元件）
- `src/routes.tsx`（路由設定）
- `src/main.tsx`（i18next 初始化）

**關鍵設計決策**:

- **TypeScript 類型安全**: 使用 Module Augmentation 擴充 i18next，確保翻譯 key 的型別檢查與自動完成（參考 data-model.md Section 2）
- **翻譯檔案位置**: 放在 `public/locales/` 而非 `src/` 中，因為 i18next-http-backend 需要透過 HTTP 請求載入這些檔案
- **單一配置檔案**: 使用單一 `i18n.ts` 配置檔案而非拆分多個檔案，符合 i18next 最佳實踐
- **語言判定策略**: 完全基於 URL 路由，不使用 localStorage 或 cookie 快取（i18next-browser-languagedetector 僅用於 Banner 提示）
- **Cloudflare Workers**: 需確認 `public/` 目錄的靜態資源能被正確服務（透過 wrangler.toml 設定）

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| [e.g., 4th project]        | [current need]     | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient]  |
