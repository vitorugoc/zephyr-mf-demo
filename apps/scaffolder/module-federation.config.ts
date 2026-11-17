import type { ModuleFederationOptions } from '@module-federation/rsbuild-plugin';
import { shared } from '../../module-federation.shared.ts';

export default {
  name: 'scaffolder',
  filename: 'remoteEntry.js',
  exposes: {
    './GoldenPaths': './src/GoldenPaths.tsx',
  },
  shared,
  dts: false,
} satisfies ModuleFederationOptions;
