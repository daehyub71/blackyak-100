import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';

import type { MountainDerived } from '@/data/schemas';

import { MountainCard } from './MountainCard';

const sample: MountainDerived = {
  blackyak_id: 1,
  blackyak_name: '가리산(홍천)',
  mntn_nm: '가리산',
  mntn_height: '1051m',
  mntn_location: '강원 홍천군 두촌면',
  mntn_summary: '...',
  tourism_info: '',
  image_url: 'https://example.com/1.jpg',
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
};

function renderCard(props: Partial<Parameters<typeof MountainCard>[0]> = {}) {
  return render(
    <MemoryRouter>
      <MountainCard mountain={sample} {...props} />
    </MemoryRouter>,
  );
}

describe('MountainCard', () => {
  it('shows the Korean name and altitude in heading', () => {
    renderCard();
    expect(screen.getByRole('heading', { name: /가리산/ })).toBeInTheDocument();
    expect(screen.getByText('1051m')).toBeInTheDocument();
  });

  it('renders region as a tag and difficulty as a badge', () => {
    renderCard();
    expect(screen.getByText('강원도')).toBeInTheDocument();
    expect(screen.getByText('어려움')).toBeInTheDocument();
  });

  it('renders trail distance when present', () => {
    renderCard();
    expect(screen.getByText(/7.2/u)).toBeInTheDocument();
  });

  it('hides trail distance gracefully when null', () => {
    renderCard({ mountain: { ...sample, trail_distance_km: null } });
    expect(screen.queryByText(/km/u)).toBeNull();
  });

  it('links to /mountain/<encoded blackyak_name>', () => {
    renderCard();
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `/mountain/${encodeURIComponent('가리산(홍천)')}`);
  });

  it('renders tags up to 2 visible (truncates rest as +N)', () => {
    renderCard({
      mountain: { ...sample, tags: ['강원산악', '천미터급', '당일코스', '추가태그'] },
    });
    expect(screen.getByText('강원산악')).toBeInTheDocument();
    expect(screen.getByText('천미터급')).toBeInTheDocument();
    expect(screen.getByText(/\+2/u)).toBeInTheDocument();
  });

  it('image has alt text including the mountain name', () => {
    renderCard();
    expect(screen.getByRole('img', { name: /가리산/ })).toBeInTheDocument();
  });
});
