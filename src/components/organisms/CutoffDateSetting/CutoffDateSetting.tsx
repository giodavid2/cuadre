import { useState, type FormEvent } from 'react';
import { Button } from '@/components/atoms/Button/Button';
import { FormField } from '@/components/molecules/FormField/FormField';
import { useExpenses } from '@/hooks/useExpenses';
import styles from './CutoffDateSetting.module.scss';

export function CutoffDateSetting() {
  const { cutoffDay, setCutoffDay } = useExpenses();
  const [value, setValue] = useState(cutoffDay?.toString() ?? '');
  const [error, setError] = useState<string>();
  const [saved, setSaved] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const day = Number(value);
    if (!value || isNaN(day) || day < 1 || day > 31) {
      setError('Ingresa un día válido entre 1 y 31');
      return;
    }
    setCutoffDay(day);
    setError(undefined);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Fecha de corte de tarjeta</h3>
        <p className={styles.description}>
          El día que configures aquí, al llegar ese día del mes, los checks del listado se reiniciarán
          automáticamente para empezar el nuevo ciclo de facturación.
        </p>
      </div>
      {cutoffDay && (
        <span className={styles.currentInfo}>
          Corte actual: día {cutoffDay} de cada mes
        </span>
      )}
      <form onSubmit={handleSubmit} noValidate>
        <div className={styles.row}>
          <div className={styles.fieldWrapper}>
            <FormField
              id="cutoff-day"
              label="Día de corte"
              type="number"
              placeholder="Ej: 24"
              min={1}
              max={31}
              value={value}
              onChange={e => {
                setValue(e.target.value);
                if (error) setError(undefined);
              }}
              error={error}
              required
            />
          </div>
          <Button type="submit" variant={saved ? 'ghost' : 'primary'}>
            {saved ? '¡Guardado!' : 'Guardar'}
          </Button>
        </div>
      </form>
    </div>
  );
}
