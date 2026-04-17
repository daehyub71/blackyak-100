---
name: add-mountain-page
description: 블랙야크 100대 명산 외의 신규 산을 데이터·UI·테스트까지 일괄 추가하는 워크플로우. v2 이후 확장 대비.
---

# Skill — 신규 산 페이지 추가

향후 한국 전체 산으로 확장할 때 반복되는 "데이터 수집 → JSON 배치 → 파생 필드 갱신 → 테스트 추가" 흐름을 표준화한다.

## 절차

### 1. 사용자 입력 확인

- `mntn_cd` (산림청 산 코드) 또는 `mntn_nm` (이름) 중 하나를 받음
- 블랙야크 100 여부 확인 — 아니면 `blackyak_id` 대신 `mntn_cd` 중심 flow

### 2. 데이터 수집

```bash
source scripts/venv/bin/activate
python scripts/fetch_mountain_info.py --mntn-cd <CODE>
python scripts/fetch_wiki_mountain_info.py --mntn-nm "<NAME>"
```

결과 JSON을 `frontend/public/mountain_info/<id>.json`에 저장. 스키마는 `Mountain` (단, 블랙야크 외는 `blackyak_id` null 허용 — P2 이후 스키마 확장 시점 결정).

### 3. 파생 필드 재빌드

```bash
python scripts/build_derived.py
```

`public/derived/mountains.json`을 재생성해 새 산을 포함시킨다.

### 4. 검증

- `mountain-data-reviewer` 에이전트 호출
- `pnpm vitest related --run src/data/schemas.test.ts`

### 5. 테스트 추가

`frontend/tests/unit/data/loaders.test.ts`에 신규 산 로드 케이스 추가.

### 6. UI 확인

`pnpm dev` 후 `/mountain/<slug>`로 접근해 히어로·지도·위키 섹션 정상 렌더 확인.

### 7. 커밋

`feat(data): add <산이름> to mountain catalog`

## 체크리스트

- [ ] fetch 스크립트 실행 성공
- [ ] JSON 스키마 검증 통과
- [ ] 좌표 범위 한반도 내
- [ ] 슬러그 중복 없음
- [ ] 파생 데이터 재빌드 완료
- [ ] 테스트 추가/갱신
- [ ] 수동 UI 확인
- [ ] 커밋

## 주의사항

- 위키 소개문에 저작권 문제가 있을 수 있음. CC BY-SA 3.0 준수 (출처·라이선스 표기)
- 이미지는 반드시 `credits.json`에 메타 기록
- 슬러그 생성 시 한글 → URL-safe slugify 룰 (hyphen-minus 기본)
