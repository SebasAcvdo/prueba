import React from 'react';
import styles from './Pagination.module.css';

/**
 * Componente de paginación genérico para tablas
 * @param {number} page - Página actual (0-indexed)
 * @param {number} size - Tamaño de página
 * @param {number} totalElements - Total de elementos
 * @param {number} totalPages - Total de páginas
 * @param {function} onPageChange - Callback al cambiar de página
 * @param {boolean} disabled - Deshabilitar controles
 */
export const Pagination = ({ 
  page = 0, 
  size = 20, 
  totalElements = 0, 
  totalPages = 0, 
  onPageChange,
  disabled = false 
}) => {
  const currentPage = page + 1; // Convertir a 1-indexed para display
  const startItem = totalElements === 0 ? 0 : page * size + 1;
  const endItem = Math.min((page + 1) * size, totalElements);

  const handlePrevious = () => {
    if (page > 0 && !disabled) {
      onPageChange(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages - 1 && !disabled) {
      onPageChange(page + 1);
    }
  };

  const handleFirst = () => {
    if (page !== 0 && !disabled) {
      onPageChange(0);
    }
  };

  const handleLast = () => {
    if (page !== totalPages - 1 && !disabled) {
      onPageChange(totalPages - 1);
    }
  };

  if (totalElements === 0) {
    return (
      <div className={styles.pagination}>
        <div className={styles.info}>
          No hay elementos para mostrar
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pagination}>
      <div className={styles.info}>
        Mostrando <strong>{startItem}</strong> a <strong>{endItem}</strong> de{' '}
        <strong>{totalElements}</strong> elementos
      </div>

      <div className={styles.controls}>
        <button
          className={styles.button}
          onClick={handleFirst}
          disabled={page === 0 || disabled}
          aria-label="Primera página"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
            <path d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
          </svg>
        </button>

        <button
          className={styles.button}
          onClick={handlePrevious}
          disabled={page === 0 || disabled}
          aria-label="Página anterior"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
          </svg>
        </button>

        <span className={styles.pageInfo}>
          Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
        </span>

        <button
          className={styles.button}
          onClick={handleNext}
          disabled={page >= totalPages - 1 || disabled}
          aria-label="Página siguiente"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
          </svg>
        </button>

        <button
          className={styles.button}
          onClick={handleLast}
          disabled={page >= totalPages - 1 || disabled}
          aria-label="Última página"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z"/>
            <path d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z"/>
          </svg>
        </button>
      </div>
    </div>
  );
};
