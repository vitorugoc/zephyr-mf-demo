import type { ModuleFederationOptions } from '@module-federation/rsbuild-plugin';

export default {
  name: 'catalog',
  filename: 'remoteEntry.js',
  exposes: {
    './ServiceCatalog': './src/ServiceCatalog.tsx',
  },
  shared: {
    react: { singleton: true, requiredVersion: '^19.3.0' },
    'react-dom': { singleton: true, requiredVersion: '^19.3.0' },
  },
  dts: false,
} satisfies ModuleFederationOptions;
