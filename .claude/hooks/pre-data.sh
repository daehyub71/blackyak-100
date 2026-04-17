#!/usr/bin/env bash
# PreToolUse hook — mountain_info/*.json, trails/*.json 편집 전 zod 스키마 검증
# P1부터 활성화 예정. 스키마 검증기 미존재 시 조용히 통과.
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
  */frontend/public/mountain_info/*.json|*/frontend/public/trails/*.json|*/frontend/public/derived/*.json) ;;
  *) exit 0 ;;
esac

VALIDATOR="$PROJECT_ROOT/frontend/scripts/validate-json.ts"
if [ ! -f "$VALIDATOR" ]; then
  exit 0
fi

cd "$PROJECT_ROOT/frontend" || exit 0
if command -v pnpm >/dev/null 2>&1; then
  if ! pnpm --silent tsx scripts/validate-json.ts "$FILE" 2>&1 | tee /tmp/blackyak-validate.log; then
    printf '[hook] schema validation failed — blocking edit\n' >&2
    exit 2
  fi
fi

exit 0
