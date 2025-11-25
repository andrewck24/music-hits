# Feature Specification: Route-Based 多語言系統

**Feature Branch**: `007-route-based-i18n`
**Created**: 2025-11-25
**Status**: Draft
**Input**: User description: "建立一個 route-based 多語言系統

- 預設為 en，且 en 不要顯示在路由中
- 支援 zh-TW, jp
- 可以偵測瀏覽器語言，提醒用戶切換至支援的語言或預設的英文
- 根據頁面使用不同的 namespace: common (home, search), artist, track"

## Clarifications

### Session 2025-11-25

- Q: 響應式行為 - 桌面版和手機版的 language-switch 顯示方式應該如何設計？ → A: 只有手機版將 language-switch 收納到 popover，桌面版直接顯示在 header（可用性優先）
- Q: Popover Trigger 圖示應該使用什麼樣式？ → A: Menu icon（如 hamburger ☰ 或 kebab menu ⋮）
- Q: Popover 內應該包含哪些項目？ → A: 僅 GitHub 連結（最小化原則，未來可擴充）
- Q: Popover 開啟時的動畫方向？ → A: 從上往下展開（從 header 下方滑出）
- Q: Popover 的關閉機制應該支援哪些方式？ → A: 多種方式（點擊外部 + ESC 鍵 + 關閉按鈕）

## User Scenarios & Testing _(mandatory)_

### User Story 1 - 基礎多語言路由支援 (Priority: P1)

使用者能夠透過 URL 訪問不同語言版本的網站，包括英文（預設）、繁體中文（zh-TW）和日文（jp）。英文作為預設語言，其 URL 不包含語言前綴（例如 `/` 或 `/search`），而其他語言則在 URL 中顯示語言代碼（例如 `/zh-TW/` 或 `/jp/search`）。所有頁面內容會依據使用者選擇的語言顯示對應的翻譯文字。

**Why this priority**: 這是多語言系統的核心功能，提供基礎的語言路由和內容本地化能力。沒有此功能，國際用戶無法以母語瀏覽網站內容，直接影響用戶體驗和網站的國際化目標。作為 P1 優先級，確保基礎多語言架構能夠獨立運作。

**Independent Test**: 可透過直接訪問不同語言的 URL（如 `/`、`/zh-TW/`、`/jp/`）驗證路由正確性，並檢查頁面內容是否以對應語言顯示。可獨立測試而不依賴語言切換器或瀏覽器偵測功能。

**Acceptance Scenarios**:

1. **Given** 使用者訪問網站首頁，**When** 在瀏覽器輸入 `/`，**Then** 應顯示英文版本的首頁內容
2. **Given** 使用者想查看繁體中文版本，**When** 在瀏覽器輸入 `/zh-TW/`，**Then** 應顯示繁體中文版本的首頁內容
3. **Given** 使用者想查看日文版本，**When** 在瀏覽器輸入 `/jp/`，**Then** 應顯示日文版本的首頁內容
4. **Given** 使用者在英文版搜尋頁面，**When** 訪問 `/search?q=music`，**Then** 應顯示英文版的搜尋結果頁面
5. **Given** 使用者在繁體中文版搜尋頁面，**When** 訪問 `/zh-TW/search?q=music`，**Then** 應顯示繁體中文版的搜尋結果頁面，且保留 query 參數
6. **Given** 使用者訪問藝人頁面，**When** 訪問 `/artist/123`（英文）或 `/zh-TW/artist/123`（中文），**Then** 應以對應語言顯示藝人資訊
7. **Given** 使用者訪問歌曲頁面，**When** 訪問 `/track/456`（英文）或 `/jp/track/456`（日文），**Then** 應以對應語言顯示歌曲資訊

---

### User Story 2 - 語言切換器（Header 整合） (Priority: P2)

使用者可透過網站 Header 右上角的語言切換器，在瀏覽任何頁面時輕鬆切換語言。切換語言後，使用者會保持在相同的頁面內容，只是語言改變（例如從 `/search` 切換到 `/zh-TW/search`），確保瀏覽流程不中斷。

**Why this priority**: 雖然使用者可以直接輸入 URL 切換語言（P1 已滿足），但大多數使用者期望透過 UI 元件進行語言切換。此功能大幅提升用戶體驗，讓語言切換變得直觀且快速。作為 P2，確保在基礎路由架構（P1）完成後，提供便利的用戶介面。

**Independent Test**: 可獨立測試語言切換器的 UI 互動（例如 dropdown 選單）和路由轉換邏輯，驗證點擊不同語言選項後 URL 和頁面內容的變化，無需依賴瀏覽器語言偵測功能。

**Acceptance Scenarios**:

