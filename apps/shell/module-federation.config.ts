import type { ModuleFederationOptions } from '@module-federation/rsbuild-plugin';

export default {
  name: 'shell',
  // Local URLs for dev. Zephyr rewrites them at deploy time using
  // "zephyr:dependencies" in package.json; the keys must match.
  remotes: {
    catalog: 'catalog@http://localhost:3001/mf-manifest.json',
  },
  shared: {
    react: { singleton: true, requiredVersion: '^19.3.0' },
    'react-dom': { singleton: true, requiredVersion: '^19.3.0' },
  },
  dts: false,
} satisfies ModuleFederationOptions;
