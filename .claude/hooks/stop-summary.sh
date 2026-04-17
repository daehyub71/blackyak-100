#!/usr/bin/env bash
# Stop hook — 현재 Phase의 TASK.md 체크 상태 요약
set -u

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
TASK_FILE="$PROJECT_ROOT/docs/TASK.md"

[ ! -f "$TASK_FILE" ] && exit 0

/usr/bin/env python3 - "$TASK_FILE" <<'PY'
import re
import sys
from pathlib import Path

path = Path(sys.argv[1])
text = path.read_text(encoding="utf-8")

phases = re.split(r"^##\s+Phase\s+", text, flags=re.MULTILINE)[1:]
summary = []
for ph in phases:
    header = ph.splitlines()[0].strip()
    total = len(re.findall(r"^\s*-\s*\[[ xX]\]", ph, flags=re.MULTILINE))
    done = len(re.findall(r"^\s*-\s*\[[xX]\]", ph, flags=re.MULTILINE))
    if total:
        summary.append(f"Phase {header}: {done}/{total}")

if summary:
    print("[hook] TASK.md progress")
    for line in summary:
        print(f"  - {line}")
PY

exit 0
