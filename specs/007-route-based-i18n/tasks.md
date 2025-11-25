# Tasks: Route-Based 多語言系統

**Input**: Design documents from `/specs/007-route-based-i18n/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Single project: `src/`, `tests/`, `public/` at repository root
- Paths are absolute from repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies and create basic directory structure

- [x] T001 Install i18next dependencies: i18next@^23.11.5, react-i18next@^14.0.0, i18next-http-backend@^2.5.0, i18next-browser-languagedetector@^7.2.0
- [x] T002 [P] Create types directory structure: src/types/
- [x] T003 [P] Create translation files directory structure: public/locales/en/, public/locales/zh-TW/, public/locales/jp/
- [x] T004 [P] Create hooks directory if not exists: src/hooks/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core i18n infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 [P] Create translation type definitions in src/types/translations.ts (CommonTranslations, ArtistTranslations, TrackTranslations interfaces)
- [x] T006 [P] Create i18next module augmentation in src/types/i18next.d.ts (declare CustomTypeOptions)
- [x] T007 Create i18n core configuration in src/lib/i18n.ts (export defaultNS, resources, configure i18next with Backend, LanguageDetector, initReactI18next)
- [x] T008 Initialize i18next in src/main.tsx (import @/lib/i18n before App)
- [x] T009 [P] Create English common translations in public/locales/en/common.json
- [x] T010 [P] Create Traditional Chinese common translations in public/locales/zh-TW/common.json
- [x] T011 [P] Create Japanese common translations in public/locales/jp/common.json
- [x] T012 [P] Create English artist translations in public/locales/en/artist.json
- [x] T013 [P] Create Traditional Chinese artist translations in public/locales/zh-TW/artist.json
- [x] T014 [P] Create Japanese artist translations in public/locales/jp/artist.json
- [x] T015 [P] Create English track translations in public/locales/en/track.json
- [x] T016 [P] Create Traditional Chinese track translations in public/locales/zh-TW/track.json
- [x] T017 [P] Create Japanese track translations in public/locales/jp/track.json

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - 基礎多語言路由支援 (Priority: P1) 🎯 MVP

**Goal**: 使用者能夠透過 URL 訪問不同語言版本的網站（英文無前綴 `/`，中文 `/zh-TW/*`，日文 `/jp/*`），所有頁面內容依據語言顯示對應翻譯文字

**Independent Test**: 直接訪問不同語言的 URL（`/`, `/zh-TW/`, `/jp/`）驗證路由正確性，檢查頁面內容是否以對應語言顯示，無需依賴語言切換器或瀏覽器偵測功能

### Implementation for User Story 1

- [x] T018 [US1] Create useCurrentLanguage hook in src/hooks/use-current-language.ts (parse language from URL pathname, return SupportedLanguages)
- [x] T019 [US1] Create useChangeLanguage hook in src/hooks/use-change-language.ts (navigate to new language path while preserving query params and hash)
- [x] T020 [US1] Update routes configuration in src/routes.tsx (add language prefix routes for zh-TW and jp, preserve en as default without prefix)
- [x] T021 [US1] Add redirect from /en/ to / in src/routes.tsx (handle edge case where users visit /en/ paths)
- [x] T022 [US1] Create LanguageSync component in src/components/language-sync.tsx (sync i18n.language with URL-based language using useCurrentLanguage and useEffect)
- [x] T023 [US1] Integrate LanguageSync in src/routes.tsx (add LanguageSync component to ensure i18n state matches URL)

**Checkpoint**: At this point, User Story 1 should be fully functional - users can visit `/`, `/zh-TW/`, `/jp/` and see content in the corresponding language. Redirects from `/en/*` to `/*` should work correctly

---

## Phase 4: User Story 2 - 語言切換器（Header 整合） (Priority: P2)

**Goal**: 使用者可透過 Header 右上角的語言切換器在任何頁面輕鬆切換語言，保持在相同頁面內容（如 `/search` → `/zh-TW/search`）。桌面版直接顯示 language-switch 和 GitHub link（圓形按鈕），手機版將 language-switch, GitHub link 收納到 Menu popover 中

**Independent Test**: 測試語言切換器的 UI 互動（popover 選單）和路由轉換邏輯，驗證點擊不同語言選項後 URL 和頁面內容的變化，無需依賴瀏覽器語言偵測功能

### Implementation for User Story 2

- [x] T024 [P] [US2] Install shadcn/ui popover component: `npx shadcn@latest add popover`
- [x] T025 [P] [US2] Create LanguageSwitch and LanguageList components in src/components/layout/language-switch.tsx
  - LanguageSwitch: popover trigger (globe icon button) + language options popover
  - LanguageList: reusable language options list (used by both LanguageSwitch and Menu)
  - Use useChangeLanguage hook for route-based navigation
  - Display current language with checkmark icon
  - Complete JSDoc documentation for both exported components
- [x] T026 [P] [US2] Create Menu popover component in src/components/layout/menu.tsx
  - Hamburger/close icon toggle button
  - Full-width dropdown from header (align: end)
  - Reuses LanguageList component for language options
  - Includes GitHub repository link
  - Supports close via icon toggle, ESC key, or outside click
  - Complete JSDoc documentation
- [x] T027 [US2] Update Header component in src/components/layout/header.tsx
  - Desktop (sm+): [Logo] [SearchBar] [LanguageSwitch] [GitHubLink]
  - Mobile (<sm): [Logo] [SearchButton (conditional)] [Menu]
  - SearchButton only shows when not on /search page
  - All icon buttons (Search/Language/GitHub/Menu) use consistent circular styling
- [x] T028 [US2] Implement responsive behavior for language switching
  - Desktop: LanguageSwitch displayed in header, Menu not visible
  - Mobile: LanguageSwitch hidden in header, LanguageList embedded in Menu popover
  - Maintains consistent UX across breakpoints
- [x] T029 [US2] Style all components using Tailwind CSS and design system variables
  - Consistent circular button styling: size-12, rounded-full, variant="secondary"
  - Popover styling with proper alignment and spacing
  - Hover states and transitions for all interactive elements
  - Maintains visual consistency with existing Spotify-themed design

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - users can switch languages via UI and URLs update correctly

---

## Phase 5: User Story 3 - 瀏覽器語言偵測與提示 (Priority: P3)

**Goal**: 首次訪問時系統偵測瀏覽器語言設定，若為支援語言（zh-TW 或 jp）且與當前 URL 語言不符，顯示 Banner 詢問是否切換。Banner 可關閉且不再重複顯示（除非清除 localStorage）

**Independent Test**: 修改瀏覽器語言設定（zh-TW, ja, fr）測試 Banner 顯示邏輯、提示訊息、關閉後的記憶功能，無需依賴其他功能

### Implementation for User Story 3

- [ ] T030 [P] [US3] Create useBannerState hook in src/hooks/use-banner-state.ts (manage isDismissed state with localStorage i18n_banner_dismissed, provide dismiss and reset functions, handle Safari private mode)
- [ ] T031 [P] [US3] Create useDetectedBrowserLanguage hook in src/hooks/use-language-detection.ts (use i18n.services.languageDetector.detect(), return SupportedLanguages or null if unsupported)
- [ ] T032 [US3] Create I18nBanner component in src/components/layout/i18n-banner.tsx (display banner when detected language differs from current URL language, use useDetectedBrowserLanguage and useBannerState, provide switch/dismiss buttons, use useChangeLanguage for switching)
- [ ] T033 [US3] Integrate I18nBanner in src/routes.tsx or src/App.tsx (add I18nBanner component at top of layout, ensure it only shows when appropriate)
- [ ] T034 [US3] Style I18nBanner component using Tailwind CSS and @/globals.css variables (position at top of page, non-intrusive design, clear close button)

**Checkpoint**: All user stories should now be independently functional - language detection banner appears for first-time users with supported browser languages

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: SEO optimization, testing, and documentation

- [ ] T035 [P] Add hreflang links in index.html head section (static links for en, zh-TW, jp, and x-default pointing to respective homepage URLs)
- [ ] T036 [P] Verify TypeScript strict mode compliance in src/types/i18next.d.ts (ensure returnNull: false in CustomTypeOptions)
- [ ] T037 [P] Add error handling for i18n failed loading events in src/lib/i18n.ts (fallback to English on load failure)
- [ ] T038 Test unsupported browser language fallback behavior (manually set browser language to unsupported language like fr/de/es, verify site defaults to English without banner)
- [ ] T039 Update CLAUDE.md with i18next configuration details (add to Active Technologies section)
- [ ] T040 Run linting and type checking: npm run lint && npm run type-check
- [ ] T041 Verify translation files load correctly in development mode (check Network panel for /locales/\*/common.json requests)
- [ ] T042 Test language switching preserves query parameters and hash (manual test: /search?q=test switching languages)
- [ ] T042a Update all Link components to include language prefix in href/to paths (create useLocalizedPath hook to generate language-aware paths)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Requires US1 (useChangeLanguage hook) but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Requires US1 (useCurrentLanguage) and US2 (useChangeLanguage) but should be independently testable

