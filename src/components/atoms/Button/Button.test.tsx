import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renderiza el texto hijo', () => {
    render(<Button>Guardar</Button>);
    expect(screen.getByRole('button', { name: 'Guardar' })).toBeInTheDocument();
  });

  it('llama a onClick al hacer clic', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Clic</Button>);
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('no dispara onClick cuando está deshabilitado', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick} disabled>Clic</Button>);
    await user.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('aplica el atributo disabled correctamente', () => {
    render(<Button disabled>Test</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('acepta className adicional', () => {
    render(<Button className="extra">Test</Button>);
    expect(screen.getByRole('button').className).toContain('extra');
  });

  it.each(['primary', 'danger', 'ghost'] as const)('renderiza con variante %s', (variant) => {
    render(<Button variant={variant}>Test</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it.each(['sm', 'md', 'lg'] as const)('renderiza con tamaño %s', (size) => {
    render(<Button size={size}>Test</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('acepta type=submit', () => {
    render(<Button type="submit">Enviar</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });
});
