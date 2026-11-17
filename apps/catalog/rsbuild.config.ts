import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { withZephyr } from 'zephyr-rsbuild-plugin';
import mfConfig from './module-federation.config';

export default defineConfig({
  // The shell (port 3000) fetches this remote cross-origin during local dev.
  server: { port: 3001, cors: { origin: 'http://localhost:3000' } },
  output: { assetPrefix: 'auto' },
  html: { title: 'Service Catalog' },
  // withZephyr must come after the federation plugin so it can read its config.
  plugins: [pluginReact(), pluginModuleFederation(mfConfig), withZephyr()],
});
