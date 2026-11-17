# Demo script (target: under 5 minutes)

## Before recording

- [ ] Zephyr dashboard: the `production` environment exists (DevOps → Environments, condition: branch `main`) and its URL opens the portal.
- [ ] PR #6 ("owner team column") is open, green and up to date with `main`. Click **Update branch** if GitHub asks, because `main` requires branches to be up to date.
- [ ] Terminal: `nvm use && pnpm install`; the dev servers aren't running yet.
- [ ] Browser tabs:
  1. this README
  2. the production URL
  3. the Zephyr dashboard (project `zephyr-mf-demo`)
  4. PR #6
  5. GitHub Actions
- [ ] Rehearse the rollback once without recording. The shell resolves the catalog through a tag URL (`t-web-latest-…`), so check which pointer the rollback moves and that the production URL actually changes. If it doesn't, roll back the catalog's tag or environment that the shell resolves through, and note what you learned in the feedback log.
- [ ] Screen: 1080p, terminal font enlarged, notifications off.
- [ ] Record with QuickTime (File → New Screen Recording), then shrink the file:
  `ffmpeg -i demo.mov -c:v libx264 -crf 26 -preset slow -c:a aac demo.mp4`

## Script

| Time | Show | Say (roughly) |
|---|---|---|
| 0:00 | README diagram | "A developer portal split into a host and two remotes, federated at runtime with Module Federation 2.0. Every app deploys to Zephyr Cloud on its default managed integration." |
| 0:25 | `pnpm nx graph`, then `apps/shell/remotes.json` and `zephyr:dependencies` in `apps/shell/package.json` | "Three apps and a shared UI kit. There's no edge from the shell to the remotes in the project graph, which matters for deploys. The shell only knows localhost URLs. Zephyr maps these keys to its own apps and rewrites the URLs at build time." |
| 1:00 | `pnpm dev` → localhost:3000, click both nav items | "Locally Zephyr is disabled, so nothing uploads while I develop." |
| 1:25 | Production URL, open DevTools → Network, filter `remoteEntry` | "In production the remotes come from Zephyr tag URLs, not localhost." |
| 1:50 | PR #6 diff (one column) → **Rebase and merge** → Actions run | "A catalog-only change. CI verifies, then deploys only what's affected." |
| 2:30 | Deploy job log: `nx run portal-catalog:build` only, then the Zephyr version URL | "One app rebuilt. The shell wasn't touched." (Cut the CI wait out of the video and say so.) |
| 2:55 | Dashboard: catalog has a new version, shell's latest version unchanged | "The catalog moved forward; the shell is the same build as before." |
| 3:10 | Production URL, reload → "Owner team" column | "The live shell picked up the new catalog without being rebuilt." (If the edge cache is slow, show the shell's version URL instead and mention the cache delay.) |
| 3:30 | Dashboard → catalog → **Rollback** → reload production | "Rollback is a pointer change. No build ran, and the column is gone." |
| 3:55 | localhost, block `localhost:3001` in DevTools (Network request blocking) → reload `#/catalog` → Golden Paths still works → unblock → **Retry** | "If a remote is down, only its page fails. The e2e tests cover this, and they caught a real bug: MF's default share strategy blanked the whole shell." |
| 4:25 | `pnpm nx g @portal/plugin:remote --name=incidents --label="Incidents" --dry-run` | "New remotes come from a golden path generator that also registers them with the shell and Zephyr." |
| 4:45 | `docs/zephyr-feedback.md` | "I logged friction as I went, including the CI-token-to-GitHub linking step and docs version drift. That's in the repo." |

## After recording

- Upload the video (YouTube unlisted or Loom), put the link in the README, and put the production URL in the README too.
- Commit with `docs: link demo video and production url`.
