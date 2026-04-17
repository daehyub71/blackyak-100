---
description: 다음 Phase 진입 시 PLAN.md를 읽어 TASK.md 체크리스트 전개 + 남은 항목 요약
argument-hint: P0|P1|P2|P3|P4
---

다음 Phase로 전환합니다: **$ARGUMENTS**

## 수행 단계

1. `docs/PLAN.md` 에서 `Phase $ARGUMENTS ·` 섹션을 찾아 범위·완료 기준을 읽어라
2. `docs/TASK.md` 에서 `## Phase $ARGUMENTS ·` 섹션을 확인하고:
   - 섹션이 존재하고 체크리스트가 있으면 → 미완료 항목만 목록으로 요약
   - 섹션이 있지만 체크리스트가 비어있으면 → PLAN의 범위를 체크박스로 전개해 추가
3. 이전 Phase가 완전히 종료되었는지(모든 `[x]`) 확인. 미완료 항목이 있으면 "이전 Phase 미완료" 경고 표시
4. `docs/SPEC.md` 대비 drift 가능성이 있는지 간단 확인
5. 최종 출력:
   - **현재 상태 요약** (Phase별 체크 비율)
   - **현재 Phase의 미완료 항목**
   - **첫 번째로 착수할 항목 추천** (TDD 사이클 Red부터 시작)

## 원칙

- TASK.md를 직접 수정할 때는 Edit 도구 사용. 체크박스 레벨만 건드리고 다른 섹션 포맷은 보존
- PLAN.md의 Phase 목표를 넘어서는 항목은 추가하지 말 것 (SPEC drift 방지)
- 모호한 경우 사용자에게 확인 (AskUserQuestion)

인자: **$ARGUMENTS**
