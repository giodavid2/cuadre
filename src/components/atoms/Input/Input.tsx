import type { InputHTMLAttributes } from 'react';
import styles from './Input.module.scss';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export function Input({ error, className = '', ...props }: InputProps) {
  const inputClass = [
    styles.input,
    error ? styles['input--error'] : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={styles.wrapper}>
      <input className={inputClass} {...props} />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
