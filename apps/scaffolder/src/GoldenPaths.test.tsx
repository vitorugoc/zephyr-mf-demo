import { describe, expect, it, rs } from '@rstest/core';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { goldenPaths } from './data/golden-paths';
import GoldenPaths from './GoldenPaths';

const nameInput = () => screen.getByRole('textbox', { name: 'App name' });

describe('GoldenPaths', () => {
  it('renders the page heading', () => {
    render(<GoldenPaths />);

    expect(screen.getByRole('heading', { level: 1, name: 'Golden Paths' })).toBeInTheDocument();
  });

  it('lists every golden path, marking the illustrative ones', () => {
    render(<GoldenPaths />);

    for (const path of goldenPaths) {
      const card = screen.getByRole('region', { name: path.name });
      if (path.availability === 'example') {
        expect(within(card).getByText('Example')).toBeInTheDocument();
      }
    }
  });

  it('shows the generate command for the selected path once the name is valid', async () => {
    render(<GoldenPaths />);

    await userEvent.type(nameInput(), 'incidents');

    expect(
      screen.getByText('pnpm nx g @portal/plugin:remote --name=incidents'),
    ).toBeInTheDocument();
  });

  it('does not offer a command for example paths whose generator does not exist', async () => {
    render(<GoldenPaths />);

    await userEvent.click(screen.getByRole('button', { name: 'Use Node BFF on Lambda' }));
    await userEvent.type(nameInput(), 'orders-bff');

    expect(screen.queryByText(/pnpm nx g/)).not.toBeInTheDocument();
    expect(screen.getByRole('note')).toHaveTextContent(
      'Node BFF on Lambda is an example path; its generator is not part of this repo yet.',
    );
  });

  it('marks the selected path as pressed', async () => {
    render(<GoldenPaths />);

    const button = screen.getByRole('button', { name: 'Use Terraform module' });
    await userEvent.click(button);

    expect(button).toHaveAttribute('aria-pressed', 'true');
  });

  it('explains an invalid name and hides the command', async () => {
    render(<GoldenPaths />);

    await userEvent.type(nameInput(), 'Bad Name');

    expect(nameInput()).toHaveAttribute('aria-invalid', 'true');
    expect(nameInput()).toHaveAccessibleDescription(
      'Use lowercase letters, digits and single dashes, starting with a letter.',
    );
    expect(screen.queryByText(/pnpm nx g/)).not.toBeInTheDocument();
  });

  it('copies the command to the clipboard and confirms it', async () => {
    const user = userEvent.setup();
    const writeText = rs.fn(() => Promise.resolve());
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    render(<GoldenPaths />);

    await user.type(nameInput(), 'incidents');
    await user.click(screen.getByRole('button', { name: 'Copy command' }));

    expect(writeText).toHaveBeenCalledWith('pnpm nx g @portal/plugin:remote --name=incidents');
    expect(await screen.findByRole('button', { name: 'Copied' })).toBeInTheDocument();
  });
});
