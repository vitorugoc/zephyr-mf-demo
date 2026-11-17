import { describe, expect, it } from '@rstest/core';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders its label', () => {
    render(<Badge>Healthy</Badge>);

    expect(screen.getByText('Healthy')).toBeInTheDocument();
  });

  it('defaults to the neutral tone', () => {
    render(<Badge>Draft</Badge>);

    expect(screen.getByText('Draft')).toHaveAttribute('data-tone', 'neutral');
  });

  it.each(['success', 'warning', 'danger'] as const)('exposes the %s tone', (tone) => {
    render(<Badge tone={tone}>Status</Badge>);

    expect(screen.getByText('Status')).toHaveAttribute('data-tone', tone);
  });
});
