import type { ChangeEvent } from 'react';
import styles from './Checkbox.module.scss';

interface CheckboxProps {
  id: string;
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}

export function Checkbox({ id, checked, label, onChange }: CheckboxProps) {
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    onChange(e.target.checked);
  }

  return (
    <label className={styles.wrapper} htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        className={styles.input}
        checked={checked}
        onChange={handleChange}
      />
      <span className={[styles.box, checked ? styles['box--checked'] : ''].filter(Boolean).join(' ')}>
        {checked && <span className={styles.checkmark} />}
      </span>
      <span className={[styles.label, checked ? styles['label--checked'] : ''].filter(Boolean).join(' ')}>
        {label}
      </span>
    </label>
  );
}
