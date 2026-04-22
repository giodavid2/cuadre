import { CutoffDateSetting } from '@/components/organisms/CutoffDateSetting/CutoffDateSetting';
import { ExpenseForm } from '@/components/organisms/ExpenseForm/ExpenseForm';
import { ExpenseList } from '@/components/organisms/ExpenseList/ExpenseList';
import styles from './RegisterPage.module.scss';

export function RegisterPage() {
  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Mis gastos</h1>
        <p className={styles.pageSubtitle}>Registra tus gastos recurrentes y configura tu fecha de corte.</p>
      </header>
      <CutoffDateSetting />
      <ExpenseForm />
      <ExpenseList />
    </div>
  );
}
