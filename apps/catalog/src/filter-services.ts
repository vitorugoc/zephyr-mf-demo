import type { Service, ServiceTier } from './data/services';

export type ServiceFilter = {
  query: string;
  tier: ServiceTier | 'all';
};

export function filterServices(
  services: readonly Service[],
  { query, tier }: ServiceFilter,
): Service[] {
  const needle = query.trim().toLowerCase();
  return services.filter(
    (service) =>
      (tier === 'all' || service.tier === tier) && service.name.toLowerCase().includes(needle),
  );
}
