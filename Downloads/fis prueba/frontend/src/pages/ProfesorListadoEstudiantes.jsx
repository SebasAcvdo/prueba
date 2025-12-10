import React, { useState, useEffect } from 'react';
import { Layout } from '../components/common/Layout';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Spinner';
import api from '../services/auth';
import styles from './ProfesorListadoEstudiantes.module.css';

export const ProfesorListadoEstudiantes = () => {
  const { user } = useAuth();
  const [grupos, setGrupos] = useState([]);
  const [selectedGrupo, setSelectedGrupo] = useState('');
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGrupos();
  }, []);

  useEffect(() => {
    if (selectedGrupo) {
      fetchEstudiantes();
    }
  }, [selectedGrupo]);

  const fetchGrupos = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/grupos', {
        params: { profesorId: user.id }
      });
      setGrupos(response.data);
    } catch (err) {
      setError('Error al cargar grupos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEstudiantes = async () => {
    try {
      setError('');
      const response = await api.get(`/grupos/${selectedGrupo}`);
      setEstudiantes(response.data.estudiantes || []);
    } catch (err) {
      setError('Error al cargar estudiantes');
      console.error(err);
    }
  };

  const handleDownloadPDF = async () => {
    if (!selectedGrupo) {
      setError('Selecciona un grupo primero');
      return;
    }

    try {
      setDownloading(true);
      setError('');
      const response = await api.get(`/grupos/${selectedGrupo}/listado.pdf`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `listado_grupo_${selectedGrupo}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Error al descargar PDF');
      console.error(err);
    } finally {
      setDownloading(false);
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
          <h1>Listado de Estudiantes</h1>
          <p>Consulta los estudiantes de tus grupos</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <label htmlFor="grupo">Seleccionar Grupo:</label>
            <select
              id="grupo"
              value={selectedGrupo}
              onChange={(e) => setSelectedGrupo(e.target.value)}
              className={styles.select}
            >
              <option value="">-- Seleccione un grupo --</option>
              {grupos.map(grupo => (
                <option key={grupo.id} value={grupo.id}>
                  {grupo.nombre} - {grupo.grado} ({grupo.estado})
                </option>
              ))}
            </select>
          </div>

          {selectedGrupo && (
            <Button 
              onClick={handleDownloadPDF}
              disabled={downloading}
            >
              {downloading ? 'Generando PDF...' : 'Descargar Listado PDF'}
            </Button>
          )}
        </div>

        {selectedGrupo && estudiantes.length > 0 && (
          <div className={styles.tableContainer}>
            <h2>Estudiantes del Grupo</h2>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Registro Civil</th>
                  <th>Nombre Completo</th>
                  <th>Grado</th>
                  <th>Acudiente</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {estudiantes.map(estudiante => (
                  <tr key={estudiante.id}>
                    <td>{estudiante.regCivil}</td>
                    <td>{estudiante.nombre} {estudiante.apellido}</td>
                    <td>{estudiante.grado}</td>
                    <td>{estudiante.acudiente?.nombre || 'N/A'}</td>
                    <td>
                      <span className={`${styles.badge} ${styles[estudiante.estado?.toLowerCase() || '']}`}>
                        {estudiante.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedGrupo && estudiantes.length === 0 && (
          <div className={styles.emptyState}>
            <p>No hay estudiantes asignados a este grupo</p>
          </div>
        )}
      </div>
    </Layout>
  );
};
