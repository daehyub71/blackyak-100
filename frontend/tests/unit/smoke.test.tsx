import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { HomePage } from '@/features/home/HomePage';

describe('HomePage', () => {
  it('renders the main heading', () => {
    render(<HomePage />);
    expect(screen.getByRole('heading', { name: /블랙야크 100대 명산/ })).toBeInTheDocument();
  });
});
