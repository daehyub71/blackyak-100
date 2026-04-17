import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it, expect } from 'vitest';

import {
  MountainSchema,
  NationalParkMetaSchema,
  TrailIndexSchema,
  TrailSchema,
} from '@/data/schemas';

const PUBLIC_DIR = join(process.cwd(), 'public');

function readJson<T = unknown>(path: string): T {
  return JSON.parse(readFileSync(path, 'utf-8')) as T;
}

describe('production mountain_info JSONs', () => {
  const mountainDir = join(PUBLIC_DIR, 'mountain_info');
  const files: string[] = readdirSync(mountainDir)
    .filter((f: string) => /^\d+\.json$/u.test(f))
    .sort((a: string, b: string) => Number.parseInt(a, 10) - Number.parseInt(b, 10));

  it('has exactly 99 mountain records', () => {
    expect(files).toHaveLength(99);
  });

  it.each(files.map((f) => [f] as const))('%s passes MountainSchema', (file) => {
    const data = readJson(join(mountainDir, file));
    const result = MountainSchema.safeParse(data);
    if (!result.success) {
      throw new Error(`${file}: ${JSON.stringify(result.error.issues, null, 2)}`);
    }
  });

  it('mountain_info/index.json is an array of valid mountains', () => {
    const data = readJson<unknown>(join(mountainDir, 'index.json'));
    expect(Array.isArray(data)).toBe(true);
    for (const entry of data as unknown[]) {
      const result = MountainSchema.safeParse(entry);
      if (!result.success) {
        throw new Error(`index.json entry: ${JSON.stringify(result.error.issues, null, 2)}`);
      }
    }
  });
});

describe('production trails JSONs', () => {
  const trailDir = join(PUBLIC_DIR, 'trails');
  const all: string[] = readdirSync(trailDir).filter(
    (f: string) => f.endsWith('.json') && f !== 'index.json',
  );

  const trackFiles: string[] = all.filter(
    (f: string) => /^\d+\.json$/u.test(f) || /^gpx_\d+\.json$/u.test(f),
  );
  const npFiles: string[] = all.filter((f: string) => /^np_\d+\.json$/u.test(f));

  it('has track files and national park metadata files', () => {
    expect(trackFiles.length).toBeGreaterThan(50);
    expect(npFiles.length).toBeGreaterThan(10);
  });

  it.each(trackFiles.map((f) => [f] as const))(
    '%s passes TrailSchema (with track)',
    (file) => {
      const data = readJson(join(trailDir, file));
      const result = TrailSchema.safeParse(data);
      if (!result.success) {
        throw new Error(`${file}: ${JSON.stringify(result.error.issues.slice(0, 3), null, 2)}`);
      }
    },
  );

  it.each(npFiles.map((f) => [f] as const))(
    '%s passes NationalParkMetaSchema',
    (file) => {
      const data = readJson(join(trailDir, file));
      const result = NationalParkMetaSchema.safeParse(data);
      if (!result.success) {
        throw new Error(`${file}: ${JSON.stringify(result.error.issues.slice(0, 3), null, 2)}`);
      }
    },
  );

  it('trails/index.json passes TrailIndexSchema', () => {
    const data = readJson(join(trailDir, 'index.json'));
    const result = TrailIndexSchema.safeParse(data);
    if (!result.success) {
      throw new Error(JSON.stringify(result.error.issues.slice(0, 3), null, 2));
    }
  });
});
