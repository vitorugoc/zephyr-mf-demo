import { describe, expect, it } from '@rstest/core';
import { render, screen, within } from '@testing-library/react';
import type { Service } from './data/services';
import { ServiceTable } from './ServiceTable';

const checkout: Service = {
  id: 'checkout-api',
  name: 'Checkout API',
  ownerTeam: 'Payments',
  tier: 'tier-1',
  status: 'operational',
  repo: 'acme/checkout-api',
  tags: ['node', 'lambda'],
};
const notifications: Service = {
  ...checkout,
  id: 'notifications-worker',
  name: 'Notifications Worker',
  status: 'outage',
};

describe('ServiceTable', () => {
  it('renders one row per service', () => {
    render(<ServiceTable services={[checkout, notifications]} />);

    // header row + two body rows
    expect(screen.getAllByRole('row')).toHaveLength(3);
  });

  it('shows the status as a badge with a matching tone', () => {
    render(<ServiceTable services={[checkout, notifications]} />);

    const outageRow = screen.getByRole('row', { name: /Notifications Worker/ });
    expect(within(outageRow).getByText('Outage')).toHaveAttribute('data-tone', 'danger');
    const okRow = screen.getByRole('row', { name: /Checkout API/ });
    expect(within(okRow).getByText('Operational')).toHaveAttribute('data-tone', 'success');
  });

  it('shows the repository of each service', () => {
    render(<ServiceTable services={[checkout]} />);

    const row = screen.getByRole('row', { name: /Checkout API/ });
    expect(within(row).getByText('acme/checkout-api')).toBeInTheDocument();
  });

  it('shows the owner team of each service', () => {
    render(<ServiceTable services={[checkout]} />);

    expect(screen.getByRole('columnheader', { name: 'Owner team' })).toBeInTheDocument();
    const row = screen.getByRole('row', { name: /Checkout API/ });
    expect(within(row).getByText('Payments')).toBeInTheDocument();
  });
});
