import { Button } from '@portal/ui';
import { Component, lazy, type ReactNode, Suspense, useState } from 'react';
import type { RemotePage } from './App';
import styles from './RemoteBoundary.module.css';

type RemoteBoundaryProps = {
  label: string;
  load: () => Promise<RemotePage>;
};

/**
 * Loads one federated page and keeps its failures to itself: if the remote is
 * down, the rest of the shell keeps working and the user can retry.
 */
export function RemoteBoundary({ label, load }: RemoteBoundaryProps) {
  const [attempt, setAttempt] = useState(0);
  // A fresh lazy component per attempt, so Retry really calls load() again.
  const [Page, setPage] = useState(() => lazy(load));

  const retry = () => {
    setPage(() => lazy(load));
    setAttempt((n) => n + 1);
  };

  return (
    <ErrorBoundary key={attempt} label={label} onRetry={retry}>
      <Suspense
        fallback={
          <p role="status" className={styles.loading}>
            Loading {label}…
          </p>
        }
      >
        <Page />
      </Suspense>
    </ErrorBoundary>
  );
}

type ErrorBoundaryProps = { label: string; onRetry: () => void; children: ReactNode };

class ErrorBoundary extends Component<ErrorBoundaryProps, { failed: boolean }> {
  override state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  override componentDidCatch(error: unknown) {
    // ponytail: console only; wire to real error reporting (Sentry, CloudWatch RUM) when one exists.
    console.error(`[shell] remote "${this.props.label}" failed to load`, error);
  }

  override render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div role="alert" className={styles.error}>
        <p>{this.props.label} is unavailable right now. The rest of the portal still works.</p>
        <Button variant="secondary" onClick={this.props.onRetry}>
          Retry
        </Button>
      </div>
    );
  }
}
