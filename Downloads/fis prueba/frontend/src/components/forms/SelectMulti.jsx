import { useState, useRef, useEffect } from 'react';
import { TbChevronDown, TbX } from 'react-icons/tb';
import styles from './SelectMulti.module.css';

export const SelectMulti = ({
  label,
  options = [],
  value = [],
  onChange,
  error,
  required = false,
  placeholder = 'Seleccionar...',
  getOptionLabel = (opt) => opt.label,
  getOptionValue = (opt) => opt.value,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = (option) => {
    const optionValue = getOptionValue(option);
    const isSelected = value.some((v) => getOptionValue(v) === optionValue);

    if (isSelected) {
      onChange(value.filter((v) => getOptionValue(v) !== optionValue));
    } else {
      onChange([...value, option]);
    }
  };

  const handleRemove = (option) => {
    const optionValue = getOptionValue(option);
    onChange(value.filter((v) => getOptionValue(v) !== optionValue));
  };

  return (
    <div className={styles.formGroup}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}

      <div className={styles.container} ref={containerRef}>
        <button
          type="button"
          className={`${styles.selectButton} ${error ? styles.error : ''} ${
            isOpen ? styles.open : ''
          }`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={value.length === 0 ? styles.placeholder : ''}>
            {value.length === 0
              ? placeholder
              : `${value.length} seleccionado${value.length > 1 ? 's' : ''}`}
          </span>
          <TbChevronDown size={18} />
        </button>

        {isOpen && (
          <div className={styles.dropdown}>
            {options.map((option, idx) => {
              const optionValue = getOptionValue(option);
              const isSelected = value.some((v) => getOptionValue(v) === optionValue);

              return (
                <div
                  key={idx}
                  className={styles.option}
                  onClick={() => handleToggle(option)}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    className={styles.checkbox}
                  />
                  {getOptionLabel(option)}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {value.length > 0 && (
        <div className={styles.selectedTags}>
          {value.map((option, idx) => (
            <span key={idx} className={styles.tag}>
              {getOptionLabel(option)}
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => handleRemove(option)}
              >
                <TbX size={14} />
              </button>
            </span>
          ))}
        </div>
      )}

      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};
