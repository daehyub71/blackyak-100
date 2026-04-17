---
name: update-trail-data
description: GPX 파일 수신 → JSON 변환 → trail 인덱스 갱신 → 지도 시각 검증까지 표준 파이프라인.
---

# Skill — 등산로 데이터 갱신

외부에서 받은 GPX 트랙 또는 직접 녹화한 경로를 trail JSON으로 통합하는 반복 작업을 표준화한다.

## 입력

- GPX 파일 1개 이상 (`data/raw/*.gpx`)
- 대상 산의 `mnt_code` 또는 `blackyak_id`

## 절차

### 1. GPX 배치

받은 GPX를 `data/raw/` 에 복사. 파일명은 `<sourceUserId>_<trackId>.gpx` 형태 유지.

### 2. 변환

```bash
source scripts/venv/bin/activate
python scripts/convert_gpx_to_json.py data/raw/<file>.gpx \
  --mnt-code <CODE> \
  --blackyak-id <ID>
```

출력: `frontend/public/trails/<mnt_code>.json` 또는 `gpx_<N>.json` (파일 이름 컨벤션은 스크립트 규칙을 따름).

### 3. 인덱스 갱신

`frontend/public/trails/index.json` 에 다음 필드 추가/수정:

```json
{
  "mountain_name": "...",
  "mnt_code": "gpx_XX" or "<CODE>",
  "blackyak_id": <ID>,
  "distance_km": <계산값>
}
```

`scripts/convert_gpx_to_json.py` 가 자동 갱신한다면 수동 편집 불필요.

### 4. 검증

- `mountain-data-reviewer` 에이전트 호출 (좌표 범위·연속성 검사)
- PreToolUse 훅이 zod 스키마 검증 수행

### 5. 지도 시각 확인

```
pnpm dev
```

`/mountain/<slug>` 또는 `/map` 에서 다음 확인:
- [ ] 라인이 산 위치에 정확히 그려지는가
- [ ] 시작점과 끝점이 인증지/주차장에 가까운가
- [ ] 중간에 직선 점프(정지 구간)가 보이지 않는가

### 6. 여러 코스 병합

한 산에 복수 trail이 있는 경우 `trails/<mnt_code>.json` 내부에 `tracks: [{name, track}]` 배열로 확장 (P3에서 스키마 확장 결정).

### 7. 커밋

`feat(trail): add <산이름> <코스이름> trail (<거리>km)`

## 체크리스트

- [ ] GPX 배치
- [ ] JSON 변환 성공
- [ ] index.json 갱신
- [ ] 스키마 검증 통과
- [ ] 좌표 범위 OK
- [ ] 지도 시각 확인
- [ ] 커밋

## 주의사항

- GPX 출처가 Rambler/Tranggle 등이면 해당 서비스 이용 약관 확인 (개인 기록물 공유 범위)
- 위치가 공개되면 곤란한 접근 금지 구역은 렌더링에서 제외
- 좌표 정밀도는 소수점 6자리로 반올림해 파일 크기 절감 (약 10cm 정확도, 산악에 충분)
