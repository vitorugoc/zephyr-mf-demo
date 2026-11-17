import type { ModuleFederationOptions } from '@module-federation/rsbuild-plugin';
import { shared } from '../../module-federation.shared';

export default {
  name: 'catalog',
  filename: 'remoteEntry.js',
  exposes: {
    './ServiceCatalog': './src/ServiceCatalog.tsx',
  },
  shared,
  dts: false,
} satisfies ModuleFederationOptions;
