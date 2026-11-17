import { describe, expect, it } from '@rstest/core';
import { goldenPaths } from './golden-paths';

describe('golden path seed data', () => {
  it('has unique ids', () => {
    const ids = goldenPaths.map((path) => path.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it('points every path at an nx generator', () => {
    for (const path of goldenPaths) {
      expect(path.generator).toMatch(/^@[a-z-]+\/[a-z-]+:[a-z-]+$/);
    }
  });

  it('marks react-remote as available, backed by the real @portal/plugin:remote generator', () => {
    const available = goldenPaths.filter((path) => path.availability === 'available');

    expect(available.map((path) => [path.id, path.generator])).toEqual([
      ['react-remote', '@portal/plugin:remote'],
    ]);
  });
});
