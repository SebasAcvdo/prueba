import React, { useState, useEffect } from 'react';
import { Layout } from '../components/common/Layout';
import { useAuth } from '../contexts/AuthContext';
import { Spinner } from '../components/common/Spinner';
import api from '../services/auth';
import styles from './AcudienteObservador.module.css';

export const AcudienteObservador = () => {
  const { user } = useAuth();
  const [estudiantes, setEstudiantes] = useState([]);
  const [selectedEstudiante, setSelectedEstudiante] = useState('');
  const [observaciones, setObservaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEstudiantes();
  }, []);

  useEffect(() => {
    if (selectedEstudiante) {
      fetchObservaciones();
    }
  }, [selectedEstudiante]);

  const fetchEstudiantes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/estudiantes', {
        params: { acudienteId: user.id }
      });
      setEstudiantes(response.data);
      if (response.data.length > 0) {
        setSelectedEstudiante(response.data[0].id);
      }
    } catch (err) {
      setError('Error al cargar estudiantes');
    } finally {
      setLoading(false);
    }
  };

  const fetchObservaciones = async () => {
    try {
      setError('');
      const response = await api.get('/observaciones', {
        params: { estudianteId: selectedEstudiante }
      });
      setObservaciones(response.data);
    } catch (err) {
      setError('Error al cargar observaciones');
    }
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

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Observador del Estudiante</h1>
          <p>Consulta las observaciones académicas y disciplinarias de tu hijo/a</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {estudiantes.length > 0 && (
          <div className={styles.selector}>
            <label htmlFor="estudiante">Seleccionar hijo/a:</label>
            <select
              id="estudiante"
              value={selectedEstudiante}
              onChange={(e) => setSelectedEstudiante(e.target.value)}
              className={styles.select}
            >
              {estudiantes.map(est => (
                <option key={est.id} value={est.id}>
                  {est.nombre} {est.apellido} - {est.grado}
                </option>
              ))}
            </select>
          </div>
        )}

        {observaciones.length > 0 && (
          <div className={styles.observacionesContainer}>
            <h3>Historial de Observaciones</h3>
            {observaciones.map(obs => (
              <div key={obs.id} className={`${styles.observacionCard} ${styles[obs.tipo.toLowerCase()]}`}>
                <div className={styles.observacionHeader}>
                  <span className={styles.fecha}>{obs.fecha}</span>
                  <span className={`${styles.badge} ${styles[obs.tipo.toLowerCase()]}`}>
                    {obs.tipo.replace('_', ' ')}
                  </span>
                </div>
                <p className={styles.descripcion}>{obs.descripcion}</p>
                <p className={styles.profesor}>Registrado por: {obs.profesor?.nombre}</p>
              </div>
            ))}
          </div>
        )}

        {observaciones.length === 0 && selectedEstudiante && (
          <div className={styles.emptyState}>
            <p>No hay observaciones registradas para este estudiante</p>
          </div>
        )}

        {estudiantes.length === 0 && (
          <div className={styles.emptyState}>
            <p>No tienes estudiantes asignados</p>
          </div>
        )}
      </div>
    </Layout>
  );
};
