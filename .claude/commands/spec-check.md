---
description: 현재 브랜치 변경사항이 SPEC.md 범위 내인지, Non-Goals 위반은 없는지 drift 검사
argument-hint: (선택) 비교 기준 브랜치. 기본 main
---

SPEC 드리프트 검사를 수행합니다.

## 수행 단계

1. 비교 기준: 인자가 있으면 `$ARGUMENTS`, 없으면 `main`
2. `git diff --name-only <base>...HEAD` 로 변경 파일 수집
3. `docs/SPEC.md` 읽어 §2.1 Goals, §2.2 Non-Goals, §3 기능 목록, §5 기술 스택 파악
4. 변경 파일 내용을 요약하며 다음을 판정:
   - **Goals 기여**: 어떤 목표에 기여하는지 (F-01~F-09 매핑)
   - **Non-Goals 위반 의심**: 예컨대 로그인 코드, 백엔드 서버 설정, SSR 관련 설정 추가 등
   - **기술 스택 이탈**: SPEC §5에 없는 라이브러리 추가 여부 (package.json diff)
5. 결과 리포트 작성

## 출력 형식

```
## SPEC Drift Check (base: <branch>)

### 변경 파일 수: N

### Goals 기여
- F-0X: <요약>

### Non-Goals 위반 의심
- <파일:라인> — <무엇을 추가했나> — <어느 Non-Goal과 충돌하는지>

### 기술 스택 이탈
- 추가 패키지: <name@ver> — SPEC에 없음
- 제거 패키지: <name> — SPEC에 명시되어 있으나 제거

### 결론
✅ 범위 내 | ⚠️ 검토 필요 | ❌ SPEC 갱신 후 진행 권장
```

drift가 정당하면 SPEC을 먼저 갱신하도록 안내한다. 사용자 결정 필요 시 AskUserQuestion.
