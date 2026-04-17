# CLAUDE.md

블랙야크 100대 명산 v2 — 모바일 감성 중심 정보 서비스 + Claude Code 하네스 레퍼런스.
상위 워크스페이스 규칙은 [/Users/sunchulkim/source/CLAUDE.md](../CLAUDE.md)를 따르며, 본 문서는 그 위에 프로젝트 고유 규칙을 덧붙인다.

---

## 프로젝트 맥락

- **위치**: `/Users/sunchulkim/source/blackyak-mountain-tracker/`
- **저장소**: 신규 git 저장소 (v1은 `/Users/sunchulkim/src/blackyak-mountain-tracker/`에 보존)
- **대상**: 소규모 베타 (지인/등산 동호회)
- **핵심 목표**: ① UX 전면 개선 ② Claude Code 하네스 엔지니어링 실전 적용

---

## 읽기 순서 (신규 세션 진입 시)

1. [docs/SPEC.md](docs/SPEC.md) — 요구사항·범위·기술 스택
2. [docs/PLAN.md](docs/PLAN.md) — Phase 설계
3. [docs/TASK.md](docs/TASK.md) — 현재 진행 체크리스트
4. [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) — 토큰·타이포·컬러 (UI 작업 시 필수)
5. [docs/HARNESS.md](docs/HARNESS.md) — 하네스 구성·사용법

---

## 필수 규칙

### SDD
- **SPEC 수정 없이 새 기능 구현 금지**. 요청이 SPEC 범위 밖이면 먼저 SPEC 갱신 토론
- SPEC 변경 → PLAN → TASK 순서로 역추적해 함께 업데이트
- `/spec-check` 슬래시 명령으로 drift 주기적 확인

### TDD
- 모든 Phase에서 **Red → Green → Refactor** 사이클 준수
- 테스트 파일: `*.test.ts(x)` 를 구현 파일과 동일 디렉토리에 배치
- PostToolUse 훅이 `vitest related`를 자동 실행한다

### 디자인 시스템
- 임의의 hex/rgb/px 금지. 반드시 `DESIGN_SYSTEM.md` 토큰만 사용
- UI PR 전 `design-system-guard` 서브에이전트 호출

### 데이터 무결성
- `frontend/public/mountain_info/*.json`, `frontend/public/trails/*.json` 편집 시 PreToolUse 훅이 zod 스키마 검증
- 대량 데이터 변경 후 `mountain-data-reviewer` 에이전트 호출

---

## 기술 스택 (고정)

| 층 | 기술 |
|---|---|
| 빌드 | Vite 7 |
| UI | React 19 + TypeScript 5.x (strict) |
| 패키지 매니저 | pnpm |
| 라우터 | React Router v7 |
| 상태 | Zustand |
| 페치 | TanStack Query |
| 검증 | zod |
| 스타일 | Tailwind CSS v4 + shadcn/ui |
| 모션 | Framer Motion |
| 지도 | MapLibre GL JS + react-map-gl |
| 타이포 | Pretendard + Noto Serif KR |
| 테스트 | Vitest + RTL + Playwright |
| 수집 | Python 3.11 (scripts/venv) |
| 배포 | Vercel |

새 라이브러리 추가는 **SPEC 갱신 후** 사용자 승인 필요.

---

## 개발 사이클

```
/new-phase PN          → TASK 체크리스트 전개
→ TDD (Red → Green → Refactor)
→ design-system-guard 호출 (UI 변경 시)
→ ux-critic 호출 (화면 단위 완료 시)
→ TASK 체크 + 커밋 (Conventional Commits)
→ 다음 항목
```

Phase 종료 시:
- 모든 TASK 체크 확인
- `/spec-check` 드리프트 확인
- `docs/TASK.md` 상단에 완료일 기록

---

## 검증 명령

```bash
cd frontend
pnpm lint              # ESLint
pnpm typecheck         # tsc --noEmit
pnpm test              # Vitest (watch)
pnpm test --run        # Vitest (단일)
pnpm test:e2e          # Playwright
pnpm build             # 프로덕션 빌드
pnpm lighthouse        # Lighthouse CI (P4 부터)
```

Phase 완료 조건: 위 명령 모두 초록.

---

## 금지 행동 (이 프로젝트 한정 추가)

- 로그인·인증·트래킹 기능 도입 (SPEC §2.2 Non-Goals)
- 백엔드 서버/DB 설정 추가 (정적 JSON 유지)
- 블랙야크 공식 이미지 저작권 미확인 상태로 사용
- 임의의 hex/px 하드코딩 (DESIGN_SYSTEM 경유 필수)
- 데이터 파일을 훅 우회해서 수정 (zod 검증 실패 시 수정 후 재시도)
- 하네스 복잡도를 과하게 증가 (PR당 훅·에이전트 증감은 HARNESS.md에 기록)

---

## 관련 경로

| 구분 | 경로 |
|---|---|
| v1 아카이브 | `/Users/sunchulkim/src/blackyak-mountain-tracker/` |
| v1 원격 | `github.com/daehyub71/blackyak-mountain-tracker` (`main`, `legacy/v1`) |
| v2 프로젝트 | `/Users/sunchulkim/source/blackyak-mountain-tracker/` |
| 상위 워크스페이스 | `/Users/sunchulkim/source/` |
