import { describe, expect, it } from '@rstest/core';
import { buildGenerateCommand } from './build-generate-command';

describe('buildGenerateCommand', () => {
  it('builds an nx generate command for the path and name', () => {
    expect(buildGenerateCommand({ generator: '@portal/plugin:remote' }, 'incidents')).toBe(
      'pnpm nx g @portal/plugin:remote --name=incidents',
    );
  });
});