### Within Each User Story

- US1: hooks → routes → language sync
- US2: shadcn component install → language-switch + menu components → header integration → styling
- US3: hooks → banner component → integration → styling

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (T002, T003, T004)
- All Foundational translation file creation tasks marked [P] can run in parallel (T009-T017)
- Type definition tasks can run in parallel (T005, T006)
- Within US2: language-switch and menu components can be developed in parallel (T024, T025)
- Within US3: both hooks can be developed in parallel (T029, T030)
- Polish tasks marked [P] can run in parallel (T034, T035, T036)

---

## Parallel Example: Foundational Phase

```bash
# Launch all translation file creation tasks together:
Task: "Create English common translations in public/locales/en/common.json"
Task: "Create Traditional Chinese common translations in public/locales/zh-TW/common.json"
Task: "Create Japanese common translations in public/locales/jp/common.json"
Task: "Create English artist translations in public/locales/en/artist.json"
# ... (all 9 translation files can be created in parallel)
```

## Parallel Example: User Story 2

```bash
# Launch component development in parallel:
Task: "Create LanguageSwitch component in src/components/layout/language-switch.tsx"
Task: "Create Menu popover component in src/components/layout/menu.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T004)
2. Complete Phase 2: Foundational (T005-T017) - CRITICAL
3. Complete Phase 3: User Story 1 (T018-T022)
4. **STOP and VALIDATE**: Test by visiting `/`, `/zh-TW/`, `/jp/` - content should display in corresponding language
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently (visit different language URLs) → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently (switch languages via UI) → Deploy/Demo
4. Add User Story 3 → Test independently (test browser language detection) → Deploy/Demo
5. Add Polish → SEO optimization and final testing → Deploy/Demo
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (T018-T022)
   - Developer B: User Story 2 (T023-T028)
   - Developer C: User Story 3 (T029-T033)
3. Stories complete and integrate independently
4. Team completes Polish together (T034-T040)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Language preference is ONLY determined by URL, not localStorage or cookies (per spec requirement)
- i18next-browser-languagedetector is ONLY used for banner display logic, caches: [] must be set
- All UI components use shadcn/ui and @/globals.css variables (per constitution)
- TypeScript strict mode and strictNullChecks enabled (per plan.md)

---

## Summary

**Total Tasks**: 42

- Setup (Phase 1): 4 tasks
- Foundational (Phase 2): 13 tasks
- User Story 1 (Phase 3): 6 tasks
- User Story 2 (Phase 4): 6 tasks
- User Story 3 (Phase 5): 5 tasks
- Polish (Phase 6): 8 tasks

**Parallel Opportunities**: 22 tasks marked [P]

**MVP Scope**: Phase 1 + Phase 2 + Phase 3 = 23 tasks (User Story 1 only)

**Independent Test Criteria**:

- US1: Visit `/`, `/zh-TW/`, `/jp/` URLs and verify content language matches
- US2: Use language switcher UI to change languages and verify URL updates
- US3: Change browser language settings and verify banner appears/dismisses correctly
