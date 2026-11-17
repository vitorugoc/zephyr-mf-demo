import entries from '../remotes.json';

/** One federated page the shell can show. `remotes.json` is the source of truth (ADR 0003). */
export type RemoteEntry = {
  /** Module Federation name of the remote; also the key in "zephyr:dependencies". */
  name: string;
  /** package.json name of the remote app; Zephyr uses it in the app id. */
  package: string;
  /** Local dev / preview port. */
  port: number;
  /** Exposed module, e.g. "./ServiceCatalog". */
  module: string;
  /** Hash route, e.g. "catalog" for #/catalog. */
  route: string;
  label: string;
};

export const registry: readonly RemoteEntry[] = entries;

/** Local manifest URLs. Zephyr swaps them for deployed URLs at build time. */
export function federationRemotes(remotes: readonly RemoteEntry[]): Record<string, string> {
  return Object.fromEntries(
    remotes.map((remote) => [
      remote.name,
      `${remote.name}@http://localhost:${remote.port}/mf-manifest.json`,
    ]),
  );
}
