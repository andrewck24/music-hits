# Data Model: Route-Based 多語言系統

**Date**: 2025-11-25
**Status**: Complete

## 概述

本文件定義多語言系統中的核心資料結構，包括語言設定、翻譯資源、以及路由配置。

**重要設計決策**:

- 語言選擇**完全基於 URL 路由**，不使用 localStorage 或 cookie 快取語言偏好
- 使用 i18next-browser-languagedetector **僅用於偵測瀏覽器語言**以顯示 Banner，不啟用快取功能
- 使用 `lang` 作為統一的語言動態欄位名稱
- 在 `index.html` 的 `<head>` 標籤中手動新增 `hreflang` 連結以優化 SEO

## 核心實體

### 1. Language Configuration（語言設定）

定義系統支援的語言清單、預設語言、以及每種語言的顯示名稱。

**TypeScript Interface**:

```typescript
interface LanguageConfig {
  code: string; // ISO 639-1 語言代碼（如 'en', 'zh-TW', 'jp'）
  name: string; // 語言的原生顯示名稱（如 'English', '繁體中文', '日本語'）
  isDefault: boolean; // 是否為預設語言
}

type SupportedLanguages = "en" | "zh-TW" | "jp";

const LANGUAGES: Record<SupportedLanguages, LanguageConfig> = {
  en: {
    code: "en",
    name: "English",
    isDefault: true,
  },
  "zh-TW": {
    code: "zh-TW",
    name: "繁體中文",
    isDefault: false,
  },
  jp: {
    code: "jp",
    name: "日本語",
    isDefault: false,
  },
};

// Helper function: 根據語言代碼產生 URL 前綴
function getUrlPrefix(lang: LanguageConfig): string | null {
  return lang.isDefault ? null : `/${lang.code}`;
}

// Helper function: 取得預設語言
function getDefaultLanguage(): LanguageConfig {
  return Object.values(LANGUAGES).find((lang) => lang.isDefault)!;
}
```

**儲存位置**: `src/lib/i18n.ts`

**驗證規則**:

- `code` 必須符合 ISO 639-1 或 BCP 47 標準
- 必須有且僅有一個 `isDefault: true` 的語言
- 預設語言的 URL 前綴透過 `getUrlPrefix()` 判斷為 `null`

**使用場景**:

- 語言切換器元件顯示語言選項
- 路由設定產生多語言路由
- URL 生成與解析

---

### 2. TypeScript Type Definitions（TypeScript 類型定義）

為了獲得完整的 TypeScript 類型安全，需要建立類型聲明文件並配置 i18next。

**類型聲明文件**: `src/types/i18next.d.ts`

```typescript
// src/types/i18next.d.ts
import "i18next";
import { defaultNS, resources } from "@/lib/i18n";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: (typeof resources)["en"];
    returnNull: false;
  }
}
```

**i18n 配置與 Type Export**: `src/lib/i18n.ts`

```typescript
// src/lib/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

// 語言配置
export const LANGUAGES: Record<SupportedLanguages, LanguageConfig> = {
  en: { code: "en", name: "English", isDefault: true },
  "zh-TW": { code: "zh-TW", name: "繁體中文", isDefault: false },
  jp: { code: "jp", name: "日本語", isDefault: false },
};

// 導出 defaultNS 和 resources 供 TypeScript 類型推導使用
export const defaultNS = "common";

// 注意：resources 在此僅用於類型定義，實際翻譯由 i18next-http-backend 動態載入
export const resources = {
  en: {
    common: {} as CommonTranslations,
    artist: {} as ArtistTranslations,
    track: {} as TrackTranslations,
    home: {} as HomeTranslations,
    search: {} as SearchTranslations,
  },
  "zh-TW": {
    common: {} as CommonTranslations,
    artist: {} as ArtistTranslations,
    track: {} as TrackTranslations,
    home: {} as HomeTranslations,
    search: {} as SearchTranslations,
  },
  jp: {
    common: {} as CommonTranslations,
    artist: {} as ArtistTranslations,
    track: {} as TrackTranslations,
    home: {} as HomeTranslations,
    search: {} as SearchTranslations,
  },
} as const;

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: process.env.NODE_ENV === "development",
    defaultNS,
    ns: ["common", "artist", "track", "home", "search"],
    returnNull: false, // 避免返回 null
    interpolation: {
      escapeValue: false, // React 已處理 XSS
    },
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
    detection: {
      order: ["navigator"], // 僅使用瀏覽器語言偵測（用於 Banner）
      caches: [], // 不快取語言偵測結果
    },
  });

export default i18n;
```

