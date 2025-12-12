import { useState } from 'react';
import styles from './ClaveTemporalPopup.module.css';

/**
 * ClaveTemporalPopup - Modal que muestra la clave temporal generada
 * Permite copiar la clave y redirigir a login
 * 
 * @param {string} claveTemporal - Clave temporal generada por el backend
 * @param {string} correo - Email del aspirante
 * @param {Function} onCerrar - Callback al cerrar (redirige a login)
 */
const ClaveTemporalPopup = ({ claveTemporal, correo, onCerrar }) => {
  const [copiado, setCopiado] = useState(false);

  /**
   * Copia la clave temporal al portapapeles
   * Usa navigator.clipboard API
   */
  const handleCopiar = async () => {
    try {
      await navigator.clipboard.writeText(claveTemporal);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
      // Fallback para navegadores sin soporte
      const textArea = document.createElement('textarea');
      textArea.value = claveTemporal;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }
  };

  return (
    <div className={styles.overlay} onClick={onCerrar}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Icono de éxito */}
        <div className={styles.iconoExito}>
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>

        <h2 className={styles.titulo}>¡Clave temporal generada!</h2>
        
        <p className={styles.descripcion}>
          Tu clave temporal ha sido creada exitosamente. Esta es la única vez que se mostrará:
        </p>
        
        <div className={styles.correoBox}>
          <span className={styles.correoLabel}>📧</span>
          <span className={styles.correoTexto}>{correo}</span>
        </div>

        <div className={styles.claveContainer}>
          <label className={styles.claveLabel}>Tu clave temporal es:</label>
          <div className={styles.claveBox}>
            <span className={styles.clave}>{claveTemporal}</span>
            <button
              type="button"
              onClick={handleCopiar}
              className={styles.botonCopiar}
              aria-label="Copiar clave temporal"
            >
              {copiado ? (
                <>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Copiado
                </>
              ) : (
                <>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  Copiar
                </>
              )}
            </button>
          </div>
        </div>

        <div className={styles.infoBox}>
          <p className={styles.infoTexto}>
            ⚠️ <strong>Importante:</strong> Guarda esta clave en un lugar seguro. 
            La necesitarás para tu primer inicio de sesión.
          </p>
        </div>

        <div className={styles.acciones}>
          <button
            type="button"
            onClick={onCerrar}
            className={styles.botonPrincipal}
          >
            Ir a iniciar sesión
          </button>
        </div>

        <p className={styles.ayuda}>
          Si tienes problemas, contacta al administrador
        </p>
      </div>
    </div>
  );
};

export default ClaveTemporalPopup;
