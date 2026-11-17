import { describe, expect, it } from '@rstest/core';
import { federationRemotes } from './registry';

describe('federationRemotes', () => {
  it('maps each registry entry to a name@manifest remote string', () => {
    const remotes = federationRemotes([
      {
        name: 'catalog',
        package: 'portal-catalog',
        port: 3001,
        module: './ServiceCatalog',
        route: 'catalog',
        label: 'Service Catalog',
      },
    ]);

    expect(remotes).toEqual({ catalog: 'catalog@http://localhost:3001/mf-manifest.json' });
  });
});
