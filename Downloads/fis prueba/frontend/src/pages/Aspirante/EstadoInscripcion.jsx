import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerEstadoPublico } from './services/aspirantePublicoService';
import styles from './EstadoInscripcion.module.css';

export default function EstadoInscripcion() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [datos, setDatos] = useState(null);

  useEffect(() => {
    cargarEstado();
  }, []);

  const cargarEstado = async () => {
    // Verificar si hay aspiranteId en localStorage
    const aspiranteId = localStorage.getItem('aspiranteId');
    
    if (!aspiranteId) {
      navigate('/aspirante/preinscripcion');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await obtenerEstadoPublico(aspiranteId);
      setDatos(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const obtenerColorEstado = (estado) => {
    switch (estado) {
      case 'Aprobado':
        return styles.badgeAprobado;
      case 'Espera entrevista':
        return styles.badgeEspera;
      case 'Sin revisar':
      default:
        return styles.badgeSinRevisar;
    }
  };

  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return '-';
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.card}>
          <div className={styles.loader}></div>
          <p className={styles.loadingText}>Cargando información...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.card}>
          <div className={styles.errorContainer}>
            <h2 className={styles.errorTitle}>Error</h2>
            <p className={styles.errorText}>{error}</p>
            <button
              onClick={() => navigate('/aspirante/preinscripcion')}
              className={styles.btnSecondary}
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.card}>
        <h1 className={styles.title}>Estado de tu Pre-inscripción</h1>
        
        {/* Badge de estado */}
        <div className={styles.estadoContainer}>
          <span className={`${styles.badge} ${obtenerColorEstado(datos.estado)}`}>
            {datos.estado}
          </span>
        </div>

        {/* Información del estudiante */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Datos del Estudiante</h2>
          <div className={styles.dataTable}>
            <div className={styles.dataRow}>
              <span className={styles.dataLabel}>Nombre completo:</span>
              <span className={styles.dataValue}>
                {datos.estudiante.nombre} {datos.estudiante.apellido}
              </span>
            </div>
            <div className={styles.dataRow}>
              <span className={styles.dataLabel}>Grado:</span>
              <span className={styles.dataValue}>{datos.estudiante.grado}</span>
            </div>
            <div className={styles.dataRow}>
              <span className={styles.dataLabel}>Fecha de nacimiento:</span>
              <span className={styles.dataValue}>
                {formatearFecha(datos.estudiante.fechaNacimiento)}
              </span>
            </div>
          </div>
        </section>

        {/* Fecha de entrevista (si existe) */}
        {datos.fechaEntrevista && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Fecha de Entrevista</h2>
            <div className={styles.entrevistaBox}>
              <div className={styles.calendarIcon}>📅</div>
              <div>
                <p className={styles.entrevistaLabel}>Entrevista programada para:</p>
                <p className={styles.entrevistaFecha}>
                  {formatearFecha(datos.fechaEntrevista)}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Información adicional según el estado */}
        <div className={styles.infoBox}>
          {datos.estado === 'Sin revisar' && (
            <p className={styles.infoText}>
              Tu solicitud está en proceso de revisión. Pronto recibirás noticias sobre el estado de tu inscripción.
            </p>
          )}
          {datos.estado === 'Espera entrevista' && (
            <p className={styles.infoText}>
              Tu solicitud ha sido revisada. Por favor, asiste a la entrevista en la fecha indicada.
            </p>
          )}
          {datos.estado === 'Aprobado' && (
            <p className={styles.infoText}>
              ¡Felicidades! Tu solicitud ha sido aprobada. Pronto recibirás información sobre los siguientes pasos.
            </p>
          )}
        </div>

        {/* Botón volver */}
        <button
          onClick={() => navigate('/')}
          className={styles.btnSecondary}
          aria-label="Volver a la página principal"
        >
          Volver al Inicio
        </button>
      </div>
    </div>
  );
}
