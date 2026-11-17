import { pluginReact } from '@rsbuild/plugin-react';
import { defineConfig } from '@rstest/core';

// Only the React plugin: tests must never pull in Module Federation or Zephyr.
export default defineConfig({
  plugins: [pluginReact()],
  testEnvironment: 'jsdom',
  setupFiles: ['./src/test-setup.ts'],
});
