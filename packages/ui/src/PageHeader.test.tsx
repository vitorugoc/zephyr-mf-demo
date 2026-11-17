import { describe, expect, it } from '@rstest/core';
import { render, screen } from '@testing-library/react';
import { PageHeader } from './PageHeader';

describe('PageHeader', () => {
  it('renders the title as the page heading', () => {
    render(<PageHeader title="Service Catalog" />);

    expect(screen.getByRole('heading', { level: 1, name: 'Service Catalog' })).toBeInTheDocument();
  });

  it('renders the description when given', () => {
    render(<PageHeader title="Service Catalog" description="Every service we run" />);

    expect(screen.getByText('Every service we run')).toBeInTheDocument();
  });
});
