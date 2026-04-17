# PLAN — 블랙야크 100대 명산 v2 개발 계획

본 계획서는 [SPEC.md](SPEC.md)에서 확정한 요구사항을 실행 가능한 Phase로 전개한다. 각 Phase는 **Red → Green → Refactor** TDD 사이클을 준수하며, 완료 시 [TASK.md](TASK.md)에 체크·완료일시를 기록한다.

## 1. 최상위 아키텍처

### 1.1 런타임 구조

```
사용자 브라우저
   ↓
Vercel CDN (정적 파일)
   ↓
Vite 빌드 산출물 (index.html + JS/CSS 번들)
   ↓
런타임 fetch
   ├─ /mountain_info/{id}.json     (99개 산)
   ├─ /trails/{mnt_code}.json      (62개 등산로)
   ├─ /trails/index.json            (조인 인덱스)
   ├─ /derived/mountains.json       (파생 필드 병합 데이터)
   └─ /images/credits.json          (사진 메타)
   ↓
상태 관리 (TanStack Query 캐싱 + Zustand 필터 상태)
   ↓
React 컴포넌트 (shadcn/ui + Framer Motion + MapLibre)
```

서버 사이드 코드는 **없다**. 모든 데이터는 빌드 타임에 확정된 정적 JSON이며, 파이썬 수집 스크립트(`scripts/`)는 데이터 갱신 시에만 수동 실행된다.

### 1.2 모듈 의존 관계

```
app/           ← 라우트 엔트리 (React Router v7)
  ↓
features/      ← 도메인별 화면 단위
  explore/, mountain/, map/, collections/, home/
  ↓
components/    ← 공용 UI (MountainCard, Hero, FilterBar, BottomSheet, ...)
  ↑
components/ui/ ← shadcn/ui 원자 컴포넌트 (Button, Dialog, ...)
  ↓
lib/           ← 순수 유틸 (필터 알고리즘, 포맷터, 슬러그)
  ↓
data/          ← 정적 데이터 로더 + zod 스키마
  ↓
styles/        ← 디자인 토큰, 글로벌 스타일
```

의존 방향은 **위 → 아래만 허용** (ESLint import/no-restricted-paths로 강제).

### 1.3 디렉토리 레이아웃

```
blackyak-mountain-tracker/
├── .claude/
│   ├── agents/              ux-critic, design-system-guard, mountain-data-reviewer
│   ├── commands/            new-phase, spec-check, data-refresh
│   ├── skills/              add-mountain-page, update-trail-data
│   └── settings.json        hooks 정의
├── docs/
│   ├── SPEC.md              요구사항
│   ├── PLAN.md              본 문서
│   ├── TASK.md              체크리스트
│   ├── DESIGN_SYSTEM.md     토큰·타이포·컬러·스페이싱
│   └── HARNESS.md           하네스 구성·사용법
├── frontend/
│   ├── public/
│   │   ├── mountain_info/   99개 산 JSON (v1 복사)
│   │   ├── trails/          62개 등산로 JSON (v1 복사)
│   │   ├── derived/         빌드 파생 데이터
│   │   └── images/          사진 에셋 + credits.json
│   ├── src/
│   │   ├── app/             routes.tsx, root.tsx, providers.tsx
│   │   ├── features/        explore/, mountain/, map/, collections/, home/
│   │   ├── components/      공용 컴포넌트
│   │   ├── components/ui/   shadcn/ui 생성물
│   │   ├── data/            loaders, schemas (zod)
│   │   ├── hooks/
│   │   ├── lib/             utils
│   │   └── styles/          tokens.css, globals.css
│   ├── tests/
│   │   ├── unit/
│   │   └── e2e/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── eslint.config.js
│   └── vitest.config.ts
├── scripts/                 Python 수집 스크립트 (v1 복사)
│   └── build_derived.py     v2 신규 — 파생 필드 생성
├── data/                    원본 CSV·GPX (v1 복사)
├── .gitignore
├── CLAUDE.md                프로젝트 가이드
└── README.md                (P4에서 작성)
```

## 2. Phase 계획

SPEC 목표 범위를 5개 Phase로 분할한다.

### Phase 0 · 기반 (목표 3일)

**목적**: 하네스가 작동하는 빈 Vite 프로젝트가 생기고, SPEC/PLAN/TASK가 자동 검증되는 환경을 구축.

**범위**
- 문서: PLAN.md, TASK.md, DESIGN_SYSTEM.md, HARNESS.md 작성
- `.claude/` 전체 구성 (hooks·agents·commands·skills)
- `frontend/` Vite+React+TS 초기화, pnpm 워크스페이스 셋업
- 툴체인: ESLint flat config, Prettier, Vitest, Playwright, Tailwind v4, shadcn/ui 초기화
- React Router v7 기본 라우트, TanStack Query Provider, Zustand store 뼈대
- 디자인 토큰 CSS 변수 정의
- 기본 레이아웃 컴포넌트 (헤더/푸터 골격만)
- 스모크 테스트 1개 통과

