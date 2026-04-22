import { createContext, useCallback, useEffect, useState, type ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { AppStorage, CheckState, RecurringExpense } from '@/types/expense';
import { loadStorage, updateStorage } from '@/utils/storage';
import { getLastCutoffDate, toISODateString } from '@/utils/dateUtils';

interface ExpensesContextValue {
  expenses: RecurringExpense[];
  checkState: CheckState;
  cutoffDay: number | null;
  addExpense: (data: Omit<RecurringExpense, 'id'>) => void;
  removeExpense: (id: string) => void;
  toggleCheck: (id: string) => void;
  setCutoffDay: (day: number) => void;
}

export const ExpensesContext = createContext<ExpensesContextValue | null>(null);

export function ExpensesProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppStorage>(() => loadStorage());

  // Al montar, verifica si corresponde resetear los checks por fecha de corte
  useEffect(() => {
    const { cutoffDay, lastResetDate, checkState } = state;
    if (!cutoffDay) return;

    const lastCutoff = getLastCutoffDate(cutoffDay);
    const lastCutoffStr = toISODateString(lastCutoff);

    const shouldReset = !lastResetDate || lastResetDate < lastCutoffStr;
    if (shouldReset && Object.keys(checkState).length > 0) {
      const next = updateStorage({ checkState: {}, lastResetDate: lastCutoffStr });
      setState(next);
    }
  }, []);

  const addExpense = useCallback((data: Omit<RecurringExpense, 'id'>) => {
    setState(prev => {
      const expense: RecurringExpense = { ...data, id: uuidv4() };
      const next = updateStorage({ expenses: [...prev.expenses, expense] });
      return next;
    });
  }, []);

  const removeExpense = useCallback((id: string) => {
    setState(prev => {
      const expenses = prev.expenses.filter(e => e.id !== id);
      const checkState = { ...prev.checkState };
      delete checkState[id];
      const next = updateStorage({ expenses, checkState });
      return next;
    });
  }, []);

  const toggleCheck = useCallback((id: string) => {
    setState(prev => {
      const checkState = { ...prev.checkState, [id]: !prev.checkState[id] };
      const next = updateStorage({ checkState });
      return next;
    });
  }, []);

  const setCutoffDay = useCallback((day: number) => {
    const lastCutoff = getLastCutoffDate(day);
    const lastResetDate = toISODateString(lastCutoff);
    const next = updateStorage({ cutoffDay: day, lastResetDate });
    setState(next);
  }, []);

  return (
    <ExpensesContext.Provider
      value={{
        expenses: state.expenses,
        checkState: state.checkState,
        cutoffDay: state.cutoffDay,
        addExpense,
        removeExpense,
        toggleCheck,
        setCutoffDay,
      }}
    >
      {children}
    </ExpensesContext.Provider>
  );
}
