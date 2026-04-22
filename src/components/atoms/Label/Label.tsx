import type { LabelHTMLAttributes } from 'react';
import styles from './Label.module.scss';

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export function Label({ required, className = '', children, ...props }: LabelProps) {
  const classes = [
    styles.label,
    required ? styles['label--required'] : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <label className={classes} {...props}>
      {children}
    </label>
  );
}