**Translation Types**: `src/types/translations.ts`

```typescript
// src/types/translations.ts
export interface CommonTranslations {
  header: {
    title: string;
    search: string;
  };
  languageSwitch: {
    label: string;
    current: string;
  };
  banner: {
    title: string;
    message: string;
    switchButton: string;
    dismissButton: string;
  };
  menu: {
    github: string;
    close: string;
  };
}

export interface ArtistTranslations {
  title: string;
  followers: string;
  genres: string;
  topTracks: string;
  relatedArtists: string;
  biography: string;
  noData: string;
}

export interface TrackTranslations {
  title: string;
  artist: string;
  album: string;
  duration: string;
  releaseDate: string;
  audioFeatures: string;
  features: {
    danceability: string;
    energy: string;
    valence: string;
    tempo: string;
    loudness: string;
  };
  noData: string;
}

export interface HomeTranslations {
  hero: {
    title: string;
    subtitle: string;
    ctaButton: string;
  };
  popularArtists: {
    title: string;
  };
  popularTracks: {
    title: string;
  };
}

export interface SearchTranslations {
  // 搜尋頁面專用翻譯（待實作）
}

export type SupportedLanguages = "en" | "zh-TW" | "jp";
export type Namespaces = "common" | "artist" | "track" | "home" | "search";
```

**重要說明**:

- **Type Declaration File**: `i18next.d.ts` 使用 Module Augmentation 擴展 i18next 類型
- **resources as const**: 使用 `as const` 確保類型推導正確
- **returnNull: false**: CustomTypeOptions 設定避免 `t()` 返回 null
- **Type Export**: 從 `i18n.ts` 導出 `defaultNS` 和 `resources` 供類型系統使用
- **Translation Interfaces**: 定義翻譯結構的 TypeScript interfaces，確保所有語言的翻譯檔案結構一致

**TypeScript 配置檢查** (`tsconfig.json`):

確保 `tsconfig.json` 包含以下設定：

```json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "types": ["vite/client"]
  },
  "include": ["src"]
}
```

---

### 3. Translation Resources（翻譯資源）

按命名空間（namespace）和語言組織的翻譯內容。

**檔案結構**:

```text
public/locales/
├── en/
│   ├── common.json
│   ├── artist.json
│   ├── track.json
│   ├── home.json
│   └── search.json
├── zh-TW/
│   ├── common.json
│   ├── artist.json
│   ├── track.json
│   ├── home.json
│   └── search.json
└── jp/
    ├── common.json
    ├── artist.json
    ├── track.json
    ├── home.json
    └── search.json
```

**JSON Schema**:

```typescript
type TranslationResource = {
  [key: string]: string | TranslationResource;
};

// 範例
interface CommonTranslations {
  header: {
    title: string;
    search: string;
  };
  languageSwitch: {
    label: string;
    current: string;
  };
  banner: {
    title: string;
    message: string;
    switchButton: string;
    dismissButton: string;
  };
  menu: {
    github: string;
    close: string;
  };
}
```

**範例內容**:

**`public/locales/en/common.json`**:

