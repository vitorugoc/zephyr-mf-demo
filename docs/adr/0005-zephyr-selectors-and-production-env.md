# 0005. Zephyr dependency selectors and a single `production` environment

- Status: Accepted
- Date: 2026-11-17

## Context

Zephyr resolves a host's remotes from `zephyr:dependencies` in the host's `package.json`. The available selectors are `@latest`, tag, environment, semver, `@*` and `workspace:*` (same branch, same user).

With the default `dependencyUrlMode: 'selector'`, Zephyr can point a host at new remote versions without rebuilding the host. Environments and tags are configured in the dashboard. Rollback goes back to the previous successful version.

## Decision

- Selectors in the shell's `package.json`:
  - `"catalog": "portal-catalog@workspace:*"`
  - `"scaffolder": "portal-scaffolder@workspace:*"`
- Keep the default `dependencyUrlMode: 'selector'`. No `zephyr.config.ts` until we need one.
- One environment, `production`, with the condition branch = `main`. Every build gets an immutable version URL, and those URLs are the previews. There is no `staging` environment and there are no extra tags.
- Demonstrate independent deploys and rollback on `production`.
- Only push to `main` deploys. PR previews are out of scope; the README describes how to add them.

## Consequences

- A catalog-only merge deploys only the catalog, and `production` serves it through the existing host build.
- If `workspace:*` does not resolve as expected for the CI token user, fall back to `@latest`. That is spike item (d).
- Zephyr's cache can take from 1 minute to 1 hour to show new assets. CI never gates on the deployed URL.
