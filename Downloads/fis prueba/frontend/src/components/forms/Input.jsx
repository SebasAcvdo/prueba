import { forwardRef } from 'react';
import styles from './Input.module.css';

export const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      required = false,
      type = 'text',
      ...props
    },
    ref
  ) => {
    return (
      <div className={styles.formGroup}>
        {label && (
          <label className={styles.label}>
            {label}
            {required && <span className={styles.required}>*</span>}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          className={`${styles.input} ${error ? styles.error : ''}`}
          {...props}
        />
        {error && <span className={styles.errorMessage}>{error}</span>}
        {helperText && !error && (
          <span className={styles.helperText}>{helperText}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
