# SPEC — 블랙야크 100대 명산 v2

## 1. 프로젝트 개요

### 1.1 정체성

블랙야크 100대 명산 챌린지 참여자와 국내 등산 애호가를 위한 **감성적인 모바일 중심 정보 서비스**. 기존 v1이 정보 나열 중심의 실용 UI였다면, v2는 **자연·질감·감성의 시각 언어**와 **재미있는 탐색 경험**으로 산 자체의 매력을 전달한다.

### 1.2 리빌드 동기

1. **UX 전면 개선** — 모바일 경험의 어색함, 감성 부족, 탐색·필터 불편, 재미 부족 해소
2. **하네스 엔지니어링 접목** — Claude Code의 hooks·subagents·slash commands·skills를 개발 파이프라인에 내장해 SDD+TDD를 자동 강제하고, 본 프로젝트 자체를 하네스 레퍼런스로 활용

### 1.3 대상 사용자

- **1차**: 소규모 베타 — 프로젝트 오너의 지인·등산 동호회
- **향후**: 일반 대중 공개 (본 스펙의 범위 외)

## 2. 범위

### 2.1 포함 (Goals)

- 99개 산의 기본 정보·위치·고도·요약 열람
- 62개 산의 등산로(trail) 좌표 기반 지도 시각화
- 지역 / 난이도 / 소요시간 / 해발고도 / 계절 멀티 파셋 필터링
- 시간대별(최단 / 2-3h / 4-5h / 5h+) 코스 정렬/추천
- 큐레이션 모음집(테마별 산 묶음) 제공
- 다크·라이트 모드
- PWA (홈 화면 추가, 오프라인 기본 캐싱)

### 2.2 제외 (Non-Goals)

- 사용자 로그인·계정
- 개인 완등 기록·진행률 추적
- 소셜 기능(댓글·좋아요·공유 등)
- 결제·광고
- 백엔드 서버·데이터베이스 (운영 데이터는 정적 JSON 고정)
- SSR·SEO 최적화 (베타 단계에서 불필요)
- 한국 전체 산으로의 확장 (v2 이후 과제)

## 3. 기능 요구사항

| ID | 기능 | 상세 |
|---|---|---|
| F-01 | 홈 화면 | 풀블리드 히어로 이미지 + 오늘의 산 큐레이션 + 주요 카테고리 진입 |
| F-02 | 멀티 파셋 탐색 | 지역·난이도·소요시간·해발고도·계절 조합 필터 + 검색어 |
| F-03 | 산 목록 뷰 전환 | 그리드 / 지도 뷰 토글 |
| F-04 | 산 상세 | 히어로·개요·등산로 지도·시간대별 코스 탭·위키 소개 |
| F-05 | 전국 지도 | MapLibre 벡터 타일 기반 전체 산 마커, 바텀시트 프리뷰 |
| F-06 | 등산로 지도 | 개별 산의 trail 좌표 렌더링, 코스 선택 |
| F-07 | 큐레이션 모음집 | 테마별(예: 가을 단풍, 서울 근교) 산 묶음 페이지 |
| F-08 | 다크/라이트 모드 | 시스템 기본값 추종 + 수동 토글 |
| F-09 | PWA | manifest·service worker·홈 화면 추가·기본 오프라인 |

## 4. 비기능 요구사항

| 분류 | 요구사항 |
|---|---|
| 성능 | 모바일 Lighthouse Performance ≥ 90, 스크롤·전환 60fps |
| 접근성 | WCAG 2.1 AA 준수, 모바일 터치 타겟 ≥ 44×44px, 명도 대비 4.5:1 이상 |
| 반응형 | 320px ~ 1440px 까지 대응, 모바일 퍼스트 |
| 호환성 | 최신 2개 메이저 버전의 iOS Safari·Chrome·Samsung Internet·Edge |
| 코드 품질 | TypeScript strict, ESLint 0 에러, Vitest 커버리지 `src/features` 80% 이상 |
| 유지보수 | SDD(SPEC/PLAN/TASK) + TDD 강제, 훅·서브에이전트로 자동 검증 |

## 5. 기술 스택 (확정)

