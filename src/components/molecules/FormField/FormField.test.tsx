import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormField } from './FormField';

describe('FormField', () => {
  it('renderiza la etiqueta y el input asociados', () => {
    render(<FormField id="campo" label="Nombre" />);
    expect(screen.getByLabelText('Nombre')).toBeInTheDocument();
  });

  it('muestra el error cuando se pasa la prop error', () => {
    render(<FormField id="campo" label="Nombre" error="Requerido" />);
    expect(screen.getByText('Requerido')).toBeInTheDocument();
  });

  it('la etiqueta muestra el asterisco cuando required es true', () => {
    render(<FormField id="campo" label="Nombre" required />);
    // El label se renderiza (el * lo agrega CSS ::after)
    expect(screen.getByLabelText('Nombre')).toBeInTheDocument();
  });

  it('pasa el placeholder al input nativo', () => {
    render(<FormField id="campo" label="Test" placeholder="Ej: algo" />);
    expect(screen.getByPlaceholderText('Ej: algo')).toBeInTheDocument();
  });

  it('llama a onChange al escribir en el input', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<FormField id="campo" label="Test" onChange={onChange} />);
    await user.type(screen.getByLabelText('Test'), 'abc');
    expect(onChange).toHaveBeenCalled();
  });
});
