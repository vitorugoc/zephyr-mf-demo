import type { ModuleFederationOptions } from '@module-federation/rsbuild-plugin';
import { shared } from '../../module-federation.shared';
import { federationRemotes, registry } from './src/registry';

export default {
  name: 'shell',
  // Local URLs for dev. Zephyr rewrites them at deploy time using
  // "zephyr:dependencies" in package.json; the keys must match.
  remotes: federationRemotes(registry),
  shared,
  dts: false,
} satisfies ModuleFederationOptions;
