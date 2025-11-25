# Quickstart: Route-Based 多語言系統

**Date**: 2025-11-25
**Status**: Complete

## 概述

本指南提供快速設定與使用路由式多語言系統的步驟，包含安裝依賴、配置 i18next、創建翻譯檔案、以及在元件中使用翻譯的範例。

## 前置需求

- Node.js 18+
- npm 或 yarn
- TypeScript 5.9.3+
- React 19.2.0+

## 快速安裝

### 1. 安裝依賴

```bash
npm install i18next@^23.11.5 react-i18next@^14.0.0 i18next-http-backend@^2.5.0 i18next-browser-languagedetector@^7.2.0
```

### 2. 建立目錄結構

```bash
# 建立類型定義目錄
mkdir -p src/types

# 建立翻譯檔案目錄
mkdir -p public/locales/en public/locales/zh-TW public/locales/jp
```

### 3. 設定 TypeScript 類型

**建立 `src/types/translations.ts`**:

```typescript
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

export type SupportedLanguages = "en" | "zh-TW" | "jp";
export type Namespaces = "common" | "artist" | "track";
```

**建立 `src/types/i18next.d.ts`**:

```typescript
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

### 4. 配置 i18next

**建立 `src/lib/i18n.ts`**:

```typescript
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import type { CommonTranslations, ArtistTranslations, TrackTranslations } from "@/types/translations";

export const defaultNS = "common";

export const resources = {
  en: {
    common: {} as CommonTranslations,
    artist: {} as ArtistTranslations,
    track: {} as TrackTranslations,
  },
  "zh-TW": {
    common: {} as CommonTranslations,
    artist: {} as ArtistTranslations,
    track: {} as TrackTranslations,
  },
  jp: {
    common: {} as CommonTranslations,
    artist: {} as ArtistTranslations,
    track: {} as TrackTranslations,
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
    ns: ["common", "artist", "track"],
    returnNull: false,
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
    detection: {
      order: ["navigator"],
      caches: [],
    },
  });

export default i18n;
```

### 5. 初始化 i18next

**修改 `src/main.tsx`**:

```typescript
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "@/lib/i18n"; // 初始化 i18next

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### 6. 建立翻譯檔案

**`public/locales/en/common.json`**:

```json
{
  "header": {
    "title": "Music Hits",
    "search": "Search"
  },
  "languageSwitch": {
    "label": "Switch language",
    "current": "Current language"
  },
  "banner": {
    "title": "Language Suggestion",
    "message": "Would you like to switch to {{language}}?",
    "switchButton": "Switch",
    "dismissButton": "Dismiss"
  },
  "menu": {
    "github": "GitHub",
    "close": "Close"
  }
}
```

**`public/locales/zh-TW/common.json`**:

```json
{
  "header": {
    "title": "音樂排行榜",
    "search": "搜尋"
  },
  "languageSwitch": {
    "label": "切換語言",
    "current": "目前語言"
  },
  "banner": {
    "title": "語言建議",
    "message": "是否切換至 {{language}}？",
    "switchButton": "切換",
    "dismissButton": "關閉"
  },
  "menu": {
    "github": "GitHub",
    "close": "關閉"
  }
}
```

**`public/locales/jp/common.json`**:

```json
{
  "header": {
    "title": "音楽ランキング",
    "search": "検索"
  },
  "languageSwitch": {
    "label": "言語を切り替え",
    "current": "現在の言語"
  },
  "banner": {
    "title": "言語の提案",
    "message": "{{language}} に切り替えますか？",
    "switchButton": "切り替え",
    "dismissButton": "閉じる"
  },
  "menu": {
    "github": "GitHub",
    "close": "閉じる"
  }
}
```

## 使用範例

### 在元件中使用翻譯

```typescript
import { useTranslation } from "react-i18next";

function Header() {
  const { t } = useTranslation("common");

  return (
    <header>
      <h1>{t("header.title")}</h1>
      <button>{t("header.search")}</button>
    </header>
  );
}
```

### 語言切換器元件

```typescript
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router";

const LANGUAGES = {
  en: { code: "en", name: "English", isDefault: true },
  "zh-TW": { code: "zh-TW", name: "繁體中文", isDefault: false },
  jp: { code: "jp", name: "日本語", isDefault: false },
};

function LanguageSwitch() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLanguageChange = (langCode: string) => {
    const newLang = LANGUAGES[langCode];
    const currentPath = location.pathname;

    // 移除當前語言前綴
    const pathWithoutLang = currentPath.replace(/^\/(zh-TW|jp)/, "");

    // 加入新語言前綴（預設語言無前綴）
    const newPath = newLang.isDefault
      ? pathWithoutLang
      : `/${newLang.code}${pathWithoutLang}`;

    // 保留 search 與 hash
    navigate({
      pathname: newPath,
      search: location.search,
      hash: location.hash,
    });

    i18n.changeLanguage(langCode);
  };

  return (
    <select
      value={i18n.language}
      onChange={(e) => handleLanguageChange(e.target.value)}
    >
      {Object.values(LANGUAGES).map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  );
}
```

