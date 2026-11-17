# Zephyr feedback log

A running log of what worked and what slowed me down while building this project. Times are local (UTC-3). It is written as I go and tidied at the end.

## Friction log

### 2026-11-17

- **19:45 — Version drift between docs and npm.** The Rsbuild + MF monorepo tutorial pins `zephyr-rsbuild-plugin` 1.2.0 and Module Federation 2.8.0. The example repo uses `latest` and MF `^0.21.2`. npm today has 1.8.0 and 2.9.3. I pinned the npm versions and planned a spike to check them before writing features. They worked together without changes.
- **19:53 — Missing `git user.email`.** My machine had no global email. The plugin warned clearly ("Global git config incomplete … Falling back to API user info") and kept going. That fallback is a nice touch. It still didn't stop me from pushing commits that GitHub couldn't link to my account, but that one is on me.
- **19:53 — Login in a non-interactive shell.** The first build ran from a non-TTY shell. The error was clear and actionable ("Run the deployment in an interactive terminal … or provide a valid authentication token"). Running the same command in a real terminal opened the browser and worked first time.
- **20:05 — Confusing log line on a web build.** The first catalog deploy printed `{ id: '005', message: 'Missing filename in Module Federation configuration. Since the filename in React Native is the actual JS bundle…' }`. This is a web app, and `filename` is set. The deploy succeeded anyway. The message looks like it comes from a React Native code path that shouldn't run here.
- **20:07 — Transient 403 on a new app.** The shell's first deploy failed with `User … is not allowed to update portal-shell.zephyr-mf-demo.vitorugoc` (403 from `/build-id`). The catalog deployed fine with the same credentials seconds earlier. A build started from another terminal at the same moment succeeded, and my retry a minute later worked too. My guess is a race while the app record was being created. The CLI message gives no hint that retrying might help, so it reads like a permanent permission problem.

## What worked well

- `ZE_DISABLED=true` is exactly what local dev and CI verification need: one clear log line, no auth prompt, no upload.
- `zephyr:dependencies` with `workspace:*` resolved the catalog to the build from the same branch and user, without any URL in my code. The build log ("Resolved remotes: catalog → …") made it easy to confirm.
- From first login to a deployed host and remote took minutes, not hours.

## Suggestions

- Keep the tutorial version pins in sync with npm, or say "use the latest" and drop the pins.
- On the 403 from `/build-id`, suggest retrying when the app was created in the last few seconds, or make app creation idempotent across parallel builds.
- Silence the React Native `filename` check for web bundlers.
