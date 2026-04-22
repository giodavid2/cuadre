import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('renderiza el texto de la etiqueta', () => {
    render(<Checkbox id="c1" checked={false} label="Netflix" onChange={vi.fn()} />);
    expect(screen.getByText('Netflix')).toBeInTheDocument();
  });

  it('el input subyacente refleja el estado checked', () => {
    render(<Checkbox id="c1" checked={true} label="Test" onChange={vi.fn()} />);
    expect(screen.getByRole('checkbox', { hidden: true })).toBeChecked();
  });

  it('el input subyacente refleja el estado unchecked', () => {
    render(<Checkbox id="c1" checked={false} label="Test" onChange={vi.fn()} />);
    expect(screen.getByRole('checkbox', { hidden: true })).not.toBeChecked();
  });

  it('llama a onChange con true al marcar', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Checkbox id="c1" checked={false} label="Test" onChange={onChange} />);
    await user.click(screen.getByText('Test'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('llama a onChange con false al desmarcar', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Checkbox id="c1" checked={true} label="Test" onChange={onChange} />);
    await user.click(screen.getByText('Test'));
    expect(onChange).toHaveBeenCalledWith(false);
  });
});
