import { type ComponentType, lazy, Suspense, useMemo } from 'react';

/** Every exposed page is a props-less component (see ADR 0003). */
export type RemotePage = { default: ComponentType };

type AppProps = {
  loadCatalog: () => Promise<RemotePage>;
};

export default function App({ loadCatalog }: AppProps) {
  const Catalog = useMemo(() => lazy(loadCatalog), [loadCatalog]);

  return (
    <main>
      <Suspense fallback={<p>Loading…</p>}>
        <Catalog />
      </Suspense>
    </main>
  );
}
