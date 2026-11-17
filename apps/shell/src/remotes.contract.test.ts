import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from '@rstest/core';
import shellPackage from '../package.json';
import { registry } from './registry';

// The shell, the remotes and Zephyr each describe the same remotes in their own
// file. This test keeps them in agreement, so a typo fails here instead of in
// a deployed shell that can't find its remote.

const appsDir = join(process.cwd(), '..');
const readJson = (path: string) => JSON.parse(readFileSync(path, 'utf8'));

describe.each(registry)('remote "$name"', (entry) => {
  const remotePackage = readJson(join(appsDir, entry.name, 'package.json'));

  it('matches the remote app package name', () => {
    expect(remotePackage.name).toBe(entry.package);
  });

  it('matches the remote federation name and exposes the module', async () => {
    const { default: config } = await import(`../../${entry.name}/module-federation.config.ts`);

    expect(config.name).toBe(entry.name);
    expect(Object.keys(config.exposes)).toContain(entry.module);
  });

  it('is declared in the shell zephyr:dependencies under the same key', () => {
    expect(shellPackage['zephyr:dependencies']).toHaveProperty(
      entry.name,
      `${entry.package}@workspace:*`,
    );
  });

  it('is built before the shell on deploy', () => {
    const [dependency] = shellPackage.nx.targets.build.dependsOn;

    expect(dependency?.projects).toContain(entry.package);
  });
});

describe('registry', () => {
  it('has unique names, routes and ports', () => {
    for (const key of ['name', 'route', 'port'] as const) {
      const values = registry.map((entry) => entry[key]);
      expect(new Set(values).size).toBe(values.length);
    }
  });

  it('has no zephyr:dependencies the registry does not know about', () => {
    expect(Object.keys(shellPackage['zephyr:dependencies']).sort()).toEqual(
      registry.map((entry) => entry.name).sort(),
    );
  });
});
