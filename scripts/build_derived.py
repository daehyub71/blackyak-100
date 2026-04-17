#!/usr/bin/env python3
"""파생 데이터 빌더.

99개 산 정보와 등산로 인덱스를 읽어
난이도·소요시간 버킷·계절·태그·컬렉션을 계산한 뒤
frontend/public/derived/mountains.json 으로 저장한다.

실행:
    python scripts/build_derived.py

설계 원칙은 docs/SPEC.md §6.4 참조.

난이도 판정식:
    score = altitude / 100 + distance_km * 0.8
    score < 10  : 쉬움
    10..16     : 보통
    > 16       : 어려움

소요시간 버킷 (평균 3km/h 산행 기준, 이동+휴식 포함):
    distance <= 4km   : 최단
    4..6km            : 2-3h
    6..10km           : 4-5h
    > 10km            : 5h+

계절:
    기본 봄·여름·가을·겨울.
    다만 해발 1,500m 이상 겨울은 "겨울"에 난이도 경고 태그를 추가해
    필터링 시 상급자용 정보로 구분할 수 있게 한다.

태그:
    지역:  "서울근교" (서울·경기·인천), "제주" (제주도), "강원산악" (강원도),
          "영남" (경상남도·경상북도·부산·대구·울산), "호남" (전라남도·전라북도·광주),
          "충청" (충청남도·충청북도·대전·세종)
    고도:  "천미터급" (1000m+), "고지대" (1500m+), "대장산" (1800m+)
    접근:  "당일코스" (소요시간 최단 또는 2-3h),
          "장거리" (5h+)

컬렉션:
    P4 에서 채워질 예정이므로 빈 배열로 초기화한다.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
ROOT = SCRIPT_DIR.parent
PUBLIC = ROOT / "frontend" / "public"
MOUNTAIN_DIR = PUBLIC / "mountain_info"
TRAIL_INDEX = PUBLIC / "trails" / "index.json"
DERIVED_DIR = PUBLIC / "derived"
OUTPUT = DERIVED_DIR / "mountains.json"


CAPITAL_AREA = {"서울", "서울특별시", "경기도", "인천", "인천광역시"}
YEONGNAM = {
    "경상남도",
    "경상북도",
    "부산",
    "부산광역시",
    "대구",
    "대구광역시",
    "울산",
    "울산광역시",
}
HONAM = {"전라남도", "전라북도", "광주", "광주광역시"}
CHUNGCHEONG = {"충청남도", "충청북도", "대전", "대전광역시", "세종", "세종특별자치시"}
JEJU = {"제주도", "제주특별자치도"}


def pick_trail_distance(trail_index: list[dict], blackyak_id: int) -> float | None:
    """해당 산의 등산로 거리를 index에서 찾아 반환. 여러 개면 중앙값 사용."""
    matches = [
        entry.get("distance_km")
        for entry in trail_index
        if entry.get("blackyak_id") == blackyak_id
        and isinstance(entry.get("distance_km"), (int, float))
    ]
    if not matches:
        return None
    matches.sort()
    mid = len(matches) // 2
    return float(matches[mid])


def compute_difficulty(altitude: int, distance_km: float | None) -> str:
    """난이도 계산. 거리 정보 없으면 고도만으로 추정."""
    if distance_km is None:
        # 거리 미상: 고도로만 판정
        if altitude < 800:
            return "쉬움"
        if altitude < 1300:
            return "보통"
        return "어려움"
    score = altitude / 100 + distance_km * 0.8
    if score < 10:
        return "쉬움"
    if score < 16:
        return "보통"
    return "어려움"


def compute_duration_bucket(distance_km: float | None) -> str:
    """소요시간 버킷. 거리 미상이면 보통으로 가정."""
    if distance_km is None:
        return "4-5h"
    if distance_km <= 4:
        return "최단"
    if distance_km <= 6:
        return "2-3h"
    if distance_km <= 10:
        return "4-5h"
    return "5h+"


def compute_seasons(altitude: int, region: str) -> list[str]:
    """계절 가능성. 기본 사계절이지만 제주도 겨울 한라산처럼 특수 케이스는 향후 분기."""
    del altitude, region  # v2 시점에선 기본 4계절 모두 반환
    return ["봄", "여름", "가을", "겨울"]


def compute_tags(altitude: int, region: str, distance_km: float | None) -> list[str]:
    tags: list[str] = []

    if region in CAPITAL_AREA:
        tags.append("서울근교")
    if region in JEJU:
        tags.append("제주")
    if region == "강원도":
        tags.append("강원산악")
    if region in YEONGNAM:
        tags.append("영남")
    if region in HONAM:
        tags.append("호남")
    if region in CHUNGCHEONG:
        tags.append("충청")

    if altitude >= 1800:
        tags.append("대장산")
    elif altitude >= 1500:
        tags.append("고지대")
    elif altitude >= 1000:
        tags.append("천미터급")

    if distance_km is not None:
        if distance_km <= 6:
            tags.append("당일코스")
        if distance_km > 10:
            tags.append("장거리")

    return tags


def build(mountain: dict, trail_index: list[dict]) -> dict:
    distance = pick_trail_distance(trail_index, mountain["blackyak_id"])
    altitude = int(mountain["altitude"])
    region = str(mountain["region"])

    return {
        **mountain,
        "difficulty": compute_difficulty(altitude, distance),
        "duration_bucket": compute_duration_bucket(distance),
        "seasons": compute_seasons(altitude, region),
        "tags": compute_tags(altitude, region, distance),
        "collections": [],
        "trail_distance_km": distance,
    }


def main() -> int:
    if not MOUNTAIN_DIR.is_dir():
        print(f"[build_derived] not found: {MOUNTAIN_DIR}", file=sys.stderr)
        return 1

    trail_index: list[dict] = (
        json.loads(TRAIL_INDEX.read_text(encoding="utf-8"))
        if TRAIL_INDEX.is_file()
        else []
    )

    rows: list[dict] = []
    for path in sorted(
        MOUNTAIN_DIR.glob("*.json"), key=lambda p: (p.stem != "index", p.stem)
    ):
        if path.name == "index.json":
            continue
        try:
            blackyak_id = int(path.stem)
        except ValueError:
            continue
        data = json.loads(path.read_text(encoding="utf-8"))
        if data.get("blackyak_id") != blackyak_id:
            print(
                f"[build_derived] id mismatch in {path.name}: "
                f"file says {blackyak_id}, content says {data.get('blackyak_id')}",
                file=sys.stderr,
            )
            continue
        rows.append(build(data, trail_index))

    rows.sort(key=lambda r: r["blackyak_id"])

    if len(rows) != 99:
        print(
            f"[build_derived] expected 99 rows, got {len(rows)}", file=sys.stderr
        )
        return 2

    DERIVED_DIR.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(
        json.dumps(rows, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(f"[build_derived] wrote {OUTPUT} with {len(rows)} records")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
