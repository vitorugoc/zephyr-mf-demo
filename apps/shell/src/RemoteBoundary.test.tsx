import { describe, expect, it, rs } from '@rstest/core';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { RemotePage } from './App';
import { RemoteBoundary } from './RemoteBoundary';

const page = (text: string): RemotePage => ({ default: () => <h1>{text}</h1> });
const never = () => new Promise<RemotePage>(() => {});

describe('RemoteBoundary', () => {
  it('shows a loading message while the remote is fetched', () => {
    render(<RemoteBoundary label="Service Catalog" load={never} />);

    expect(screen.getByRole('status')).toHaveTextContent('Loading Service Catalog…');
  });

  it('renders the remote page once it loads', async () => {
    render(
      <RemoteBoundary label="Service Catalog" load={() => Promise.resolve(page('Catalog'))} />,
    );

    expect(await screen.findByRole('heading', { name: 'Catalog' })).toBeInTheDocument();
  });

  it('shows an alert naming the remote when it fails to load', async () => {
    const load = () => Promise.reject(new Error('network down'));
    render(<RemoteBoundary label="Service Catalog" load={load} />);

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Service Catalog is unavailable right now.',
    );
  });

  it('loads the remote again on retry', async () => {
    const load = rs
      .fn<() => Promise<RemotePage>>()
      .mockRejectedValueOnce(new Error('network down'))
      .mockResolvedValueOnce(page('Catalog'));
    render(<RemoteBoundary label="Service Catalog" load={load} />);

    await userEvent.click(await screen.findByRole('button', { name: 'Retry' }));

    expect(await screen.findByRole('heading', { name: 'Catalog' })).toBeInTheDocument();
    expect(load).toHaveBeenCalledTimes(2);
  });
});