### 語言偵測 Banner

```typescript
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

function I18nBanner() {
  const { i18n } = useTranslation();
  const [isDismissed, setIsDismissed] = useState(() => {
    try {
      return localStorage.getItem("i18n_banner_dismissed") === "true";
    } catch {
      return false;
    }
  });
  const [suggestedLang, setSuggestedLang] = useState<string | null>(null);

  useEffect(() => {
    const browserLang = navigator.language;
    const currentLang = i18n.language;

    // 檢查瀏覽器語言與當前語言是否匹配
    if (browserLang.startsWith("zh") && currentLang !== "zh-TW") {
      setSuggestedLang("zh-TW");
    } else if (browserLang.startsWith("ja") && currentLang !== "jp") {
      setSuggestedLang("jp");
    }
  }, [i18n.language]);

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      localStorage.setItem("i18n_banner_dismissed", "true");
    } catch {
      // Safari private mode fallback
    }
  };

  if (isDismissed || !suggestedLang) return null;

  return (
    <div className="banner">
      <p>{i18n.t("banner.message", { language: LANGUAGES[suggestedLang].name })}</p>
      <button onClick={() => handleLanguageChange(suggestedLang)}>
        {i18n.t("banner.switchButton")}
      </button>
      <button onClick={handleDismiss}>
        {i18n.t("banner.dismissButton")}
      </button>
    </div>
  );
}
```

## 測試

### 單元測試範例

```typescript
import { renderHook } from "@testing-library/react";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";

describe("i18n configuration", () => {
  it("should load translations correctly", async () => {
    await i18n.changeLanguage("en");
    const { result } = renderHook(() => useTranslation("common"));

    expect(result.current.t("header.title")).toBe("Music Hits");
  });

  it("should switch language", async () => {
    await i18n.changeLanguage("zh-TW");
    const { result } = renderHook(() => useTranslation("common"));

    expect(result.current.t("header.title")).toBe("音樂排行榜");
  });
});
```

### E2E 測試範例

```typescript
import { test, expect } from "@playwright/test";

test("should switch language via URL", async ({ page }) => {
  // 訪問英文首頁
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("Music Hits");

  // 切換至中文
  await page.goto("/zh-TW/");
  await expect(page.locator("h1")).toContainText("音樂排行榜");

  // 切換至日文
  await page.goto("/jp/");
  await expect(page.locator("h1")).toContainText("音楽ランキング");
});
```

## 驗證

### 檢查 i18next 是否正確載入

開啟瀏覽器開發者工具，執行：

```javascript
console.log(window.i18n.language); // 應顯示當前語言代碼
console.log(window.i18n.t("header.title")); // 應顯示翻譯內容
```

### 檢查翻譯檔案是否正確載入

在 Network 面板中，應該看到以下請求：

- `/locales/en/common.json`
- `/locales/en/artist.json` (在藝人頁面)
- `/locales/en/track.json` (在歌曲頁面)

## 常見問題

### Q: 翻譯檔案無法載入（404 錯誤）

**A**: 確認以下事項：

1. 翻譯檔案位於 `public/locales/` 目錄
2. Vite 配置正確（`vite.config.ts` 無特殊設定通常即可）
3. Cloudflare Workers 部署時，確認 `wrangler.toml` 包含：
   ```toml
   [site]
   bucket = "./dist"
   ```

### Q: TypeScript 無法正確推導翻譯 key

**A**: 確認以下事項：

1. `src/types/i18next.d.ts` 正確設定 Module Augmentation
2. `src/lib/i18n.ts` 正確 export `defaultNS` 和 `resources`
3. `resources` 使用 `as const` 斷言
4. `tsconfig.json` 包含 `"strict": true` 和 `"strictNullChecks": true`

### Q: 語言切換後，URL 沒有更新

**A**: 確認語言切換函數同時執行：

1. `navigate()` 更新路由
2. `i18n.changeLanguage()` 更新 i18next 狀態

### Q: Banner 每次都顯示

**A**: 確認 localStorage 可正常運作：

1. 瀏覽器未處於無痕模式
2. localStorage 未被手動清除
3. 使用 try-catch 處理 Safari private mode

### Q: 翻譯內容顯示為 key 而非實際文字

**A**: 確認以下事項：

1. i18next 初始化完成後才渲染元件（使用 `ready` 狀態）
2. 翻譯檔案 JSON 格式正確（無語法錯誤）
3. 翻譯 key 拼寫正確

## 下一步

- 閱讀 [data-model.md](./data-model.md) 了解完整資料模型
- 閱讀 [spec.md](./spec.md) 了解功能需求與驗收標準
- 執行 `/speckit.tasks` 產生實作任務清單
- 開始實作功能（參考 [plan.md](./plan.md)）

## 參考資源

- [i18next Documentation](https://www.i18next.com/)
- [react-i18next Documentation](https://react.i18next.com/)
- [i18next TypeScript Guide](https://www.i18next.com/overview/typescript)
- [Research Document](./research.md) - 技術選型決策說明