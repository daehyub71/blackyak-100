import { queryOptions } from '@tanstack/react-query';
import { z } from 'zod';

import {
  MountainSchema,
  NationalParkMetaSchema,
  TrailIndexSchema,
  TrailSchema,
  type Mountain,
  type NationalParkMeta,
  type Trail,
  type TrailIndex,
} from './schemas';

export async function fetchValidated<T>(url: string, schema: z.ZodType<T>): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status}`);
  }
  const raw = (await res.json()) as unknown;
  return schema.parse(raw);
}

const MountainListSchema = z.array(MountainSchema);
const TrailOrNationalParkSchema = z.union([TrailSchema, NationalParkMetaSchema]);

export const mountainsQueryOptions = queryOptions<Mountain[]>({
  queryKey: ['mountains'],
  queryFn: () => fetchValidated('/mountain_info/index.json', MountainListSchema),
});

export function mountainQueryOptions(id: number) {
  return queryOptions<Mountain>({
    queryKey: ['mountain', id],
    queryFn: () => fetchValidated(`/mountain_info/${id}.json`, MountainSchema),
  });
}

export function trailQueryOptions(mntCode: number | string) {
  return queryOptions<Trail | NationalParkMeta>({
    queryKey: ['trail', mntCode],
    queryFn: () => fetchValidated(`/trails/${mntCode}.json`, TrailOrNationalParkSchema),
  });
}

export const trailIndexQueryOptions = queryOptions<TrailIndex>({
  queryKey: ['trailIndex'],
  queryFn: () => fetchValidated('/trails/index.json', TrailIndexSchema),
});
