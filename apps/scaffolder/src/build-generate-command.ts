import type { GoldenPath } from './data/golden-paths';

export function buildGenerateCommand(path: Pick<GoldenPath, 'generator'>, name: string): string {
  return `pnpm nx g ${path.generator} --name=${name}`;
}
