import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { RegisterPage } from './RegisterPage';
import { renderWithProviders } from '@/test/renderWithProviders';

describe('RegisterPage', () => {
  it('muestra el título principal de la página', () => {
    renderWithProviders(<RegisterPage />);
    expect(screen.getByRole('heading', { name: /mis gastos/i, level: 1 })).toBeInTheDocument();
  });

  it('muestra el subtítulo descriptivo', () => {
    renderWithProviders(<RegisterPage />);
    expect(screen.getByText(/registra tus gastos recurrentes/i)).toBeInTheDocument();
  });

  it('incluye el formulario de registro de gastos', () => {
    renderWithProviders(<RegisterPage />);
    expect(screen.getByRole('button', { name: /agregar gasto/i })).toBeInTheDocument();
  });

  it('incluye el configurador de fecha de corte', () => {
    renderWithProviders(<RegisterPage />);
    expect(screen.getByRole('button', { name: /guardar/i })).toBeInTheDocument();
  });

  it('incluye el listado de gastos (estado vacío visible)', () => {
    renderWithProviders(<RegisterPage />);
    expect(screen.getByRole('heading', { name: /gastos registrados/i })).toBeInTheDocument();
  });
});
