import { afterEach, describe, expect, it } from '@rstest/core';
import { render, screen } from '@testing-library/react';
import App, { type RemotePage } from './App';
import type { RemoteEntry } from './registry';

const remotes: RemoteEntry[] = [
  {
    name: 'catalog',
    package: 'portal-catalog',
    port: 3001,
    module: './ServiceCatalog',
    route: 'catalog',
    label: 'Service Catalog',
  },
  {
    name: 'scaffolder',
    package: 'portal-scaffolder',
    port: 3002,
    module: './GoldenPaths',
    route: 'golden-paths',
    label: 'Golden Paths',
  },
];

// Each fake remote renders a heading with its own name.
const load = (entry: RemoteEntry): Promise<RemotePage> =>
  Promise.resolve({ default: () => <h1>{`${entry.name} page`}</h1> });

afterEach(() => {
  window.location.hash = '';
});

describe('App', () => {
  it('renders a nav link for every remote', () => {
    render(<App remotes={remotes} load={load} />);

    const nav = screen.getByRole('navigation', { name: 'Main' });
    expect(nav).toContainElement(screen.getByRole('link', { name: 'Service Catalog' }));
    expect(screen.getByRole('link', { name: 'Golden Paths' })).toHaveAttribute(
      'href',
      '#/golden-paths',
    );
  });

  it('opens the first remote when there is no route', async () => {
    render(<App remotes={remotes} load={load} />);

    expect(await screen.findByRole('heading', { name: 'catalog page' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Service Catalog' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('opens the remote that matches the route', async () => {
    window.location.hash = '#/golden-paths';

    render(<App remotes={remotes} load={load} />);

    expect(await screen.findByRole('heading', { name: 'scaffolder page' })).toBeInTheDocument();
  });

  it('shows not found for an unknown route', () => {
    window.location.hash = '#/nope';

    render(<App remotes={remotes} load={load} />);

    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
  });
});
