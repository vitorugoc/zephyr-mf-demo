import { describe, expect, it } from '@rstest/core';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { services } from './data/services';
import ServiceCatalog from './ServiceCatalog';

const bodyRows = () => screen.getAllByRole('row').slice(1);

describe('ServiceCatalog', () => {
  it('renders the page heading', () => {
    render(<ServiceCatalog />);

    expect(screen.getByRole('heading', { level: 1, name: 'Service Catalog' })).toBeInTheDocument();
  });

  it('lists every service by default', () => {
    render(<ServiceCatalog />);

    expect(bodyRows()).toHaveLength(services.length);
  });

  it('narrows the list as the user types a search query', async () => {
    render(<ServiceCatalog />);

    await userEvent.type(screen.getByRole('searchbox', { name: 'Search services' }), 'checkout');

    expect(bodyRows()).toHaveLength(1);
    expect(screen.getByRole('row', { name: /Checkout API/ })).toBeInTheDocument();
  });

  it('narrows the list by tier', async () => {
    render(<ServiceCatalog />);

    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Tier' }), 'tier-3');

    const expected = services.filter((service) => service.tier === 'tier-3').length;
    expect(bodyRows()).toHaveLength(expected);
  });
});
