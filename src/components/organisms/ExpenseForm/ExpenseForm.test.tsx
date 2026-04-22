import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExpenseForm } from './ExpenseForm';
import { renderWithProviders } from '@/test/renderWithProviders';

describe('ExpenseForm — renderizado', () => {
  it('muestra los tres campos del formulario', () => {
    renderWithProviders(<ExpenseForm />);
    expect(screen.getByLabelText(/nombre del gasto/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/monto/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/día del mes/i)).toBeInTheDocument();
  });

  it('muestra el botón de envío', () => {
    renderWithProviders(<ExpenseForm />);
    expect(screen.getByRole('button', { name: /agregar gasto/i })).toBeInTheDocument();
  });
});

describe('ExpenseForm — validación', () => {
  it('muestra error si se envía el formulario vacío', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ExpenseForm />);
    await user.click(screen.getByRole('button', { name: /agregar gasto/i }));
    expect(screen.getByText(/nombre es requerido/i)).toBeInTheDocument();
    expect(screen.getByText(/monto válido/i)).toBeInTheDocument();
    expect(screen.getByText(/día entre 1 y 31/i)).toBeInTheDocument();
  });

  it('muestra error si el monto es 0', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ExpenseForm />);
    await user.type(screen.getByLabelText(/nombre/i), 'Netflix');
    // El campo monto queda vacío → error de monto
    await user.click(screen.getByRole('button', { name: /agregar gasto/i }));
    expect(screen.getByText(/monto válido/i)).toBeInTheDocument();
  });

  it('muestra error si el día es mayor a 31', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ExpenseForm />);
    await user.type(screen.getByLabelText(/nombre/i), 'Test');
    await user.type(screen.getByLabelText(/monto/i), '10000');
    await user.type(screen.getByLabelText(/día/i), '32');
    await user.click(screen.getByRole('button', { name: /agregar gasto/i }));
    expect(screen.getByText(/día entre 1 y 31/i)).toBeInTheDocument();
  });

  it('muestra error si el día es 0', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ExpenseForm />);
    await user.type(screen.getByLabelText(/nombre/i), 'Test');
    await user.type(screen.getByLabelText(/monto/i), '10000');
    await user.type(screen.getByLabelText(/día/i), '0');
    await user.click(screen.getByRole('button', { name: /agregar gasto/i }));
    expect(screen.getByText(/día entre 1 y 31/i)).toBeInTheDocument();
  });
});

describe('ExpenseForm — formateo de monto en COP', () => {
  it('devuelve vacío cuando el usuario escribe solo letras', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ExpenseForm />);
    const input = screen.getByLabelText(/monto/i);
    await user.type(input, 'abc');
    expect(input).toHaveValue('');
  });

  it('agrega puntos de miles al escribir 4 dígitos', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ExpenseForm />);
    const input = screen.getByLabelText(/monto/i);
    await user.type(input, '5000');
    expect(input).toHaveValue('5.000');
  });

  it('agrega puntos de miles al escribir 6 dígitos', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ExpenseForm />);
    const input = screen.getByLabelText(/monto/i);
    await user.type(input, '500000');
    expect(input).toHaveValue('500.000');
  });

  it('ignora caracteres no numéricos al escribir', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ExpenseForm />);
    const input = screen.getByLabelText(/monto/i);
    await user.type(input, '1abc2');
    expect(input).toHaveValue('12');
  });

  it('limpia el error de monto al empezar a escribir', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ExpenseForm />);
    // Primero disparar el error
    await user.click(screen.getByRole('button', { name: /agregar gasto/i }));
    expect(screen.getByText(/monto válido/i)).toBeInTheDocument();
    // Luego escribir en el campo
    await user.type(screen.getByLabelText(/monto/i), '1');
    expect(screen.queryByText(/monto válido/i)).not.toBeInTheDocument();
  });
});

describe('ExpenseForm — envío exitoso', () => {
  it('limpia el formulario después de un envío válido', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ExpenseForm />);
    await user.type(screen.getByLabelText(/nombre/i), 'Spotify');
    await user.type(screen.getByLabelText(/monto/i), '15000');
    await user.type(screen.getByLabelText(/día/i), '5');
    await user.click(screen.getByRole('button', { name: /agregar gasto/i }));
    expect(screen.getByLabelText(/nombre/i)).toHaveValue('');
    expect(screen.getByLabelText(/monto/i)).toHaveValue('');
    expect(screen.getByLabelText(/día/i)).toHaveValue(null);
  });

  it('limpia el error del campo name al escribir', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ExpenseForm />);
    await user.click(screen.getByRole('button', { name: /agregar gasto/i }));
    expect(screen.getByText(/nombre es requerido/i)).toBeInTheDocument();
    await user.type(screen.getByLabelText(/nombre/i), 'A');
    expect(screen.queryByText(/nombre es requerido/i)).not.toBeInTheDocument();
  });

  it('limpia el error del día al escribir', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ExpenseForm />);
    await user.click(screen.getByRole('button', { name: /agregar gasto/i }));
    expect(screen.getByText(/día entre 1 y 31/i)).toBeInTheDocument();
    await user.type(screen.getByLabelText(/día/i), '1');
    expect(screen.queryByText(/día entre 1 y 31/i)).not.toBeInTheDocument();
  });
});
