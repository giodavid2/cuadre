import { describe, it, expect, vi } from 'vitest';
import { screen, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CutoffDateSetting } from './CutoffDateSetting';
import { renderWithProviders } from '@/test/renderWithProviders';

describe('CutoffDateSetting — renderizado', () => {
  it('muestra el formulario de configuración', () => {
    renderWithProviders(<CutoffDateSetting />);
    expect(screen.getByLabelText(/día de corte/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /guardar/i })).toBeInTheDocument();
  });

  it('no muestra el texto "Corte actual" cuando no hay cutoffDay configurado', () => {
    renderWithProviders(<CutoffDateSetting />);
    expect(screen.queryByText(/corte actual/i)).not.toBeInTheDocument();
  });

  it('muestra el texto "Corte actual" cuando hay cutoffDay configurado', () => {
    renderWithProviders(<CutoffDateSetting />, {
      initialState: { cutoffDay: 24, lastResetDate: '2026-04-24' },
    });
    expect(screen.getByText(/corte actual: día 24/i)).toBeInTheDocument();
  });
});

describe('CutoffDateSetting — validación', () => {
  it('muestra error si se envía sin valor', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CutoffDateSetting />);
    await user.click(screen.getByRole('button', { name: /guardar/i }));
    expect(screen.getByText(/día válido entre 1 y 31/i)).toBeInTheDocument();
  });

  it('muestra error si el día es 0', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CutoffDateSetting />);
    await user.type(screen.getByLabelText(/día de corte/i), '0');
    await user.click(screen.getByRole('button', { name: /guardar/i }));
    expect(screen.getByText(/día válido entre 1 y 31/i)).toBeInTheDocument();
  });

  it('muestra error si el día es 32', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CutoffDateSetting />);
    await user.type(screen.getByLabelText(/día de corte/i), '32');
    await user.click(screen.getByRole('button', { name: /guardar/i }));
    expect(screen.getByText(/día válido entre 1 y 31/i)).toBeInTheDocument();
  });

  it('limpia el error al escribir después de un intento fallido', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CutoffDateSetting />);
    await user.click(screen.getByRole('button', { name: /guardar/i }));
    expect(screen.getByText(/día válido entre 1 y 31/i)).toBeInTheDocument();
    await user.type(screen.getByLabelText(/día de corte/i), '1');
    expect(screen.queryByText(/día válido/i)).not.toBeInTheDocument();
  });
});

describe('CutoffDateSetting — guardado', () => {
  it('muestra "¡Guardado!" tras guardar correctamente', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CutoffDateSetting />);
    await user.type(screen.getByLabelText(/día de corte/i), '24');
    await user.click(screen.getByRole('button', { name: /guardar/i }));
    expect(screen.getByRole('button', { name: /guardado/i })).toBeInTheDocument();
  });

  it('vuelve a mostrar "Guardar" después de 2 segundos', () => {
    vi.useFakeTimers();
    renderWithProviders(<CutoffDateSetting />);

    // fireEvent es síncrono: evita el problema de userEvent con fake timers
    fireEvent.change(screen.getByLabelText(/día de corte/i), { target: { value: '24' } });
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /guardar/i }));
    });

    expect(screen.getByRole('button', { name: /guardado/i })).toBeInTheDocument();

    act(() => { vi.advanceTimersByTime(2100); });

    expect(screen.getByRole('button', { name: /^guardar$/i })).toBeInTheDocument();
    vi.useRealTimers();
  });
});
