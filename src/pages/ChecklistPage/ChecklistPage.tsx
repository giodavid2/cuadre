import { ChecklistPanel } from '@/components/organisms/ChecklistPanel/ChecklistPanel';
import styles from './ChecklistPage.module.scss';

export function ChecklistPage() {
  return (
    <div className={styles.page}>
      <ChecklistPanel />
    </div>
  );
}
