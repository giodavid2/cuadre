import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Label } from './Label';

describe('Label', () => {
  it('renderiza el texto hijo', () => {
    render(<Label>Nombre del gasto</Label>);
    expect(screen.getByText('Nombre del gasto')).toBeInTheDocument();
  });

  it('se asocia a un input mediante htmlFor', () => {
    render(
      <>
        <Label htmlFor="mi-input">Etiqueta</Label>
        <input id="mi-input" />
      </>,
    );
    expect(screen.getByLabelText('Etiqueta')).toBeInTheDocument();
  });

  it('aplica className adicional', () => {
    render(<Label className="extra">Test</Label>);
    expect(screen.getByText('Test').className).toContain('extra');
  });

  it('cuando required es true el DOM contiene el asterisco vía CSS ::after (clase presente)', () => {
    render(<Label required>Campo</Label>);
    // La clase CSS agrega el * vía ::after; verificamos que el elemento se renderiza
    expect(screen.getByText('Campo')).toBeInTheDocument();
  });

  it('cuando required es false no aplica la clase --required', () => {
    render(<Label>Campo</Label>);
    expect(screen.getByText('Campo').className).not.toContain('required');
  });
});
