# Feature Specification: Audio Features Data Migration - ReccoBeats Integration

**Feature Branch**: `003-spotify-api-audio`
**Created**: 2025-11-13
**Status**: Draft
**Input**: User description: "使用新服務替換舊的 spotify api 服務，以提供 audio-features 呈現"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 查看歌曲音樂特徵分析 (Priority: P1)

當使用者瀏覽歌曲詳情頁面時，可以看到該歌曲的音樂特徵分析，包括能量、舞曲性、快樂度等指標，以雷達圖和數值方式呈現。資料來源從已廢棄的 Spotify Audio Features API 遷移至 ReccoBeats API。

**Why this priority**: 這是核心功能，直接影響使用者體驗。音樂特徵分析是應用的主要價值之一，使用者依賴此功能了解歌曲特性。由於 Spotify API 已廢棄（返回 403 錯誤），此遷移是恢復功能的必要步驟。

**Independent Test**:

1. 訪問任一歌曲詳情頁面（例如：`/track/0V3wPSX9ygBnCm8psDIegu`）
2. 確認雷達圖顯示 7 個音樂特徵（acousticness, danceability, energy, instrumentalness, liveness, speechiness, valence）
3. 確認顯示 tempo（BPM）數值
4. 確認資料來自 ReccoBeats API（檢查 Network 請求）

**Acceptance Scenarios**:

1. **Given** 使用者訪問歌曲詳情頁面，**When** 頁面載入完成，**Then** 顯示音樂特徵雷達圖，包含 7 個指標軸（acousticness, danceability, energy, instrumentalness, liveness, speechiness, valence）
2. **Given** 使用者查看音樂特徵分析，**When** 資料載入成功，**Then** 每個特徵顯示 0.0 - 1.0 之間的數值
3. **Given** 使用者查看音樂特徵分析，**When** 資料載入成功，**Then** 額外顯示 tempo（速度）數值，單位為 BPM
4. **Given** 資料來源回應成功，**When** 系統接收並處理資料，**Then** 雷達圖和數值在 2 秒內完成渲染

---

### User Story 2 - 簡化系統，移除未使用功能 (Priority: P2)

移除應用中從未被使用的批次查詢功能，簡化系統架構並降低維護負擔。

**Why this priority**: 此功能從未被使用，移除後可減少系統複雜度，降低未來維護成本。優先度為 P2 是因為不影響使用者體驗，但有助於系統品質。

**Independent Test**:

1. 確認系統只支援單一歌曲查詢，不支援多首歌曲同時查詢
2. 確認移除批次功能後，所有現有功能正常運作
3. 執行完整測試，確認所有測試通過

**Acceptance Scenarios**:

1. **Given** 使用者嘗試查詢音樂特徵，**When** 系統處理查詢請求，**Then** 系統只接受單一歌曲識別碼，不接受多個歌曲識別碼
2. **Given** 系統已移除批次查詢功能，**When** 執行完整測試套件，**Then** 所有測試通過，確認現有功能未受影響
3. **Given** 系統程式碼已清理，**When** 檢查程式碼庫，**Then** 不存在批次查詢相關的程式碼和介面定義

---

### Edge Cases

- **資料來源無資料**: 當新的資料來源（ReccoBeats）沒有該歌曲的音樂特徵時，顯示友善的訊息「此歌曲的音樂特徵分析暫時無法使用」
- **資料來源服務限流**: 當超過資料來源的使用限制時，系統自動重試（最多 3 次），若仍失敗則顯示「目前使用人數過多，請稍後再試」
- **資料來源服務錯誤**: 當資料來源服務發生錯誤時，顯示「服務暫時無法使用，請稍後再試」
- **無效的歌曲識別碼**: 當提供的歌曲識別碼格式錯誤時，立即顯示錯誤訊息，不查詢資料來源
- **查詢逾時**: 當資料查詢超過 10 秒未完成時，中斷請求並顯示逾時錯誤訊息

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: 系統必須接受歌曲唯一識別碼（22 字元格式）作為查詢參數
- **FR-002**: 系統必須從新的資料來源（ReccoBeats）獲取音樂特徵資料
- **FR-003**: 系統必須回傳包含以下 9 個音樂特徵：聲學程度、舞曲性、能量、器樂程度、現場感、響度、語音比例、速度、正向度
- **FR-004**: 系統必須驗證查詢參數格式，格式錯誤時回應錯誤訊息
- **FR-005**: 系統必須妥善處理資料來源的錯誤情況（資料不存在、服務限流、服務錯誤），並提供對應的使用者友善訊息
- **FR-006**: 系統必須以雷達圖和數值方式呈現音樂特徵，保持現有的視覺化方式
- **FR-007**: 系統必須移除未使用的批次查詢功能，包括相關介面和程式碼
- **FR-008**: 系統必須只支援單一歌曲查詢，不支援多首歌曲同時查詢
- **FR-009**: 系統必須記錄資料來源的錯誤事件，以便問題分析和監控

