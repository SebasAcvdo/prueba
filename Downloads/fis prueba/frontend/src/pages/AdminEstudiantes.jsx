import React, { useState, useEffect } from 'react';
import { Layout } from '../components/common/Layout';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Spinner';
import { TbPlus, TbX, TbArrowsExchange } from 'react-icons/tb';
import api from '../services/auth';
import styles from './AdminEstudiantes.module.css';

export const AdminEstudiantes = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState('');
  const [accion, setAccion] = useState(''); // 'agregar', 'cambiar', 'quitar'

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [estudiantesRes, gruposRes] = await Promise.all([
        api.get('/estudiantes'),
        api.get('/grupos')
      ]);
      setEstudiantes(estudiantesRes.data);
      setGrupos(gruposRes.data);
    } catch (err) {
      setError('Error al cargar datos: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleAbrirModal = (estudiante, accionTipo) => {
    setEstudianteSeleccionado(estudiante);
    setAccion(accionTipo);
    setGrupoSeleccionado('');
    setShowModal(true);
  };

  const handleAsignarGrupo = async () => {
    if (!grupoSeleccionado) {
      setError('Debe seleccionar un grupo');
      return;
    }

    try {
      setError('');
      setSuccess('');
      await api.post(`/grupos/${grupoSeleccionado}/estudiantes`, {
        estudianteId: estudianteSeleccionado.id
      });
      setSuccess('Estudiante asignado exitosamente');
      setShowModal(false);
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al asignar estudiante');
    }
  };

  const handleQuitarGrupo = async () => {
    if (!window.confirm('¿Está seguro de quitar al estudiante del grupo?')) return;

    try {
      setError('');
      setSuccess('');
      await api.delete(`/estudiantes/${estudianteSeleccionado.id}/grupo`);
      setSuccess('Estudiante removido del grupo exitosamente');
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al remover estudiante');
    }
  };

  const handleCambiarGrupo = async () => {
    if (!grupoSeleccionado) {
      setError('Debe seleccionar un grupo');
      return;
    }

    try {
      setError('');
      setSuccess('');
      // Primero quitar del grupo actual
      await api.delete(`/estudiantes/${estudianteSeleccionado.id}/grupo`);
      // Luego asignar al nuevo grupo
      await api.post(`/grupos/${grupoSeleccionado}/estudiantes`, {
        estudianteId: estudianteSeleccionado.id
      });
      setSuccess('Estudiante cambiado de grupo exitosamente');
      setShowModal(false);
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cambiar estudiante de grupo');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (accion === 'agregar' || accion === 'cambiar') {
      if (accion === 'agregar') {
        handleAsignarGrupo();
      } else {
        handleCambiarGrupo();
      }
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
            <h1 className={styles.title}>Gestión de Estudiantes</h1>
            <p className={styles.subtitle}>Administra la asignación de estudiantes a grupos</p>
          </div>
        </div>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Estado Asignación</th>
                <th>Grupo Asignado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {estudiantes.map((estudiante) => (
                <tr key={estudiante.id}>
                  <td>{estudiante.nombre}</td>
                  <td>{estudiante.apellido}</td>
                  <td>
                    {estudiante.grupo ? (
                      <span className={styles.badgeAsignado}>Asignado</span>
                    ) : (
                      <span className={styles.badgeSinAsignar}>Sin asignar</span>
                    )}
                  </td>
                  <td>
                    {estudiante.grupo ? (
                      <span className={styles.grupoNombre}>{estudiante.grupo.nombre}</span>
                    ) : (
                      <span className={styles.grupoVacio}>-</span>
                    )}
                  </td>
                  <td>
                    <div className={styles.acciones}>
                      {!estudiante.grupo ? (
                        <Button
                          icon={TbPlus}
                          size="small"
                          onClick={() => handleAbrirModal(estudiante, 'agregar')}
                        >
                          Agregar a Grupo
                        </Button>
                      ) : (
                        <>
                          <Button
                            icon={TbArrowsExchange}
                            size="small"
                            variant="outline"
                            onClick={() => handleAbrirModal(estudiante, 'cambiar')}
                          >
                            Cambiar Grupo
                          </Button>
                          <Button
                            icon={TbX}
                            size="small"
                            variant="danger"
                            onClick={() => {
                              setEstudianteSeleccionado(estudiante);
                              handleQuitarGrupo();
                            }}
                          >
                            Quitar
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className={styles.modal} onClick={() => setShowModal(false)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <h2>
                {accion === 'agregar' ? 'Agregar a Grupo' : 'Cambiar de Grupo'}
              </h2>
              <p className={styles.modalSubtitle}>
                Estudiante: <strong>{estudianteSeleccionado?.nombre} {estudianteSeleccionado?.apellido}</strong>
                {accion === 'cambiar' && (
                  <> (Grupo actual: {estudianteSeleccionado?.grupo?.nombre})</>
                )}
              </p>

              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="grupo">Seleccione el grupo:</label>
                  <select
                    id="grupo"
                    value={grupoSeleccionado}
                    onChange={(e) => setGrupoSeleccionado(e.target.value)}
                    required
                  >
                    <option value="">Seleccione...</option>
                    {grupos
                      .filter(g => g.estado === 'ACTIVO' || g.estado === 'BORRADOR')
                      .map((grupo) => {
                        const capacidadDisponible = grupo.capacidad - (grupo.estudiantes?.length || 0);
                        const estaLleno = capacidadDisponible <= 0;
                        
                        return (
                          <option 
                            key={grupo.id} 
                            value={grupo.id}
                            disabled={estaLleno && accion === 'agregar'}
                          >
                            {grupo.nombre} - {grupo.grado} 
                            ({grupo.estudiantes?.length || 0}/{grupo.capacidad})
                            {estaLleno && ' - LLENO'}
                          </option>
                        );
                      })}
                  </select>
                </div>

                <div className={styles.modalActions}>
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {accion === 'agregar' ? 'Agregar' : 'Cambiar'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
