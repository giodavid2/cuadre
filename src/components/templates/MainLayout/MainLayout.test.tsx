import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ExpensesProvider } from '@/context/ExpensesContext';
import { MainLayout } from './MainLayout';

function setup(initialPath = '/') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <ExpensesProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<div>Página inicio</div>} />
            <Route path="/checklist" element={<div>Página checklist</div>} />
          </Route>
        </Routes>
      </ExpensesProvider>
    </MemoryRouter>,
  );
}

describe('MainLayout', () => {
  it('muestra el logo/brand "Cuadre"', () => {
    setup();
    expect(screen.getByText('Cuadre')).toBeInTheDocument();
  });

  it('muestra los dos enlaces de navegación', () => {
    setup();
    expect(screen.getByRole('link', { name: /mis gastos/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /checklist/i })).toBeInTheDocument();
  });

  it('renderiza el contenido de la ruta actual (Outlet)', () => {
    setup('/');
    expect(screen.getByText('Página inicio')).toBeInTheDocument();
  });

  it('renderiza el contenido de la ruta /checklist', () => {
    setup('/checklist');
    expect(screen.getByText('Página checklist')).toBeInTheDocument();
  });

  it('el enlace activo tiene la clase --active', () => {
    setup('/');
    const link = screen.getByRole('link', { name: /mis gastos/i });
    expect(link.className).toContain('active');
  });
});
