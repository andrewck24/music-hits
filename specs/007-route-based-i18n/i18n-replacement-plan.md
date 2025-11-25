# I18n 硬編碼字串替換計劃

## 目標
將專案中所有硬編碼字串替換為 i18next 翻譯 keys，支援英文、繁體中文、日文三種語言。

## Namespace 結構規劃

### 1. Common Namespace
包含全站共用的常用單字和片語。

**檔案**: `public/locales/{lang}/common.json`

**內容分類**:
- 通用動作: search, back, home, close, cancel, confirm, save, delete, edit, view
- 通用狀態: loading, error, success, notFound, empty
- 通用描述: title, description, name, date, time

### 2. Layout Namespace
包含 layout 相關元件的翻譯。

**檔案**: `public/locales/{lang}/layout.json`

**內容分類**:
- header: logo, searchPlaceholder, githubLink
- menu: menuTitle, languageSection, githubSection
- banner: (已完成)
- languageSwitch: (已完成)
- footer: (如有需要)

### 3. Home Namespace
包含首頁相關元件的翻譯。

**檔案**: `public/locales/{lang}/home.json`

**內容分類**:
- hero: title, subtitle, ctaButton
- popularArtists: sectionTitle, viewAll, loadMore
- popularTracks: sectionTitle, viewAll, loadMore

### 4. Search Namespace
包含搜尋頁面相關元件的翻譯。

**檔案**: `public/locales/{lang}/search.json`

**內容分類**:
- page: title, placeholder, noResults, searchPrompt
- categoryTabs: all, artists, tracks, albums
- results: artistsTitle, tracksTitle, showMore, noResults

### 5. Artist Namespace (已存在)
包含藝人頁面相關元件的翻譯。

**檔案**: `public/locales/{lang}/artist.json`

**內容分類**:
- profile: followers, genres, popularity, bio
- tracks: topTracks, allTracks, noTracks
- related: relatedArtists, similarTo
- error: notFound, loadError, tryAgain

### 6. Track Namespace (已存在)
包含歌曲頁面相關元件的翻譯。

**檔案**: `public/locales/{lang}/track.json`

**內容分類**:
- info: title, artist, album, duration, releaseDate
- features: audioFeatures, danceability, energy, valence, tempo, loudness, acousticness, instrumentalness, liveness, speechiness, key, mode, timeSignature
- artists: performers, featuredArtists
- error: notFound, loadError, tryAgain

## 執行順序

### Phase 1: Common Namespace 擴充
1. 識別所有通用單字和片語
2. 擴充 `common.json` 檔案
3. 建立翻譯對照表

### Phase 2: Layout Components
1. header.tsx
2. sidebar.tsx (如有使用)
3. search-bar.tsx
4. menu.tsx
5. language-switch.tsx (已完成)
6. i18n-banner.tsx (已完成)

每完成一個元件驗證並提交。

### Phase 3: Home Page
1. hero.tsx
2. popular-artists.tsx
3. popular-tracks.tsx
4. home-page.tsx

完成後驗證並提交。

### Phase 4: Search Page
1. category-tabs.tsx
2. artist-results.tsx
3. track-results.tsx
4. search-page.tsx

完成後驗證並提交。

### Phase 5: Artist Page
1. profile.tsx
2. card.tsx
3. artist-page.tsx

完成後驗證並提交。

### Phase 6: Track Page
1. info.tsx
2. features/index.tsx
3. features/chart.tsx
4. features/other.tsx
5. features/popularity.tsx
6. artists.tsx
7. track-page.tsx

完成後驗證並提交。

### Phase 7: Shared Components
1. error-boundary.tsx
2. loading-fallback.tsx
3. placeholder-image.tsx (如有文字)

完成後驗證並提交。

## 翻譯 Key 命名規範

### 結構
```
{namespace}.{section}.{key}
```

### 範例
```typescript
// Common
t('common.actions.search')
t('common.states.loading')
t('common.errors.notFound')

// Home
t('home.hero.title')
t('home.popularArtists.sectionTitle')

// Search
t('search.page.placeholder')
t('search.categoryTabs.all')

// Artist
t('artist.profile.followers', { count: 1000 })
t('artist.error.notFound')

// Track
t('track.info.title')
t('track.features.danceability')
```

## 實作準則

### 1. 使用 useTranslation Hook
```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation('namespace');

  return <div>{t('key')}</div>;
}
```

### 2. 多個 Namespace
```typescript
const { t } = useTranslation(['common', 'home']);

// common namespace (default)
t('common.actions.search')

// home namespace
t('home.hero.title')
```

### 3. 插值變數
```typescript
// Translation: "Found {{count}} results"
t('search.results.count', { count: 42 })

// Translation: "Hello, {{name}}!"
t('common.greeting', { name: 'John' })
```

### 4. 複數形式
```typescript
// en: "{{count}} item" | "{{count}} items"
// zh-TW: "{{count}} 個項目"
// jp: "{{count}} 項目"
t('common.itemCount', { count: 1 })
t('common.itemCount', { count: 5 })
```

## 驗證檢查清單

每完成一個區域後執行以下檢查：

- [ ] 所有硬編碼字串已替換為 t() 函數
- [ ] 翻譯檔案包含所有需要的 keys
- [ ] 英文、中文、日文翻譯都已完成
- [ ] 插值變數正確傳遞
- [ ] 複數形式正確處理
- [ ] TypeScript 無錯誤
- [ ] ESLint 無錯誤
- [ ] 在瀏覽器中測試三種語言
- [ ] 提交 git commit

## 注意事項

1. **保持原有功能**: 替換字串不應改變元件行為
2. **避免過度拆分**: 相關的字串可以組合在一起
3. **保持一致性**: 相同概念使用相同的翻譯 key
4. **考慮上下文**: 相同單字在不同上下文可能需要不同翻譯
5. **遵循 TypeScript**: 確保所有翻譯 key 都有類型定義
6. **錯誤處理**: 遇到無法修正的錯誤，註記後繼續開發

## 預期成果

完成後，專案應：
- 所有使用者可見的文字都透過 i18next 管理
- 支援英文、繁體中文、日文三種語言
- 翻譯檔案結構清晰、易於維護
- 符合 i18next TypeScript 最佳實踐
- 所有測試通過
