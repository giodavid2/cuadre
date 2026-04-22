import { useState, type FormEvent } from 'react';
import { Button } from '@/components/atoms/Button/Button';
import { FormField } from '@/components/molecules/FormField/FormField';
import { useExpenses } from '@/hooks/useExpenses';
import styles from './ExpenseForm.module.scss';

interface FormValues {
  name: string;
  amount: string;
  dayOfMonth: string;
}

interface FormErrors {
  name?: string;
  amount?: string;
  dayOfMonth?: string;
}

const INITIAL_VALUES: FormValues = { name: '', amount: '', dayOfMonth: '' };

function formatCopInput(raw: string): { display: string; digits: string } {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return { display: '', digits: '' };
  const display = parseInt(digits, 10).toLocaleString('es-CO');
  return { display, digits };
}

export function ExpenseForm() {
  const { addExpense } = useExpenses();
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [displayAmount, setDisplayAmount] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  function validate(vals: FormValues): FormErrors {
    const errs: FormErrors = {};
    if (!vals.name.trim()) errs.name = 'El nombre es requerido';
    const amount = Number(vals.amount);
    if (!vals.amount || isNaN(amount) || amount <= 0) errs.amount = 'Ingresa un monto válido mayor a 0';
    const day = Number(vals.dayOfMonth);
    if (!vals.dayOfMonth || isNaN(day) || day < 1 || day > 31) errs.dayOfMonth = 'Ingresa un día entre 1 y 31';
    return errs;
  }

  function handleChange(field: keyof FormValues) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues(prev => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
    };
  }

  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { display, digits } = formatCopInput(e.target.value);
    setDisplayAmount(display);
    setValues(prev => ({ ...prev, amount: digits }));
    if (errors.amount) setErrors(prev => ({ ...prev, amount: undefined }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate(values);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    addExpense({
      name: values.name.trim(),
      amount: Number(values.amount),
      dayOfMonth: Number(values.dayOfMonth),
    });
    setValues(INITIAL_VALUES);
    setDisplayAmount('');
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <h2 className={styles.title}>Registrar gasto recurrente</h2>
      <div className={styles.grid}>
        <FormField
          id="expense-name"
          label="Nombre del gasto"
          placeholder="Ej: Netflix, Arriendo..."
          value={values.name}
          onChange={handleChange('name')}
          error={errors.name}
          required
        />
        <FormField
          id="expense-amount"
          label="Monto (COP)"
          type="text"
          inputMode="numeric"
          placeholder="Ej: 50.000"
          value={displayAmount}
          onChange={handleAmountChange}
          error={errors.amount}
          required
        />
        <FormField
          id="expense-day"
          label="Día del mes"
          type="number"
          placeholder="Ej: 15"
          min={1}
          max={31}
          value={values.dayOfMonth}
          onChange={handleChange('dayOfMonth')}
          error={errors.dayOfMonth}
          required
        />
      </div>
      <div className={styles.footer}>
        <Button type="submit">Agregar gasto</Button>
      </div>
    </form>
  );
}
