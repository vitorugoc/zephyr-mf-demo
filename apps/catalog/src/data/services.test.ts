import { describe, expect, it } from '@rstest/core';
import { services } from './services';

describe('service seed data', () => {
  it('has unique ids', () => {
    const ids = services.map((service) => service.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it('covers every tier so the filter has something to show', () => {
    const tiers = new Set(services.map((service) => service.tier));

    expect([...tiers].sort()).toEqual(['tier-1', 'tier-2', 'tier-3']);
  });
});
