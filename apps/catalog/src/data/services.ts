export type ServiceTier = 'tier-1' | 'tier-2' | 'tier-3';
export type ServiceStatus = 'operational' | 'degraded' | 'outage';

export type Service = {
  id: string;
  name: string;
  ownerTeam: string;
  tier: ServiceTier;
  status: ServiceStatus;
  repo: string;
  tags: readonly string[];
};

// Fictional data. In a real portal this would come from a BFF.
export const services: readonly Service[] = [
  {
    id: 'checkout-api',
    name: 'Checkout API',
    ownerTeam: 'Payments',
    tier: 'tier-1',
    status: 'operational',
    repo: 'acme/checkout-api',
    tags: ['node', 'lambda'],
  },
  {
    id: 'identity-bff',
    name: 'Identity BFF',
    ownerTeam: 'Platform',
    tier: 'tier-1',
    status: 'operational',
    repo: 'acme/identity-bff',
    tags: ['node', 'bff', 'lambda'],
  },
  {
    id: 'search-indexer',
    name: 'Search Indexer',
    ownerTeam: 'Discovery',
    tier: 'tier-2',
    status: 'degraded',
    repo: 'acme/search-indexer',
    tags: ['node', 'queue'],
  },
  {
    id: 'storefront-shell',
    name: 'Storefront Shell',
    ownerTeam: 'Web Platform',
    tier: 'tier-1',
    status: 'operational',
    repo: 'acme/storefront-shell',
    tags: ['react', 'module-federation'],
  },
  {
    id: 'product-reviews',
    name: 'Product Reviews',
    ownerTeam: 'Discovery',
    tier: 'tier-3',
    status: 'operational',
    repo: 'acme/product-reviews',
    tags: ['react', 'remote'],
  },
  {
    id: 'notifications-worker',
    name: 'Notifications Worker',
    ownerTeam: 'Messaging',
    tier: 'tier-2',
    status: 'outage',
    repo: 'acme/notifications-worker',
    tags: ['node', 'queue'],
  },
  {
    id: 'design-system',
    name: 'Design System',
    ownerTeam: 'Web Platform',
    tier: 'tier-2',
    status: 'operational',
    repo: 'acme/design-system',
    tags: ['react', 'library'],
  },
  {
    id: 'edge-config',
    name: 'Edge Config',
    ownerTeam: 'Platform',
    tier: 'tier-3',
    status: 'degraded',
    repo: 'acme/edge-config',
    tags: ['cdn', 'terraform'],
  },
];
