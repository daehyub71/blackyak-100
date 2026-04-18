import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';

import { useFilterStore } from '@/stores/filterStore';

import { FilterBar } from './FilterBar';

afterEach(() => {
  useFilterStore.getState().clear();
});

describe('FilterBar', () => {
  it('renders region, difficulty, duration, and season groups', () => {
    render(<FilterBar />);
    expect(screen.getByRole('group', { name: '지역' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: '난이도' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: '소요시간' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: '계절' })).toBeInTheDocument();
  });

  it('toggles a region in the store when clicked', async () => {
    render(<FilterBar />);
    const regionGroup = screen.getByRole('group', { name: '지역' });
    await userEvent.click(within(regionGroup).getByRole('button', { name: '강원도' }));
    expect(useFilterStore.getState().regions).toContain('강원도');
  });

  it('reflects selected state via aria-pressed', async () => {
    render(<FilterBar />);
    const difficultyGroup = screen.getByRole('group', { name: '난이도' });
    const easyButton = within(difficultyGroup).getByRole('button', { name: '쉬움' });
    await userEvent.click(easyButton);
    expect(easyButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('clear button resets the store', async () => {
    render(<FilterBar />);
    await userEvent.click(screen.getByRole('button', { name: '강원도' }));
    expect(useFilterStore.getState().regions).toHaveLength(1);
    await userEvent.click(screen.getByRole('button', { name: /초기화/u }));
    expect(useFilterStore.getState().regions).toHaveLength(0);
  });

  it('search input updates query in store', async () => {
    render(<FilterBar />);
    const input = screen.getByRole('searchbox', { name: /산 이름/u });
    await userEvent.type(input, '북한산');
    expect(useFilterStore.getState().query).toBe('북한산');
  });
});