**완료 기준**
- [ ] `pnpm install` 성공, `pnpm dev` 시작
- [ ] 파일 편집 시 PostToolUse 훅이 lint/tsc/vitest를 트리거하는 것을 육안 확인
- [ ] `pnpm test` 스모크 테스트 1개 통과
- [ ] `/new-phase` 슬래시 명령 정상 동작
- [ ] TASK.md의 P0 체크박스 전원 체크

### Phase 1 · 데이터 & 컴포넌트 기초 (목표 1주)

**목적**: 99개 산·62개 등산로 데이터가 v2로 이전되고, 공용 UI 컴포넌트가 디자인 시스템에 맞게 구축.

**범위**
- 데이터 복사 (v1 → v2): `mountain_info/`, `trails/`, `data/`, `scripts/`
- zod 스키마 작성: `Mountain`, `Trail`, `TrailIndex`, `MountainDerived`
- `scripts/build_derived.py` 신규: 난이도·소요시간·계절·태그 계산 로직
- 데이터 로더: `data/loaders.ts` — TanStack Query + zod 런타임 검증
- 공용 컴포넌트 (shadcn/ui 래핑):
  - `MountainCard` (썸네일·이름·지역·고도 배지)
  - `Hero` (풀블리드 이미지 + 타이틀 오버레이)
  - `FilterBar` (지역·난이도·소요시간 칩)
  - `BottomSheet` (모바일 바텀시트)
  - `Badge`, `Tag`, `SegmentedControl`
- 단위 테스트: 각 컴포넌트 스냅샷 + 상호작용 + 데이터 검증 테스트

**완료 기준**
- [ ] 99개 산 로더 통과, 62개 trail 로더 통과 (zod 검증)
- [ ] `public/derived/mountains.json` 생성 성공
- [ ] 공용 컴포넌트 모두 Storybook-like 테스트 페이지(`/__playground`)에서 확인 가능
- [ ] Vitest `src/features` 커버리지 준비, `components/` 커버리지 70%+

### Phase 2 · 탐색 & 상세 (목표 1주)

**목적**: 홈·탐색·산 상세 화면 완성. 감성적 인터랙션을 구현.

**범위**
- 홈 `/` — 풀블리드 히어로, 오늘의 산 큐레이션, 카테고리 진입점
- 탐색 `/explore` — 멀티 파셋 필터 + 검색어, 그리드·지도 뷰 토글, URL 동기화 (query string)
- 산 상세 `/mountain/:slug` — 히어로·개요·등산로 지도(임베디드)·시간대별 코스 탭·위키 소개
- Framer Motion 페이지 전환 (페이드 + 슬라이드)
- 스크롤 복원, scroll-snap 카드 리스트

**완료 기준**
- [ ] 모바일 크롬 DevTools Performance tab에서 스크롤·전환 60fps 유지
- [ ] 필터 복합 조건(지역+난이도+시간) 테스트 5개 통과
- [ ] 해시 라우팅·URL 공유 시 필터 복원 테스트 통과
- [ ] Lighthouse 홈/탐색/상세 각각 Accessibility ≥ 95

### Phase 3 · 지도 리뉴얼 (목표 1주)

**목적**: MapLibre 기반 전국 지도와 상세 지도 완성.

**범위**
- MapLibre GL JS 도입, `react-map-gl` 래퍼
- 전국 지도 `/map` — 99개 산 마커, 클러스터링, 핀 클릭 시 바텀시트 프리뷰
- 개별 산 지도 — `/mountain/:slug` 내 등산로 라인 렌더링, 코스 선택
- 지도 스타일 커스터마이징 (토큰 기반 컬러) — 라이트/다크 모두 자연스러운 지도 스타일
- 모바일 제스처 (핀치 줌, 더블탭 확대)
- 타일 제공자 선택 (MapTiler free / OSM Standard)

**완료 기준**
- [ ] 62개 trail 좌표가 지도 위에 렌더링
- [ ] 핀치 줌·더블탭·한 손가락 이동 테스트 통과 (Playwright mobile emulation)
- [ ] 지도 로드 타임 < 2s (3G Throttle 기준)

### Phase 4 · 마감 (목표 3-4일)

**목적**: 큐레이션 모음집·다크모드·PWA·품질 게이트 통과 후 배포.

**범위**
- 큐레이션 모음집 `/collections`, `/collections/:theme` — 테마 메타데이터는 `public/collections.json`에 하드코딩
- 다크/라이트 모드 토글 (시스템 기본값 추종)
- PWA: `manifest.webmanifest`, service worker (Workbox 또는 vite-plugin-pwa), 오프라인 기본 캐싱
- Lighthouse CI 스크립트 작성, 임계치 90 강제
- 접근성 점검 (axe-core), 터치 타겟 44px 검사
- README.md / README_KO.md 작성
- Vercel 배포 (환경변수, preview 도메인 연결)

