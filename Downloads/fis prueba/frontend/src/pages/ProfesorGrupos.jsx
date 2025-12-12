import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Layout } from '../components/common/Layout';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Spinner';
import { TbDownload, TbUsers } from 'react-icons/tb';
import api from '../services/auth';
import styles from './ProfesorGrupos.module.css';

export const ProfesorGrupos = () => {
  const { user } = useAuth();
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    fetchGrupos();
  }, []);

  const fetchGrupos = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/grupos', {
        params: { profesorId: user.id }
      });
      setGrupos(response.data);
    } catch (err) {
      setError('Error al cargar grupos: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDescargarListado = async (grupoId) => {
    try {
      setDownloading(grupoId);
      const response = await api.get(`/grupos/${grupoId}/listado.pdf`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `listado_grupo_${grupoId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Error al descargar el listado: ' + (err.response?.data?.message || err.message));
    } finally {
      setDownloading(null);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className={styles.container}>
          <Spinner />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Mis Grupos</h1>
          <p className={styles.subtitle}>Grupos asignados a {user.nombre}</p>
        </div>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        {grupos.length === 0 ? (
          <div className={styles.emptyState}>
            <TbUsers size={64} />
            <p>No tienes grupos asignados</p>
          </div>
        ) : (
          <div className={styles.gruposGrid}>
            {grupos.map((grupo) => (
              <div key={grupo.id} className={styles.grupoCard}>
                <div className={styles.grupoHeader}>
                  <h3 className={styles.grupoNombre}>{grupo.nombre}</h3>
                  <span className={`${styles.estadoBadge} ${styles[grupo.estado.toLowerCase()]}`}>
                    {grupo.estado}
                  </span>
                </div>

                <div className={styles.grupoInfo}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Grado:</span>
                    <span className={styles.infoValue}>{grupo.grado}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Jornada:</span>
                    <span className={styles.infoValue}>{grupo.jornada}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Estudiantes:</span>
                    <span className={styles.infoValue}>
                      {grupo.estudiantes?.length || 0} / 20
                    </span>
                  </div>
                </div>

                {grupo.estado === 'ACTIVO' && (
                  <Button
                    icon={TbDownload}
                    variant="outline"
                    size="small"
                    onClick={() => handleDescargarListado(grupo.id)}
                    disabled={downloading === grupo.id}
                  >
                    {downloading === grupo.id ? 'Descargando...' : 'Descargar Listado'}
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};
