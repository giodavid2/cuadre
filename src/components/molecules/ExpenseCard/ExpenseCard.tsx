import { Badge } from '@/components/atoms/Badge/Badge';
import { Button } from '@/components/atoms/Button/Button';
import type { RecurringExpense } from '@/types/expense';
import { formatCurrency } from '@/utils/dateUtils';
import styles from './ExpenseCard.module.scss';

interface ExpenseCardProps {
  expense: RecurringExpense;
  onDelete: (id: string) => void;
}

export function ExpenseCard({ expense, onDelete }: ExpenseCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.info}>
        <span className={styles.name}>{expense.name}</span>
        <div className={styles.meta}>
          <span className={styles.amount}>{formatCurrency(expense.amount)}</span>
          <Badge variant="primary">Día {expense.dayOfMonth}</Badge>
        </div>
      </div>
      <div className={styles.actions}>
        <Button
          variant="danger"
          size="sm"
          onClick={() => onDelete(expense.id)}
          aria-label={`Eliminar ${expense.name}`}
        >
          Eliminar
        </Button>
      </div>
    </div>
  );
}
