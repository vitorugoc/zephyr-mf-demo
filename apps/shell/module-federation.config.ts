import type { ModuleFederationOptions } from '@module-federation/rsbuild-plugin';
import { shared } from '../../module-federation.shared.ts';
import { federationRemotes, registry } from './src/registry';

export default {
  name: 'shell',
  // Local URLs for dev. Zephyr rewrites them at deploy time using
  // "zephyr:dependencies" in package.json; the keys must match.
  remotes: federationRemotes(registry),
  shared,
  // The default 'version-first' fetches every remote's entry at startup to
  // negotiate shared versions, so one remote being down blanks the whole shell.
  // 'loaded-first' only fetches a remote when its page is opened.
  shareStrategy: 'loaded-first',
  dts: false,
} satisfies ModuleFederationOptions;
