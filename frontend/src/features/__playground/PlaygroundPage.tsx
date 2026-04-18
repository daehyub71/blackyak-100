import { useState } from 'react';

import { Badge } from '@/components/Badge';
import { BottomSheet } from '@/components/BottomSheet';
import { FilterBar } from '@/components/FilterBar';
import { Hero } from '@/components/Hero';
import { MountainCard } from '@/components/MountainCard';
import { SegmentedControl } from '@/components/SegmentedControl';
import { Tag } from '@/components/Tag';
import type { MountainDerived } from '@/data/schemas';

const sampleMountains: MountainDerived[] = [
  {
    blackyak_id: 1,
    blackyak_name: '가리산(홍천)',
    mntn_nm: '가리산',
    mntn_height: '1051m',
    mntn_location: '강원 홍천군 두촌면',
    mntn_summary: '가리산',
    tourism_info: '',
    image_url:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop',
    certification_point: '정상',
    altitude: 1051,
    region: '강원도',
    address: '강원 홍천군 두촌면',
    latitude: 37.871378,
    longitude: 127.956469,
    difficulty: '어려움',
    duration_bucket: '4-5h',
    seasons: ['봄', '여름', '가을', '겨울'],
    tags: ['강원산악', '천미터급'],
    collections: [],
    trail_distance_km: 7.21,
  },
  {
    blackyak_id: 53,
    blackyak_name: '수락산',
    mntn_nm: '수락산',
    mntn_height: '637m',
    mntn_location: '서울 노원구',
    mntn_summary: '수락산',
    tourism_info: '',
    image_url:
      'https://images.unsplash.com/photo-1542401886-65d6c61db217?w=800&auto=format&fit=crop',
    certification_point: '주봉',
    altitude: 637,
    region: '서울특별시',
    address: '서울 노원구',
    latitude: 37.6865,
    longitude: 127.0956,
    difficulty: '쉬움',
    duration_bucket: '2-3h',
    seasons: ['봄', '여름', '가을', '겨울'],
    tags: ['서울근교', '당일코스'],
    collections: [],
    trail_distance_km: 5.4,
  },
];

export function PlaygroundPage() {
  const [view, setView] = useState<'grid' | 'map'>('grid');
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <div className="flex flex-col gap-12 pb-20">
      <Section title="Hero">
        <Hero
          title="블랙야크 100대 명산"
          subtitle="산의 결을 닮은 탐색 경험"
          imageUrl="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&auto=format&fit=crop"
          imageAlt="가을 산자락"
          credit={{ author: 'Hendrik Cornelissen', source: 'Unsplash' }}
        >
          <a
            href="/explore"
            className="inline-flex min-h-[44px] items-center rounded-[var(--radius-md)] bg-white/90 px-5 font-medium text-[var(--color-fg-primary)] hover:bg-white"
          >
            지금 탐색
          </a>
        </Hero>
      </Section>

      <Section title="Badges">
        <div className="flex flex-wrap items-center gap-3">
          <Badge>중립</Badge>
          <Badge tone="accent">accent</Badge>
          <Badge tone="warm">warm</Badge>
          <Badge tone="cool">cool</Badge>
        </div>
      </Section>

      <Section title="Tags (interactive)">
        <div className="flex flex-wrap items-center gap-2">
          <Tag>정적 태그</Tag>
          <Tag onClick={() => {}}>클릭 가능</Tag>
          <Tag onClick={() => {}} selected>
            선택됨
          </Tag>
        </div>
      </Section>

      <Section title="SegmentedControl">
        <SegmentedControl
          items={[
            { value: 'grid', label: '그리드' },
            { value: 'map', label: '지도' },
          ]}
          value={view}
          onChange={setView}
          label="뷰 전환"
        />
        <p className="mt-2 text-[length:var(--text-body-sm)] text-[var(--color-fg-secondary)]">
          현재 뷰: {view}
        </p>
      </Section>

      <Section title="MountainCard">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sampleMountains.map((m) => (
            <MountainCard key={m.blackyak_id} mountain={m} />
          ))}
        </div>
      </Section>

      <Section title="FilterBar">
        <FilterBar />
      </Section>

      <Section title="BottomSheet">
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="min-h-[44px] rounded-[var(--radius-md)] bg-[var(--color-accent)] px-4 text-white"
        >
          시트 열기
        </button>
        <BottomSheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          title="가리산 미리보기"
          description="강원 홍천 · 1051m"
        >
          <p className="text-[var(--color-fg-secondary)]">
            바텀시트 본문 영역입니다. 모바일에서는 하단에서 올라오고, 데스크톱에서는 가운데 표시됩니다.
          </p>
        </BottomSheet>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mx-auto w-full max-w-[var(--layout-max)] px-4">
      <h2 className="mb-4 font-serif text-[length:var(--text-display-md)] text-[var(--color-fg-primary)]">
        {title}
      </h2>
      {children}
    </section>
  );
}
