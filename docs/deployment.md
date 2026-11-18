# Deployment

How code gets from a commit to Zephyr Cloud, and how a release is promoted or rolled back without rebuilding anything.

## The short version

1. Every app's `build` target runs `rsbuild build` with `withZephyr()` as the last plugin. The plugin uploads the output to Zephyr's managed cloud (Zephyr's default integration, no BYOC provider), and each build becomes an **immutable version** with its own URL.
2. CI (`.github/workflows/ci.yml`) runs `verify` on every PR. On a push to `main` it also runs `deploy`: `nx affected -t build` with `ZE_CI_TOKEN`. A remote-only change gets exactly one new version (see below for shell changes).
3. The host never hardcodes remote URLs. `zephyr:dependencies` in `apps/shell/package.json` maps each MF remote key to a Zephyr app (`portal-catalog@workspace:*`). At build time Zephyr rewrites the shell's `localhost` remotes to **tag URLs** that always point at the newest matching remote version.
4. Environments and rollbacks are pointer changes in the Zephyr dashboard. Nothing is rebuilt.

## Local vs CI

| Command | Zephyr | Used for |
|---|---|---|
| `pnpm dev` | disabled (`ZE_DISABLED=true`) | local development, remotes on ports 3001/3002 |
| `pnpm nx run-many -t build:local` | disabled | e2e tests against production builds |
| `pnpm nx run portal-shell:build` | **uploads** | manual deploy; builds the remotes first through a task-level `dependsOn` |
| CI `deploy` job | uploads with `ZE_CI_TOKEN` | every push to `main` |

`build` is not cached by NX on purpose. With Zephyr a build is also a deploy, so a cache hit would skip the upload without any warning.

The first local deploy opens a browser to log in, and the session is stored in `~/.zephyr`. In CI the GitHub user who triggers the workflow must have GitHub linked under Zephyr's **My Profile → Settings → Git Providers**, otherwise the CI token can't be exchanged.

## Independent deploys

The shell's build depends on the remotes' builds at **task** level only (`nx.targets.build.dependsOn` in `apps/shell/package.json`), not through the project graph. So:

- A change in `apps/catalog` → `nx affected` = `portal-catalog` only → one new catalog version.
- The shell isn't rebuilt. Its remote URL is a tag URL (for example `t-web-latest-…-portal-catalog-…`), so it picks the new catalog version up on the next page load.
- A change in `packages/ui` or `module-federation.shared.ts` affects every app, which is right: shared singletons must agree.
- A change in `apps/shell` runs the remotes' builds first, because of that same `dependsOn`. They upload fresh versions with identical content. It's noisy but harmless, and it guarantees the remotes exist before the very first shell deploy. Once every remote has been deployed at least once, the trade-off could flip: drop the `dependsOn` and let the shell rely on the tag URLs.

## Environments

Created in the Zephyr dashboard under **DevOps → Environments**:

| Environment | Points at | Purpose |
|---|---|---|
| `production` | builds from `main` | what users see; the URL to share |

An environment follows a tag condition (branch `main`) or is pinned to one version. Promoting or pinning is a dashboard action, again with no rebuild.

## Rollback

In the dashboard, open the app (for example `portal-catalog`) and use **Rollback**. The environment moves back to the previous successful version. The shell keeps working, because it resolves the catalog through the tag or environment rather than a fixed version.

## Not done here, and how I'd add it

- **PR previews.** Zephyr already gives every build a version URL. I'd deploy from the `pull_request` event too, with the branch as the tag condition, and post the shell's version URL as a PR comment. I left it out to keep the default cloud usage small.
- **Pinned releases.** For stricter releases, set `dependencyUrlMode: 'version'` in a `zephyr.config.ts` so a shell version always loads the exact remote versions it was built with. Promoting then means promoting the shell.
