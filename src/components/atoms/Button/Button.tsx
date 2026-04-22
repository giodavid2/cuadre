import type { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.scss';

type Variant = 'primary' | 'danger' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }: ButtonProps) {
  const classes = [
    styles.button,
    styles[`button--${variant}`],
    size !== 'md' ? styles[`button--${size}`] : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
