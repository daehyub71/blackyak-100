# HARNESS — 개발 하네스 구성 가이드

이 프로젝트는 Claude Code의 **hooks · subagents · slash commands · skills** 네 가지 메커니즘을 조합해 SDD(SPEC/PLAN/TASK) + TDD 사이클을 **자동으로 강제**하는 개발 파이프라인을 구축한다. 본 문서는 각 하네스 요소의 역할·위치·사용법·예시를 정리한다.

## 1. 전체 그림

```
┌────────────────────────────────────────────────────────────┐
│  개발자 입력 (Claude Code 대화)                             │
└────────────────────────────────────────────────────────────┘
           │
           ▼
┌────────────────────────────────────────────────────────────┐
│  슬래시 명령어 (.claude/commands/)                          │
│    /new-phase   /spec-check   /data-refresh                │
└────────────────────────────────────────────────────────────┘
           │
           ▼
┌────────────────────────────────────────────────────────────┐
│  메인 에이전트 (Claude Opus) + 프로젝트 서브에이전트         │
│    ux-critic · design-system-guard · mountain-data-reviewer │
└────────────────────────────────────────────────────────────┘
           │
           ▼ (파일 편집 / 도구 호출)
┌────────────────────────────────────────────────────────────┐
│  Hooks (.claude/settings.json)                              │
│    PreToolUse  → JSON 스키마 검증                           │
│    PostToolUse → ESLint, tsc, Vitest related                │
│    Stop        → TASK.md 진행률 요약                         │
└────────────────────────────────────────────────────────────┘
           │
           ▼
┌────────────────────────────────────────────────────────────┐
│  스킬 (.claude/skills/)                                     │
│    add-mountain-page · update-trail-data                    │
└────────────────────────────────────────────────────────────┘
```

## 2. Hooks

### 2.1 파일 위치

`.claude/settings.json`

### 2.2 훅 정의

| 이벤트 | 매처 | 동작 | 실패 시 효과 |
|---|---|---|---|
| PreToolUse | Edit/Write → `frontend/public/mountain_info/*.json` 또는 `frontend/public/trails/*.json` | `pnpm tsx scripts/validate-json.ts <file>` 실행 | 편집 차단 |
| PostToolUse | Edit/Write → `*.ts`/`*.tsx` | `pnpm lint:fix <file>` + `pnpm typecheck` | 경고만 표시 |
| PostToolUse | Edit/Write → `src/**/*.{ts,tsx}` | `pnpm vitest related --run <file>` | 경고만 표시 |
| Stop | - | `pnpm tsx scripts/summarize-task.ts` (TASK.md 진행률 파싱·출력) | 무관 |

### 2.3 운영 원칙

- **단계적 도입**: P0은 ESLint + tsc만 활성화. Vitest·JSON 스키마 훅은 P1에서 켠다
- **실패 ≠ 차단**: PreToolUse 스키마 검증만 차단(데이터 무결성). 나머지는 경고로만 남기고 진행
- **성능**: 대형 파일 일괄 편집 시 훅 지연 최소화 — 관련 테스트만 실행 (`vitest related`)
- **로컬 전용**: `settings.local.json`에 개인 개발 환경 한정 추가 훅 배치 (원격 CI와 분리)

## 3. 서브에이전트 (`.claude/agents/`)

프로젝트 도메인을 아는 전문가 에이전트. 메인 에이전트가 `Agent` 도구로 호출한다.

### 3.1 `ux-critic.md`

**역할**: 새로 만든 화면/컴포넌트가 모바일 감성 UX 원칙을 따르는지 검토.

**체크 포인트**
- 터치 타겟 44×44px 이상
- 스크롤·전환 애니메이션이 `DESIGN_SYSTEM.md` 모션 토큰 사용
- 핵심 정보의 가독성 (타이포 스케일, 대비)
- 한 손 조작 가능 여부 (주 CTA 하단 배치)
- 키보드·스크린리더 접근성

**호출 시점**: 각 Phase 2·3 완료 직전

### 3.2 `design-system-guard.md`

**역할**: 새 CSS/Tailwind 코드가 `DESIGN_SYSTEM.md` 토큰만 사용했는지 점검.

**체크 포인트**
- 임의의 hex/rgb 값 없음
- 하드코딩 px 없음 (토큰 변수 또는 Tailwind 스케일만)
- 모션 duration/easing 토큰 사용
- radius·shadow·breakpoint 토큰 사용

**호출 시점**: UI 컴포넌트 PR 직전

### 3.3 `mountain-data-reviewer.md`

**역할**: `mountain_info/*.json`, `trails/*.json`, `derived/*.json` 변경을 zod 스키마·좌표 범위·필수 필드 기준으로 검토.

