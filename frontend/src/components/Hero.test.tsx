import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Hero } from './Hero';

describe('Hero', () => {
  it('renders title and subtitle', () => {
    render(
      <Hero
        title="블랙야크 100대 명산"
        subtitle="산의 결을 닮은 탐색"
        imageUrl="https://example.com/hero.jpg"
        imageAlt="가을 단풍의 산자락"
      />,
    );
    expect(screen.getByRole('heading', { name: '블랙야크 100대 명산' })).toBeInTheDocument();
    expect(screen.getByText('산의 결을 닮은 탐색')).toBeInTheDocument();
  });

  it('uses serif display typography on the heading', () => {
    render(
      <Hero
        title="제목"
        imageUrl="https://example.com/hero.jpg"
        imageAlt="배경"
      />,
    );
    const h = screen.getByRole('heading');
    expect(h.className).toMatch(/font-serif/u);
    expect(h.className).toMatch(/text-\[length:var\(--text-display-xl\)\]/u);
  });

  it('renders the image with eager loading and provided alt', () => {
    render(
      <Hero
        title="제목"
        imageUrl="https://example.com/hero.jpg"
        imageAlt="가을 단풍의 산자락"
      />,
    );
    const img = screen.getByRole('img', { name: '가을 단풍의 산자락' });
    expect(img).toHaveAttribute('loading', 'eager');
    expect(img).toHaveAttribute('src', 'https://example.com/hero.jpg');
  });

  it('shows credit line when credit prop is provided', () => {
    render(
      <Hero
        title="제목"
        imageUrl="https://example.com/hero.jpg"
        imageAlt="alt"
        credit={{ author: '홍길동', source: 'Unsplash' }}
      />,
    );
    expect(screen.getByText(/홍길동/u)).toBeInTheDocument();
    expect(screen.getByText(/Unsplash/u)).toBeInTheDocument();
  });

  it('renders optional CTA children', () => {
    render(
      <Hero title="제목" imageUrl="https://example.com/hero.jpg" imageAlt="alt">
        <button type="button">시작하기</button>
      </Hero>,
    );
    expect(screen.getByRole('button', { name: '시작하기' })).toBeInTheDocument();
  });
});
