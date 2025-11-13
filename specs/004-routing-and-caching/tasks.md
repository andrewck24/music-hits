# Tasks: 瀏覽器導航與資料快取

**Input**: Design documents from `/specs/004-routing-and-caching/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: This feature does not explicitly request tests. Tasks focus on implementation only.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- Single project at repository root: `src/`, `public/`
- All paths relative to repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 [P] Install shadcn/ui components (input, badge, alert) using `npx shadcn@latest add input badge alert`
- [ ] T002 Create pages directory structure at `src/pages/`
- [ ] T003 Create features/api directory structure at `src/features/api/`
- [ ] T004 Create features/recommendations directory structure at `src/features/recommendations/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T005 Create RTK Query API slice in `src/features/api/spotify-api.ts` with getArtist, getTrack, getAudioFeatures endpoints
- [ ] T006 Update Redux store configuration in `src/lib/store.ts` to integrate spotifyApi reducer and middleware
- [ ] T007 Create router configuration in `src/lib/router.tsx` with createBrowserRouter for routes: `/`, `/search`, `/artist/:artistId`, `/artist/:artistId/track/:trackId`
- [ ] T008 Update `src/main.tsx` to use RouterProvider instead of current routing approach
- [ ] T009 Create `public/_redirects` file with content `/* /index.html 200` for Cloudflare Pages SPA support

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - 基本頁面導航 (Priority: P1) 🎯 MVP

**Goal**: 使用者能夠在應用程式的不同頁面之間進行導航，並使用瀏覽器「上一頁」和「下一頁」按鈕跳轉

**Independent Test**: 開啟應用程式 → 點擊歌手 → 點擊歌曲 → 按瀏覽器「上一頁」→ 確認返回歌手資訊頁 → 按「下一頁」→ 確認前進到歌曲資訊頁

### Implementation for User Story 1

- [ ] T010 [P] [US1] Create ArtistPage component in `src/pages/artist-page.tsx` using useParams and useGetArtistQuery
- [ ] T011 [P] [US1] Create TrackPage component in `src/pages/track-page.tsx` using useParams, useGetTrackQuery, and useGetAudioFeaturesQuery
- [ ] T012 [US1] Update ArtistProfile component in `src/components/artist/artist-profile.tsx` to accept artist data as props instead of reading from Redux
- [ ] T013 [US1] Update TrackDetail component in `src/components/track/track-detail.tsx` to accept track and audioFeatures as props instead of reading from Redux
- [ ] T014 [US1] Update TrackList component in `src/components/track/track-list.tsx` to use Link from react-router for navigation to track pages
- [ ] T015 [US1] Add error handling and loading states in ArtistPage for missing artistId or API errors
- [ ] T016 [US1] Add error handling and loading states in TrackPage for missing trackId or API errors

**Checkpoint**: User Story 1 should be fully functional - users can navigate between artist and track pages using browser navigation

---

## Phase 4: User Story 2 - 首頁歌手推薦 (Priority: P2)

**Goal**: 使用者開啟應用程式時看到首頁，顯示熱門歌手推薦列表，可直接點擊跳轉到歌手資訊頁

**Independent Test**: 開啟應用程式 → 確認看到首頁 → 確認顯示多位歌手推薦 → 點擊任一歌手 → 確認導航到該歌手資訊頁

### Implementation for User Story 2

- [ ] T017 [US2] Create RECOMMENDED_ARTIST_IDS constant in `src/features/recommendations/constants.ts` with 8 popular artist IDs
- [ ] T018 [US2] Create HomePage component in `src/pages/home-page.tsx` that renders recommended artist cards
- [ ] T019 [US2] Create ArtistCard component in `src/components/artist/artist-card.tsx` that uses useGetArtistQuery and Link to artist page
- [ ] T020 [US2] Add loading skeleton states for ArtistCard in HomePage while artist data is loading
- [ ] T021 [US2] Style HomePage grid layout for responsive display (2 columns mobile, 4 columns desktop)

