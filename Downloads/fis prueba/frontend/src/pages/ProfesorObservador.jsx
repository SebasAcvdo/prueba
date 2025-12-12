import React, { useState, useEffect } from 'react';
import { Layout } from '../components/common/Layout';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Spinner';
import api from '../services/auth';
import styles from './ProfesorObservador.module.css';

export const ProfesorObservador = () => {
  const { user } = useAuth();
  const [grupos, setGrupos] = useState([]);
  const [selectedGrupo, setSelectedGrupo] = useState('');
  const [estudiantes, setEstudiantes] = useState([]);
  const [selectedEstudiante, setSelectedEstudiante] = useState('');
  const [observaciones, setObservaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    tipo: 'ACADEMICA',
    descripcion: ''
  });

  useEffect(() => {
    fetchGrupos();
  }, []);

  useEffect(() => {
    if (selectedGrupo) {
      fetchEstudiantes();
    }
  }, [selectedGrupo]);

  useEffect(() => {
    if (selectedEstudiante) {
      fetchObservaciones();
    }
  }, [selectedEstudiante]);

  const fetchGrupos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/grupos', {
        params: { profesorId: user.id }
      });
      setGrupos(response.data);
    } catch (err) {
      setError('Error al cargar grupos');
    } finally {
      setLoading(false);
    }
  };

  const fetchEstudiantes = async () => {
    try {
      const response = await api.get(`/grupos/${selectedGrupo}`);
      setEstudiantes(response.data.estudiantes || []);
    } catch (err) {
      setError('Error al cargar estudiantes');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.post('/observaciones', {
        ...formData,
        estudianteId: parseInt(selectedEstudiante)
      });
      setSuccess('Observación agregada correctamente');
      setShowForm(false);
      setFormData({
        fecha: new Date().toISOString().split('T')[0],
        tipo: 'ACADEMICA',
        descripcion: ''
      });
      fetchObservaciones();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar observación');
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
          <p>Registra y consulta observaciones académicas y disciplinarias</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <label htmlFor="grupo">Grupo:</label>
            <select
              id="grupo"
              value={selectedGrupo}
              onChange={(e) => {
                setSelectedGrupo(e.target.value);
                setSelectedEstudiante('');
                setObservaciones([]);
              }}
              className={styles.select}
            >
              <option value="">-- Seleccione un grupo --</option>
              {grupos.map(grupo => (
                <option key={grupo.id} value={grupo.id}>
                  {grupo.nombre} - {grupo.grado}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="estudiante">Estudiante:</label>
            <select
              id="estudiante"
              value={selectedEstudiante}
              onChange={(e) => setSelectedEstudiante(e.target.value)}
              className={styles.select}
              disabled={!selectedGrupo}
            >
              <option value="">-- Seleccione un estudiante --</option>
              {estudiantes.map(est => (
                <option key={est.id} value={est.id}>
                  {est.nombre} {est.apellido}
                </option>
              ))}
            </select>
          </div>

          {selectedEstudiante && (
            <Button onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancelar' : 'Agregar Observación'}
            </Button>
          )}
        </div>

        {showForm && (
          <div className={styles.formCard}>
            <h3>Nueva Observación</h3>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="fecha">Fecha:</label>
                <input
                  type="date"
                  id="fecha"
                  value={formData.fecha}
                  onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="tipo">Tipo:</label>
                <select
                  id="tipo"
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                  required
                >
                  <option value="ACADEMICA">Académica</option>
                  <option value="DISCIPLINARIA">Disciplinaria</option>
                  <option value="CONVIVENCIA">Convivencia</option>
                  <option value="LOGRO_DESTACADO">Logro Destacado</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="descripcion">Descripción:</label>
                <textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  rows="4"
                  required
                />
              </div>
              <Button type="submit">Guardar Observación</Button>
            </form>
          </div>
        )}

        {selectedEstudiante && observaciones.length > 0 && (
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
                <p className={styles.profesor}>Por: {obs.profesor?.nombre}</p>
              </div>
            ))}
          </div>
        )}

        {selectedEstudiante && observaciones.length === 0 && !showForm && (
          <div className={styles.emptyState}>
            <p>No hay observaciones registradas para este estudiante</p>
          </div>
        )}
      </div>
    </Layout>
  );
};
