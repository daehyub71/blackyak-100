---
description: Python 수집 스크립트 실행 → frontend/public 데이터 갱신 → mountain-data-reviewer 검증
argument-hint: mountain | trail | derived | all
---

데이터 갱신 워크플로우: **$ARGUMENTS**

## 사전 조건

- `scripts/venv/` 가상환경이 존재해야 함 (없으면 생성 + `pip install -r scripts/requirements.txt`)
- `frontend/public/mountain_info/`, `frontend/public/trails/`, `frontend/public/derived/` 디렉토리 존재

## 수행 단계

인자에 따라 아래 중 선택:

### mountain
1. `source scripts/venv/bin/activate`
2. `python scripts/fetch_mountain_info.py`
3. `python scripts/fetch_wiki_mountain_info.py`
4. 결과 JSON을 `frontend/public/mountain_info/`에 배치
5. `mountain-data-reviewer` 에이전트 호출

### trail
1. `python scripts/convert_gpx_to_json.py data/raw/<new.gpx>` (GPX 파일 경로 제공 필요)
2. `frontend/public/trails/` 업데이트, `index.json` 갱신
3. `mountain-data-reviewer` 에이전트 호출

### derived
1. `python scripts/build_derived.py`
2. `frontend/public/derived/mountains.json` 생성
3. 스키마 검증 스크립트 실행

### all
1. mountain → trail → derived 순서로 전체 실행

## 출력

```
## Data Refresh ($ARGUMENTS)

### 실행 스크립트
- ...

### 변경 요약
- 신규: N개 (ID 목록)
- 수정: N개
- 삭제: N개

### 검증 결과
- [mountain-data-reviewer 리포트]

### 다음 단계
- git diff 검토 후 커밋 권장
```

실행 중 에러가 나면 중단하고 사용자에게 로그를 요약 보고한다.
