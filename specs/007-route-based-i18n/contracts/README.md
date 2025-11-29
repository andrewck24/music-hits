# Translation Contracts (JSON Schemas)

**Purpose**: 定義翻譯檔案的結構規範，確保所有語言的翻譯檔案格式一致。

## Schema Files

### 1. common.schema.json

定義共用 UI 元件的翻譯結構，包含：

- `header`: 頁面 header（標題、搜尋按鈕）
- `languageSwitch`: 語言切換器（標籤、當前語言指示器）
- `banner`: 語言偵測 Banner（標題、訊息、按鈕）
- `menu`: Menu popover（GitHub 連結、關閉按鈕）

**適用檔案**:
- `public/locales/en/common.json`
- `public/locales/zh-TW/common.json`
- `public/locales/jp/common.json`

### 2. artist.schema.json

定義藝人頁面的翻譯結構，包含：

- `title`: 頁面標題
- `followers`: 追蹤者數量標籤
- `genres`: 音樂類型區塊標籤
- `topTracks`: 熱門歌曲區塊標籤
- `relatedArtists`: 相關藝人區塊標籤
- `biography`: 傳記區塊標籤
- `noData`: 無資料訊息

**適用檔案**:
- `public/locales/en/artist.json`
- `public/locales/zh-TW/artist.json`
- `public/locales/jp/artist.json`

### 3. track.schema.json

定義歌曲頁面的翻譯結構，包含：

- `title`: 頁面標題
- `artist`: 藝人標籤
- `album`: 專輯標籤
- `duration`: 時長標籤
- `releaseDate`: 發行日期標籤
- `audioFeatures`: 音訊特徵區塊標籤
- `features`: 各項音訊特徵的標籤（danceability, energy, valence, tempo, loudness）
- `noData`: 無資料訊息

**適用檔案**:
- `public/locales/en/track.json`
- `public/locales/zh-TW/track.json`
- `public/locales/jp/track.json`

## Usage

### Validation

可以使用 JSON Schema 驗證工具（如 `ajv`）在 CI/CD 中驗證翻譯檔案：

```bash
npm install --save-dev ajv-cli
npx ajv validate -s contracts/common.schema.json -d public/locales/en/common.json
```

### TypeScript Type Generation

這些 JSON Schema 與 `src/types/translations.ts` 中的 TypeScript interfaces 一致，確保類型安全。

### Continuous Integration

建議在 CI 流程中加入 schema 驗證，確保新增或修改的翻譯檔案符合規範：

```yaml
# .github/workflows/validate-translations.yml (example)
- name: Validate translation files
  run: |
    npx ajv validate -s specs/007-route-based-i18n/contracts/common.schema.json -d "public/locales/*/common.json"
    npx ajv validate -s specs/007-route-based-i18n/contracts/artist.schema.json -d "public/locales/*/artist.json"
    npx ajv validate -s specs/007-route-based-i18n/contracts/track.schema.json -d "public/locales/*/track.json"
```

## Design Decisions

- **additionalProperties: false**: 禁止額外欄位，避免拼寫錯誤或不一致的 key
- **required fields**: 所有欄位均為必填，確保每種語言的翻譯完整性
- **nested structure**: 使用巢狀物件組織翻譯內容，提升可維護性
- **consistent naming**: 所有語言使用相同的 key 結構，僅翻譯 value