```json
{
  "header": {
    "title": "Music Hits",
    "search": "Search"
  },
  "languageSwitch": {
    "label": "Language",
    "current": "Current language: {{language}}"
  },
  "banner": {
    "title": "Language Suggestion",
    "message": "Your browser language is set to {{language}}. Would you like to switch?",
    "switchButton": "Switch to {{language}}",
    "dismissButton": "Keep English"
  },
  "menu": {
    "github": "View on GitHub",
    "close": "Close"
  }
}
```

**`public/locales/zh-TW/common.json`**:

```json
{
  "header": {
    "title": "Music Hits",
    "search": "搜尋"
  },
  "languageSwitch": {
    "label": "語言",
    "current": "當前語言：{{language}}"
  },
  "banner": {
    "title": "語言建議",
    "message": "您的瀏覽器語言設定為 {{language}}，是否要切換？",
    "switchButton": "切換至 {{language}}",
    "dismissButton": "保持英文"
  },
  "menu": {
    "github": "在 GitHub 上查看",
    "close": "關閉"
  }
}
```

**`public/locales/jp/common.json`**:

```json
{
  "header": {
    "title": "Music Hits",
    "search": "検索"
  },
  "languageSwitch": {
    "label": "言語",
    "current": "現在の言語：{{language}}"
  },
  "banner": {
    "title": "言語の提案",
    "message": "ブラウザの言語が {{language}} に設定されています。切り替えますか？",
    "switchButton": "{{language}} に切り替える",
    "dismissButton": "英語を維持"
  },
  "menu": {
    "github": "GitHubで見る",
    "close": "閉じる"
  }
}
```

**`public/locales/en/artist.json`**:

```json
{
  "title": "Artist Profile",
  "followers": "Followers: {{count}}",
  "genres": "Genres",
  "topTracks": "Top Tracks",
  "relatedArtists": "Related Artists",
  "biography": "Biography",
  "noData": "No data available"
}
```

**`public/locales/en/track.json`**:

```json
{
  "title": "Track Details",
  "artist": "Artist",
  "album": "Album",
  "duration": "Duration",
  "releaseDate": "Release Date",
  "audioFeatures": "Audio Features",
  "features": {
    "danceability": "Danceability",
    "energy": "Energy",
    "valence": "Valence",
    "tempo": "Tempo",
    "loudness": "Loudness"
  },
  "noData": "No data available"
}
```

**命名空間（Namespace）定義**:

| Namespace | 用途                                                  | 使用頁面             |
| --------- | ----------------------------------------------------- | -------------------- |
| `common`  | 共用 UI 元素（header, menu, banner, language-switch） | 所有頁面             |
| `home`    | 首頁專用翻譯（hero, popular artists/tracks）          | `/:lang?/`           |
| `search`  | 搜尋頁面專用翻譯                                      | `/:lang?/search`     |
| `artist`  | 藝人頁面專用翻譯                                      | `/:lang?/artist/:id` |
| `track`   | 歌曲頁面專用翻譯                                      | `/:lang?/track/:id`  |

**載入策略**:

- `common` namespace 在應用啟動時預載
- `home`, `search`, `artist`, `track` namespace 在對應頁面訪問時動態載入

**驗證規則**:

- 所有語言的相同 namespace 必須包含相同的 key 結構
- 使用 interpolation 變數（如 `{{count}}`）時，所有語言的對應 key 必須包含相同變數
- 不允許空字串作為翻譯值

---

### 4. Banner Dismissed State（Banner 關閉狀態）

儲存使用者是否曾關閉語言提示 Banner（**僅此項目使用 localStorage**）。

**儲存位置**: `localStorage`

**LocalStorage Schema**:

```typescript
interface BannerState {
  i18n_banner_dismissed: "true" | null; // 'true' 表示已關閉，null 或不存在表示未關閉
}

// 實際儲存
localStorage.setItem("i18n_banner_dismissed", "true");
```

**React Hook Interface**:

