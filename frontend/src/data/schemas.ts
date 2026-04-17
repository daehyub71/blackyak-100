import { z } from 'zod';

// 한반도 좌표 범위
const KOREA_LAT_MIN = 33;
const KOREA_LAT_MAX = 39;
const KOREA_LNG_MIN = 124;
const KOREA_LNG_MAX = 132;

const Latitude = z.number().gte(KOREA_LAT_MIN).lte(KOREA_LAT_MAX);
const Longitude = z.number().gte(KOREA_LNG_MIN).lte(KOREA_LNG_MAX);

// 산림청 코드는 숫자이거나 "gpx_1" 같은 문자열
const MountainCode = z.union([z.number().int().positive(), z.string().min(1)]);

const BlackyakId = z.number().int().gte(1).lte(99);

export const MountainSchema = z.object({
  blackyak_id: BlackyakId,
  blackyak_name: z.string().min(1),
  mntn_nm: z.string().min(1),
  mntn_height: z.string().regex(/^\d+m$/u, 'mntn_height must be in "1234m" form'),
  mntn_location: z.string().min(1),
  mntn_summary: z.string(),
  tourism_info: z.string(),
  image_url: z.string(),
  certification_point: z.string().min(1),
  altitude: z.number().int().positive(),
  region: z.string().min(1),
  address: z.string().min(1),
  latitude: Latitude,
  longitude: Longitude,
});

export type Mountain = z.infer<typeof MountainSchema>;

const TrackPoint = z.tuple([Longitude, Latitude]);

const BoundsSchema = z.object({
  southwest: z.tuple([z.number(), z.number()]),
  northeast: z.tuple([z.number(), z.number()]),
});

const Center = z.tuple([Longitude, Latitude]);

const WaypointSchema = z
  .object({
    coordinates: z.tuple([z.number(), z.number()]).optional(),
    lon: z.number().optional(),
    lat: z.number().optional(),
    longitude: z.number().optional(),
    latitude: z.number().optional(),
    name: z.string().optional(),
    elevation: z.number().optional(),
    altitude: z.number().optional(),
  })
  .passthrough();

const SummitSchema = z
  .object({
    name: z.string().optional(),
    altitude: z.number().optional(),
    elevation: z.number().optional(),
    coordinates: z.tuple([z.number(), z.number()]).optional(),
  })
  .passthrough();

export const TrailSchema = z.object({
  mountain_name: z.string().min(1),
  mnt_code: MountainCode,
  // 일부 track 파일은 블랙야크 100 미매핑 상태로 기록됨
  blackyak_id: BlackyakId.nullable(),
  track: z.array(TrackPoint).min(2),
  waypoints: z.array(WaypointSchema).optional().nullable(),
  center: Center.optional().nullable(),
  bounds: BoundsSchema.optional().nullable(),
  total_distance_km: z.number().nonnegative().optional().nullable(),
  point_count: z.number().int().nonnegative().optional().nullable(),
  waypoint_count: z.number().int().nonnegative().optional().nullable(),
  source: z.string().optional().nullable(),
  source_file: z.string().optional().nullable(),
  summit: SummitSchema.optional().nullable(),
});

export type Trail = z.infer<typeof TrailSchema>;

const LineStringGeometry = z.object({
  type: z.literal('LineString'),
  coordinates: z.array(z.tuple([z.number(), z.number()])),
});

const NationalParkFeature = z
  .object({
    properties: z
      .object({
        name: z.string().optional().nullable(),
        detail: z.string().optional().nullable(),
        distance_m: z.number().optional().nullable(),
        difficulty: z.string().optional().nullable(),
        max_elevation: z.number().optional().nullable(),
      })
      .passthrough()
      .optional()
      .nullable(),
    geometry: LineStringGeometry.optional().nullable(),
  })
  .passthrough();

export const NationalParkMetaSchema = z.object({
  mountain_name: z.string().min(1),
  blackyak_id: BlackyakId,
  source: z.string().min(1),
  center: Center,
  summit: SummitSchema.optional(),
  features: z.array(NationalParkFeature).optional(),
});

export type NationalParkMeta = z.infer<typeof NationalParkMetaSchema>;

export function isTrailWithTrack(value: unknown): value is Trail {
  return TrailSchema.safeParse(value).success;
}

export const TrailIndexEntrySchema = z.object({
  mountain_name: z.string().min(1),
  mnt_code: MountainCode,
  // 일부 엔트리는 블랙야크 100에 미매핑되어 null로 기록되어 있음
  blackyak_id: BlackyakId.nullable(),
  distance_km: z.number().nonnegative().optional(),
});

export type TrailIndexEntry = z.infer<typeof TrailIndexEntrySchema>;

export const TrailIndexSchema = z.array(TrailIndexEntrySchema);

export type TrailIndex = z.infer<typeof TrailIndexSchema>;

// 파생 필드 — scripts/build_derived.py 로 생성
export const DifficultySchema = z.enum(['쉬움', '보통', '어려움']);
export const DurationBucketSchema = z.enum(['최단', '2-3h', '4-5h', '5h+']);
export const SeasonSchema = z.enum(['봄', '여름', '가을', '겨울']);

export const MountainDerivedSchema = MountainSchema.extend({
  difficulty: DifficultySchema,
  duration_bucket: DurationBucketSchema,
  seasons: z.array(SeasonSchema).min(1),
  tags: z.array(z.string()),
  collections: z.array(z.string()),
  trail_distance_km: z.number().nonnegative().nullable(),
});

export type MountainDerived = z.infer<typeof MountainDerivedSchema>;

export const MountainDerivedListSchema = z.array(MountainDerivedSchema).length(99);
