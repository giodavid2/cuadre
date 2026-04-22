import type { InputHTMLAttributes } from 'react';
import { Input } from '@/components/atoms/Input/Input';
import { Label } from '@/components/atoms/Label/Label';
import styles from './FormField.module.scss';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
}

export function FormField({ id, label, error, required, ...inputProps }: FormFieldProps) {
  return (
    <div className={styles.field}>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <Input id={id} error={error} required={required} {...inputProps} />
    </div>
  );
}
