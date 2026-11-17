import { afterEach, describe, expect, it } from '@rstest/core';
import { act, renderHook } from '@testing-library/react';
import { useHashRoute } from './use-hash-route';

const navigate = (hash: string) =>
  act(() => {
    window.location.hash = hash;
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  });

afterEach(() => {
  window.location.hash = '';
});

describe('useHashRoute', () => {
  it('returns an empty route when there is no hash', () => {
    const { result } = renderHook(() => useHashRoute());

    expect(result.current).toBe('');
  });

  it('reads the route from a #/route hash', () => {
    window.location.hash = '#/golden-paths';

    const { result } = renderHook(() => useHashRoute());

    expect(result.current).toBe('golden-paths');
  });

  it('updates when the hash changes', () => {
    const { result } = renderHook(() => useHashRoute());

    navigate('#/catalog');

    expect(result.current).toBe('catalog');
  });
});
