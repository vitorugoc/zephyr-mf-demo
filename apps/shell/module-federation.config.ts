import type { ModuleFederationOptions } from '@module-federation/rsbuild-plugin';
import { shared } from '../../module-federation.shared';

export default {
  name: 'shell',
  // Local URLs for dev. Zephyr rewrites them at deploy time using
  // "zephyr:dependencies" in package.json; the keys must match.
  remotes: {
    catalog: 'catalog@http://localhost:3001/mf-manifest.json',
  },
  shared,
  dts: false,
} satisfies ModuleFederationOptions;
