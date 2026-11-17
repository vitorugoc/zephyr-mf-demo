import { readFileSync } from 'node:fs';
import { defineConfig, devices } from '@playwright/test';

// Serve the production builds (`build:local`, Zephyr disabled), ports taken from
// the shell registry so the two can't disagree.
const remotes: { name: string; port: number }[] = JSON.parse(
  readFileSync(new URL('../apps/shell/remotes.json', import.meta.url), 'utf8'),
);

const preview = (app: string, port: number) => ({
  command: `pnpm --dir ../apps/${app} preview`,
  url: `http://localhost:${port}`,
  reuseExistingServer: !process.env.CI,
});

export default defineConfig({
  testDir: './tests',
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    ...remotes.map((remote) => preview(remote.name, remote.port)),
    preview('shell', 3000),
  ],
});
