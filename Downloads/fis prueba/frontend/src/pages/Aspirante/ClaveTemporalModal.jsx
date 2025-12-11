import { useState } from 'react';
import styles from './ClaveTemporalModal.module.css';

export default function ClaveTemporalModal({ claveTemporal, onVerEstado }) {
  const [copiado, setCopiado] = useState(false);

  const copiarClave = async () => {
    try {
      await navigator.clipboard.writeText(claveTemporal);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  return (
    <div className={styles.modalOverlay} role="dialog" aria-labelledby="modal-title">
      <div className={styles.modalContent}>
        <h2 id="modal-title" className={styles.modalTitle}>
          ¡Pre-inscripción Exitosa!
        </h2>
        
        <p className={styles.modalText}>
          Guarda tu <strong>clave temporal</strong> para consultar el estado de tu inscripción:
        </p>

        <div className={styles.claveContainer}>
          <input
            type="text"
            value={claveTemporal}
            readOnly
            className={styles.claveInput}
            aria-label="Clave temporal generada"
          />
        </div>

        <button
          onClick={copiarClave}
          className={styles.btnCopiar}
          aria-label="Copiar clave temporal al portapapeles"
        >
          {copiado ? '✓ Copiado' : '📋 Copiar Clave'}
        </button>

        <div className={styles.infoBox}>
          <p className={styles.infoText}>
            💡 <strong>Importante:</strong> Esta clave te permitirá consultar el estado 
            de tu inscripción en cualquier momento.
          </p>
        </div>

        <button
          onClick={onVerEstado}
          className={styles.btnPrimary}
          aria-label="Ver estado de inscripción"
        >
          Ver Estado de Inscripción
        </button>
      </div>
    </div>
  );
}
