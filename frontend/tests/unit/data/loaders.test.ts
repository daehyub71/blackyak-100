import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  fetchValidated,
  mountainQueryOptions,
  mountainsQueryOptions,
  trailIndexQueryOptions,
  trailQueryOptions,
} from '@/data/loaders';
import { MountainSchema } from '@/data/schemas';

const validMountain = {
  blackyak_id: 1,
  blackyak_name: '가리산(홍천)',
  mntn_nm: '가리산',
  mntn_height: '1051m',
  mntn_location: '강원 홍천군 두촌면',
  mntn_summary: 'summary',
  tourism_info: '',
  image_url: 'https://example.com/1.jpg',
  certification_point: '정상',
  altitude: 1051,
  region: '강원도',
  address: '강원 홍천군 두촌면',
  latitude: 37.871378,
  longitude: 127.956469,
};

function mockFetch(body: unknown, ok = true, status = 200) {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => ({
      ok,
      status,
      json: async () => body,
    })) as unknown as typeof fetch,
  );
}

describe('fetchValidated', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('parses a valid response against schema', async () => {
    mockFetch(validMountain);
    await expect(fetchValidated('/m/1.json', MountainSchema)).resolves.toMatchObject({
      blackyak_id: 1,
    });
  });

  it('throws when HTTP response is not ok', async () => {
    mockFetch({}, false, 404);
    await expect(fetchValidated('/m/1.json', MountainSchema)).rejects.toThrow(/404/);
  });

  it('throws when schema validation fails', async () => {
    mockFetch({ ...validMountain, latitude: 10 });
    await expect(fetchValidated('/m/1.json', MountainSchema)).rejects.toThrow();
  });
});

describe('query options', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        status: 200,
        json: async () => validMountain,
      })) as unknown as typeof fetch,
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('mountainsQueryOptions has stable key', () => {
    expect(mountainsQueryOptions.queryKey).toEqual(['mountains']);
  });

  it('mountainQueryOptions keys by id', () => {
    expect(mountainQueryOptions(42).queryKey).toEqual(['mountain', 42]);
  });

  it('trailQueryOptions keys by code (string or number)', () => {
    expect(trailQueryOptions('gpx_1').queryKey).toEqual(['trail', 'gpx_1']);
    expect(trailQueryOptions(113500201).queryKey).toEqual(['trail', 113500201]);
  });

  it('trailIndexQueryOptions has stable key', () => {
    expect(trailIndexQueryOptions.queryKey).toEqual(['trailIndex']);
  });
});
