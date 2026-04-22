import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChecklistPanel } from './ChecklistPanel';
import { renderWithProviders } from '@/test/renderWithProviders';
import type { RecurringExpense } from '@/types/expense';

const expenses: RecurringExpense[] = [
  { id: 'e1', name: 'Netflix', amount: 20000, dayOfMonth: 15 },
  { id: 'e2', name: 'Spotify', amount: 15000, dayOfMonth: 5 },
];

describe('ChecklistPanel', () => {
  it('muestra el estado vacío cuando no hay gastos', () => {
    renderWithProviders(<ChecklistPanel />);
    expect(screen.getByText(/no hay gastos registrados/i)).toBeInTheDocument();
  });

  it('muestra un encabezado de nivel 1 para el panel', () => {
    renderWithProviders(<ChecklistPanel />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('muestra el día de corte cuando está configurado', () => {
    renderWithProviders(<ChecklistPanel />, {
      initialState: { expenses, cutoffDay: 24 },
    });
    expect(screen.getByText(/corte.*día 24/i)).toBeInTheDocument();
  });

  it('no muestra el texto de corte si cutoffDay es null', () => {
    renderWithProviders(<ChecklistPanel />, { initialState: { expenses } });
    expect(screen.queryByText(/corte/i)).not.toBeInTheDocument();
  });

  it('renderiza todos los ítems del checklist', () => {
    renderWithProviders(<ChecklistPanel />, { initialState: { expenses } });
    expect(screen.getByText(/Netflix/)).toBeInTheDocument();
    expect(screen.getByText(/Spotify/)).toBeInTheDocument();
  });

  it('muestra el progreso "0 de 2 pagados" cuando ninguno está chequeado', () => {
    renderWithProviders(<ChecklistPanel />, { initialState: { expenses } });
    expect(screen.getByText('0 de 2 pagados')).toBeInTheDocument();
  });

  it('actualiza el progreso al marcar un ítem', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ChecklistPanel />, { initialState: { expenses } });
    const checkboxes = screen.getAllByRole('checkbox', { hidden: true });
    await user.click(checkboxes[0]);
    expect(screen.getByText('1 de 2 pagados')).toBeInTheDocument();
  });

  it('muestra la etiqueta "Total mensual" y el monto total', () => {
    renderWithProviders(<ChecklistPanel />, { initialState: { expenses } });
    expect(screen.getByText('Total mensual')).toBeInTheDocument();
    // Hay al menos un elemento mostrando el total (35.000)
    expect(screen.getAllByText(/35\.000/).length).toBeGreaterThanOrEqual(1);
  });

  it('muestra el monto pendiente cuando no todos están pagados', () => {
    renderWithProviders(<ChecklistPanel />, {
      initialState: { expenses, checkState: { e1: true } },
    });
    expect(screen.getByText(/pendiente/i)).toBeInTheDocument();
  });

  it('no muestra el monto pendiente cuando todos están pagados', () => {
    renderWithProviders(<ChecklistPanel />, {
      initialState: { expenses, checkState: { e1: true, e2: true } },
    });
    expect(screen.queryByText(/pendiente/i)).not.toBeInTheDocument();
  });

  it('ordena los ítems por día del mes de forma ascendente', () => {
    renderWithProviders(<ChecklistPanel />, { initialState: { expenses } });
    const items = screen.getAllByRole('checkbox', { hidden: true });
    // Spotify (día 5) debe aparecer antes que Netflix (día 15)
    expect(items[0].id).toBe('check-e2');
    expect(items[1].id).toBe('check-e1');
  });
});
