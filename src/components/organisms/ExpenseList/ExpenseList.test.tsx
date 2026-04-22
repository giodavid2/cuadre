import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExpenseList } from './ExpenseList';
import { renderWithProviders } from '@/test/renderWithProviders';
import type { RecurringExpense } from '@/types/expense';

const expenses: RecurringExpense[] = [
  { id: 'e1', name: 'Netflix', amount: 20000, dayOfMonth: 15 },
  { id: 'e2', name: 'Spotify', amount: 15000, dayOfMonth: 5 },
];

describe('ExpenseList', () => {
  it('muestra el estado vacío cuando no hay gastos', () => {
    renderWithProviders(<ExpenseList />);
    expect(screen.getByText(/no tienes gastos registrados/i)).toBeInTheDocument();
  });

  it('muestra el conteo de gastos', () => {
    renderWithProviders(<ExpenseList />, { initialState: { expenses } });
    expect(screen.getByText('2 gastos')).toBeInTheDocument();
  });

  it('muestra "1 gasto" en singular', () => {
    renderWithProviders(<ExpenseList />, { initialState: { expenses: [expenses[0]] } });
    expect(screen.getByText('1 gasto')).toBeInTheDocument();
  });

  it('renderiza el nombre de cada gasto', () => {
    renderWithProviders(<ExpenseList />, { initialState: { expenses } });
    expect(screen.getByText('Netflix')).toBeInTheDocument();
    expect(screen.getByText('Spotify')).toBeInTheDocument();
  });

  it('elimina un gasto al hacer clic en Eliminar', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ExpenseList />, { initialState: { expenses } });
    const btns = screen.getAllByRole('button', { name: /eliminar/i });
    await user.click(btns[0]);
    expect(screen.getByText('1 gasto')).toBeInTheDocument();
  });
});
