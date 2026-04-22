import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';

describe('Input', () => {
  it('renderiza un elemento input', () => {
    render(<Input />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('muestra el mensaje de error cuando se pasa la prop error', () => {
    render(<Input error="Campo requerido" />);
    expect(screen.getByText('Campo requerido')).toBeInTheDocument();
  });

  it('no muestra mensaje de error cuando no se pasa la prop', () => {
    render(<Input placeholder="Escribe aquí" />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('acepta y refleja el valor controlado', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Input value="hola" onChange={onChange} />);
    expect(screen.getByRole('textbox')).toHaveValue('hola');
  });

  it('llama a onChange al escribir', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Input onChange={onChange} />);
    await user.type(screen.getByRole('textbox'), 'test');
    expect(onChange).toHaveBeenCalled();
  });

  it('aplica className adicional al input', () => {
    render(<Input className="mi-clase" />);
    expect(screen.getByRole('textbox').className).toContain('mi-clase');
  });

  it('pasa el placeholder al input nativo', () => {
    render(<Input placeholder="Ej: 50.000" />);
    expect(screen.getByPlaceholderText('Ej: 50.000')).toBeInTheDocument();
  });
});
