import React, { useState, useEffect } from 'react';
import { Layout } from '../components/common/Layout';
import { useAuth } from '../contexts/AuthContext';
import { Spinner } from '../components/common/Spinner';
import api from '../services/auth';
import styles from './AspiranteEstado.module.css';

export const AspiranteEstado = () => {
  const { user } = useAuth();
  const [aspirante, setAspirante] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAspirante();
  }, []);

  const fetchAspirante = async () => {
    try {
      setLoading(true);
      setError('');
      // Buscar aspirante por usuario
      const response = await api.get('/aspirantes');
      const miAspirante = response.data.find(a => a.usuario.id === user.id);
      setAspirante(miAspirante);
    } catch (err) {
      setError('Error al cargar el estado de la solicitud');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoColor = (estado) => {
    const colors = {
      SIN_REVISAR: '#ff9800',
      REVISADO: '#2196f3',
      ESPERA_ENTREVISTA: '#9c27b0',
      APROBADO: '#4caf50',
      NO_APROBADO: '#f44336'
    };
    return colors[estado] || '#666';
  };

  const getEstadoTexto = (estado) => {
    const textos = {
      SIN_REVISAR: 'Tu solicitud está pendiente de revisión',
      REVISADO: 'Tu solicitud ha sido revisada',
      ESPERA_ENTREVISTA: 'Tienes una entrevista programada',
      APROBADO: '¡Felicitaciones! Tu solicitud fue aprobada',
      NO_APROBADO: 'Lo sentimos, tu solicitud no fue aprobada'
    };
    return textos[estado] || 'Estado desconocido';
  };

  if (loading) {
    return (
      <Layout>
        <div className={styles.loadingContainer}>
          <Spinner />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className={styles.container}>
          <div className={styles.error}>{error}</div>
        </div>
      </Layout>
    );
  }

  if (!aspirante) {
    return (
      <Layout>
        <div className={styles.container}>
          <div className={styles.emptyState}>
            <h2>No se encontró solicitud</h2>
            <p>No tienes una solicitud de aspirante registrada.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Estado de tu Solicitud</h1>
          <p>Consulta el estado de tu pre-inscripción en Jardín Aprendiendo Juntos</p>
        </div>

        <div className={styles.statusCard} style={{ borderLeftColor: getEstadoColor(aspirante.estadoInscripcion) }}>
          <div className={styles.statusHeader}>
            <span className={styles.statusBadge} style={{ backgroundColor: getEstadoColor(aspirante.estadoInscripcion) }}>
              {aspirante.estadoInscripcion.replace('_', ' ')}
            </span>
          </div>
          <h2>{getEstadoTexto(aspirante.estadoInscripcion)}</h2>

          {aspirante.fechaEntrevista && (
            <div className={styles.entrevistaInfo}>
              <h3>📅 Fecha de Entrevista</h3>
              <p className={styles.fecha}>{aspirante.fechaEntrevista}</p>
              <p className={styles.aviso}>Por favor asiste puntualmente a tu entrevista.</p>
            </div>
          )}
        </div>

        <div className={styles.infoCard}>
          <h3>Datos de tu Solicitud</h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.label}>Nombre:</span>
              <span className={styles.value}>{aspirante.usuario.nombre}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Correo:</span>
              <span className={styles.value}>{aspirante.usuario.correo}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Estudiantes:</span>
              <span className={styles.value}>{aspirante.estudiantes?.length || 0}</span>
            </div>
          </div>
        </div>

        {aspirante.estudiantes && aspirante.estudiantes.length > 0 && (
          <div className={styles.estudiantesCard}>
            <h3>Estudiantes Pre-Inscritos</h3>
            {aspirante.estudiantes.map((est, index) => (
              <div key={index} className={styles.estudianteItem}>
                <div className={styles.estudianteInfo}>
                  <strong>{est.nombre} {est.apellido}</strong>
                  <span>{est.grado}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className={styles.ayudaCard}>
          <h3>¿Necesitas ayuda?</h3>
          <p>Si tienes preguntas sobre tu solicitud, contáctanos:</p>
          <p>📧 Email: admisiones@jardinaprendiendojuntos.edu</p>
          <p>📞 Teléfono: (601) 123-4567</p>
        </div>
      </div>
    </Layout>
  );
};
