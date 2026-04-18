import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { SegmentedControl } from './SegmentedControl';

const items = [
  { value: 'grid', label: '그리드' },
  { value: 'map', label: '지도' },
];

describe('SegmentedControl', () => {
  it('renders each item with role=radio', () => {
    render(<SegmentedControl items={items} value="grid" onChange={() => {}} label="뷰" />);
    expect(screen.getAllByRole('radio')).toHaveLength(2);
  });

  it('marks the active item via aria-checked', () => {
    render(<SegmentedControl items={items} value="grid" onChange={() => {}} label="뷰" />);
    expect(screen.getByRole('radio', { name: '그리드' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: '지도' })).toHaveAttribute('aria-checked', 'false');
  });

  it('fires onChange when a different item is clicked', async () => {
    const onChange = vi.fn();
    render(<SegmentedControl items={items} value="grid" onChange={onChange} label="뷰" />);
    await userEvent.click(screen.getByRole('radio', { name: '지도' }));
    expect(onChange).toHaveBeenCalledWith('map');
  });

  it('controlled component switches selection on rerender', async () => {
    function Harness() {
      const [v, setV] = useState('grid');
      return <SegmentedControl items={items} value={v} onChange={setV} label="뷰" />;
    }
    render(<Harness />);
    await userEvent.click(screen.getByRole('radio', { name: '지도' }));
    expect(screen.getByRole('radio', { name: '지도' })).toHaveAttribute('aria-checked', 'true');
  });

  it('uses min touch target on each segment', () => {
    render(<SegmentedControl items={items} value="grid" onChange={() => {}} label="뷰" />);
    for (const radio of screen.getAllByRole('radio')) {
      expect(radio.className).toMatch(/min-h-\[44px\]/u);
    }
  });

  it('attaches aria-label from label prop to the group', () => {
    render(<SegmentedControl items={items} value="grid" onChange={() => {}} label="뷰" />);
    expect(screen.getByRole('radiogroup', { name: '뷰' })).toBeInTheDocument();
  });
});