```typescript
interface UseBannerStateReturn {
  isDismissed: boolean;
  dismiss: () => void;
  reset: () => void;
}

function useBannerState(): UseBannerStateReturn {
  const [isDismissed, setIsDismissed] = useState(() => {
    try {
      return localStorage.getItem("i18n_banner_dismissed") === "true";
    } catch {
      return false; // Safari private mode fallback
    }
  });

  const dismiss = () => {
    try {
      localStorage.setItem("i18n_banner_dismissed", "true");
      setIsDismissed(true);
    } catch {
      // Safari private mode: localStorage 不可用，僅更新 state
      setIsDismissed(true);
    }
  };

  const reset = () => {
    try {
      localStorage.removeItem("i18n_banner_dismissed");
      setIsDismissed(false);
    } catch {
      setIsDismissed(false);
    }
  };

  return { isDismissed, dismiss, reset };
}
```

**重要說明**:

- **語言選擇不使用 localStorage**：語言完全由 URL 路由決定
- 僅 Banner 關閉狀態使用 localStorage
- 使用 try-catch 處理 Safari private mode 或 localStorage 不可用的情況
- Privacy-friendly: 僅儲存 UI 狀態，不含敏感資訊

---

### 5. Browser Language Detection（瀏覽器語言偵測）

使用 i18next-browser-languagedetector 偵測瀏覽器語言，**僅用於 Banner 提示**。

**配置**:

```typescript
import LanguageDetector from "i18next-browser-languagedetector";

i18n.use(LanguageDetector).init({
  // 關鍵：禁用所有快取功能
  detection: {
    order: ["navigator"], // 僅使用 navigator（瀏覽器語言設定）
    caches: [], // 不快取任何語言偵測結果
  },
  // 其他設定...
});
```

**使用範例（在 Banner 元件中）**:

```typescript
function useDetectedBrowserLanguage(): SupportedLanguages | null {
  const { i18n } = useTranslation();

  // 取得瀏覽器偵測的語言（不影響當前語言）
  const detectedLang = i18n.services.languageDetector?.detect();

  // 檢查是否為支援的語言
  if (typeof detectedLang === 'string' && isValidLanguage(detectedLang)) {
    return detectedLang as SupportedLanguages;
  }

  return null;
}

function I18nBanner() {
  const currentLang = useCurrentLanguage(); // 從 URL 取得
  const detectedLang = useDetectedBrowserLanguage(); // 從瀏覽器偵測
  const { isDismissed, dismiss } = useBannerState();

  // 僅在偵測語言與當前語言不同時顯示 Banner
  const shouldShowBanner = !isDismissed && detectedLang && detectedLang !== currentLang;

  if (!shouldShowBanner) return null;

  return (
    <Banner onDismiss={dismiss} suggestedLang={detectedLang} />
  );
}
```

**重要說明**:

- i18next-browser-languagedetector 的 `caches: []` 禁用所有快取
- 語言偵測結果僅用於判斷是否顯示 Banner
- Banner 不會自動切換語言，僅提供建議
- 使用者必須手動點擊才會切換語言（導航至對應 URL）

---

### 6. Route Configuration（路由設定）

多語言路由的資料結構，使用統一的 `lang` 參數名稱。

**TypeScript Interface**:

```typescript
interface RouteConfig {
  path: string;              // 基礎路徑（不含語言前綴）
  element: React.ReactNode;  // 路由元件
  namespaces: string[];      // 該路由需要的翻譯命名空間
}

interface LocalizedRoute {
  lang: SupportedLanguages;  // 使用 lang 作為統一欄位名稱
  path: string;              // 包含語言前綴的完整路徑
  element: React.ReactNode;
  namespaces: string[];
}

const BASE_ROUTES: RouteConfig[] = [
  {
    path: '/',
    element: <HomePage />,
    namespaces: ['common', 'home']
  },
  {
    path: '/search',
    element: <SearchPage />,
    namespaces: ['common', 'search']
  },
  {
    path: '/artist/:id',
    element: <ArtistPage />,
    namespaces: ['common', 'artist']
  },
  {
    path: '/track/:id',
    element: <TrackPage />,
    namespaces: ['common', 'track']
  }
];

// 產生多語言路由（React Router 7 語法）
function generateLocalizedRoutes(
  baseRoutes: RouteConfig[],
  languages: Record<SupportedLanguages, LanguageConfig>
): RouteConfig[] {
  const routes: RouteConfig[] = [];

  Object.values(languages).forEach(langConfig => {
    const prefix = getUrlPrefix(langConfig);

    baseRoutes.forEach(route => {
      routes.push({
        path: prefix ? `${prefix}${route.path}` : route.path,
        element: route.element,
        namespaces: route.namespaces
      });
    });
  });

  return routes;
}
```

