import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChecklistItem } from './ChecklistItem';
import type { RecurringExpense } from '@/types/expense';

const expense: RecurringExpense = {
  id: 'e1',
  name: 'Spotify',
  amount: 15000,
  dayOfMonth: 5,
};

describe('ChecklistItem', () => {
  it('muestra el nombre y el día del mes en la etiqueta', () => {
    render(<ChecklistItem expense={expense} checked={false} onToggle={vi.fn()} />);
    expect(screen.getByText(/Spotify/)).toBeInTheDocument();
    expect(screen.getByText(/Día 5/)).toBeInTheDocument();
  });

  it('muestra el monto formateado', () => {
    render(<ChecklistItem expense={expense} checked={false} onToggle={vi.fn()} />);
    expect(screen.getByText(/15\.000/)).toBeInTheDocument();
  });

  it('el checkbox está marcado cuando checked es true', () => {
    render(<ChecklistItem expense={expense} checked={true} onToggle={vi.fn()} />);
    expect(screen.getByRole('checkbox', { hidden: true })).toBeChecked();
  });

  it('el checkbox está desmarcado cuando checked es false', () => {
    render(<ChecklistItem expense={expense} checked={false} onToggle={vi.fn()} />);
    expect(screen.getByRole('checkbox', { hidden: true })).not.toBeChecked();
  });

  it('llama a onToggle con el id al hacer clic en el checkbox', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(<ChecklistItem expense={expense} checked={false} onToggle={onToggle} />);
    await user.click(screen.getByText(/Spotify/));
    expect(onToggle).toHaveBeenCalledWith('e1');
  });
});
