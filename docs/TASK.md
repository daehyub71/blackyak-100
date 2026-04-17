# TASK — 블랙야크 100대 명산 v2 작업 체크리스트

각 항목은 완료 즉시 `[x]` 체크. Phase 완료 시 상단에 완료 일시(YYYY-MM-DD) 기록.
SPEC·PLAN 변경 시 관련 항목을 역추적하여 갱신.

---

## Phase 0 · 기반

**상태**: 🚧 진행 중 (데이터 마이그레이션·커밋 남음)
**기간 목표**: 3일
**완료일**: —

### P0.1 문서
- [x] `docs/SPEC.md`
- [x] `docs/PLAN.md`
- [x] `docs/TASK.md` (본 문서)
- [x] `docs/DESIGN_SYSTEM.md`
- [x] `docs/HARNESS.md`
- [x] `CLAUDE.md` (프로젝트 루트)
- [x] `.gitignore`

### P0.2 하네스 (.claude/)
- [x] `.claude/settings.json` — PostToolUse (ESLint+tsc), Stop (TASK 요약), PreToolUse JSON 스키마(가드)
- [x] `.claude/hooks/post-edit.sh`, `post-test.sh`, `pre-data.sh`, `stop-summary.sh`
- [x] `.claude/agents/ux-critic.md`
- [x] `.claude/agents/design-system-guard.md`
- [x] `.claude/agents/mountain-data-reviewer.md`
- [x] `.claude/commands/new-phase.md`
- [x] `.claude/commands/spec-check.md`
- [x] `.claude/commands/data-refresh.md`
- [x] `.claude/skills/add-mountain-page/SKILL.md`
- [x] `.claude/skills/update-trail-data/SKILL.md`

### P0.3 프론트엔드 초기화
- [x] `pnpm` 전역 설치 확인 (10.33.0)
- [x] `frontend/` Vite + React + TS 템플릿 생성
- [x] `pnpm install` 성공
- [x] `pnpm dev` — 기본 라우트 뜨는 것 로컬 확인 필요 (런타임 스모크는 Playwright P1에서)
- [x] `tsconfig.app.json` strict 모드
- [x] `vite.config.ts` path alias(`@/*`) 설정

### P0.4 툴체인
- [x] ESLint flat config (typescript-eslint, react-hooks, jsx-a11y, import, resolver-typescript)
- [x] Prettier 설정 + tailwind 플러그인
- [x] Vitest + @testing-library/react + jsdom + setup.ts
- [x] Playwright (E2E) config
- [x] Tailwind CSS v4 (@tailwindcss/vite)
- [ ] shadcn/ui CLI 초기화 — P1 초반으로 미룸 (컴포넌트 작성 시점에 설치)
- [x] `zod` 설치

### P0.5 런타임 뼈대
- [x] React Router v7 기본 라우트 (`/`, `/explore`, `/map`, `/mountain/:slug`, `/collections`, `/collections/:theme`)
- [x] TanStack Query `QueryClientProvider` (`src/app/providers.tsx`)
- [x] Zustand 필터 store 파일 (`src/stores/filterStore.ts`)
- [x] 헤더/푸터 레이아웃 컴포넌트 (`src/app/root.tsx`)
- [x] 디자인 토큰 CSS 변수 (`src/styles/tokens.css`)

### P0.6 훅 동작 검증
- [ ] 임의의 `.tsx` 파일 저장 → 훅 로그에 ESLint/tsc 실행 출력 확인 (사용자 직접 확인 권장)
- [ ] 의도적으로 타입 오류 넣고 훅이 실패 알림하는지 확인
- [x] `pnpm test:run` 스모크 테스트(HomePage 렌더링) 통과
- [x] `pnpm typecheck`, `pnpm lint`, `pnpm build` 전원 초록

### P0.7 데이터 마이그레이션
- [x] v1 `mountain_info/` 99개 JSON + index.json → `frontend/public/mountain_info/`
- [x] v1 `trails/` 103개 JSON (62 np + 22 gpx + 18 기타 + index) → `frontend/public/trails/`
- [x] v1 `data/` (CSV·GPX) → `data/` (2.1MB)
- [x] v1 `scripts/` 수집 스크립트 → `scripts/` (venv 제외)

### P0.8 첫 커밋
- [x] `.gitignore` 반영
- [ ] `chore: initialize v2 project with harness and data` 커밋

---

## Phase 1 · 데이터 & 컴포넌트 기초

**상태**: ⏸ 대기
**기간 목표**: 1주
**완료일**: —

### P1.1 데이터 마이그레이션
- [ ] v1 `mountain_info/` 99개 JSON → `frontend/public/mountain_info/`
- [ ] v1 `trails/` 62개 JSON + `index.json` → `frontend/public/trails/`
- [ ] v1 `data/` (CSV·GPX) → `data/`
- [ ] v1 `scripts/` (크롤러·변환기) → `scripts/`

### P1.2 스키마 & 로더
- [ ] `src/data/schemas.ts` — Mountain, Trail, TrailIndex, MountainDerived zod 스키마
- [ ] `src/data/loaders.ts` — TanStack Query queryFn + zod 런타임 검증
- [ ] 스키마 단위 테스트 — 정상/이상 케이스

### P1.3 파생 데이터
- [ ] `scripts/build_derived.py` — 난이도·소요시간·계절·태그 계산
- [ ] `public/derived/mountains.json` 생성 성공 + 스키마 통과
- [ ] 계산 로직 docstring (상단에 공식·임계값 명시)

