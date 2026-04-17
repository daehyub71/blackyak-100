import { describe, it, expect } from 'vitest';

import {
  MountainSchema,
  TrailIndexEntrySchema,
  TrailIndexSchema,
  TrailSchema,
  NationalParkMetaSchema,
  isTrailWithTrack,
} from '@/data/schemas';

const gariSan = {
  blackyak_id: 1,
  blackyak_name: '가리산(홍천)',
  mntn_nm: '가리산',
  mntn_height: '1051m',
  mntn_location: '강원 홍천군 두촌면',
  mntn_summary: '가리산(加里山)의 다른 뜻은 다음과 같다.',
  tourism_info: '',
  image_url: 'https://example.com/1.jpg',
  certification_point: '정상',
  altitude: 1051,
  region: '강원도',
  address: '강원 홍천군 두촌면',
  latitude: 37.871378,
  longitude: 127.956469,
};

describe('MountainSchema', () => {
  it('parses a valid mountain_info record', () => {
    expect(() => MountainSchema.parse(gariSan)).not.toThrow();
  });

  it('rejects missing required field', () => {
    const rest: Partial<typeof gariSan> = { ...gariSan };
    delete rest.blackyak_id;
    expect(() => MountainSchema.parse(rest)).toThrow(/blackyak_id/i);
  });

  it('rejects latitude outside the Korean peninsula', () => {
    expect(() => MountainSchema.parse({ ...gariSan, latitude: 12.0 })).toThrow();
    expect(() => MountainSchema.parse({ ...gariSan, latitude: 45.0 })).toThrow();
  });

  it('rejects longitude outside the Korean peninsula', () => {
    expect(() => MountainSchema.parse({ ...gariSan, longitude: 100.0 })).toThrow();
    expect(() => MountainSchema.parse({ ...gariSan, longitude: 140.0 })).toThrow();
  });

  it('rejects non-integer blackyak_id outside 1..99', () => {
    expect(() => MountainSchema.parse({ ...gariSan, blackyak_id: 0 })).toThrow();
    expect(() => MountainSchema.parse({ ...gariSan, blackyak_id: 100 })).toThrow();
  });

  it('allows empty tourism_info but requires string type', () => {
    expect(() => MountainSchema.parse({ ...gariSan, tourism_info: '' })).not.toThrow();
    expect(() => MountainSchema.parse({ ...gariSan, tourism_info: null })).toThrow();
  });
});

const trailWithTrack = {
  mountain_name: '수락산',
  mnt_code: 113500201,
  blackyak_id: 53,
  track: [
    [127.095605227, 37.6865783987],
    [127.095553674, 37.6866650631],
  ],
};

const npMeta = {
  mountain_name: '북한산',
  blackyak_id: 20,
  source: 'national_park',
  center: [126.9861, 37.6594],
  summit: { name: '백운대', altitude: 836 },
  features: [],
};

describe('TrailSchema', () => {
  it('parses a trail with track array', () => {
    const parsed = TrailSchema.parse(trailWithTrack);
    expect(parsed.track).toHaveLength(2);
  });

  it('parses an np_* metadata-only trail (no track)', () => {
    const parsed = NationalParkMetaSchema.parse(npMeta);
    expect(parsed.mountain_name).toBe('북한산');
  });

  it('rejects track points outside Korean peninsula', () => {
    expect(() =>
      TrailSchema.parse({
        ...trailWithTrack,
        track: [[200, 45]],
      }),
    ).toThrow();
  });

  it('isTrailWithTrack narrows the union correctly', () => {
    expect(isTrailWithTrack(TrailSchema.parse(trailWithTrack))).toBe(true);
  });

  it('accepts string mnt_code (e.g. gpx_1)', () => {
    expect(() =>
      TrailSchema.parse({
        ...trailWithTrack,
        mnt_code: 'gpx_1',
      }),
    ).not.toThrow();
  });
});

describe('TrailIndexSchema', () => {
  it('parses a trail index array', () => {
    const entry = {
      mountain_name: '가리산(홍천)',
      mnt_code: 'gpx_1',
      blackyak_id: 1,
      distance_km: 7.21,
    };
    expect(() => TrailIndexEntrySchema.parse(entry)).not.toThrow();
    expect(() => TrailIndexSchema.parse([entry, entry])).not.toThrow();
  });
});
