import type { ComponentType } from 'react';
import styles from './App.module.css';
import { RemoteBoundary } from './RemoteBoundary';
import type { RemoteEntry } from './registry';
import { useHashRoute } from './use-hash-route';

/** Every exposed page is a props-less component (see ADR 0003). */
export type RemotePage = { default: ComponentType };

type AppProps = {
  remotes: readonly RemoteEntry[];
  load: (entry: RemoteEntry) => Promise<RemotePage>;
};

export default function App({ remotes, load }: AppProps) {
  const route = useHashRoute() || remotes[0]?.route;
  const current = remotes.find((entry) => entry.route === route);

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <span className={styles.brand}>Platform Portal</span>
        <nav aria-label="Main" className={styles.nav}>
          {remotes.map((entry) => (
            <a
              key={entry.name}
              className={styles.link}
              href={`#/${entry.route}`}
              aria-current={entry === current ? 'page' : undefined}
            >
              {entry.label}
            </a>
          ))}
        </nav>
      </header>
      <main className={styles.main}>
        {current ? (
          // Keyed by remote so switching pages resets loading and error state.
          <RemoteBoundary key={current.name} label={current.label} load={() => load(current)} />
        ) : (
          <h1>Page not found</h1>
        )}
      </main>
    </div>
  );
}
