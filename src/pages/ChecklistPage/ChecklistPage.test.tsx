import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { ChecklistPage } from './ChecklistPage';
import { renderWithProviders } from '@/test/renderWithProviders';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-04-22'));
});
afterEach(() => {
  vi.useRealTimers();
});

describe('ChecklistPage', () => {
  it('renderiza el panel de checklist', () => {
    renderWithProviders(<ChecklistPage />);
    // El panel muestra el mes actual cuando está vacío o con datos
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('muestra el estado vacío cuando no hay gastos', () => {
    renderWithProviders(<ChecklistPage />);
    expect(screen.getByText(/no hay gastos registrados/i)).toBeInTheDocument();
  });

  it('muestra los gastos cuando existen', () => {
    renderWithProviders(<ChecklistPage />, {
      initialState: {
        expenses: [{ id: 'e1', name: 'Netflix', amount: 20000, dayOfMonth: 15 }],
      },
    });
    expect(screen.getByText(/Netflix/)).toBeInTheDocument();
  });
});
