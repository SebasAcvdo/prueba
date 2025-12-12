import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAspiranteRegistro } from '../../hooks/useAspiranteRegistro';
import ClaveTemporalPopup from './ClaveTemporalPopup';
import styles from './RegistroCorreo.module.css';

/**
 * RegistroCorreo - Pantalla pública para que aspirantes soliciten clave temporal
 * Flujo: Aspirante ingresa correo → backend genera clave → popup muestra clave
 */
const RegistroCorreo = () => {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState('');
  const [correoValido, setCorreoValido] = useState(true);
  const [mostrarPopup, setMostrarPopup] = useState(false);
  
  const { 
    registroStatus, 
    claveTemporal, 
    aspiranteId, 
    error, 
    solicitarClave 
  } = useAspiranteRegistro();

  /**
   * Valida formato de correo electrónico
   * @param {string} email - Email a validar
   * @returns {boolean} True si es válido
   */
  const validarCorreo = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  /**
   * Maneja cambio en input de correo
   * @param {Event} e - Evento del input
   */
  const handleCorreoChange = (e) => {
    const value = e.target.value;
    setCorreo(value);
    if (value) {
      setCorreoValido(validarCorreo(value));
    } else {
      setCorreoValido(true);
    }
  };

  /**
   * Solicita clave temporal al backend
   * POST /api/aspirantes/solicitar-clave → {claveTemporal, aspiranteId}
   */
  const handleSolicitar = async (e) => {
    e.preventDefault();
    
    if (!validarCorreo(correo)) {
      setCorreoValido(false);
      return;
    }

    try {
      await solicitarClave(correo);
      setMostrarPopup(true);
    } catch (err) {
      console.error('Error al solicitar clave:', err);
      // El error se muestra automáticamente desde el hook
    }
  };

  /**
   * Cierra popup y redirige a login con datos pre-llenados
   */
  const handleCerrarPopup = () => {
    setMostrarPopup(false);
    navigate(`/login?esAspirante=true&correo=${encodeURIComponent(correo)}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.titulo}>Bienvenido a Academia UD</h1>
          <p className={styles.subtitulo}>
            Solicita tu clave temporal para iniciar el proceso de pre-inscripción
          </p>
        </div>

        <form onSubmit={handleSolicitar} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="correo" className={styles.label}>
              Correo electrónico
            </label>
            <input
              id="correo"
              type="email"
              value={correo}
              onChange={handleCorreoChange}
              className={`${styles.input} ${!correoValido ? styles.inputError : ''}`}
              placeholder="tu.correo@ejemplo.com"
              required
              disabled={registroStatus === 'sending'}
            />
            {!correoValido && (
              <span className={styles.errorText}>
                Por favor ingresa un correo electrónico válido
              </span>
            )}
          </div>

          {error && (
            <div className={styles.errorMessage}>
              <span>⚠️</span>
              <p>{error}</p>
            </div>
          )}

          <button
            type="submit"
            className={styles.botonPrincipal}
            disabled={registroStatus === 'sending' || !correo}
          >
            {registroStatus === 'sending' ? (
              <>
                <span className={styles.spinner}></span>
                Enviando solicitud...
              </>
            ) : (
              'Solicitar clave temporal'
            )}
          </button>

          <div className={styles.infoBox}>
            <p className={styles.infoTexto}>
              ℹ️ Tu clave temporal se mostrará en pantalla una vez generada.
              <br />
              <strong>Asegúrate de copiarla antes de continuar.</strong>
            </p>
          </div>
        </form>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            ¿Ya tienes una cuenta?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className={styles.linkButton}
            >
              Iniciar sesión
            </button>
          </p>
        </div>
      </div>

      {/* Popup con clave temporal */}
      {mostrarPopup && claveTemporal && (
        <ClaveTemporalPopup
          claveTemporal={claveTemporal}
          correo={correo}
          onCerrar={handleCerrarPopup}
        />
      )}
    </div>
  );
};

export default RegistroCorreo;
