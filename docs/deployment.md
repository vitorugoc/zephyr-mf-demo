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

Environments are per application, and each one follows a tag. Set up in the Zephyr dashboard (**app → DevOps**):

| App | Tag | Environment |
|---|---|---|
| `portal-shell` | `main` (branch is `main`) | `production` |
| `portal-catalog` | `main` (branch is `main`) | `production` |

On its own, a host environment does **not** switch its remotes to same-named environments. The shell's `production` environment therefore has a remote dependency override (**Environments → production → dependencies**) pointing `catalog` at the catalog's `production` environment. The result:

- https://production-portal-shell-zephyr-mf-demo-vitorugoc-ze.zephyrcloud.app/ loads the catalog from `https://production-portal-catalog-…/remoteEntry.js`.
- A version URL such as `vitorhugo02cc-29-portal-shell-…` is immutable. It keeps the remote URLs from its build (the auto tag `web_latest_…`), so use the environment URL for anything users see.
- `portal-scaffolder` has no environment and still follows its build tag. Adding one is the same two steps plus an override.

## Rollback

In the dashboard, open `portal-catalog` and use **Rollback** on its deployments. Its `production` environment moves back to the previous successful version, and because the shell's `production` environment resolves the catalog through that environment, the live portal follows without a rebuild.

## Not done here, and how I'd add it

- **PR previews.** Zephyr already gives every build a version URL. I'd deploy from the `pull_request` event too, with the branch as the tag condition, and post the shell's version URL as a PR comment. I left it out to keep the default cloud usage small.
- **Pinned releases.** For stricter releases, set `dependencyUrlMode: 'version'` in a `zephyr.config.ts` so a shell version always loads the exact remote versions it was built with. Promoting then means promoting the shell.
