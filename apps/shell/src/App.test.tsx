import { describe, expect, it } from '@rstest/core';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the catalog page loaded from the remote', async () => {
    const loadCatalog = () => Promise.resolve({ default: () => <h1>Remote page</h1> });

    render(<App loadCatalog={loadCatalog} />);

    expect(await screen.findByRole('heading', { name: 'Remote page' })).toBeInTheDocument();
  });
});
