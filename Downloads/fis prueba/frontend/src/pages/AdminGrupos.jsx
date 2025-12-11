import React, { useState, useEffect } from 'react';
import { Layout } from '../components/common/Layout';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Spinner';
import { TbPlus, TbCheck, TbUsers, TbDownload } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import api from '../services/auth';
import styles from './AdminGrupos.module.css';

export const AdminGrupos = () => {
  const navigate = useNavigate();
  const [grupos, setGrupos] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    grado: '',
    profesorId: '',
    capacidad: 10
  });

  useEffect(() => {
    fetchGrupos();
    fetchProfesores();
  }, []);

  const fetchGrupos = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/grupos');
      setGrupos(response.data);
    } catch (err) {
      setError('Error al cargar grupos: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchProfesores = async () => {
    try {
      const response = await api.get('/usuarios/page', {
        params: { rol: 'PROFESOR', page: 0, size: 100 }
      });
      console.log('Profesores cargados:', response.data);
      setProfesores(response.data.content || []);
    } catch (err) {
      console.error('Error al cargar profesores:', err);
      setError('Error al cargar profesores: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setSuccess('');
      await api.post('/grupos', formData);
      setSuccess('Grupo creado exitosamente');
      setShowModal(false);
      setFormData({
        nombre: '',
        grado: '',
        profesorId: '',
        capacidad: 10
      });
      fetchGrupos();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Error al crear grupo: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleConfirmar = async (grupoId) => {
    try {
      setError('');
      setSuccess('');
      await api.patch(`/grupos/${grupoId}/confirmar`);
      setSuccess('Grupo confirmado exitosamente');
      fetchGrupos();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Error al confirmar grupo: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDescargarListado = async (grupoId) => {
    try {
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
      setError('Error al descargar listado: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleEliminar = async (grupoId) => {
    if (!window.confirm('¿Está seguro de eliminar este grupo?')) return;
    
    try {
      setError('');
      setSuccess('');
      await api.delete(`/grupos/${grupoId}`);
      setSuccess('Grupo eliminado exitosamente');
      fetchGrupos();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Error al eliminar grupo: ' + (err.response?.data?.message || err.message));
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
          <div>
            <h1 className={styles.title}>Gestión de Grupos</h1>
            <p className={styles.subtitle}>Administra los grupos de la academia</p>
          </div>
          <Button icon={TbPlus} onClick={() => setShowModal(true)}>
            Crear Grupo
          </Button>
        </div>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

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
                  <span className={styles.infoLabel}>Profesor:</span>
                  <span className={styles.infoValue}>{grupo.profesor?.nombre || 'No asignado'}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Estudiantes:</span>
                  <span className={styles.infoValue}>
                    {grupo.estudiantes?.length || 0} / {grupo.capacidad}
                  </span>
                </div>
              </div>

              <div className={styles.grupoActions}>
                <Button
                  icon={TbUsers}
                  size="small"
                  variant="outline"
                  onClick={() => navigate('/admin/estudiantes')}
                >
                  Gestionar Estudiantes
                </Button>
                
                {grupo.estado === 'BORRADOR' && (
                  <Button
                    icon={TbCheck}
                    size="small"
                    onClick={() => handleConfirmar(grupo.id)}
                  >
                    Confirmar
                  </Button>
                )}
                
                {grupo.estado === 'ACTIVO' && (
                  <Button
                    icon={TbDownload}
                    size="small"
                    onClick={() => handleDescargarListado(grupo.id)}
                  >
                    Descargar PDF
                  </Button>
                )}
                
                <Button
                  size="small"
                  variant="danger"
                  onClick={() => handleEliminar(grupo.id)}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          ))}
        </div>

        {showModal && (
          <div className={styles.modal} onClick={() => setShowModal(false)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <h2>Crear Nuevo Grupo</h2>
              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="nombre">Nombre del Grupo:</label>
                  <input
                    type="text"
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="grado">Grado:</label>
                  <select
                    id="grado"
                    value={formData.grado}
                    onChange={(e) => setFormData({ ...formData, grado: e.target.value })}
                    required
                  >
                    <option value="">Seleccione...</option>
                    <option value="Párvulos">Párvulos</option>
                    <option value="Caminadores">Caminadores</option>
                    <option value="Pre-jardín">Pre-jardín</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="profesorId">Profesor:</label>
                  <select
                    id="profesorId"
                    value={formData.profesorId}
                    onChange={(e) => setFormData({ ...formData, profesorId: e.target.value })}
                    required
                  >
                    <option value="">Seleccione...</option>
                    {profesores.length > 0 ? (
                      profesores.map((prof) => (
                        <option key={prof.id} value={prof.id}>
                          {prof.nombre}
                        </option>
                      ))
                    ) : (
                      <option disabled>No hay profesores disponibles</option>
                    )}
                  </select>
                  {profesores.length === 0 && (
                    <small style={{color: 'orange'}}>Cargando profesores...</small>
                  )}
                </div>

                <div className={styles.modalActions}>
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Crear Grupo</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