**路由映射範例（使用 `lang` 參數）**:

| 基礎路徑      | en            | zh-TW               | jp               |
| ------------- | ------------- | ------------------- | ---------------- |
| `/`           | `/`           | `/zh-TW/`           | `/jp/`           |
| `/search`     | `/search`     | `/zh-TW/search`     | `/jp/search`     |
| `/artist/:id` | `/artist/:id` | `/zh-TW/artist/:id` | `/jp/artist/:id` |
| `/track/:id`  | `/track/:id`  | `/zh-TW/track/:id`  | `/jp/track/:id`  |

**語言偵測邏輯（從 URL）**:

```typescript
// 從 URL 中解析語言
function getLangFromUrl(pathname: string): SupportedLanguages {
  const match = pathname.match(/^\/(zh-TW|jp)(?:\/|$)/);
  if (match && isValidLanguage(match[1])) {
    return match[1] as SupportedLanguages;
  }
  return "en"; // 預設語言
}

// 驗證語言代碼
function isValidLanguage(lang: string): lang is SupportedLanguages {
  return ["en", "zh-TW", "jp"].includes(lang);
}

// React Router 使用範例
import { useLocation } from "react-router-dom";

function useCurrentLanguage(): SupportedLanguages {
  const location = useLocation();
  return getLangFromUrl(location.pathname);
}
```

**語言切換邏輯**:

```typescript
import { useNavigate, useLocation } from "react-router-dom";

function useChangeLanguage() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentLang = useCurrentLanguage();

  const changeLanguage = (newLang: SupportedLanguages) => {
    if (newLang === currentLang) return;

    // 移除當前語言前綴
    let newPath = location.pathname;
    if (currentLang !== "en") {
      newPath = newPath.replace(new RegExp(`^/${currentLang}`), "");
    }

    // 新增新語言前綴（預設語言不加前綴）
    if (newLang !== "en") {
      newPath = `/${newLang}${newPath}`;
    }

    // 保留 query parameters 和 hash
    navigate({
      pathname: newPath,
      search: location.search,
      hash: location.hash,
    });
  };

  return changeLanguage;
}
```

**URL 參數保留**:

- Query parameters（如 `?q=search`）在語言切換時保留
- Path parameters（如 `:id`）在語言切換時保留
- Hash（如 `#section`）在語言切換時保留

---

### 7. SEO Configuration（SEO 設定）

在 `index.html` 的 `<head>` 標籤中手動新增 `hreflang` 連結以優化 SEO。

**靜態 hreflang 連結（在 `index.html` 中）**:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Music Hits</title>

    <!-- SEO: hreflang 連結（靜態，指向首頁） -->
    <link
      rel="alternate"
      hreflang="en"
      href="https://music-hits.example.com/"
    />
    <link
      rel="alternate"
      hreflang="zh-TW"
      href="https://music-hits.example.com/zh-TW/"
    />
    <link
      rel="alternate"
      hreflang="jp"
      href="https://music-hits.example.com/jp/"
    />
    <link
      rel="alternate"
      hreflang="x-default"
      href="https://music-hits.example.com/"
    />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**說明**:

