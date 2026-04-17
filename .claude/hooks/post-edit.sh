#!/usr/bin/env bash
# PostToolUse hook — TS/TSX 편집 시 lint + typecheck 실행
# 프론트엔드 초기화 전이면 조용히 건너뜀
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
  *.ts|*.tsx) ;;
  *) exit 0 ;;
esac

FRONTEND="$PROJECT_ROOT/frontend"
if [ ! -d "$FRONTEND/node_modules" ] || [ ! -f "$FRONTEND/package.json" ]; then
  printf '[hook] frontend not initialized yet — skipping lint/typecheck\n'
  exit 0
fi

REL_FILE="${FILE#$FRONTEND/}"

cd "$FRONTEND" || exit 0

if command -v pnpm >/dev/null 2>&1; then
  printf '[hook] pnpm lint:fix %s\n' "$REL_FILE"
  pnpm --silent lint:fix "$REL_FILE" 2>&1 | tail -20 || true
  printf '[hook] pnpm typecheck\n'
  pnpm --silent typecheck 2>&1 | tail -10 || true
fi

exit 0
