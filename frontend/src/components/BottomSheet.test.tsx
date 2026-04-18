import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { BottomSheet } from './BottomSheet';

describe('BottomSheet', () => {
  it('does not render content when closed', () => {
    render(
      <BottomSheet open={false} onOpenChange={() => {}} title="제목">
        <p>본문</p>
      </BottomSheet>,
    );
    expect(screen.queryByText('본문')).toBeNull();
  });

  it('renders content with proper dialog roles when open', () => {
    render(
      <BottomSheet open onOpenChange={() => {}} title="가리산 미리보기">
        <p>본문</p>
      </BottomSheet>,
    );
    expect(screen.getByRole('dialog', { name: '가리산 미리보기' })).toBeInTheDocument();
    expect(screen.getByText('본문')).toBeInTheDocument();
  });

  it('calls onOpenChange(false) when close button clicked', async () => {
    const onOpenChange = vi.fn();
    render(
      <BottomSheet open onOpenChange={onOpenChange} title="제목">
        <p>본문</p>
      </BottomSheet>,
    );
    await userEvent.click(screen.getByRole('button', { name: /닫기/u }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('escape key closes the sheet', async () => {
    const onOpenChange = vi.fn();
    render(
      <BottomSheet open onOpenChange={onOpenChange} title="제목">
        <p>본문</p>
      </BottomSheet>,
    );
    await userEvent.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('positions content at the bottom on small viewports', () => {
    render(
      <BottomSheet open onOpenChange={() => {}} title="제목">
        <p>본문</p>
      </BottomSheet>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog.className).toMatch(/bottom-0/u);
  });
});
