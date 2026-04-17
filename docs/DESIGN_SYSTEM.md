# DESIGN SYSTEM — 블랙야크 100대 명산 v2

디자인 토큰·타이포·컬러·스페이싱·모션의 단일 진실 원천. 새 컴포넌트는 여기의 토큰만 사용해야 한다. 임의의 hex·px 값은 `design-system-guard` 에이전트가 거부한다.

## 1. 무드 (Mood)

- **자연·질감 (Natural & Textural)**: 대형 사진 중심, 여백 있는 레이아웃, 부드러운 그림자
- **정적 안정 + 미세 모션 (Still with Subtle Motion)**: 페이지 전환 외에는 자극 최소화, 호버·탭 시 미세한 스케일/그림자
- **한글 가독성 (Korean Legibility)**: 본문 Pretendard, 헤드라인 Noto Serif KR — 산세리프·세리프 대비로 감성 연출
- **모바일 퍼스트 (Mobile-first)**: 터치 타겟 44×44px, 한 손 사용 가능한 하단 네비

## 2. 컬러 팔레트

### 2.1 자연 파생 코어 팔레트

| 토큰 | Light | Dark | 의도 |
|---|---|---|---|
| `--color-bg-base` | `#F7F4EF` (snow/paper) | `#121412` (night forest) | 기본 배경 |
| `--color-bg-raised` | `#FFFFFF` | `#1B1E1B` | 카드·모달 |
| `--color-bg-sunken` | `#EDE7DC` | `#0C0D0C` | 하위 표면 |
| `--color-fg-primary` | `#1E1F1C` | `#F0ECE3` | 본문 |
| `--color-fg-secondary` | `#555752` | `#B7B1A4` | 보조 |
| `--color-fg-muted` | `#8A8880` | `#7B7666` | 비활성 |
| `--color-accent` | `#4F6A3D` (moss) | `#9FBF86` | 주 강조 (모스) |
| `--color-accent-warm` | `#C47A3D` (clay) | `#E1A16B` | 따뜻한 강조 (흙) |
| `--color-accent-cool` | `#4A6D7C` (stone-blue) | `#8FB3C3` | 차가운 강조 (암영) |
| `--color-border` | `#D9D2C2` | `#2C2F2B` | 테두리 |
| `--color-border-strong` | `#A39A86` | `#4A4D45` | 강조 테두리 |

### 2.2 시맨틱

| 토큰 | 용도 |
|---|---|
| `--color-success` | moss accent 재사용 |
| `--color-warning` | clay accent 재사용 |
| `--color-error` | `#B4443A` / dark `#D56A5F` |
| `--color-info` | stone-blue accent 재사용 |

### 2.3 계절 강조 (히어로/배지용)

```
--season-spring: #A3BE8C  (연록)
--season-summer: #6A8F5A  (짙은 녹)
--season-autumn: #C47A3D  (단풍 클레이)
--season-winter: #8FB3C3  (눈·바위)
```

### 2.4 사용 규칙

- 임의의 hex 금지. 반드시 CSS 변수 또는 Tailwind 토큰 경유 (`bg-[var(--color-bg-base)]` 또는 `bg-surface`)
- 투명도는 `color-mix` 또는 토큰 기반 alpha 변수 사용

## 3. 타이포그래피

### 3.1 웹폰트

| 용도 | 폰트 | 출처 |
|---|---|---|
| 본문 | Pretendard Variable | `cdn.jsdelivr.net` 셀프호스트 또는 unpkg |
| 헤드라인 | Noto Serif KR Variable | Google Fonts |
| 모노 | JetBrains Mono | 코드/숫자 필요 시 |

### 3.2 스케일

모바일 기준 base 16px. `rem`으로 선언, 모바일↔데스크톱 동일 스케일 사용 (미디어 쿼리로 상세 튜닝).

| 토큰 | 크기 | line-height | 용도 |
|---|---|---|---|
| `--text-display-xl` | 3.5rem (56px) | 1.05 | 히어로 대형 |
| `--text-display-lg` | 2.5rem (40px) | 1.1 | 페이지 타이틀 |
| `--text-display-md` | 1.75rem (28px) | 1.2 | 섹션 헤딩 |
| `--text-body-lg` | 1.125rem (18px) | 1.55 | 강조 본문 |
| `--text-body` | 1rem (16px) | 1.55 | 본문 |
| `--text-body-sm` | 0.875rem (14px) | 1.5 | 캡션 |
| `--text-label` | 0.75rem (12px) | 1.4 | 라벨/배지 |

### 3.3 사용 규칙

- 헤드라인(display-*)은 Noto Serif KR, 본문(body-*)은 Pretendard
- 숫자(고도, 거리 등)는 본문 폰트의 tabular-nums 변형 사용
- 헤드라인 `letter-spacing`: -0.015em (밀도 있는 느낌)
- 본문 `letter-spacing`: 0

## 4. 스페이싱

8의 배수 베이스. Tailwind 기본 스케일 재사용.

