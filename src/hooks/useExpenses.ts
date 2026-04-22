import { useContext } from 'react';
import { ExpensesContext } from '@/context/ExpensesContext';

export function useExpenses() {
  const ctx = useContext(ExpensesContext);
  if (!ctx) throw new Error('useExpenses debe usarse dentro de ExpensesProvider');
  return ctx;
}
