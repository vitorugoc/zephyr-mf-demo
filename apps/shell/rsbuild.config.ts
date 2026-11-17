import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { withZephyr } from 'zephyr-rsbuild-plugin';
import mfConfig from './module-federation.config';

export default defineConfig({
  server: { port: 3000 },
  output: { assetPrefix: 'auto' },
  html: { title: 'Platform Portal' },
  // withZephyr must come after the federation plugin so it can read its config.
  plugins: [pluginReact(), pluginModuleFederation(mfConfig), withZephyr()],
});
