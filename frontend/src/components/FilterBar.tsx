import { Search, X } from 'lucide-react';

import { cn } from '@/lib/cn';
import {
  type Difficulty,
  type DurationBucket,
  type Region,
  type Season,
  useFilterStore,
} from '@/stores/filterStore';

import { Tag } from './Tag';

const REGIONS: Region[] = [
  '서울',
  '경기도',
  '인천',
  '강원도',
  '충청남도',
  '충청북도',
  '대전',
  '경상남도',
  '경상북도',
  '부산',
  '대구',
  '울산',
  '전라남도',
  '전라북도',
  '광주',
  '제주도',
];

const DIFFICULTIES: Difficulty[] = ['쉬움', '보통', '어려움'];
const DURATIONS: DurationBucket[] = ['최단', '2-3h', '4-5h', '5h+'];
const SEASONS: Season[] = ['봄', '여름', '가을', '겨울'];

interface FilterBarProps {
  className?: string;
}

export function FilterBar({ className }: FilterBarProps) {
  const query = useFilterStore((s) => s.query);
  const regions = useFilterStore((s) => s.regions);
  const difficulties = useFilterStore((s) => s.difficulties);
  const durations = useFilterStore((s) => s.durations);
  const seasons = useFilterStore((s) => s.seasons);

  const setQuery = useFilterStore((s) => s.setQuery);
  const toggleRegion = useFilterStore((s) => s.toggleRegion);
  const toggleDifficulty = useFilterStore((s) => s.toggleDifficulty);
  const toggleDuration = useFilterStore((s) => s.toggleDuration);
  const toggleSeason = useFilterStore((s) => s.toggleSeason);
  const clear = useFilterStore((s) => s.clear);

  const hasAny =
    !!query ||
    regions.length > 0 ||
    difficulties.length > 0 ||
    durations.length > 0 ||
    seasons.length > 0;

  return (
    <div className={cn('flex flex-col gap-5', className)}>
      <label className="relative block">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--color-fg-muted)]"
          aria-hidden
        />
        <input
          type="search"
          aria-label="산 이름 검색"
          placeholder="산 이름 검색"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-h-[44px] w-full rounded-[var(--radius-md)] bg-[var(--color-bg-raised)] pl-10 pr-4 text-[length:var(--text-body)] text-[var(--color-fg-primary)] ring-1 ring-inset ring-[var(--color-border)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
        />
      </label>

      <FilterGroup label="지역" items={REGIONS} selected={regions} onToggle={toggleRegion} />
      <FilterGroup
        label="난이도"
        items={DIFFICULTIES}
        selected={difficulties}
        onToggle={toggleDifficulty}
      />
      <FilterGroup
        label="소요시간"
        items={DURATIONS}
        selected={durations}
        onToggle={toggleDuration}
      />
      <FilterGroup label="계절" items={SEASONS} selected={seasons} onToggle={toggleSeason} />

      {hasAny && (
        <button
          type="button"
          onClick={clear}
          className="inline-flex items-center gap-1 self-end text-[length:var(--text-body-sm)] text-[var(--color-fg-secondary)] hover:text-[var(--color-fg-primary)]"
        >
          <X className="size-4" aria-hidden /> 필터 초기화
        </button>
      )}
    </div>
  );
}

interface FilterGroupProps<T extends string> {
  label: string;
  items: ReadonlyArray<T>;
  selected: ReadonlyArray<T>;
  onToggle: (value: T) => void;
}

function FilterGroup<T extends string>({ label, items, selected, onToggle }: FilterGroupProps<T>) {
  const set = new Set(selected);
  return (
    <div role="group" aria-label={label} className="flex flex-col gap-2">
      <h3 className="text-[length:var(--text-label)] uppercase tracking-wide text-[var(--color-fg-muted)]">
        {label}
      </h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Tag key={item} selected={set.has(item)} onClick={() => onToggle(item)}>
            {item}
          </Tag>
        ))}
      </div>
    </div>
  );
}
