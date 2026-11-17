import { PageHeader } from '@portal/ui';
import { useState } from 'react';
import { type ServiceTier, services } from './data/services';
import { filterServices, type ServiceFilter } from './filter-services';
import styles from './ServiceCatalog.module.css';
import { ServiceTable } from './ServiceTable';

const tierOptions: { value: ServiceFilter['tier']; label: string }[] = [
  { value: 'all', label: 'All tiers' },
  { value: 'tier-1', label: 'Tier 1' },
  { value: 'tier-2', label: 'Tier 2' },
  { value: 'tier-3', label: 'Tier 3' },
];

export default function ServiceCatalog() {
  const [filter, setFilter] = useState<ServiceFilter>({ query: '', tier: 'all' });
  const visible = filterServices(services, filter);

  return (
    <section className={styles.page}>
      <PageHeader
        title="Service Catalog"
        description="Every service the platform runs, and who owns it."
      />
      <search className={styles.filters}>
        <label className={styles.field}>
          Search services
          <input
            type="search"
            value={filter.query}
            onChange={(event) => setFilter({ ...filter, query: event.target.value })}
          />
        </label>
        <label className={styles.field}>
          Tier
          <select
            value={filter.tier}
            onChange={(event) =>
              setFilter({ ...filter, tier: event.target.value as ServiceTier | 'all' })
            }
          >
            {tierOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </search>
      {visible.length > 0 ? (
        <ServiceTable services={visible} />
      ) : (
        <p role="status" className={styles.empty}>
          No services match your filters.
        </p>
      )}
    </section>
  );
}