1. **Given** 使用者在首頁，**When** 點擊 Header 右上角的語言切換器並選擇「繁體中文」，**Then** 應從 `/` 導航至 `/zh-TW/` 並顯示繁體中文內容
2. **Given** 使用者在搜尋頁面 `/search?q=music`，**When** 點擊語言切換器並選擇「日本語」，**Then** 應導航至 `/jp/search?q=music` 並保留搜尋參數
3. **Given** 使用者在繁體中文版藝人頁面 `/zh-TW/artist/123`，**When** 切換回「English」，**Then** 應導航至 `/artist/123`
4. **Given** 使用者在日文版歌曲頁面 `/jp/track/456`，**When** 切換至「繁體中文」，**Then** 應導航至 `/zh-TW/track/456`
5. **Given** 使用者想了解當前語言，**When** 查看語言切換器，**Then** 應清楚顯示目前選中的語言（例如標示為 active 或 highlighted）
6. **Given** Header 需要整合多個功能元件，**When** 語言切換器和其他功能整合至 Header 後，**Then** 桌面版應在 Header 右側直接顯示 language-switch 和一個 popover trigger（收納 GitHub 連結等次要功能）；手機版應將 language-switch 和 GitHub 連結都收納到 popover 中，僅顯示 search 按鈕和 popover trigger，保持 Header 簡潔
7. **Given** 使用者在桌面版，**When** 點擊 Header 右側的 menu icon (popover trigger)，**Then** 應從 header 下方展開 full-width popover，顯示 GitHub 連結
8. **Given** 使用者在手機版，**When** 點擊 menu icon，**Then** popover 應展開並同時顯示 language-switch 和 GitHub 連結
9. **Given** Popover 已開啟，**When** 使用者點擊 popover 外部區域、按下 ESC 鍵、或點擊關閉按鈕，**Then** popover 應關閉並收回

---

### User Story 3 - 瀏覽器語言偵測與提示 (Priority: P3)

當使用者首次訪問網站時，系統會偵測瀏覽器的語言設定。如果偵測到瀏覽器語言為網站支援的語言（繁體中文或日文），系統會在頁面頂部顯示一個 Banner 提示，詢問使用者是否要切換至該語言。若偵測到不支援的語言，則使用預設的英文版本。Banner 可由使用者關閉，且關閉後不會再次顯示（除非清除瀏覽器資料）。

**Why this priority**: 這是進階的用戶體驗優化功能，幫助國際用戶更快發現網站支援其母語。雖然提升便利性，但並非核心功能（使用者仍可透過 P2 的語言切換器手動選擇語言）。作為 P3，確保在基礎功能（P1）和 UI 便利性（P2）完備後，再提供主動的語言建議。

**Independent Test**: 可透過修改瀏覽器語言設定（例如將瀏覽器語言設為 zh-TW、ja、或 fr）來測試 Banner 的顯示邏輯、提示訊息、以及關閉後的記憶功能，無需依賴其他功能。

**Acceptance Scenarios**:

1. **Given** 使用者的瀏覽器語言設定為繁體中文（zh-TW），**When** 首次訪問網站首頁 `/`，**Then** 應在頁面頂部顯示 Banner，提示「您的瀏覽器語言為繁體中文，是否切換？」並提供「切換語言」和「保持英文」兩個選項
2. **Given** 使用者看到語言提示 Banner，**When** 點擊「切換語言」，**Then** 應導航至 `/zh-TW/` 並關閉 Banner
3. **Given** 使用者看到語言提示 Banner，**When** 點擊「保持英文」或關閉按鈕，**Then** Banner 應消失且記錄使用者選擇（不再於後續訪問顯示）
4. **Given** 使用者的瀏覽器語言設定為日文（ja），**When** 首次訪問網站，**Then** 應顯示 Banner 提示切換至日文版本
5. **Given** 使用者的瀏覽器語言設定為不支援的語言（例如法文 fr），**When** 訪問網站，**Then** 應顯示英文版本且不顯示語言切換 Banner
6. **Given** 使用者曾關閉 Banner，**When** 清除瀏覽器 localStorage 並重新訪問，**Then** Banner 應再次顯示
7. **Given** 使用者在任意頁面看到 Banner，**When** 點擊切換語言，**Then** 應保持在相同頁面路徑（例如 `/search` 變為 `/zh-TW/search`），而非導向首頁

---

### Edge Cases

