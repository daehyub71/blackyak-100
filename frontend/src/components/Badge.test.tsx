import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Badge } from './Badge';

describe('Badge', () => {
  it('renders its children', () => {
    render(<Badge>정상</Badge>);
    expect(screen.getByText('정상')).toBeInTheDocument();
  });

  it('uses the tone-neutral palette by default', () => {
    render(<Badge>기본</Badge>);
    const el = screen.getByText('기본');
    expect(el.className).toMatch(/bg-\[var\(--color-bg-sunken\)\]/u);
  });

  it('accepts accent, warm, and cool tones', () => {
    const { rerender } = render(<Badge tone="accent">accent</Badge>);
    expect(screen.getByText('accent').className).toMatch(/var\(--color-accent\)/u);

    rerender(<Badge tone="warm">warm</Badge>);
    expect(screen.getByText('warm').className).toMatch(/var\(--color-accent-warm\)/u);

    rerender(<Badge tone="cool">cool</Badge>);
    expect(screen.getByText('cool').className).toMatch(/var\(--color-accent-cool\)/u);
  });

  it('forwards className via cn() without dropping defaults', () => {
    render(<Badge className="ml-2">custom</Badge>);
    const el = screen.getByText('custom');
    expect(el.className).toMatch(/ml-2/u);
    expect(el.className).toMatch(/rounded-/u);
  });

  it('uses a small font-size token by default', () => {
    render(<Badge>텍스트</Badge>);
    expect(screen.getByText('텍스트').className).toMatch(/text-\[length:var\(--text-label\)\]/u);
  });
});