```
--space-0:  0
--space-1:  0.25rem (4px)
--space-2:  0.5rem  (8px)
--space-3:  0.75rem (12px)
--space-4:  1rem    (16px)
--space-5:  1.5rem  (24px)
--space-6:  2rem    (32px)
--space-7:  3rem    (48px)
--space-8:  4rem    (64px)
--space-9:  6rem    (96px)
```

컴포넌트 내부 패딩은 `--space-4` / `--space-5` 기본.
섹션 간 세로 간격은 `--space-7` / `--space-8`.

## 5. 라운딩 & 테두리

```
--radius-sm:   6px    배지·칩
--radius-md:   10px   버튼·입력
--radius-lg:   16px   카드
--radius-xl:   24px   히어로 오버레이 박스
--radius-full: 9999px 원형
```

기본 테두리 두께 1px, 강조 2px. 대부분 `--color-border` 사용, hover/focus 시 `--color-border-strong`.

## 6. 그림자

부드럽고 확산된 그림자 (자연광 느낌).

```
--shadow-xs: 0 1px 2px rgba(30,31,28,0.04)
--shadow-sm: 0 2px 6px rgba(30,31,28,0.06), 0 1px 2px rgba(30,31,28,0.04)
--shadow-md: 0 8px 20px rgba(30,31,28,0.08), 0 2px 6px rgba(30,31,28,0.04)
--shadow-lg: 0 20px 40px rgba(30,31,28,0.10), 0 8px 12px rgba(30,31,28,0.05)
```

다크 모드에서는 alpha 값을 1.5배 (예: 0.04 → 0.06).

## 7. 모션

### 7.1 곡선 (easing)

```
--ease-out:    cubic-bezier(0.16, 1, 0.3, 1)      (출현용, 빠른 시작 여유 착지)
--ease-in-out: cubic-bezier(0.45, 0, 0.55, 1)     (상태 전환)
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1)  (미세한 오버슈트)
```

### 7.2 지속시간

```
--motion-fast:   120ms  (호버·포커스 상태)
--motion-base:   200ms  (버튼·체크·팝오버)
--motion-medium: 320ms  (카드 전환·바텀시트)
--motion-slow:   480ms  (페이지 전환)
```

### 7.3 원칙

- 모든 모션은 `@media (prefers-reduced-motion: reduce)` 존중 — 즉시 반영하도록 분기
- 페이지 전환은 Framer Motion `AnimatePresence` 사용, 페이드 + Y축 8px 슬라이드
- 카드 호버: `scale(1.01) + shadow-md → shadow-lg` (fast)
- 탭/클릭: `scale(0.98)` 짧게 (fast)

## 8. 레이아웃 브레이크포인트

모바일 퍼스트.

```
sm:  640px   큰 폰
md:  768px   태블릿
lg:  1024px  작은 데스크톱
xl:  1280px  데스크톱
2xl: 1440px  대형 디스플레이
```

최대 콘텐츠 너비: `1200px` (`--layout-max`). 히어로는 풀블리드 허용.

## 9. 상호작용

### 9.1 터치 타겟

- 최소 44×44px (WCAG 2.1 AA)
- 리스트 아이템은 56px 이상

### 9.2 포커스

- `--ring-color`: `color-mix(in srgb, var(--color-accent) 50%, transparent)`
- 키보드 포커스만 ring 표시 (`:focus-visible`)

### 9.3 로딩 상태

- Skeleton: 베이스 컬러 기반 shimmer, 500ms 루프
- Spinner는 절제해서 사용, 주로 페이지 단위 로딩에만

## 10. 아이콘

- [Lucide](https://lucide.dev) (line icon) — 기본 stroke 1.5
- 산·지형 관련 아이콘은 별도 SVG 세트 필요 시 `src/assets/icons/` 에 직접 추가

## 11. 이미지 (사진)

- aspect-ratio 16:9 또는 4:3, 히어로는 3:4 (세로) 허용
- 저화질 블러 placeholder(LQIP) 또는 컬러 도미넌트 블록 사용
- `loading="lazy"` 기본, 히어로만 `eager`
- 모든 이미지에 alt 텍스트 필수 (`credits.json` 메타의 caption)

## 12. 코드 매핑

- CSS 변수는 `frontend/src/styles/tokens.css` 에 선언
- Tailwind v4 `@theme` 블록으로 위 토큰을 `--color-*`, `--spacing-*`, `--radius-*`, `--text-*` 네임스페이스에 노출
- shadcn/ui는 기본 variable 이름(`--background`, `--foreground` 등)을 위 토큰에 매핑하는 alias로 연결

## 13. 변경 정책

- 새 토큰 추가 시 본 문서에 먼저 정의 → 구현
- 임의의 hex·px 하드코딩 발견 시 `design-system-guard` 에이전트가 PR/커밋 전에 지적
- 중대한 팔레트 변경(예: accent 교체)은 SPEC·PLAN 영향 점검 후 진행
