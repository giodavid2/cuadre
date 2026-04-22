import { ExpenseCard } from '@/components/molecules/ExpenseCard/ExpenseCard';
import { useExpenses } from '@/hooks/useExpenses';
import styles from './ExpenseList.module.scss';

export function ExpenseList() {
  const { expenses, removeExpense } = useExpenses();

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Gastos registrados</h2>
        <span className={styles.count}>{expenses.length} gasto{expenses.length !== 1 ? 's' : ''}</span>
      </div>
      {expenses.length === 0 ? (
        <div className={styles.empty}>
          Aún no tienes gastos registrados. Agrega uno arriba.
        </div>
      ) : (
        <ul className={styles.list}>
          {expenses.map(expense => (
            <li key={expense.id}>
              <ExpenseCard expense={expense} onDelete={removeExpense} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
