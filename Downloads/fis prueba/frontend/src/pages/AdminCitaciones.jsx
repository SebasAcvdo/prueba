import React, { useState, useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';
import styles from './AdminCitaciones.module.css';
import { Button } from '../components/common/Button';
import { Pagination } from '../components/common/Pagination';
import { BadgeEstado } from '../components/common/BadgeEstado';
import { Spinner } from '../components/common/Spinner';
import { CalendarInput } from '../components/common/CalendarInput';
import api from '../services/auth';

export const AdminCitaciones = () => {
  const { showSuccess, showError } = useToast();
  const [citaciones, setCitaciones] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [estadoFilter, setEstadoFilter] = useState('');
  const [tipoFilter, setTipoFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  
  // Form states
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    tipo: 'INDIVIDUAL',
    fecha: '',
    motivo: '',
    acudientesIds: [],
    aspirantesIds: [],
    profesoresIds: []
  });
  const [acudientes, setAcudientes] = useState([]);
  const [aspirantes, setAspirantes] = useState([]);
  const [profesores, setProfesores] = useState([]);

  useEffect(() => {
    fetchCitaciones();
  }, [page, estadoFilter, tipoFilter]);

  useEffect(() => {
    if (showForm) {
      fetchUsuarios();
    }
  }, [showForm]);

  const fetchCitaciones = async () => {
    try {
      setLoading(true);
      const params = { page, size: 20 };
      if (estadoFilter) params.estado = estadoFilter;
      if (tipoFilter) params.tipo = tipoFilter;

      const response = await api.get('/citaciones/page', { params });
      setCitaciones(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
    } catch (err) {
      showError('Error al cargar citaciones: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const [acudRes, aspRes, profRes] = await Promise.all([
        api.get('/usuarios/page', { params: { page: 0, size: 100 } }),
        api.get('/aspirantes'),
        api.get('/usuarios/page', { params: { page: 0, size: 100 } })
      ]);

      setAcudientes(acudRes.data.content.filter(u => u.rol === 'ACUDIENTE'));
      setAspirantes(aspRes.data);
      setProfesores(profRes.data.content.filter(u => u.rol === 'PROFESOR'));
    } catch (err) {
      showError('Error al cargar usuarios');
    }
  };

  const handleCreateCitacion = async (e) => {
    e.preventDefault();
    
    if (!formData.fecha || !formData.motivo) {
      showError('Debe completar todos los campos requeridos');
      return;
    }

    if (formData.tipo === 'INDIVIDUAL' && formData.acudientesIds.length !== 1) {
      showError('Una citación individual debe tener exactamente 1 acudiente');
      return;
    }

    if (formData.tipo === 'GRUPAL' && formData.acudientesIds.length === 0) {
      showError('Una citación grupal debe tener al menos 1 acudiente');
      return;
    }

    if (formData.tipo === 'ASPIRANTE' && formData.aspirantesIds.length === 0) {
      showError('Una citación de aspirante debe tener al menos 1 aspirante');
      return;
    }

    try {
      setCreating(true);
      await api.post('/citaciones', formData);
      showSuccess('Citación creada exitosamente');
      setShowForm(false);
      resetForm();
      fetchCitaciones();
    } catch (err) {
      showError('Error al crear citación: ' + (err.response?.data?.message || err.message));
    } finally {
      setCreating(false);
    }
  };

  const handleCambiarEstado = async (id, nuevoEstado) => {
    try {
      await api.patch(`/citaciones/${id}/estado`, null, {
        params: { estado: nuevoEstado }
      });
      showSuccess('Estado actualizado');
      fetchCitaciones();
    } catch (err) {
      showError('Error al cambiar estado: ' + (err.response?.data?.message || err.message));
    }
  };

  const resetForm = () => {
    setFormData({
      tipo: 'INDIVIDUAL',
      fecha: '',
      motivo: '',
      acudientesIds: [],
      aspirantesIds: [],
      profesoresIds: []
    });
  };

  const handleMultiSelectChange = (field, value) => {
    const currentValues = formData[field];
    const numValue = parseInt(value);
    
    if (currentValues.includes(numValue)) {
      setFormData(prev => ({
        ...prev,
        [field]: currentValues.filter(id => id !== numValue)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: [...currentValues, numValue]
      }));
    }
  };

  const formatFecha = (fecha) => {
    if (!fecha) return '-';
    return new Date(fecha).toLocaleString('es-CO');
  };

  const getEstadoColor = (estado) => {
    const colores = {
      PENDIENTE: 'warning',
      REALIZADA: 'success',
      CANCELADA: 'danger',
      APLAZADA: 'info'
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
        <div>
          <h1>Gestión de Citaciones</h1>
          <p>Administra las citaciones con acudientes, aspirantes y profesores</p>
        </div>
        <Button variant="primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancelar' : '+ Nueva Citación'}
        </Button>
      </div>

      {showForm && (
        <div className={styles.formCard}>
          <h2>Crear Nueva Citación</h2>
          <form onSubmit={handleCreateCitacion}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Tipo de Citación *</label>
                <select
                  value={formData.tipo}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      tipo: e.target.value,
                      acudientesIds: [],
                      aspirantesIds: []
                    }));
                  }}
                  className={styles.select}
                >
                  <option value="INDIVIDUAL">Individual</option>
                  <option value="GRUPAL">Grupal</option>
                  <option value="ASPIRANTE">Aspirante</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Fecha y Hora *</label>
                <input
                  type="datetime-local"
                  value={formData.fecha}
                  onChange={(e) => setFormData(prev => ({ ...prev, fecha: e.target.value }))}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                <label>Motivo *</label>
                <textarea
                  value={formData.motivo}
                  onChange={(e) => setFormData(prev => ({ ...prev, motivo: e.target.value }))}
                  className={styles.textarea}
                  rows={3}
                  placeholder="Describe el motivo de la citación..."
                  required
                />
              </div>

              {(formData.tipo === 'INDIVIDUAL' || formData.tipo === 'GRUPAL') && (
                <div className={styles.formGroup}>
                  <label>
                    Acudientes * {formData.tipo === 'INDIVIDUAL' && '(seleccione 1)'}
                  </label>
                  <div className={styles.multiSelect}>
                    {acudientes.map((acu) => (
                      <label key={acu.id} className={styles.checkbox}>
                        <input
                          type="checkbox"
                          checked={formData.acudientesIds.includes(acu.id)}
                          onChange={() => handleMultiSelectChange('acudientesIds', acu.id)}
                        />
                        <span>{acu.nombre} ({acu.correo})</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {formData.tipo === 'ASPIRANTE' && (
                <div className={styles.formGroup}>
                  <label>Aspirantes *</label>
                  <div className={styles.multiSelect}>
                    {aspirantes.map((asp) => (
                      <label key={asp.id} className={styles.checkbox}>
                        <input
                          type="checkbox"
                          checked={formData.aspirantesIds.includes(asp.id)}
                          onChange={() => handleMultiSelectChange('aspirantesIds', asp.id)}
                        />
                        <span>{asp.usuario?.nombre} ({asp.usuario?.correo})</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className={styles.formGroup}>
                <label>Profesores (opcional)</label>
                <div className={styles.multiSelect}>
                  {profesores.map((prof) => (
                    <label key={prof.id} className={styles.checkbox}>
                      <input
                        type="checkbox"
                        checked={formData.profesoresIds.includes(prof.id)}
                        onChange={() => handleMultiSelectChange('profesoresIds', prof.id)}
                      />
                      <span>{prof.nombre} ({prof.correo})</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.formActions}>
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary" disabled={creating}>
                {creating ? 'Creando...' : 'Crear Citación'}
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label>Tipo:</label>
          <select
            value={tipoFilter}
            onChange={(e) => {
              setTipoFilter(e.target.value);
              setPage(0);
            }}
            className={styles.select}
          >
            <option value="">Todos</option>
            <option value="INDIVIDUAL">Individual</option>
            <option value="GRUPAL">Grupal</option>
            <option value="ASPIRANTE">Aspirante</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Estado:</label>
          <select
            value={estadoFilter}
            onChange={(e) => {
              setEstadoFilter(e.target.value);
              setPage(0);
            }}
            className={styles.select}
          >
            <option value="">Todos</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="REALIZADA">Realizada</option>
            <option value="CANCELADA">Cancelada</option>
            <option value="APLAZADA">Aplazada</option>
          </select>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tipo</th>
              <th>Fecha</th>
              <th>Motivo</th>
              <th>Estado</th>
              <th>Participantes</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {citaciones.length === 0 ? (
              <tr>
                <td colSpan="7" className={styles.emptyRow}>
                  No hay citaciones para mostrar
                </td>
              </tr>
            ) : (
              citaciones.map((citacion) => (
                <tr key={citacion.id}>
                  <td>{citacion.id}</td>
                  <td><span className={styles.tipoBadge}>{citacion.tipo}</span></td>
                  <td>{formatFecha(citacion.fecha)}</td>
                  <td className={styles.motivo}>{citacion.motivo}</td>
                  <td>
                    <BadgeEstado estado={citacion.estadoCita} tipo={getEstadoColor(citacion.estadoCita)} />
                  </td>
                  <td>
                    {citacion.acudientes?.length > 0 && `${citacion.acudientes.length} acudiente(s)`}
                    {citacion.aspirantes?.length > 0 && `${citacion.aspirantes.length} aspirante(s)`}
                  </td>
                  <td>
                    {citacion.estadoCita === 'PENDIENTE' && (
                      <div className={styles.actions}>
                        <button
                          className={`${styles.actionBtn} ${styles.success}`}
                          onClick={() => handleCambiarEstado(citacion.id, 'REALIZADA')}
                          title="Marcar como Realizada"
                        >
                          ✓
                        </button>
                        <button
                          className={`${styles.actionBtn} ${styles.danger}`}
                          onClick={() => handleCambiarEstado(citacion.id, 'CANCELADA')}
                          title="Cancelar"
                        >
                          ✕
                        </button>
                      </div>
                    )}
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
    </div>
  );
};
