import { describe, expect, it } from '@rstest/core';
import type { Service } from './data/services';
import { filterServices } from './filter-services';

const service = (overrides: Partial<Service>): Service => ({
  id: 'id',
  name: 'Name',
  ownerTeam: 'Team',
  tier: 'tier-1',
  status: 'operational',
  repo: 'acme/repo',
  tags: [],
  ...overrides,
});

const checkout = service({ id: 'checkout', name: 'Checkout API', tier: 'tier-1' });
const search = service({ id: 'search', name: 'Search Indexer', tier: 'tier-2' });
const reviews = service({ id: 'reviews', name: 'Product Reviews', tier: 'tier-3' });
const all = [checkout, search, reviews];

describe('filterServices', () => {
  it('returns every service when there is no query and no tier', () => {
    expect(filterServices(all, { query: '', tier: 'all' })).toEqual(all);
  });

  it('matches names case-insensitively, ignoring surrounding spaces', () => {
    expect(filterServices(all, { query: '  CHECKout ', tier: 'all' })).toEqual([checkout]);
  });

  it('filters by tier', () => {
    expect(filterServices(all, { query: '', tier: 'tier-2' })).toEqual([search]);
  });

  it('combines query and tier', () => {
    expect(filterServices(all, { query: 'e', tier: 'tier-3' })).toEqual([reviews]);
  });
});