**체크 포인트**
- 좌표 범위 (한반도 내 위경도)
- blackyak_id 중복/누락
- 필수 필드 완비
- trail 좌표가 `[lng, lat]` 순서

**호출 시점**: 데이터 파일 편집 후, 훅이 경고한 케이스 조사 시

## 4. 슬래시 명령어 (`.claude/commands/`)

반복 워크플로우의 바로가기. `CustomCommandInput`으로 받은 인자를 프롬프트에 주입.

### 4.1 `/new-phase`

**사용**: `/new-phase P1`

**동작**:
1. `docs/PLAN.md`에서 해당 Phase 섹션 파싱
2. `docs/TASK.md`에서 해당 Phase 체크리스트 존재 여부 확인
3. 없으면 PLAN 범위를 체크리스트로 전개해 추가
4. 현재 Phase의 TASK 미완료 항목 요약 출력
5. 첫 in-progress 항목으로 이동 제안

### 4.2 `/spec-check`

**사용**: `/spec-check` (인자 없음)

**동작**:
1. 현재 브랜치의 커밋 diff 분석
2. `docs/SPEC.md`의 Goals / Non-Goals와 대조
3. Non-Goals에 해당하는 기능 추가 여부 경고
4. Goals 중 미착수 항목 리포트

### 4.3 `/data-refresh`

**사용**: `/data-refresh [mountain|trail|all]`

**동작**:
1. `scripts/` 디렉토리의 해당 수집기 실행 (venv 활성화 후)
2. 결과 JSON을 `frontend/public/*/` 에 배치
3. `mountain-data-reviewer` 에이전트 호출해 검증
4. 변경 요약 출력 (새 산·삭제 산·필드 변경)

## 5. 스킬 (`.claude/skills/`)

재사용 가능한 복합 워크플로우. `SKILL.md`에 절차·예시·검증 단계를 기록.

### 5.1 `add-mountain-page/`

신규 산 추가(향후 한국 전체 산 확장 대비):
1. `scripts/fetch_mountain_info.py` 로 데이터 수집
2. `public/mountain_info/{id}.json` 생성
3. 파생 데이터 재빌드 (`build_derived.py`)
4. 슬러그 충돌 확인
5. 테스트 스냅샷 갱신

### 5.2 `update-trail-data/`

GPX → JSON 파이프라인:
1. 입력 GPX를 `data/raw/` 에 배치
2. `scripts/convert_gpx_to_json.py` 실행
3. `public/trails/{mnt_code}.json` 갱신 + `index.json` 업데이트
4. 좌표 범위·순서 검증
5. 지도 렌더링 시각 확인 체크리스트 안내

## 6. 개발 사이클 예시

```
개발자: "P2.3 산 상세 페이지 들어갈게"
  ↓
/new-phase P2           → TASK.md에 P2 체크리스트 로드
  ↓
개발자: "히어로 컴포넌트 테스트부터 작성"
  ↓ (Red)
Edit src/features/mountain/__tests__/Hero.test.tsx
  → PostToolUse: vitest related → 테스트 실패 확인
  ↓ (Green)
Edit src/features/mountain/Hero.tsx
  → PostToolUse: lint, tsc, vitest related → 통과
  ↓ (Refactor)
구조 정리
  → PostToolUse: 계속 통과 확인
  ↓
Agent: design-system-guard 호출 → 토큰 준수 확인
  ↓
체크: TASK.md Hero 항목 [x]
  ↓
Stop hook: "P2.3 / 4 완료, 다음 항목: 개요 섹션" 출력
```

## 7. 안티 패턴

- 훅이 실패해도 되돌아가지 않고 무시 → PR 머지 전 수동 lint/tsc 재실행 필수
- 슬래시 명령어를 무분별하게 남용해 컨텍스트 비대화 → 명령어 실행 후 핵심 요약만 유지
- 서브에이전트에 과도한 권한 부여 → agents 파일에 `tools` 필드로 최소 권한 원칙 적용
- 하네스 복잡도 관리 안 함 → P0에서 최소로 시작, Phase 종료마다 필요성 재평가

## 8. 관련 파일 인덱스

| 파일 | 역할 |
|---|---|
| `.claude/settings.json` | 훅·모델·권한 설정 |
| `.claude/agents/*.md` | 서브에이전트 명세 |
| `.claude/commands/*.md` | 슬래시 명령어 프롬프트 |
| `.claude/skills/*/SKILL.md` | 스킬 절차서 |
| `scripts/validate-json.ts` | PreToolUse 훅 실행 대상 |
| `scripts/summarize-task.ts` | Stop 훅 실행 대상 |
| `scripts/build_derived.py` | 파생 필드 계산 |
| `scripts/fetch_mountain_info.py` | 산 정보 수집 (v1 계승) |
| `scripts/convert_gpx_to_json.py` | GPX → trail JSON (v1 계승) |