### P1.4 공용 컴포넌트 + 테스트 (TDD)
- [ ] `MountainCard` 테스트 → 구현
- [ ] `Hero` 테스트 → 구현
- [ ] `FilterBar` 테스트 → 구현
- [ ] `BottomSheet` 테스트 → 구현
- [ ] `Badge`, `Tag`, `SegmentedControl` 테스트 → 구현

### P1.5 Playground 화면
- [ ] `/__playground` 라우트 (개발 모드 한정)
- [ ] 모든 공용 컴포넌트 렌더링 확인

### P1.6 커버리지 & 검증
- [ ] `components/` Vitest 라인 커버리지 70%+
- [ ] 훅이 자동 테스트 실행하는 것 재확인
- [ ] `chore: migrate v1 data and add shared components` 커밋

---

## Phase 2 · 탐색 & 상세

**상태**: ⏸ 대기
**기간 목표**: 1주
**완료일**: —

### P2.1 홈
- [ ] 히어로 배경 이미지 로직 (시즌별 1장씩 순환)
- [ ] "오늘의 산" 큐레이션 로직 (날짜 기반 의사 랜덤)
- [ ] 카테고리 진입 카드 (탐색/지도/모음집)

### P2.2 탐색
- [ ] 필터 상태 Zustand store 구현
- [ ] URL query ↔ store 동기화
- [ ] 필터 적용 결과 계산 로직 (`lib/filterMountains.ts`)
- [ ] 그리드 뷰 + 지도 뷰 토글 (지도는 P3에서 정식)
- [ ] 검색어 (산 이름 퍼지)
- [ ] 필터 복합 조건 테스트 5개

### P2.3 산 상세
- [ ] 슬러그 기반 라우팅 (`blackyak_name` → 한글 슬러그)
- [ ] 히어로 (이미지 + 고도/지역 오버레이)
- [ ] 개요 섹션
- [ ] 시간대별 코스 탭 (최단/2-3h/4-5h/5h+) — 파생 데이터 기반
- [ ] 등산로 미니 지도 (iframe 아닌 임베디드)
- [ ] 위키 소개

### P2.4 모션
- [ ] Framer Motion 페이지 전환 (페이드 + 슬라이드)
- [ ] 카드 호버/탭 미세 모션
- [ ] 스크롤 복원

### P2.5 검증
- [ ] 모바일 DevTools 60fps 확인
- [ ] Lighthouse a11y ≥ 95
- [ ] Playwright 스모크: 홈 → 탐색 → 상세 이동
- [ ] `feat: explore, home, detail screens` 커밋

---

## Phase 3 · 지도 리뉴얼

**상태**: ⏸ 대기
**기간 목표**: 1주
**완료일**: —

### P3.1 MapLibre 도입
- [ ] `maplibre-gl`, `react-map-gl` 설치
- [ ] 타일 제공자 결정 (MapTiler free vs OSM)
- [ ] 토큰/키 환경변수 처리 (필요 시)

### P3.2 전국 지도 `/map`
- [ ] 99개 산 마커
- [ ] 클러스터링
- [ ] 핀 클릭 → 바텀시트 프리뷰
- [ ] 현재 위치 기반 초기 뷰포트 (옵션 토글)

### P3.3 상세 지도
- [ ] trail 라인 렌더링 (62개)
- [ ] 코스 선택 UI (탭과 연동)
- [ ] 포커스 애니메이션

### P3.4 스타일
- [ ] 라이트 모드 맵 스타일
- [ ] 다크 모드 맵 스타일
- [ ] 토큰 컬러 연동 (경계선·강조 컬러)

### P3.5 모바일 제스처
- [ ] 핀치 줌
- [ ] 더블탭 확대
- [ ] 한 손가락 이동 (two-finger 요구 안 함)
- [ ] Playwright mobile emulation 테스트

### P3.6 검증
- [ ] 3G Throttle 로드 타임 < 2s
- [ ] `feat: redesigned maps with MapLibre` 커밋

---

## Phase 4 · 마감

**상태**: ⏸ 대기
**기간 목표**: 3-4일
**완료일**: —

### P4.1 큐레이션 모음집
- [ ] `public/collections.json` 테마 메타 작성
- [ ] `/collections` 목록
- [ ] `/collections/:theme` 상세

### P4.2 다크 모드
- [ ] 시스템 기본값 추종
- [ ] 수동 토글 (헤더에 배치)
- [ ] 토큰 다크 팔레트 검증

### P4.3 PWA
- [ ] `manifest.webmanifest`
- [ ] 아이콘 세트 (192, 512)
- [ ] service worker (vite-plugin-pwa)
- [ ] 오프라인 기본 캐싱

### P4.4 품질 게이트
- [ ] Lighthouse CI 스크립트, 임계치 90
- [ ] axe-core 자동 점검
- [ ] 터치 타겟 44px 검사

### P4.5 배포
- [ ] README.md (영어)
- [ ] README_KO.md (한국어)
- [ ] Vercel 연결
- [ ] 베타 URL 확보
- [ ] 피드백 수집 채널 준비

### P4.6 회고
- [ ] v2 완성 회고 문서 `docs/RETRO.md`
- [ ] 하네스 효율성 기록 (어떤 훅이 유용/방해가 되었는지)