- **用戶直接訪問 `/en/` 路徑**：系統應重定向至 `/`（移除不必要的語言前綴）
- **用戶訪問不存在的語言路徑**（例如 `/fr/`）：系統應顯示 404 錯誤頁面或重定向至預設的英文版本 `/`
- **Banner 關閉後清除 localStorage**：若使用者清除瀏覽器資料（localStorage），下次訪問時 Banner 應再次顯示
- **翻譯內容缺失**：當切換至某語言但該語言的翻譯內容不完整或缺失時，系統應顯示預設的英文內容作為 fallback
- **URL 參數保留**：切換語言時，所有 URL 參數（如 `?q=keyword`）應被保留（例如 `/search?q=music` 切換為 `/zh-TW/search?q=music`）
- **深度連結保留**：使用者分享的 URL 連結應保持有效，即使語言不同（例如朋友分享 `/search?q=test`，接收者瀏覽器為日文，Banner 提示切換但 URL 保持不變直到使用者選擇）
- **語言偵測優先順序**：若 URL 已包含語言前綴（如 `/zh-TW/`），則以 URL 為準，不顯示語言切換 Banner（避免衝突）

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: 系統必須支援透過 URL 語言前綴來訪問不同語言版本（`/zh-TW/*` 對應繁體中文，`/jp/*` 對應日文）
- **FR-002**: 系統必須將英文作為預設語言，且英文版本的 URL 不包含語言前綴（例如 `/` 而非 `/en/`）
- **FR-003**: 系統必須支援按頁面類型載入對應的翻譯命名空間（namespace），包括 common（用於 home 和 search）、artist（用於藝人頁面）、track（用於歌曲頁面）
- **FR-004**: 系統必須在網站 Header 右上角提供語言切換 UI 元件，讓使用者能隨時切換語言
- **FR-005**: 系統必須在使用者首次訪問時偵測瀏覽器語言設定，並判斷是否為支援的語言（zh-TW 或 jp）
- **FR-006**: 系統必須在使用者切換語言後，保持在相同的頁面路徑（例如從 `/search` 切換至 `/zh-TW/search`），而非導向首頁
- **FR-007**: 系統必須在偵測到不支援的瀏覽器語言時，使用預設的英文版本，且不進行自動重定向
- **FR-008**: 系統必須允許使用者關閉語言提示 Banner，並記錄使用者的選擇（使用瀏覽器儲存機制），避免重複顯示
- **FR-009**: 系統必須在 Header 右側提供一個 popover trigger（使用 menu icon 如 hamburger ☰ 或 kebab menu ⋮），點擊後開啟 full-width 的 popover（位置緊貼 header，從上往下展開動畫），收納 GitHub 連結
- **FR-010**: Popover 必須支援多種關閉方式，包括點擊 popover 外部區域、按下 ESC 鍵、以及點擊 popover 內的關閉按鈕
- **FR-011**: 在桌面版，Header 右側應直接顯示 language-switch，並在其右側顯示 popover trigger
- **FR-012**: 在手機版，Header 應僅顯示 search 按鈕和 popover trigger，將 language-switch 和 GitHub 連結都收納到 popover 中，保持介面簡潔

### Key Entities

- **語言設定（Language Configuration）**: 記錄系統支援的語言清單（en, zh-TW, jp）、預設語言（en）、以及每種語言對應的顯示名稱（例如「English」、「繁體中文」、「日本語」）
- **翻譯資源（Translation Resources）**: 按命名空間（namespace）組織的多語言文字內容，包含 common（首頁、搜尋頁共用）、artist（藝人頁面）、track（歌曲頁面）等分類，每個命名空間包含不同語言的翻譯對照
- **使用者語言偏好（User Language Preference）**: 記錄使用者選擇的語言以及是否曾關閉語言提示 Banner 的狀態，透過瀏覽器儲存機制（如 localStorage）持久化保存

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 使用者能在 3 秒內透過語言切換器完成語言切換操作（從點擊語言選項到頁面完全載入並顯示新語言內容）。測量方式：使用瀏覽器 Performance API 或手動計時，從使用者點擊語言選項開始，到新語言頁面的所有翻譯文字渲染完成（i18next 載入完畢且 DOM 更新完成）為止
- **SC-002**: 使用者切換語言後，保持在相同的頁面內容和位置（例如從 `/search?q=music` 切換至 `/zh-TW/search?q=music`），不會導向首頁或遺失頁面狀態
- **SC-003**: 90% 以上瀏覽器語言設定為支援語言（zh-TW 或 jp）的使用者，在首次訪問時能看到語言切換提示 Banner
- **SC-004**: URL 正確反映當前語言設定（繁體中文和日文的 URL 包含語言前綴 `/zh-TW/` 或 `/jp/`，英文 URL 不包含前綴）
- **SC-005**: 語言提示 Banner 不干擾使用者的頁面瀏覽體驗（可輕鬆關閉，且關閉後不再重複顯示，除非使用者清除瀏覽器資料）
- **SC-006**: 所有頁面內容（包括導航、按鈕、提示訊息、錯誤訊息等）皆能依據選擇的語言正確顯示對應的翻譯文字
- **SC-007**: 使用者分享的 URL 連結在不同語言環境下保持有效（例如分享 `/search?q=test`，接收者無論使用哪種語言皆能正常訪問該頁面）
