import React, { useState, useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';
import styles from './AdminAspirantes.module.css';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Pagination } from '../components/common/Pagination';
import { BadgeEstado } from '../components/common/BadgeEstado';
import { Spinner } from '../components/common/Spinner';
import { CalendarInput } from '../components/common/CalendarInput';
import api from '../services/auth';

export const AdminAspirantes = () => {
  const { showSuccess, showError } = useToast();
  const [aspirantes, setAspirantes] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [estadoFilter, setEstadoFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedAspirante, setSelectedAspirante] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'aprobar', 'rechazar', 'entrevista'
  const [fechaEntrevista, setFechaEntrevista] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchAspirantes();
  }, [page, estadoFilter]);

  const fetchAspirantes = async () => {
    try {
      setLoading(true);
      const params = { page, size: 20 };
      if (estadoFilter) params.estado = estadoFilter;

      const response = await api.get('/aspirantes/page', { params });
      setAspirantes(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
    } catch (err) {
      showError('Error al cargar aspirantes: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const openModal = (aspirante, type) => {
    setSelectedAspirante(aspirante);
    setModalType(type);
    setShowModal(true);
    if (type === 'entrevista') {
      setFechaEntrevista('');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAspirante(null);
    setModalType('');
    setFechaEntrevista('');
  };

  const handleAprobar = async () => {
    try {
      setActionLoading(true);
      await api.patch(`/aspirantes/${selectedAspirante.id}/estado`, null, {
        params: { estado: 'APROBADO' }
      });
      showSuccess('Aspirante aprobado exitosamente');
      closeModal();
      fetchAspirantes();
    } catch (err) {
      showError('Error al aprobar aspirante: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const handleRechazar = async () => {
    try {
      setActionLoading(true);
      await api.patch(`/aspirantes/${selectedAspirante.id}/estado`, null, {
        params: { estado: 'RECHAZADO' }
      });
      showSuccess('Aspirante rechazado');
      closeModal();
      fetchAspirantes();
    } catch (err) {
      showError('Error al rechazar aspirante: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const handleProgramarEntrevista = async () => {
    if (!fechaEntrevista) {
      showError('Debe seleccionar una fecha para la entrevista');
      return;
    }

    try {
      setActionLoading(true);
      await api.put(`/aspirantes/${selectedAspirante.id}/entrevista`, null, {
        params: { fecha: fechaEntrevista }
      });
      showSuccess('Entrevista programada exitosamente');
      closeModal();
      fetchAspirantes();
    } catch (err) {
      showError('Error al programar entrevista: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const formatFecha = (fecha) => {
    if (!fecha) return '-';
    return new Date(fecha).toLocaleDateString('es-CO');
  };

  const getEstadoColor = (estado) => {
    const colores = {
      SIN_REVISAR: 'warning',
      REVISADO: 'info',
      ESPERA_ENTREVISTA: 'primary',
      APROBADO: 'success',
      RECHAZADO: 'danger'
    };
    return colores[estado] || 'default';
  };

  if (loading && page === 0) {
    return (
      <div className={styles.container}>
        <Spinner />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Gestión de Aspirantes</h1>
        <p>Administra las solicitudes de inscripción</p>
      </div>

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label htmlFor="estado">Filtrar por estado:</label>
          <select
            id="estado"
            value={estadoFilter}
            onChange={(e) => {
              setEstadoFilter(e.target.value);
              setPage(0);
            }}
            className={styles.select}
          >
            <option value="">Todos</option>
            <option value="SIN_REVISAR">Sin Revisar</option>
            <option value="REVISADO">Revisado</option>
            <option value="ESPERA_ENTREVISTA">Espera Entrevista</option>
            <option value="APROBADO">Aprobado</option>
            <option value="RECHAZADO">Rechazado</option>
          </select>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Correo</th>
              <th>Estado</th>
              <th>Fecha Entrevista</th>
              <th>Estudiantes</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {aspirantes.length === 0 ? (
              <tr>
                <td colSpan="7" className={styles.emptyRow}>
                  No hay aspirantes para mostrar
                </td>
              </tr>
            ) : (
              aspirantes.map((aspirante) => (
                <tr key={aspirante.id}>
                  <td>{aspirante.id}</td>
                  <td>{aspirante.usuario?.nombre || '-'}</td>
                  <td>{aspirante.usuario?.correo || '-'}</td>
                  <td>
                    <BadgeEstado estado={aspirante.estadoInscripcion} tipo={getEstadoColor(aspirante.estadoInscripcion)} />
                  </td>
                  <td>{formatFecha(aspirante.fechaEntrevista)}</td>
                  <td>{aspirante.estudiantes?.length || 0}</td>
                  <td>
                    <div className={styles.actions}>
                      {aspirante.estadoInscripcion === 'SIN_REVISAR' && (
                        <>
                          <button
                            className={`${styles.actionBtn} ${styles.success}`}
                            onClick={() => openModal(aspirante, 'aprobar')}
                            title="Aprobar"
                          >
                            ✓
                          </button>
                          <button
                            className={`${styles.actionBtn} ${styles.danger}`}
                            onClick={() => openModal(aspirante, 'rechazar')}
                            title="Rechazar"
                          >
                            ✕
                          </button>
                          <button
                            className={`${styles.actionBtn} ${styles.primary}`}
                            onClick={() => openModal(aspirante, 'entrevista')}
                            title="Programar Entrevista"
                          >
                            📅
                          </button>
                        </>
                      )}
                      {aspirante.estadoInscripcion === 'REVISADO' && (
                        <button
                          className={`${styles.actionBtn} ${styles.primary}`}
                          onClick={() => openModal(aspirante, 'entrevista')}
                          title="Programar Entrevista"
                        >
                          📅
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        size={20}
        totalElements={totalElements}
        totalPages={totalPages}
        onPageChange={setPage}
        disabled={loading}
      />

      {/* Modal para acciones */}
      {showModal && (
        <Modal isOpen={showModal} onClose={closeModal} title={
          modalType === 'aprobar' ? 'Aprobar Aspirante' :
          modalType === 'rechazar' ? 'Rechazar Aspirante' :
          'Programar Entrevista'
        }>
          <div className={styles.modalContent}>
            {modalType === 'aprobar' && (
              <>
                <p>¿Está seguro que desea aprobar al aspirante <strong>{selectedAspirante?.usuario?.nombre}</strong>?</p>
                <div className={styles.modalActions}>
                  <Button variant="secondary" onClick={closeModal}>
                    Cancelar
                  </Button>
                  <Button variant="primary" onClick={handleAprobar} disabled={actionLoading}>
                    {actionLoading ? 'Aprobando...' : 'Confirmar'}
                  </Button>
                </div>
              </>
            )}

            {modalType === 'rechazar' && (
              <>
                <p>¿Está seguro que desea rechazar al aspirante <strong>{selectedAspirante?.usuario?.nombre}</strong>?</p>
                <div className={styles.modalActions}>
                  <Button variant="secondary" onClick={closeModal}>
                    Cancelar
                  </Button>
                  <Button variant="danger" onClick={handleRechazar} disabled={actionLoading}>
                    {actionLoading ? 'Rechazando...' : 'Confirmar'}
                  </Button>
                </div>
              </>
            )}

            {modalType === 'entrevista' && (
              <>
                <p>Seleccione la fecha para la entrevista con <strong>{selectedAspirante?.usuario?.nombre}</strong>:</p>
                <div className={styles.formGroup}>
                  <label htmlFor="fecha">Fecha de Entrevista:</label>
                  <CalendarInput
                    value={fechaEntrevista}
                    onChange={setFechaEntrevista}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className={styles.modalActions}>
                  <Button variant="secondary" onClick={closeModal}>
                    Cancelar
                  </Button>
                  <Button variant="primary" onClick={handleProgramarEntrevista} disabled={actionLoading}>
                    {actionLoading ? 'Programando...' : 'Programar'}
                  </Button>
                </div>
              </>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