| 층 | 기술 |
|---|---|
| 빌드 | Vite 7 |
| UI | React 19 + TypeScript 5.x (strict) |
| 패키지 매니저 | **pnpm** |
| 라우터 | **React Router v7** (SPA 모드) |
| 상태 | Zustand |
| 데이터 페치 | TanStack Query (정적 JSON 캐싱) |
| 스키마 검증 | zod |
| 스타일 | Tailwind CSS v4 |
| 디자인 시스템 | shadcn/ui + Radix UI |
| 애니메이션 | Framer Motion |
| 지도 | MapLibre GL JS + react-map-gl |
| 타이포 | Pretendard(본문) + Noto Serif KR(헤드라인) |
| 테스트 | Vitest + React Testing Library + Playwright(E2E) |
| 검증 | ESLint flat config + Prettier + TypeScript strict |
| 데이터 수집 | Python 3.11 (기존 `scripts/` 그대로 유지) |
| 배포 | Vercel |

## 6. 데이터 모델

운영 데이터는 **정적 JSON 파일**로 `frontend/public/` 하위에 서빙. 데이터 수집은 `scripts/` 파이썬 스크립트가 담당하며 아래 스키마를 준수한다.

### 6.1 산 정보 — `public/mountain_info/{blackyak_id}.json`

```ts
interface Mountain {
  blackyak_id: number;         // 1-99
  blackyak_name: string;        // "가리산(홍천)" 등 공식 표기
  mntn_nm: string;              // 표기상 산 이름
  mntn_height: string;          // "1051m" 문자열 (표기용)
  mntn_location: string;        // "강원 홍천군 두촌면"
  mntn_summary: string;         // 위키 기반 소개문
  tourism_info: string;         // 관광 정보 (빈 문자열 허용)
  image_url: string;            // 대표 이미지 URL (v2에서 재검토)
  certification_point: string;  // 블랙야크 인증지
  altitude: number;             // 해발고도 (m)
  region: string;               // "강원도" 등 광역 시·도
  address: string;              // 상세 주소
  latitude: number;
  longitude: number;
}
```

### 6.2 등산로 — `public/trails/{mnt_code}.json`

```ts
interface Trail {
  mountain_name: string;
  mnt_code: number;             // 산림청 산 코드
  blackyak_id: number;          // mountain_info와 조인 키
  track: [number, number][];    // [longitude, latitude] 배열
}
```

### 6.3 인덱스 — `public/trails/index.json`

trail 파일 메타데이터 목록 (blackyak_id ↔ mnt_code ↔ 파일명 매핑).

### 6.4 확장 필드 (v2에서 추가)

v2에서는 탐색/필터·큐레이션을 위해 아래 파생 필드를 **빌드 타임에 계산**해 별도 파생 파일로 생성한다 (원본 JSON은 건드리지 않음).

```ts
interface MountainDerived {
  blackyak_id: number;
  difficulty: "쉬움" | "보통" | "어려움";   // 거리·경사 기반 계산
  duration_bucket: "최단" | "2-3h" | "4-5h" | "5h+";
  seasons: ("봄" | "여름" | "가을" | "겨울")[];
  tags: string[];                           // "단풍", "서울근교" 등
  collections: string[];                    // 큐레이션 모음집 ID 목록
}
```

파생 파일: `public/derived/mountains.json` (99개 통합 배열 + 위 필드 병합)
생성 스크립트: `scripts/build_derived.py`

## 7. 정보 구조 (IA)

```
/                       홈 (히어로 + 오늘의 산)
/explore                탐색 (필터 + 그리드·지도 토글)
/map                    전국 지도
/mountain/:slug         산 상세 (slug = blackyak_name 한글 슬러그)
/collections            큐레이션 목록
/collections/:theme     큐레이션 상세
/about                  프로젝트 소개
```

## 8. 디자인 언어 (요약)

세부 토큰은 `docs/DESIGN_SYSTEM.md` 참조.