- 靜態 hreflang 連結指向各語言的首頁
- 對於 SPA，搜尋引擎主要索引首頁，內頁透過 JavaScript 渲染
- `x-default` 指向預設語言（英文）
- 不需要使用 React Helmet 或其他套件
- 保持簡單，符合 Cloudflare Workers 部署需求

**SEO 最佳實踐**:

- 每個語言版本都應包含 hreflang 連結
- `x-default` 應指向預設語言（en）
- URL 必須是絕對路徑（包含 domain）
- 對於 SPA，靜態 hreflang 已足夠

---

## 資料流程圖

```text
使用者訪問網站
    ↓
[語言偵測 - 僅基於 URL]
    ├─ URL 包含 /zh-TW/ → 使用繁體中文
    ├─ URL 包含 /jp/ → 使用日文
    └─ 其他 → 使用英文（預設）
    ↓
[瀏覽器語言偵測（僅用於 Banner）]
    ├─ 呼叫 i18n.services.languageDetector.detect()
    ├─ 如果為支援語言且與 URL 不符 → 顯示 Banner
    ├─ 檢查 localStorage 的 Banner 關閉狀態
    └─ 不快取語言偵測結果（caches: []）
    ↓
[載入翻譯資源]
    ├─ 請求 /locales/{lang}/common.json
    ├─ 根據路由載入對應 namespace
    └─ 快取翻譯資源（瀏覽器 HTTP 快取）
    ↓
[渲染頁面]
    ├─ 使用 useTranslation hook 取得翻譯函數
    ├─ 根據 URL 語言顯示內容
    ├─ 顯示語言切換器
    └─ 靜態 hreflang 連結已在 index.html 中
    ↓
[使用者切換語言]
    ├─ 呼叫 changeLanguage(newLang)
    ├─ 更新 URL（navigate 至新語言路徑）
    ├─ 保留 query parameters 和 hash
    └─ 重新渲染頁面
```

## 資料驗證

### TypeScript 型別定義

```typescript
// src/types/i18n.ts
export type SupportedLanguages = "en" | "zh-TW" | "jp";
export type Namespaces = "common" | "artist" | "track" | "home" | "search";

export interface LanguageConfig {
  code: SupportedLanguages;
  name: string;
  isDefault: boolean;
}

export interface TranslationKeys {
  common: CommonTranslations;
  artist: ArtistTranslations;
  track: TrackTranslations;
}
```

### Runtime 驗證

```typescript
// 驗證語言代碼
function isValidLanguage(lang: string): lang is SupportedLanguages {
  return ["en", "zh-TW", "jp"].includes(lang);
}

// 驗證命名空間
function isValidNamespace(ns: string): ns is Namespaces {
  return ["common", "artist", "track"].includes(ns);
}

// 載入翻譯資源時的錯誤處理
i18n.on("failedLoading", (lng, ns, msg) => {
  console.error(`Failed to load ${lng}/${ns}: ${msg}`);
  // Fallback to English
  if (lng !== "en") {
    i18n.changeLanguage("en");
  }
});
```

## 測試資料

### Mock 資料

```typescript
// test/mocks/i18n.ts
export const mockLanguages: Record<SupportedLanguages, LanguageConfig> = {
  en: { code: "en", name: "English", isDefault: true },
  "zh-TW": { code: "zh-TW", name: "繁體中文", isDefault: false },
  jp: { code: "jp", name: "日本語", isDefault: false },
};

export const mockTranslations = {
  en: { common: { test: { simple: "Test" } } },
  "zh-TW": { common: { test: { simple: "測試" } } },
  jp: { common: { test: { simple: "テスト" } } },
};
```

## 參考資料

- [i18next Configuration Options](https://www.i18next.com/overview/configuration-options)
- [i18next-browser-languagedetector](https://github.com/i18next/i18next-browser-languagedetector)
- [BCP 47 Language Tags](https://www.rfc-editor.org/info/bcp47)
- [ISO 639-1 Language Codes](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)
- [Google SEO hreflang Guide](https://developers.google.com/search/docs/specialty/international/localized-versions)
