# 0001. Rsbuild + Module Federation 2.0 + Zephyr Rsbuild plugin

- Status: Accepted
- Date: 2026-11-17

## Context

The assignment is to deploy a Module Federation app with Zephyr's default cloud. Zephyr has plugins for Rsbuild, Rspack, Webpack, Vite and Modern.js. Its own MF tutorial uses Rsbuild with `@module-federation/rsbuild-plugin`. The docs pin older versions (plugin 1.2.0, MF 2.8.0) than the ones on npm today (1.8.0, 2.9.3).

## Decision

Every app is built with Rsbuild 2 using `@module-federation/rsbuild-plugin` (MF 2.0, manifest-based).

- `withZephyr()` from `zephyr-rsbuild-plugin` is the last plugin.
- `output.assetPrefix` is `'auto'`.
- Versions are pinned exactly to what npm publishes today, not to what the docs show.
- MF options live in a plain `module-federation.config.ts` per app, so tests and the generator can read them.

## Consequences

- We stay on the path Zephyr documents and tests most. Under the hood it is still Rspack.
- Using newer versions than the docs is a known risk. The P1 spike exists to confirm they work together before we write any feature code.
- Webpack and Vite federation are not used. Moving away from Rsbuild later would mean rewriting each app's config, but not its components.
