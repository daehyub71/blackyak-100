#!/usr/bin/env -S tsx
/**
 * PreToolUse 훅에서 호출되는 JSON 스키마 검증 CLI.
 * 편집 대상 JSON 파일의 경로를 인자로 받아 zod 스키마로 검증한다.
 * 실패 시 exit code 2로 훅을 중단시킨다.
 *
 * 사용: pnpm tsx scripts/validate-json.ts <absolute-path-to-json>
 */

import { readFileSync } from 'node:fs';
import { basename, dirname } from 'node:path';
import process from 'node:process';

import {
  MountainSchema,
  NationalParkMetaSchema,
  TrailIndexSchema,
  TrailSchema,
} from '../src/data/schemas';

function classify(filePath: string) {
  const dir = basename(dirname(filePath));
  const name = basename(filePath);

  if (dir === 'mountain_info') {
    if (name === 'index.json') return { kind: 'mountain-index' } as const;
    return { kind: 'mountain' } as const;
  }

  if (dir === 'trails') {
    if (name === 'index.json') return { kind: 'trail-index' } as const;
    if (/^np_\d+\.json$/u.test(name)) return { kind: 'national-park' } as const;
    return { kind: 'trail' } as const;
  }

  if (dir === 'derived') {
    return { kind: 'derived' } as const;
  }

  return { kind: 'unknown' } as const;
}

function main(): number {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('validate-json: missing file path argument');
    return 1;
  }

  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(filePath, 'utf-8'));
  } catch (err) {
    console.error(`validate-json: failed to parse ${filePath}: ${(err as Error).message}`);
    return 2;
  }

  const { kind } = classify(filePath);

  const schemas = {
    mountain: MountainSchema,
    'mountain-index': { safeParse: (v: unknown) => ({ success: Array.isArray(v), data: v }) },
    trail: TrailSchema,
    'national-park': NationalParkMetaSchema,
    'trail-index': TrailIndexSchema,
    derived: { safeParse: () => ({ success: true, data: raw }) },
    unknown: { safeParse: () => ({ success: true, data: raw }) },
  } as const;

  const schema = schemas[kind];
  const result = schema.safeParse(raw);

  if (!result.success) {
    console.error(`validate-json: ${filePath} failed ${kind} schema`);
    if ('error' in result && result.error) {
      console.error(JSON.stringify(result.error.issues.slice(0, 5), null, 2));
    }
    return 2;
  }

  console.log(`validate-json: ${filePath} OK (${kind})`);
  return 0;
}

process.exit(main());
