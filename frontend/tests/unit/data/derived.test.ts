import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { MountainDerivedListSchema } from '@/data/schemas';

describe('derived/mountains.json', () => {
  const path = join(process.cwd(), 'public', 'derived', 'mountains.json');

  it('exists with 99 rows', () => {
    const raw = JSON.parse(readFileSync(path, 'utf-8')) as unknown;
    const result = MountainDerivedListSchema.safeParse(raw);
    if (!result.success) {
      throw new Error(JSON.stringify(result.error.issues.slice(0, 5), null, 2));
    }
    expect(result.data).toHaveLength(99);
  });

  it('has distinct blackyak_id values 1..99', () => {
    const raw = JSON.parse(readFileSync(path, 'utf-8')) as Array<{ blackyak_id: number }>;
    const ids = new Set(raw.map((r) => r.blackyak_id));
    expect(ids.size).toBe(99);
    for (let i = 1; i <= 99; i += 1) {
      expect(ids.has(i)).toBe(true);
    }
  });

  it('computes at least one tag per mountain', () => {
    const raw = JSON.parse(readFileSync(path, 'utf-8')) as Array<{ tags: string[] }>;
    for (const row of raw) {
      expect(row.tags.length).toBeGreaterThan(0);
    }
  });

  it('distributes difficulty across all buckets', () => {
    const raw = JSON.parse(readFileSync(path, 'utf-8')) as Array<{ difficulty: string }>;
    const buckets = new Set(raw.map((r) => r.difficulty));
    expect(buckets.has('쉬움') || buckets.has('보통')).toBe(true);
    expect(buckets.has('어려움')).toBe(true);
  });
});
