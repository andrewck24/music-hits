# Research: Route-Based 多語言系統

**Date**: 2025-11-25
**Status**: Complete

## 研究目標

解決 Technical Context 中的所有 NEEDS CLARIFICATION 項目：

1. i18next 版本與設定方式
2. i18next-browser-languagedetector 的 Cloudflare Workers 相容性
3. i18next-http-backend 的 Cloudflare Workers 環境設定
4. react-i18next 版本與最佳實踐
5. 翻譯檔案載入策略（靜態 import vs. 動態載入）

## 研究結果

### 1. i18next 套件版本與設定

**Decision**: 使用 i18next v23+ 與 react-i18next v14+

**Rationale**:
- i18next v23.11.5 是目前最新穩定版本，提供完整的 TypeScript 支援
- react-i18next v14+ 支援 React 19，並提供 hooks-based API（`useTranslation`）
- 兩者皆為 npm 上的主流版本，文件完整且社群活躍

**配置方式**:
```typescript
// src/lib/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    defaultNS: 'common',
    ns: ['common', 'artist', 'track'],
    interpolation: {
      escapeValue: false // React 已經處理 XSS
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json'
    },
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator'],
      caches: ['localStorage', 'cookie']
    }
  });

export default i18n;
```

**Alternatives considered**:
- next-i18next: 僅適用於 Next.js
- next-intl: 僅適用於 Next.js
- remix-i18next: 僅適用於 Remix
- i18next v9（legacy）: 不支援 React hooks

---

### 2. i18next-browser-languagedetector 與 Cloudflare Workers 相容性

**Decision**: ✅ 完全相容，無需特殊配置

**Rationale**:
- `i18next-browser-languagedetector` 是純 client-side 套件，在瀏覽器環境執行
- Cloudflare Workers 僅影響伺服器端渲染（SSR），不影響 client-side 邏輯
- 本專案為 SPA（Single Page Application），無 SSR 需求
- 語言偵測邏輯（localStorage、navigator、cookie）全部在瀏覽器端運作

**支援的偵測方式**（按優先順序）:
1. Query string（`?lng=zh-TW`）
2. Cookie
3. localStorage
4. Browser navigator language

**配置範例**:
```typescript
detection: {
  order: ['querystring', 'cookie', 'localStorage', 'navigator'],
  caches: ['localStorage', 'cookie'],
  lookupQuerystring: 'lng',
  lookupCookie: 'i18next',
  lookupLocalStorage: 'i18nextLng',
  cookieMinutes: 10080 // 7 days
}
```

**Alternatives considered**:
- 自行實作語言偵測邏輯：不必要的重複開發

---

### 3. i18next-http-backend 與 Cloudflare Workers 環境設定

**Decision**: ✅ 使用 i18next-http-backend，翻譯檔案放置於 `public/locales/`

**Rationale**:
- `i18next-http-backend` 透過 HTTP 請求載入翻譯檔案，適用於任何靜態檔案伺服器
- Cloudflare Workers 部署時，`public/` 目錄的內容會被部署為靜態資源（透過 Vite 打包）
- 動態載入翻譯檔案可減少初始 bundle 大小，僅在需要時載入對應語言
- 支援 Vite 的靜態資源處理機制

**配置**:
```typescript
backend: {
  loadPath: '/locales/{{lng}}/{{ns}}.json',
  crossDomain: false, // 同源請求
  requestOptions: {
    mode: 'cors',
    credentials: 'same-origin',
    cache: 'default'
  }
}
```

**Cloudflare Workers 部署注意事項**:
1. Vite 會自動將 `public/` 目錄複製到 build output
2. Cloudflare Workers 透過 `wrangler.toml` 設定靜態資源目錄
3. 確認 wrangler 配置包含：
   ```toml
   [site]
   bucket = "./dist"
   ```

**Alternatives considered**:
- 靜態 import JSON: 會導致所有語言的翻譯檔案都包含在初始 bundle 中，增加 bundle 大小
- i18next-resources-to-backend: 需要 webpack 或 vite 的特殊配置，且仍會打包所有語言
- i18next-chained-backend + i18next-localstorage-backend: 增加複雜度，對本專案而言 over-engineering

---

### 4. react-i18next 版本與最佳實踐

**Decision**: 使用 react-i18next v14+ 與 hooks-based API

**Rationale**:
- react-i18next v14 完全支援 React 19.2
- Hooks-based API（`useTranslation`）符合 React 函數式元件最佳實踐
- 提供 `Trans` 元件處理包含 JSX 的翻譯內容
- 完整的 TypeScript 支援

**核心 API**:

1. **useTranslation Hook**:
```typescript
function MyComponent() {
  const { t, i18n, ready } = useTranslation('common', {
    keyPrefix: 'welcome'
  });

  if (!ready) return <div>Loading...</div>;

  return (
    <div>
      <h1>{t('title')}</h1>
      <button onClick={() => i18n.changeLanguage('zh-TW')}>
        切換語言
      </button>
    </div>
  );
}
```

