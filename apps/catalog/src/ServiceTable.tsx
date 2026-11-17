import { Badge, type BadgeTone } from '@portal/ui';
import type { Service, ServiceStatus } from './data/services';
import styles from './ServiceTable.module.css';

const statusBadge: Record<ServiceStatus, { label: string; tone: BadgeTone }> = {
  operational: { label: 'Operational', tone: 'success' },
  degraded: { label: 'Degraded', tone: 'warning' },
  outage: { label: 'Outage', tone: 'danger' },
};

export function ServiceTable({ services }: { services: readonly Service[] }) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th scope="col">Service</th>
          <th scope="col">Tier</th>
          <th scope="col">Status</th>
          <th scope="col">Repository</th>
          <th scope="col">Tags</th>
        </tr>
      </thead>
      <tbody>
        {services.map((service) => {
          const status = statusBadge[service.status];
          return (
            <tr key={service.id}>
              <th scope="row" className={styles.name}>
                {service.name}
              </th>
              <td>{service.tier}</td>
              <td>
                <Badge tone={status.tone}>{status.label}</Badge>
              </td>
              <td>
                {/* Fictional repos, so plain text rather than dead links. */}
                <code className={styles.repo}>{service.repo}</code>
              </td>
              <td className={styles.tags}>{service.tags.join(', ')}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
