import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExpensesProvider } from './ExpensesContext';
import { useExpenses } from '@/hooks/useExpenses';
import { saveStorage } from '@/utils/storage';

// Componente auxiliar para consumir el contexto en tests
function Fixture() {
  const { expenses, checkState, cutoffDay, addExpense, removeExpense, toggleCheck, setCutoffDay } =
    useExpenses();
  return (
    <div>
      <span data-testid="count">{expenses.length}</span>
      <span data-testid="cutoff">{cutoffDay ?? 'none'}</span>
      <span data-testid="checked">{Object.values(checkState).filter(Boolean).length}</span>
      <button onClick={() => addExpense({ name: 'Netflix', amount: 20000, dayOfMonth: 15 })}>
        add
      </button>
      {expenses.map(e => (
        <button key={e.id} onClick={() => removeExpense(e.id)}>
          remove-{e.id}
        </button>
      ))}
      {expenses.map(e => (
        <button key={`t-${e.id}`} onClick={() => toggleCheck(e.id)}>
          toggle-{e.id}
        </button>
      ))}
      <button onClick={() => setCutoffDay(24)}>set-cutoff</button>
    </div>
  );
}

function setup(initialState?: Parameters<typeof saveStorage>[0]) {
  if (initialState) saveStorage(initialState);
  render(
    <ExpensesProvider>
      <Fixture />
    </ExpensesProvider>,
  );
}

describe('ExpensesProvider — acciones CRUD', () => {
  it('comienza con el estado vacío cuando localStorage está limpio', () => {
    setup();
    expect(screen.getByTestId('count')).toHaveTextContent('0');
  });

  it('addExpense incrementa la lista', async () => {
    const user = userEvent.setup();
    setup();
    await user.click(screen.getByText('add'));
    expect(screen.getByTestId('count')).toHaveTextContent('1');
  });

  it('removeExpense elimina el gasto y limpia su checkState', async () => {
    const user = userEvent.setup();
    setup();
    await user.click(screen.getByText('add'));
    const removeBtn = screen.getByRole('button', { name: /remove-/ });
    await user.click(removeBtn);
    expect(screen.getByTestId('count')).toHaveTextContent('0');
  });

  it('toggleCheck activa y desactiva el check de un gasto', async () => {
    const user = userEvent.setup();
    setup();
    await user.click(screen.getByText('add'));
    const toggleBtn = screen.getByRole('button', { name: /toggle-/ });
    await user.click(toggleBtn);
    expect(screen.getByTestId('checked')).toHaveTextContent('1');
    await user.click(toggleBtn);
    expect(screen.getByTestId('checked')).toHaveTextContent('0');
  });

  it('setCutoffDay guarda el día de corte', async () => {
    const user = userEvent.setup();
    setup();
    await user.click(screen.getByText('set-cutoff'));
    expect(screen.getByTestId('cutoff')).toHaveTextContent('24');
  });

  it('carga los gastos existentes desde localStorage al montar', () => {
    setup({
      expenses: [{ id: 'x1', name: 'Spotify', amount: 15000, dayOfMonth: 5 }],
      checkState: {},
      cutoffDay: null,
      lastResetDate: null,
    });
    expect(screen.getByTestId('count')).toHaveTextContent('1');
  });
});

describe('ExpensesProvider — auto-reset de checks por fecha de corte', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-22'));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('limpia los checks cuando lastResetDate es null y ya pasó el corte', () => {
    setup({
      expenses: [{ id: 'e1', name: 'Test', amount: 1000, dayOfMonth: 1 }],
      checkState: { e1: true },
      cutoffDay: 15,
      lastResetDate: null,
    });
    expect(screen.getByTestId('checked')).toHaveTextContent('0');
  });

  it('limpia los checks cuando lastResetDate es anterior al último corte', () => {
    setup({
      expenses: [{ id: 'e1', name: 'Test', amount: 1000, dayOfMonth: 1 }],
      checkState: { e1: true },
      cutoffDay: 15,
      lastResetDate: '2026-03-15',
    });
    expect(screen.getByTestId('checked')).toHaveTextContent('0');
  });

  it('NO limpia los checks cuando lastResetDate coincide con el último corte', () => {
    setup({
      expenses: [{ id: 'e1', name: 'Test', amount: 1000, dayOfMonth: 1 }],
      checkState: { e1: true },
      cutoffDay: 15,
      lastResetDate: '2026-04-15',
    });
    expect(screen.getByTestId('checked')).toHaveTextContent('1');
  });

  it('NO hace nada cuando cutoffDay es null', () => {
    setup({
      expenses: [{ id: 'e1', name: 'Test', amount: 1000, dayOfMonth: 1 }],
      checkState: { e1: true },
      cutoffDay: null,
      lastResetDate: null,
    });
    expect(screen.getByTestId('checked')).toHaveTextContent('1');
  });

  it('NO resetea cuando shouldReset es true pero checkState está vacío', () => {
    // No debe llamar a updateStorage innecesariamente
    setup({
      expenses: [{ id: 'e1', name: 'Test', amount: 1000, dayOfMonth: 1 }],
      checkState: {},
      cutoffDay: 15,
      lastResetDate: null,
    });
    expect(screen.getByTestId('checked')).toHaveTextContent('0');
  });
});

describe('useExpenses fuera del provider', () => {
  it('lanza un error si se usa fuera del provider', () => {
    // Silenciamos el error de consola esperado
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Fixture />)).toThrow();
    consoleSpy.mockRestore();
  });
});
