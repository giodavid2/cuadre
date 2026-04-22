import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExpenseCard } from './ExpenseCard';
import type { RecurringExpense } from '@/types/expense';

const expense: RecurringExpense = {
  id: 'e1',
  name: 'Netflix',
  amount: 20000,
  dayOfMonth: 15,
};

describe('ExpenseCard', () => {
  it('muestra el nombre del gasto', () => {
    render(<ExpenseCard expense={expense} onDelete={vi.fn()} />);
    expect(screen.getByText('Netflix')).toBeInTheDocument();
  });

  it('muestra el monto formateado en COP', () => {
    render(<ExpenseCard expense={expense} onDelete={vi.fn()} />);
    expect(screen.getByText(/20\.000/)).toBeInTheDocument();
  });

  it('muestra el día del mes', () => {
    render(<ExpenseCard expense={expense} onDelete={vi.fn()} />);
    expect(screen.getByText('Día 15')).toBeInTheDocument();
  });

  it('llama a onDelete con el id correcto al hacer clic en Eliminar', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(<ExpenseCard expense={expense} onDelete={onDelete} />);
    await user.click(screen.getByRole('button', { name: /eliminar/i }));
    expect(onDelete).toHaveBeenCalledWith('e1');
  });
});
