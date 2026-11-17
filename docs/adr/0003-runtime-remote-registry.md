# 0003. Runtime remote loading from a registry, no MF DTS

- Status: Accepted
- Date: 2026-11-17

## Context

The shell needs to know which remotes exist, how to load them, what to put in the nav, and what Zephyr should resolve. The usual pattern is a static `import('catalog/ServiceCatalog')` plus generated types (`@mf-types`). That approach has two problems here:

- Every new remote means hand-editing TypeScript in several places, which makes a generator awkward.
- MF type generation fails (TYPE-001) when exposed files import a workspace package from outside the remote's rootDir. Our remotes do exactly that with `@portal/ui`.

## Decision

- `apps/shell/remotes.json` is the single list of remotes. Each entry has `name`, `package`, `port`, `module`, `route` and `label`.
  - `module-federation.config.ts` builds `remotes` from it.
  - The app builds nav and routes from it.
- Pages load at runtime with `loadRemote()` from `@module-federation/enhanced/runtime`. That package is pinned to the same version as the Rsbuild MF plugin, so there is only one runtime instance.
- Every exposed module is a props-less page component. The shell types all of them with one `RemotePage = { default: ComponentType }`.
- `dts: false` in every MF config.
- A contract test in the shell checks the registry against each remote's `exposes` and against `zephyr:dependencies` in the shell's `package.json`.

## Consequences

- Adding a remote is a JSON edit, which the generator does with `updateJson`.
- We lose compile-time types for remote props. That is acceptable because pages take no props. The contract test plus the e2e smoke catch drift.
- `RemoteBoundary` receives its loader as a prop, so the tests never touch the MF runtime.
