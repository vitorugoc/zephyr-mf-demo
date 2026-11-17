import { describe, expect, it } from '@rstest/core';
import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Card', () => {
  it('renders its title as a level 2 heading', () => {
    render(<Card title="React remote">body</Card>);

    expect(screen.getByRole('heading', { level: 2, name: 'React remote' })).toBeInTheDocument();
  });

  it('renders its content', () => {
    render(<Card title="React remote">A federated React app</Card>);

    expect(screen.getByText('A federated React app')).toBeInTheDocument();
  });

  it('is labelled by its title so it can be found as a region', () => {
    render(<Card title="React remote">body</Card>);

    expect(screen.getByRole('region', { name: 'React remote' })).toBeInTheDocument();
  });
});
