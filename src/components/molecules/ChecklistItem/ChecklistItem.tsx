import { Checkbox } from '@/components/atoms/Checkbox/Checkbox';
import type { RecurringExpense } from '@/types/expense';
import { formatCurrency } from '@/utils/dateUtils';
import styles from './ChecklistItem.module.scss';

interface ChecklistItemProps {
  expense: RecurringExpense;
  checked: boolean;
  onToggle: (id: string) => void;
}

export function ChecklistItem({ expense, checked, onToggle }: ChecklistItemProps) {
  const itemClass = [styles.item, checked ? styles['item--checked'] : ''].filter(Boolean).join(' ');
  const amountClass = [styles.amount, checked ? styles['amount--checked'] : ''].filter(Boolean).join(' ');

  return (
    <div className={itemClass}>
      <div className={styles.left}>
        <Checkbox
          id={`check-${expense.id}`}
          checked={checked}
          label={`${expense.name} — Día ${expense.dayOfMonth}`}
          onChange={() => onToggle(expense.id)}
        />
      </div>
      <span className={amountClass}>{formatCurrency(expense.amount)}</span>
    </div>
  );
}
