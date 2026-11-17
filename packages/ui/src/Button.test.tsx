import { describe, expect, it, rs } from '@rstest/core';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('is exposed as a button with its label as accessible name', () => {
    render(<Button>Retry</Button>);

    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const onClick = rs.fn();
    render(<Button onClick={onClick}>Retry</Button>);

    await userEvent.click(screen.getByRole('button', { name: 'Retry' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('defaults to type="button" so it never submits a form by accident', () => {
    render(<Button>Retry</Button>);

    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });
});
