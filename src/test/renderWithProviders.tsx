import { render, type RenderOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { ReactElement } from 'react';
import { ExpensesProvider } from '@/context/ExpensesContext';
import type { AppStorage } from '@/types/expense';
import { saveStorage } from '@/utils/storage';

interface Options extends RenderOptions {
  initialState?: Partial<AppStorage>;
  withRouter?: boolean;
}

export function renderWithProviders(
  ui: ReactElement,
  { initialState, withRouter = false, ...options }: Options = {},
) {
  if (initialState) {
    saveStorage({
      expenses: [],
      checkState: {},
      cutoffDay: null,
      lastResetDate: null,
      ...initialState,
    });
  }

  function Wrapper({ children }: { children: React.ReactNode }) {
    const inner = <ExpensesProvider>{children}</ExpensesProvider>;
    return withRouter ? <MemoryRouter>{inner}</MemoryRouter> : inner;
  }

  return render(ui, { wrapper: Wrapper, ...options });
}