**완료 기준**
- [ ] 홈/탐색/상세 Lighthouse mobile Performance ≥ 90, Accessibility ≥ 90
- [ ] Playwright E2E 스모크 5개 시나리오 전원 통과
- [ ] PWA 홈 화면 추가 가능 (Chrome Lighthouse PWA 섹션 green)
- [ ] Vercel 배포 성공, 베타 URL 확보
- [ ] 사용자 5명 피드백 수집 채널 준비 (피드백 폼 or 대화 링크)

## 3. Phase 간 리스크 & 완화

| 리스크 | 영향 Phase | 완화책 |
|---|---|---|
| MapLibre 타일 비용 초과 | P3 | MapTiler free tier 한도 모니터링, 초과 시 OSM raster로 폴백 |
| 사진 저작권 재확인 실패 | P1, P2 | Unsplash/Pexels/위키미디어만 사용, `credits.json`에 메타 필수 기록 |
| 훅 과잉으로 개발 속도 저해 | P0~ | 훅을 최소(ESLint+tsc)로 시작, 필요시 점진적으로 Vitest·스키마 검증 추가 |
| React 19 + shadcn/ui 호환 이슈 | P0 | 초기화 시 공식 예제 순서를 따르고, RSC 전용 코드는 Vite 환경에 맞게 포팅 |
| 파생 필드 계산 기준 모호 | P1 | 난이도·시간 버킷 계산식을 `build_derived.py` 상단 주석으로 명시, 리뷰 후 확정 |
| 베타 사용자 확보 어려움 | P4 | 개인 등산 동호회·지인 그룹에 직접 공유, 초기에 5명만 목표 |

## 4. 하네스 요소 투입 시점

| 하네스 | 도입 Phase | 용도 |
|---|---|---|
| PostToolUse hook (ESLint + tsc) | P0 | TS 편집 시 즉시 피드백 |
| PostToolUse hook (Vitest related) | P1 | 컴포넌트 테스트 자동 실행 |
| PreToolUse hook (JSON schema) | P1 | 데이터 파일 변경 시 zod 검증 |
| Stop hook (TASK.md 요약) | P0 | Phase 진행률 가시화 |
| `mountain-data-reviewer` agent | P1 | 데이터 복사·수정 검토 |
| `design-system-guard` agent | P1 이후 | UI 스타일링 검사 |
| `ux-critic` agent | P2 이후 | 화면 단위 UX 검토 |
| `/new-phase` command | P0부터 | Phase 전환 자동화 |
| `/spec-check` command | 상시 | 스펙 드리프트 탐지 |
| `/data-refresh` command | P1 이후 | 수집 스크립트 실행 |
| `add-mountain-page` skill | P2 | 신규 산 추가 워크플로우 |
| `update-trail-data` skill | P3 | GPX → JSON 파이프라인 |

## 5. 검증 매트릭스 (Phase 별)

| Phase | tsc | ESLint | Vitest | Playwright | Lighthouse | 수동 |
|---|---|---|---|---|---|---|
| P0 | ✅ | ✅ | smoke 1 | — | — | 훅 트리거 확인 |
| P1 | ✅ | ✅ | 70%+ | — | — | 데이터 로딩 확인 |
| P2 | ✅ | ✅ | 80%+ | 3 scenarios | a11y ≥ 95 | 실기기 체크 |
| P3 | ✅ | ✅ | 80%+ | 4 scenarios | perf ≥ 90 | 지도 제스처 실기기 |
| P4 | ✅ | ✅ | 80%+ | 5 scenarios | 전 지표 ≥ 90 | 베타 피드백 |

## 6. 작업 워크플로우

각 Phase 내에서 아래 사이클을 반복한다.

```
1. /new-phase 로 다음 Phase TASK 체크리스트 생성
2. TASK 항목 하나 선택 → in_progress
3. 해당 기능에 대한 테스트 먼저 작성 (Red)
4. 테스트 통과하는 최소 구현 (Green)
5. 훅이 자동 lint/tsc/vitest 실행 (Green 확인)
6. 리팩토링 (Refactor) — 훅이 계속 통과 확인
7. 관련 서브에이전트(ux-critic, design-system-guard) 호출해 검토
8. TASK 체크, 커밋 (Conventional Commits)
9. 다음 TASK로
```

## 7. 다음 단계

1. [TASK.md](TASK.md) 의 P0 체크리스트에 따라 하네스 구축 + 프로젝트 초기화 착수
2. P0 완료 시 [SPEC.md](SPEC.md)·[PLAN.md](PLAN.md) 대비 drift 여부 `/spec-check` 로 확인
3. P1 진입
