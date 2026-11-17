import { describe, expect, it } from '@rstest/core';
import { render, screen } from '@testing-library/react';
import ServiceCatalog from './ServiceCatalog';

describe('ServiceCatalog', () => {
  it('renders the page heading', () => {
    render(<ServiceCatalog />);

    expect(screen.getByRole('heading', { level: 1, name: 'Service Catalog' })).toBeInTheDocument();
  });
});