- **무드**: 자연적·질감적. 대형 사진, 여백, 부드러운 그림자, 정적이되 미묘한 모션
- **컬러 팔레트**: 흙·이끼·바위·눈의 자연광 파생 (셰일/포레스트/스톤/스노우)
- **타이포**: 본문 Pretendard Variable, 헤드라인 Noto Serif KR (대비 있는 세리프)
- **모션 원칙**: 빠른 진입 + 여유 있는 감쇠 (ease-out, 180–240ms), 페이지 전환 시 페이드·슬라이드 혼합

## 9. 사진 소스 정책

- **1차**: Unsplash·Pexels의 **CC0 / 상업적 이용 가능 / 변형 허용** 라이선스
- **2차**: 위키미디어 커먼즈의 **CC BY / CC BY-SA** — 저작자 표기 컴포넌트 내장
- 각 사진 메타데이터(`public/images/credits.json`)에 출처·작가·라이선스·URL 기록
- 블랙야크 공식·저작권 미확인 이미지는 사용하지 않음 (기존 `image_url` 필드는 참고용으로만 보존)

## 10. 하네스 엔지니어링 요구사항

| 항목 | 요구사항 |
|---|---|
| Hooks | PostToolUse로 TS 편집 시 ESLint+tsc 자동 실행, Vitest related 테스트 자동 실행, Stop 훅으로 TASK.md 진행률 요약 |
| 서브에이전트 | `ux-critic`, `design-system-guard`, `mountain-data-reviewer` |
| 슬래시 명령어 | `/new-phase`, `/spec-check`, `/data-refresh` |
| 스킬 | `add-mountain-page`, `update-trail-data` |
| 문서화 | `docs/HARNESS.md`에 각 컴포넌트의 역할·사용법·예시 기술 |

## 11. 제약 및 가정

- 지도 타일은 무료 한도 내 사용 (MapTiler free / OSM raster fallback)
- 배포는 Vercel 무료 티어
- 데이터 갱신은 수동 (`/data-refresh` 명령으로 스크립트 실행 후 커밋)
- 사용자 디바이스는 온라인 상태 가정 (오프라인은 기본 캐시 수준)
- 공식 저작권·개인 식별 정보 취급하지 않음

## 12. 성공 기준

- **정량**: Lighthouse mobile Performance / Accessibility / Best Practices ≥ 90
- **정량**: Vitest 단위 테스트 `src/features` 커버리지 80%+, Playwright 스모크 5개 시나리오 통과
- **정성**: 베타 사용자 5명 이상에게 "감성적이고 탐색이 재미있다"는 피드백 확보
- **정성**: 개발자(본인)가 하네스 기능을 실전에서 빈번히 활용하며 SDD+TDD 사이클이 유지됨

## 13. 참고 자산

v2는 **새 디렉토리**(`/Users/sunchulkim/source/blackyak-mountain-tracker/`)에 **새 git 저장소**로 시작한다. v1은 `/Users/sunchulkim/src/blackyak-mountain-tracker/`에 그대로 보존되고, 원격 백업은 [daehyub71/blackyak-mountain-tracker](https://github.com/daehyub71/blackyak-mountain-tracker)의 `main`·`legacy/v1` 브랜치에 있다.

P1 데이터 마이그레이션 시 아래 자산을 v1 경로에서 v2 경로로 복사한다.

| 자산 | v1 경로 | v2 복사 대상 |
|---|---|---|
| 산 정보 JSON (99개) | `/Users/sunchulkim/src/blackyak-mountain-tracker/frontend/public/mountain_info/` | `frontend/public/mountain_info/` |
| 등산로 JSON (+ index) | `/Users/sunchulkim/src/blackyak-mountain-tracker/frontend/public/trails/` | `frontend/public/trails/` |
| 원본 CSV·GPX | `/Users/sunchulkim/src/blackyak-mountain-tracker/data/` | `data/` |
| Python 수집 스크립트 | `/Users/sunchulkim/src/blackyak-mountain-tracker/scripts/` | `scripts/` |

참고 문서 (복사 X, v1 경로에서 열람):
- v1 `docs/개발계획서.md`, `docs/db_schema.md`, `docs/등산로_개발계획서.md`
- 산림청 공공 API 가이드 `docs/OpenAPI활용가이드_*.docx`
