#!/usr/bin/env bash
# PostToolUse hook — src/** 편집 시 관련 Vitest 실행
set -u

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

INPUT="$(cat)"
FILE="$(printf '%s' "$INPUT" | /usr/bin/env python3 -c 'import json,sys
try:
  d=json.load(sys.stdin)
  p=d.get("tool_input",{}).get("file_path","")
  print(p)
except Exception:
  pass')"

[ -z "$FILE" ] && exit 0

case "$FILE" in
  */frontend/src/*.ts|*/frontend/src/*.tsx) ;;
  *) exit 0 ;;
esac

FRONTEND="$PROJECT_ROOT/frontend"
if [ ! -d "$FRONTEND/node_modules" ]; then
  exit 0
fi

cd "$FRONTEND" || exit 0

if command -v pnpm >/dev/null 2>&1 && [ -f vitest.config.ts ]; then
  REL_FILE="${FILE#$FRONTEND/}"
  printf '[hook] vitest related --run %s\n' "$REL_FILE"
  pnpm --silent vitest related --run "$REL_FILE" 2>&1 | tail -30 || true
fi

exit 0
