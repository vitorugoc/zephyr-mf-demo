# 0004. Rstest over Vitest

- Status: Accepted
- Date: 2026-11-17

## Context

We need a unit and component test runner for TDD with React Testing Library. Vitest is the default choice in most React codebases. Vitest 5 lists `vite` as a required peer, though, which adds a second bundler and a second transform pipeline to a repo that is otherwise Rspack-only. Rstest is the Rstack test runner. Its API is Jest-compatible, and `@rstest/adapter-rsbuild` reuses each app's `rsbuild.config.ts`. It is still 0.x.

## Decision

- Use `@rstest/core` with `@rstest/adapter-rsbuild` (`extends: withRsbuildConfig(...)`), the jsdom environment and `@testing-library/jest-dom/matchers` registered in a setup file.
- In test builds, strip the MF and Zephyr plugins through `modifyRsbuildConfig`, so tests never federate and never upload.
- Fallback: if Rstest blocks progress for more than an hour, switch to Vitest 5 + Vite. Test code barely changes (`rs.fn` becomes `vi.fn`). Record the switch by superseding this ADR.

## Consequences

- One compiler setup (SWC, CSS Modules) is shared by app builds and tests.
- We depend on a pre-1.0 tool. The fallback is cheap and the timebox is explicit.
