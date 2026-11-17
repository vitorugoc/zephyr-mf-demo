import { join } from 'node:path';
import {
  formatFiles,
  type GeneratorCallback,
  generateFiles,
  installPackagesTask,
  readJson,
  type Tree,
  writeJson,
} from '@nx/devkit';

export type RemoteGeneratorSchema = {
  name: string;
  label?: string;
};

type RegistryEntry = {
  name: string;
  package: string;
  port: number;
  module: string;
  route: string;
  label: string;
};
type PackageJson = {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

const SHELL = 'apps/shell';
// Only the host loads remotes at runtime; remotes don't need the runtime package.
const HOST_ONLY_DEPENDENCIES = ['@module-federation/enhanced'];

export async function remoteGenerator(
  tree: Tree,
  options: RemoteGeneratorSchema,
): Promise<GeneratorCallback> {
  const name = options.name;
  const label = options.label ?? name;
  const registry = readJson<RegistryEntry[]>(tree, `${SHELL}/remotes.json`);
  const port = Math.max(3000, ...registry.map((entry) => entry.port)) + 1;
  const appRoot = `apps/${name}`;

  generateFiles(tree, join(__dirname, 'files'), appRoot, { name, label, port, tmpl: '' });
  writeJson(tree, `${appRoot}/package.json`, remotePackageJson(tree, name));
  writeJson(tree, `${SHELL}/remotes.json`, [
    ...registry,
    { name, package: `portal-${name}`, port, module: './Page', route: name, label },
  ]);

  await formatFiles(tree);
  return () => installPackagesTask(tree);
}

/** Same scripts as the other remotes, same dependency versions as the shell. */
function remotePackageJson(tree: Tree, name: string) {
  const shell = readJson<PackageJson>(tree, `${SHELL}/package.json`);
  const dependencies = Object.fromEntries(
    Object.entries(shell.dependencies ?? {}).filter(
      ([dependency]) => !HOST_ONLY_DEPENDENCIES.includes(dependency),
    ),
  );
  return {
    name: `portal-${name}`,
    version: '0.1.0',
    private: true,
    type: 'module',
    scripts: {
      dev: 'ZE_DISABLED=true rsbuild dev',
      build: 'rsbuild build',
      'build:local': 'ZE_DISABLED=true rsbuild build',
      preview: 'rsbuild preview',
      test: 'rstest run',
      typecheck: 'tsc --noEmit',
    },
    dependencies,
    devDependencies: shell.devDependencies ?? {},
  };
}

export default remoteGenerator;