**Checkpoint**: User Stories 1 AND 2 should both work independently - users can start from homepage or navigate directly to artist/track pages

---

## Phase 5: User Story 3 - 深度連結支援 (Priority: P3)

**Goal**: 使用者可以直接透過 URL 訪問特定頁面，應用程式會自動載入對應內容

**Independent Test**: 直接在瀏覽器輸入歌手 URL (例如 `/artist/123`) → 確認載入並顯示該歌手資訊 → 直接輸入歌曲 URL → 確認載入並顯示該歌曲資訊

### Implementation for User Story 3

- [ ] T022 [US3] Create SearchPage component in `src/pages/search-page.tsx` using useSearchParams to read query from URL
- [ ] T023 [US3] Update SearchBar component to use setSearchParams with `{ replace: true }` option to avoid polluting browser history
- [ ] T024 [US3] Update SearchResults component to read query from URL searchParams instead of Redux state
- [ ] T025 [US3] Refactor search logic to use performSearch pure function from search-service with fuseInstance from Redux
- [ ] T026 [US3] Add URL parameter validation in all page components (HomePage, SearchPage, ArtistPage, TrackPage)
- [ ] T027 [US3] Add friendly error pages for invalid URLs or missing resources
- [ ] T028 [US3] Test deep linking by directly navigating to various URLs and verifying correct content loads

**Checkpoint**: All user stories (1, 2, 3) should now work independently - users can deep link to any page via URL

---

## Phase 6: User Story 4 - 資料快取 (Priority: P4)

**Goal**: 已獲取過的資料會被快取，當使用者返回之前瀏覽過的頁面時，不需要重新請求相同資料

**Independent Test**: 開啟應用程式 → 瀏覽某歌手頁面（記錄 API 請求次數）→ 瀏覽其他頁面 → 返回同一歌手頁面 → 確認沒有發出新的 API 請求

**Note**: RTK Query automatically handles caching. This phase focuses on verification and optimization.

### Implementation for User Story 4

- [ ] T029 [US4] Verify RTK Query cache behavior using Redux DevTools - confirm queries are cached with 60s TTL
- [ ] T030 [US4] Test cache hit rate by navigating between pages and monitoring Network tab in browser DevTools
- [ ] T031 [US4] Verify deduplication works by triggering multiple concurrent requests for same resource
- [ ] T032 [US4] Document cache behavior in code comments and update quickstart.md with cache verification steps
- [ ] T033 [US4] Add cache tags verification to ensure proper invalidation strategy is in place

**Checkpoint**: All user stories (1, 2, 3, 4) complete - caching verified and optimized

---

## Phase 7: Code Cleanup & Refactoring

**Purpose**: Remove old code that has been replaced by RTK Query and react-router

- [ ] T034 [P] Delete `src/features/artist/artist-slice.ts`, `artist-selectors.ts`, `artist-types.ts`
- [ ] T035 [P] Delete `src/features/track/track-slice.ts`, `track-selectors.ts`, `track-types.ts`
- [ ] T036 [P] Delete `src/features/search/search-slice.ts`, `search-selectors.ts` (keep search-service.ts and search-types.ts)
- [ ] T037 [P] Delete `src/hooks/use-artist.ts`, `use-track.ts`, `use-search.ts`
- [ ] T038 [P] Delete `src/services/spotify-api.ts` (replaced by RTK Query)
- [ ] T039 Move fuseInstance from search state to data state in `src/features/data/data-slice.ts`
- [ ] T040 Update data-slice to initialize fuseInstance when tracks are loaded
- [ ] T041 Evaluate and potentially delete `src/features/spotify/spotify-slice.ts` and `spotify-selectors.ts` if no longer needed (keep spotify-types.ts)
- [ ] T042 Update all imports throughout codebase to remove references to deleted files
- [ ] T043 Remove unused dependencies from package.json if any

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T044 [P] Update type definitions to ensure all components have proper TypeScript types
- [ ] T045 [P] Add proper error boundaries for route-level error handling
- [ ] T046 Run `npm run lint` and fix all linting issues
- [ ] T047 Run `npm run type-check` and fix all TypeScript errors
- [ ] T048 Test all user scenarios from spec.md acceptance criteria
- [ ] T049 Test all edge cases from spec.md (invalid URLs, network errors, empty searches, etc.)
- [ ] T050 Verify all success criteria from spec.md are met (SC-001 through SC-010)
- [ ] T051 Performance testing: verify homepage loads <1s, deep links <2s, cached navigation <0.5s
- [ ] T052 Run quickstart.md validation to ensure all implementation steps are correct

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User stories can proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4)
- **Cleanup (Phase 7)**: Depends on User Story 1, 2, 3 completion (can start before US4)
- **Polish (Phase 8)**: Depends on all user stories and cleanup being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Builds on US1 routing but independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Uses US1 pages but adds deep linking
- **User Story 4 (P4)**: Verification only - RTK Query handles caching automatically from Phase 2