2. **Trans 元件**（處理包含 HTML/JSX 的翻譯）:
```typescript
<Trans
  i18nKey="userMessagesUnread"
  count={count}
  components={{
    strong: <strong />,
    link: <Link to="/messages" />
  }}
/>
```

3. **I18nextProvider**（在 main.tsx 中設定）:
```typescript
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <I18nextProvider i18n={i18n}>
    <App />
  </I18nextProvider>
);
```

**Best Practices**:
- 使用 `keyPrefix` 減少重複的 key 前綴
- 檢查 `ready` 狀態避免顯示未翻譯的 key
- 使用命名空間（namespace）分離不同頁面的翻譯
- 避免在 render 內呼叫 `i18n.changeLanguage()`，使用 `useEffect` 或事件處理器

**Alternatives considered**:
- withTranslation HOC: 僅適用於 class components，不符合專案風格
- Translation render prop: 較 hooks 冗長，不推薦

---

### 5. 翻譯檔案載入策略

**Decision**: 使用動態載入（i18next-http-backend）

**Rationale**:
- **Bundle Size**: 動態載入僅在需要時載入對應語言，初始 bundle 不包含翻譯檔案
- **Scalability**: 新增語言時無需修改程式碼，僅需新增對應的 JSON 檔案
- **Performance**: 使用瀏覽器快取機制，減少重複請求
- **Maintainability**: 翻譯檔案與程式碼分離，方便非技術人員更新翻譯內容

**動態載入流程**:
1. 使用者訪問網站
2. i18next-browser-languagedetector 偵測語言（如 `zh-TW`）
3. i18next-http-backend 發送 HTTP 請求載入 `/locales/zh-TW/common.json`
4. 根據當前頁面載入對應命名空間（如 `artist.json`）
5. 瀏覽器快取翻譯檔案（使用 Cache-Control headers）

**命名空間策略**:
- `common`: 共用翻譯（header、footer、通用 UI 元素）
- `artist`: 藝人頁面專用翻譯
- `track`: 歌曲頁面專用翻譯

**載入時機**:
```typescript
// 在元件中指定需要的命名空間
const { t } = useTranslation(['common', 'artist']);
```

**Bundle Size 比較**:
- 靜態 import: ~150KB（所有語言 × 所有命名空間）
- 動態載入: ~15KB per namespace per language（按需載入）
- 初始節省: ~135KB

**Alternatives considered**:
- 靜態 import: 簡單但會增加 bundle size，不適合多語言專案
- Code splitting with dynamic import(): 需要手動管理，且無法利用 i18next 的快取機制
- CDN 託管翻譯檔案: 增加外部依賴，不適合本專案

---

## 最終技術棧

| 套件 | 版本 | 用途 |
|------|------|------|
| i18next | ^23.11.5 | 核心國際化框架 |
| react-i18next | ^14.0.0 | React 整合（hooks API） |
| i18next-http-backend | ^2.5.0 | HTTP 動態載入翻譯檔案 |
| i18next-browser-languagedetector | ^7.2.0 | 瀏覽器語言偵測 |

## 實作檢查清單

- [ ] 安裝所有 i18next 相關套件
- [ ] 建立 `src/lib/i18n.ts` 配置檔案
- [ ] 在 `main.tsx` 中初始化 i18next
- [ ] 建立 `public/locales/` 目錄結構
- [ ] 為每個語言建立對應的 JSON 翻譯檔案
- [ ] 確認 Cloudflare Workers 部署配置（wrangler.toml）
- [ ] 實作語言切換器元件（使用 `i18n.changeLanguage`）
- [ ] 實作語言偵測 Banner 元件
- [ ] 更新路由設定以支援語言前綴
- [ ] 撰寫單元測試與 e2e 測試

## 風險與緩解策略

| 風險 | 影響 | 緩解策略 |
|------|------|----------|
| Cloudflare Workers 無法正確服務 public/ 檔案 | High | 在部署前測試靜態資源訪問；準備 fallback 為靜態 import |
| 翻譯檔案載入失敗導致白屏 | Medium | 實作 error boundary 與 fallback UI；設定 `fallbackLng: 'en'` |
| 初次載入翻譯時出現閃爍（顯示 key 而非文字） | Low | 使用 `ready` 狀態顯示 loading indicator |
| localStorage 被使用者清除導致語言重置 | Low | 使用 cookie 作為備用儲存；可接受的使用者體驗降級 |

## 參考資源

- [i18next Documentation](https://www.i18next.com/)
- [react-i18next Documentation](https://react.i18next.com/)
- [i18next-http-backend](https://github.com/i18next/i18next-http-backend)
- [i18next-browser-languagedetector](https://github.com/i18next/i18next-browser-languagedetector)
- [Cloudflare Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/)
