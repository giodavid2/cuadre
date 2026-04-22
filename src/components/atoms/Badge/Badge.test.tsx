import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renderiza el texto hijo', () => {
    render(<Badge>Día 15</Badge>);
    expect(screen.getByText('Día 15')).toBeInTheDocument();
  });

  it.each(['primary', 'success', 'warning', 'danger'] as const)(
    'renderiza con variante %s sin errores',
    (variant) => {
      render(<Badge variant={variant}>Label</Badge>);
      expect(screen.getByText('Label')).toBeInTheDocument();
    },
  );

  it('usa la variante primary por defecto', () => {
    render(<Badge>Default</Badge>);
    expect(screen.getByText('Default')).toBeInTheDocument();
  });
});
