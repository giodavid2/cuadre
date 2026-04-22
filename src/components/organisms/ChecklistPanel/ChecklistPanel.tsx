import { ChecklistItem } from '@/components/molecules/ChecklistItem/ChecklistItem';
import { useExpenses } from '@/hooks/useExpenses';
import { formatCurrency, getCurrentMonthLabel } from '@/utils/dateUtils';
import styles from './ChecklistPanel.module.scss';

export function ChecklistPanel() {
  const { expenses, checkState, toggleCheck, cutoffDay } = useExpenses();

  const checkedCount = expenses.filter(e => checkState[e.id]).length;
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const paid = expenses.filter(e => checkState[e.id]).reduce((sum, e) => sum + e.amount, 0);
  const pending = total - paid;
  const progressPct = expenses.length > 0 ? Math.round((checkedCount / expenses.length) * 100) : 0;

  const sorted = [...expenses].sort((a, b) => a.dayOfMonth - b.dayOfMonth);

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.titles}>
          <h1 className={styles.title}>{getCurrentMonthLabel()}</h1>
          {cutoffDay && (
            <span className={styles.subtitle}>Fecha de corte: día {cutoffDay}</span>
          )}
        </div>
        {expenses.length > 0 && (
          <div className={styles.progress}>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${progressPct}%` }} />
            </div>
            <span className={styles.progressLabel}>{checkedCount} de {expenses.length} pagados</span>
          </div>
        )}
      </div>

      {expenses.length === 0 ? (
        <div className={styles.empty}>
          No hay gastos registrados. Ve a la sección "Gastos" para agregar tus gastos recurrentes.
        </div>
      ) : (
        <>
          <ul className={styles.list}>
            {sorted.map(expense => (
              <li key={expense.id}>
                <ChecklistItem
                  expense={expense}
                  checked={!!checkState[expense.id]}
                  onToggle={toggleCheck}
                />
              </li>
            ))}
          </ul>
          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>Total mensual</span>
            <div style={{ textAlign: 'right' }}>
              <div className={styles.totalAmount}>{formatCurrency(total)}</div>
              {pending > 0 && (
                <div className={styles.totalPending}>Pendiente: {formatCurrency(pending)}</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
