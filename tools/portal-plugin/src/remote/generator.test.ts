import { readJson, type Tree, writeJson } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { describe, expect, it } from '@rstest/core';
import { remoteGenerator } from './generator';

function workspaceWithShell(): Tree {
  const tree = createTreeWithEmptyWorkspace();
  writeJson(tree, 'apps/shell/remotes.json', [
    {
      name: 'catalog',
      package: 'portal-catalog',
      port: 3001,
      module: './ServiceCatalog',
      route: 'catalog',
      label: 'Service Catalog',
    },
  ]);
  writeJson(tree, 'apps/shell/package.json', {
    name: 'portal-shell',
    dependencies: {
      react: '19.3.1',
      '@portal/ui': 'workspace:*',
      '@module-federation/enhanced': '2.9.3',
    },
    devDependencies: { '@rsbuild/core': '2.3.3' },
    'zephyr:dependencies': { catalog: 'portal-catalog@workspace:*' },
    nx: { targets: { build: { dependsOn: [{ projects: ['portal-catalog'], target: 'build' }] } } },
  });
  return tree;
}

describe('remote generator', () => {
  it('creates the app with package name portal-<name>', async () => {
    const tree = workspaceWithShell();

    await remoteGenerator(tree, { name: 'incidents', label: 'Incidents' });

    const pkg = readJson(tree, 'apps/incidents/package.json');
    expect(pkg.name).toBe('portal-incidents');
    expect(pkg.version).toBe('0.1.0');
    expect(pkg.scripts.build).toBe('rsbuild build');
  });

  it('copies the shell dependency versions, minus the host-only runtime', async () => {
    const tree = workspaceWithShell();

    await remoteGenerator(tree, { name: 'incidents', label: 'Incidents' });

    const pkg = readJson(tree, 'apps/incidents/package.json');
    expect(pkg.dependencies).toEqual({ react: '19.3.1', '@portal/ui': 'workspace:*' });
    expect(pkg.devDependencies).toEqual({ '@rsbuild/core': '2.3.3' });
  });

  it('exposes a Page module under the remote name', async () => {
    const tree = workspaceWithShell();

    await remoteGenerator(tree, { name: 'incidents', label: 'Incidents' });

    const mfConfig = tree.read('apps/incidents/module-federation.config.ts', 'utf-8');
    expect(mfConfig).toContain("name: 'incidents'");
    expect(mfConfig).toContain("'./Page': './src/Page.tsx'");
    expect(tree.read('apps/incidents/src/Page.tsx', 'utf-8')).toContain('Incidents');
    expect(tree.exists('apps/incidents/src/Page.test.tsx')).toBe(true);
  });

  it('registers the remote in the shell registry on the next free port', async () => {
    const tree = workspaceWithShell();

    await remoteGenerator(tree, { name: 'incidents', label: 'Incidents' });

    expect(readJson(tree, 'apps/shell/remotes.json').at(-1)).toEqual({
      name: 'incidents',
      package: 'portal-incidents',
      port: 3002,
      module: './Page',
      route: 'incidents',
      label: 'Incidents',
    });
    expect(tree.read('apps/incidents/rsbuild.config.ts', 'utf-8')).toContain('port: 3002');
  });

  it('adds the remote to zephyr:dependencies and the shell build order', async () => {
    const tree = workspaceWithShell();

    await remoteGenerator(tree, { name: 'incidents', label: 'Incidents' });

    const shell = readJson(tree, 'apps/shell/package.json');
    expect(shell['zephyr:dependencies']).toEqual({
      catalog: 'portal-catalog@workspace:*',
      incidents: 'portal-incidents@workspace:*',
    });
    expect(shell.nx.targets.build.dependsOn[0].projects).toEqual([
      'portal-catalog',
      'portal-incidents',
    ]);
  });

  it('rejects a name that is not kebab-case', async () => {
    const tree = workspaceWithShell();

    await expect(remoteGenerator(tree, { name: 'Incidents' })).rejects.toThrow(
      'Invalid remote name "Incidents"',
    );
    expect(tree.exists('apps/Incidents')).toBe(false);
  });

  it('rejects a name that is already registered', async () => {
    const tree = workspaceWithShell();

    await expect(remoteGenerator(tree, { name: 'catalog' })).rejects.toThrow(
      'Remote "catalog" already exists',
    );
  });

  it('rejects a label that would break the generated code', async () => {
    const tree = workspaceWithShell();

    await expect(
      remoteGenerator(tree, { name: 'incidents', label: "On-call's view" }),
    ).rejects.toThrow('Label must not contain quotes');
  });

  it('rejects a label with control characters such as a newline', async () => {
    const tree = workspaceWithShell();

    await expect(remoteGenerator(tree, { name: 'incidents', label: 'On\ncall' })).rejects.toThrow(
      'Label must not contain',
    );
  });
});