### Key Entities

- **ReccoBeatsAudioFeatures**: 音樂特徵資料物件，包含 9 個欄位
  - acousticness (number, 0.0-1.0): 聲學程度
  - danceability (number, 0.0-1.0): 適合跳舞程度
  - energy (number, 0.0-1.0): 能量
  - instrumentalness (number, 0.0-1.0): 器樂程度
  - liveness (number, 0.0-1.0): 現場錄音可能性
  - loudness (number, -60 to 0 dB): 響度
  - speechiness (number, 0.0-1.0): 語音內容比例
  - tempo (number, BPM): 速度（每分鐘拍數）
  - valence (number, 0.0-1.0): 音樂正向度（快樂度）

- **Spotify Track ID**: 歌曲唯一識別碼，22 字元 base62 格式（例如：`06HL4z0CvFAxyc27GXpf02`），來源為本地資料檔案 `public/data/tracks.json`

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 使用者在訪問歌曲詳情頁面後，可在 2 秒內看到音樂特徵雷達圖完整渲染
- **SC-002**: 系統查詢並回傳音樂特徵資料的時間 < 500ms（P95 百分位數）
- **SC-003**: 雷達圖顯示 7 個音樂特徵軸（acousticness, danceability, energy, instrumentalness, liveness, speechiness, valence），每個軸顯示對應數值
- **SC-004**: 使用者無需額外設定或認證即可查看音樂特徵資料
- **SC-005**: 當資料來源無法提供資料時，使用者看到友善的錯誤訊息（例如：「此歌曲的音樂特徵分析暫時無法使用」），而非技術性錯誤訊息
- **SC-006**: 移除批次查詢功能後，程式碼庫中不存在相關的批次查詢程式碼和介面定義

## Assumptions *(optional)*

- 新的資料來源（ReccoBeats）提供免費且無需認證的音樂特徵查詢服務
- 新的資料來源支援使用現有的歌曲識別碼直接查詢，無需額外轉換
- 新的資料來源的資料品質與原有來源（Spotify）相當，使用者不會察覺明顯差異
- 現有的音樂特徵視覺化只需要 9 個核心指標，不依賴原有來源獨有的資料欄位（如音調、調式、拍號）
- 批次查詢功能在專案中從未被使用，移除後不影響任何現有功能
- 新的資料來源有合理的使用限制，足以應付應用的正常使用量
- 新的資料來源的回應格式穩定，不會頻繁變動

## Dependencies *(optional)*

- **外部服務**: ReccoBeats 音樂特徵資料服務必須可用且穩定
- **本地資料**: 應用的歌曲資料庫必須包含有效的歌曲識別碼
- **基礎建設**: 應用的運行環境必須支援對外部服務的網路請求

## Out of Scope *(optional)*

- **不整合資料來源的其他功能**: 僅使用音樂特徵查詢功能，不整合其他功能（如音樂搜尋、推薦等）
- **不保留原有資料來源作為備援**: 不實作「新資料來源失敗時回退到原有來源」的機制（因原有來源已廢棄）
- **不實作資料快取機制**: 初期版本不實作音樂特徵資料的快取（未來可評估是否需要）
- **不顯示額外的音樂理論資訊**: 不顯示新資料來源未提供的音樂理論資訊（如音調、調式、拍號）
- **不實作批次查詢的替代方案**: 移除批次查詢功能後，不實作任何替代的批次查詢機制
- **不支援資料來源的原生識別碼**: 僅支援現有的歌曲識別碼格式，不支援資料來源的原生識別碼格式
