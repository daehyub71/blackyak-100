import { Link } from 'react-router';

import type { MountainDerived } from '@/data/schemas';
import { cn } from '@/lib/cn';

import { Badge } from './Badge';
import { Tag } from './Tag';

export interface MountainCardProps {
  mountain: MountainDerived;
  className?: string;
}

const difficultyTone: Record<MountainDerived['difficulty'], 'accent' | 'warm' | 'cool'> = {
  쉬움: 'cool',
  보통: 'accent',
  어려움: 'warm',
};

const MAX_VISIBLE_TAGS = 2;

function formatDistance(km: number | null): string | null {
  if (km == null) return null;
  return `${km.toFixed(1)}km`;
}

export function MountainCard({ mountain, className }: MountainCardProps) {
  const slug = encodeURIComponent(mountain.blackyak_name);
  const distance = formatDistance(mountain.trail_distance_km);
  const visibleTags = mountain.tags.slice(0, MAX_VISIBLE_TAGS);
  const overflow = mountain.tags.length - visibleTags.length;

  return (
    <Link
      to={`/mountain/${slug}`}
      className={cn(
        'group block overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-bg-raised)] ring-1 ring-inset ring-[var(--color-border)] shadow-[var(--shadow-sm)] transition-shadow duration-[var(--duration-base)] ease-[var(--ease-out)] hover:shadow-[var(--shadow-md)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]',
        className,
      )}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--color-bg-sunken)]">
        <img
          src={mountain.image_url}
          alt={`${mountain.blackyak_name} 대표 이미지`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[var(--duration-medium)] ease-[var(--ease-out)] group-hover:scale-[1.02]"
        />
        <div className="absolute right-3 top-3">
          <Badge tone={difficultyTone[mountain.difficulty]}>{mountain.difficulty}</Badge>
        </div>
      </div>
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-serif text-[length:var(--text-display-md)] leading-[var(--text-display-md--line-height)] text-[var(--color-fg-primary)]">
            {mountain.blackyak_name}
          </h3>
          <span className="font-mono text-[length:var(--text-body-sm)] text-[var(--color-fg-secondary)] tabular-nums">
            {mountain.mntn_height}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[length:var(--text-body-sm)] text-[var(--color-fg-secondary)]">
          <Tag>{mountain.region}</Tag>
          <span aria-hidden>·</span>
          <span>{mountain.duration_bucket}</span>
          {distance && (
            <>
              <span aria-hidden>·</span>
              <span className="tabular-nums">{distance}</span>
            </>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-1">
          {visibleTags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
          {overflow > 0 && (
            <span className="text-[length:var(--text-label)] text-[var(--color-fg-muted)]">
              +{overflow}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
