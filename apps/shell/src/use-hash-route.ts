import { useSyncExternalStore } from 'react';

function subscribe(onChange: () => void) {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
}

const readRoute = () => window.location.hash.replace(/^#\/?/, '');

/**
 * Current hash route ("#/catalog" -> "catalog"). Hash routing needs no
 * server-side fallback, so deep links work on any static host, Zephyr included.
 */
export function useHashRoute(): string {
  return useSyncExternalStore(subscribe, readRoute);
}