### Within Each User Story

- Models before services (not applicable - using RTK Query)
- Services before pages (RTK Query API before page components)
- Pages before component updates (new pages before refactoring old components)
- Core implementation before edge cases (happy path before error handling)

### Parallel Opportunities

- All Setup tasks (T001-T004) can run in parallel
- Within Foundational: T005 and T009 can run in parallel
- Within US1: T010, T011 can run in parallel, then T012-T014 can run in parallel
- Within US2: All tasks can run in sequence or in parallel by different developers
- Within US3: T022-T024 can run in parallel
- Within US4: All verification tasks can run in parallel
- Within Cleanup: All delete tasks (T034-T038) can run in parallel
- Within Polish: T044, T045, T046, T047 can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch page components together:
Task: "Create ArtistPage component in src/pages/artist-page.tsx"
Task: "Create TrackPage component in src/pages/track-page.tsx"

# Then update existing components together:
Task: "Update ArtistProfile component in src/components/artist/artist-profile.tsx"
Task: "Update TrackDetail component in src/components/track/track-detail.tsx"
Task: "Update TrackList component in src/components/track/track-list.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 + 2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Basic Navigation)
4. Complete Phase 4: User Story 2 (Homepage Recommendations)
5. **STOP and VALIDATE**: Test US1 + US2 independently
6. Deploy/demo if ready

### Full Feature Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → MVP navigation working
3. Add User Story 2 → Test independently → Homepage added
4. Add User Story 3 → Test independently → Deep linking supported
5. Verify User Story 4 → Cache behavior confirmed
6. Cleanup old code → Remove deprecated slices and hooks
7. Polish → Final testing and validation
8. Each phase adds value without breaking previous functionality

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Navigation)
   - Developer B: User Story 2 (Homepage)
   - Developer C: User Story 3 (Deep Linking)
3. Developer D can start Cleanup (Phase 7) after US1-US3 are complete
4. All developers participate in Polish phase together

---

## Summary

- **Total Tasks**: 52 tasks
- **Task Distribution**:
  - Phase 1 (Setup): 4 tasks
  - Phase 2 (Foundational): 5 tasks (BLOCKING)
  - Phase 3 (US1 - P1 Navigation): 7 tasks 🎯 MVP
  - Phase 4 (US2 - P2 Homepage): 5 tasks
  - Phase 5 (US3 - P3 Deep Links): 7 tasks
  - Phase 6 (US4 - P4 Caching): 5 tasks
  - Phase 7 (Cleanup): 10 tasks
  - Phase 8 (Polish): 9 tasks
- **Parallel Opportunities**: Significant parallelization possible within each phase and across user stories
- **Independent Test Criteria**: Each user story has clear acceptance criteria from spec.md
- **Suggested MVP Scope**: Phase 1 + 2 + 3 + 4 (Setup + Foundational + US1 + US2) = Core navigation + Homepage

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group of related tasks
- Stop at any checkpoint to validate story independently
- RTK Query handles caching automatically - US4 is primarily verification
- Deep linking works automatically with react-router once routes are configured
- No tests explicitly requested in spec - focus on implementation
