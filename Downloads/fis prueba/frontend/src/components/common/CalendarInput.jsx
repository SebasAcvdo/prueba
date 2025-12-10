import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { TbCalendar } from 'react-icons/tb';
import 'react-day-picker/dist/style.css';
import styles from './CalendarInput.module.css';

export const CalendarInput = ({
  label,
  value,
  onChange,
  error,
  required = false,
  placeholder = 'Seleccionar fecha',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (date) => {
    onChange(date);
    setIsOpen(false);
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className={styles.formGroup}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}

      <div className={styles.container}>
        <button
          type="button"
          className={`${styles.input} ${error ? styles.error : ''}`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
        >
          <span className={value ? '' : styles.placeholder}>
            {value ? formatDate(value) : placeholder}
          </span>
          <TbCalendar size={18} />
        </button>

        {isOpen && (
          <div className={styles.dropdown}>
            <DayPicker
              mode="single"
              selected={value}
              onSelect={handleSelect}
              locale="es"
            />
          </div>
        )}
      </div>

      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};
