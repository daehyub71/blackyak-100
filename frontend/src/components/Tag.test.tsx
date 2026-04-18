import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Tag } from './Tag';

describe('Tag', () => {
  it('renders text and exposes role=button when interactive', () => {
    render(<Tag onClick={() => {}}>강원산악</Tag>);
    const tag = screen.getByRole('button', { name: '강원산악' });
    expect(tag).toBeInTheDocument();
  });

  it('renders as a static span when not interactive', () => {
    render(<Tag>천미터급</Tag>);
    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.getByText('천미터급')).toBeInTheDocument();
  });

  it('marks selected state via aria-pressed', () => {
    render(
      <Tag onClick={() => {}} selected>
        가을
      </Tag>,
    );
    expect(screen.getByRole('button', { name: '가을' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('fires onClick when activated', async () => {
    const onClick = vi.fn();
    render(<Tag onClick={onClick}>봄</Tag>);
    await userEvent.click(screen.getByRole('button', { name: '봄' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('keyboard activates with Enter and Space', async () => {
    const onClick = vi.fn();
    render(<Tag onClick={onClick}>겨울</Tag>);
    const tag = screen.getByRole('button', { name: '겨울' });
    tag.focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('meets minimum touch target height', () => {
    render(<Tag onClick={() => {}}>접근성</Tag>);
    const el = screen.getByRole('button', { name: '접근성' });
    expect(el.className).toMatch(/min-h-\[44px\]/u);
  });
});
