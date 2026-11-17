import { describe, expect, it } from '@rstest/core';
import { validateName } from './validate-name';

describe('validateName', () => {
  it.each(['incidents', 'feature-flags', 'app2', 'a-b', 'x'.repeat(30)])('accepts "%s"', (name) => {
    expect(validateName(name)).toBeNull();
  });

  it('asks for a name when empty', () => {
    expect(validateName('')).toBe('Enter a name.');
  });

  it.each(['ab', 'x'.repeat(31)])('rejects "%s" for its length', (name) => {
    expect(validateName(name)).toBe('Use 3 to 30 characters.');
  });

  it.each(['Incidents', 'feature flags', '2fast', '-lead', 'trail-', 'double--dash', 'snake_case'])(
    'rejects "%s" as not kebab-case',
    (name) => {
      expect(validateName(name)).toBe(
        'Use lowercase letters, digits and single dashes, starting with a letter.',
      );
    },
  );
});
