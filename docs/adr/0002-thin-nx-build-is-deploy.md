# 0002. Thin NX: `build` is an uncached deploy, ordering is task-level

- Status: Accepted
- Date: 2026-11-17

## Context

We want NX for the project graph, caching and `affected` runs. Two things collide with Zephyr:

1. With `withZephyr()` installed, every `rsbuild build` uploads a new version. If NX restores a build from its cache, nothing is uploaded.
2. Remotes have to build before the host, so the host can resolve them. An `implicitDependencies` edge from shell to remotes gives us that order. It also marks the shell as affected whenever a remote changes, which defeats independent deploys.

## Decision

- Package-based NX (`nx` only, no `@nx/*` inference or executor plugins). Targets come from each `package.json` script.
- `build` means "build and deploy to Zephyr" and has `cache: false`. `build:local` runs with `ZE_DISABLED=true`, can be cached, and is what preview and e2e use.
- The shell declares its build order at task level: `nx.targets.build.dependsOn: [{ projects: ["portal-catalog", "portal-scaffolder"], target: "build" }]`. There are no implicit dependencies.
- CI deploys with `nx affected -t build`.
- `@nx/devkit` is allowed, but only as the SDK for our own generator (`tools/portal-plugin`).

## Consequences

- A catalog-only change rebuilds and redeploys only the catalog. The host picks it up through Zephyr (see ADR 0005).
- A local `build` always needs a Zephyr login. That is intended and documented.
- The P1 spike has to confirm that task-level `dependsOn` does not add a project-graph edge (`nx show projects --affected`).
