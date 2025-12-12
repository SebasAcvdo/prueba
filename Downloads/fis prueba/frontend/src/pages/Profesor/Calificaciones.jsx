import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import api from '../../services/api';
import styles from './Calificaciones.module.css';

// ==================== ESQUEMAS DE VALIDACIÓN ====================
const calificacionSchema = z.object({
  nota: z.number()
    .min(1.0, 'La nota mínima es 1.0')
    .max(5.0, 'La nota máxima es 5.0')
    .refine((val) => {
      const decimal = (val * 10) % 10;
      return decimal === 0;
    }, 'Solo se permite un decimal')
});

// ==================== COMPONENTE SPINNER ====================
const Spinner = ({ size = 'medium' }) => {
  const sizeClass = size === 'small' ? styles.spinnerSmall : styles.spinner;
  return <div className={sizeClass}></div>;
};

// ==================== COMPONENTE MODAL CONFIRMACIÓN ====================
const ModalConfirmDelete = ({ isOpen, onConfirm, onCancel, logroNombre }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Confirmar eliminación</h3>
        <p>¿Está seguro de eliminar la calificación del logro:</p>
        <p className={styles.logroNombre}>{logroNombre}?</p>
        <div className={styles.modalActions}>
          <button 
            className={styles.btnCancel} 
            onClick={onCancel}
            type="button"
          >
            Cancelar
          </button>
          <button 
            className={styles.btnDelete} 
            onClick={onConfirm}
            type="button"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================== COMPONENTE FILA CALIFICACIÓN ====================
const FilaCalificacion = ({ 
  logro, 
  periodo, 
  estudianteId, 
  onSave, 
  onDelete, 
  saving 
}) => {
  const [editMode, setEditMode] = useState(!logro.calificacionId);
  const [nota, setNota] = useState(logro.nota || '');
  const [error, setError] = useState('');

  const handleBlur = async () => {
    if (nota === '' || nota === logro.nota) return;
    
    const notaNum = parseFloat(nota);
    const validation = calificacionSchema.safeParse({ nota: notaNum });
    
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }
    
    setError('');
    await handleSave();
  };

  const handleSave = async () => {
    const notaNum = parseFloat(nota);
    const validation = calificacionSchema.safeParse({ nota: notaNum });
    
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      toast.error(validation.error.errors[0].message);
      return;
    }

    setError('');
    await onSave(logro, notaNum);
    setEditMode(false);
  };

  return (
    <tr className={styles.filaCalificacion}>
      <td>{logro.nombre}</td>
      <td>{logro.categoria}</td>
      <td className={styles.textCenter}>{periodo}</td>
      <td className={styles.textCenter}>
        <div className={styles.notaContainer}>
          <input
            type="number"
            step="0.1"
            min="1.0"
            max="5.0"
            value={nota}
            onChange={(e) => {
              setNota(e.target.value);
              setError('');
            }}
            onBlur={handleBlur}
            className={`${styles.inputNota} ${error ? styles.inputError : ''}`}
            disabled={saving}
            aria-label={`Nota para ${logro.nombre}`}
          />
          {error && <span className={styles.errorText}>{error}</span>}
        </div>
      </td>
      <td className={styles.acciones}>
        {saving ? (
          <Spinner size="small" />
        ) : (
          <>
            <button
              onClick={handleSave}
              className={styles.btnSave}
              title="Guardar"
              disabled={!nota || nota === logro.nota}
              aria-label="Guardar calificación"
              type="button"
            >
              ✓
            </button>
            {logro.calificacionId && (
              <>
                <button
                  onClick={() => setEditMode(!editMode)}
                  className={styles.btnEdit}
                  title="Editar"
                  aria-label="Editar calificación"
                  type="button"
                >
                  ✏
                </button>
                <button
                  onClick={() => onDelete(logro)}
                  className={styles.btnDeleteIcon}
                  title="Eliminar"
                  aria-label="Eliminar calificación"
                  type="button"
                >
                  🗑
                </button>
              </>
            )}
          </>
        )}
      </td>
    </tr>
  );
};

// ==================== COMPONENTE TABLA CALIFICACIONES ====================
const TablaCalificaciones = ({ 
  logros, 
  periodo, 
  estudianteId, 
  onSave, 
  onDelete,
  onSaveAll,
  saving,
  savingId 
}) => {
  if (logros.length === 0) {
    return (
      <div className={styles.noData}>
        No hay logros disponibles para este grado
      </div>
    );
  }

  return (
    <div className={styles.tablaContainer}>
      <table className={styles.tabla}>
        <thead>
          <tr>
            <th>Logro</th>
            <th>Categoría</th>
            <th className={styles.textCenter}>Periodo</th>
            <th className={styles.textCenter}>Nota</th>
            <th className={styles.textCenter}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {logros.map((logro) => (
            <FilaCalificacion
              key={logro.logroId}
              logro={logro}
              periodo={periodo}
              estudianteId={estudianteId}
              onSave={onSave}
              onDelete={onDelete}
              saving={savingId === logro.logroId}
            />
          ))}
        </tbody>
      </table>
      <div className={styles.stickyFooter}>
        <button
          onClick={onSaveAll}
          className={styles.btnSaveAll}
          disabled={saving}
          type="button"
        >
          {saving ? 'Guardando...' : 'Guardar todos los cambios'}
        </button>
      </div>
    </div>
  );
};

// ==================== COMPONENTE PREVIEW BOLETÍN ====================
const PreviewBoletin = ({ calificaciones, estudiante, periodo, onDownload, downloading }) => {
  const calcularPromedio = () => {
    if (calificaciones.length === 0) return 0;
    const notasValidas = calificaciones.filter(c => c.nota !== null && c.nota !== undefined);
    if (notasValidas.length === 0) return 0;
    const suma = notasValidas.reduce((acc, c) => acc + parseFloat(c.nota), 0);
    return (suma / notasValidas.length).toFixed(1);
  };

  const promedio = calcularPromedio();

  return (
    <div className={styles.previewBoletin}>
      <div className={styles.previewHeader}>
        <h3>Preview Boletín</h3>
        <button
          onClick={onDownload}
          className={styles.btnDownloadPdf}
          disabled={!estudiante || downloading}
          aria-label="Descargar boletín PDF"
          type="button"
        >
          {downloading ? '⏳' : '📥'} Descargar PDF
        </button>
      </div>

      {estudiante ? (
        <>
          <div className={styles.previewInfo}>
            <p><strong>Estudiante:</strong> {estudiante.nombre} {estudiante.apellido}</p>
            <p><strong>Periodo:</strong> {periodo}</p>
            <p><strong>Promedio:</strong> <span className={styles.promedio}>{promedio}</span></p>
          </div>

          <div className={styles.previewTabla}>
            <table>
              <thead>
                <tr>
                  <th>Logro</th>
                  <th>Nota</th>
                </tr>
              </thead>
              <tbody>
                {calificaciones.map((cal) => (
                  <tr key={cal.logroId}>
                    <td>{cal.nombre}</td>
                    <td className={styles.textCenter}>
                      {cal.nota !== null && cal.nota !== undefined 
                        ? parseFloat(cal.nota).toFixed(1) 
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <p className={styles.noData}>Seleccione un estudiante para ver el preview</p>
      )}
    </div>
  );
};

// ==================== COMPONENTE PAGINACIÓN ESTUDIANTES ====================
const PaginationEstudiante = ({ estudiantes, currentIndex, onChange }) => {
  if (estudiantes.length === 0) return null;

  const handlePrev = () => {
    if (currentIndex > 0) {
      onChange(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < estudiantes.length - 1) {
      onChange(currentIndex + 1);
    }
  };

  return (
    <div className={styles.pagination}>
      <button
        onClick={handlePrev}
        disabled={currentIndex === 0}
        className={styles.btnPagination}
        aria-label="Estudiante anterior"
        type="button"
      >
        ← Anterior
      </button>
      <span className={styles.paginationInfo}>
        {currentIndex + 1} de {estudiantes.length}
      </span>
      <button
        onClick={handleNext}
        disabled={currentIndex === estudiantes.length - 1}
        className={styles.btnPagination}
        aria-label="Siguiente estudiante"
        type="button"
      >
        Siguiente →
      </button>
    </div>
  );
};

// ==================== COMPONENTE PRINCIPAL ====================
const Calificaciones = () => {
  // Estados
  const [grupos, setGrupos] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [logrosConCalif, setLogrosConCalif] = useState([]);
  const [periodo, setPeriodo] = useState(1);
  const [selectedGrupo, setSelectedGrupo] = useState('');
  const [selectedEstudiante, setSelectedEstudiante] = useState('');
  const [estudianteIndex, setEstudianteIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingId, setSavingId] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, logro: null });

  // Obtener usuario del token
  const getUserFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (error) {
      return null;
    }
  };

  // Cargar grupos del profesor al montar
  useEffect(() => {
    cargarGrupos();
  }, []);

  // Cargar estudiantes cuando cambia el grupo
  useEffect(() => {
    if (selectedGrupo) {
      cargarEstudiantes();
    } else {
      setEstudiantes([]);
      setSelectedEstudiante('');
    }
  }, [selectedGrupo]);

  // Cargar calificaciones cuando cambia estudiante o periodo
  useEffect(() => {
    if (selectedEstudiante && periodo) {
      cargarLogrosYCalificaciones();
    } else {
      setLogrosConCalif([]);
    }
  }, [selectedEstudiante, periodo]);

  // ==================== FUNCIONES DE CARGA ====================
  const cargarGrupos = async () => {
    try {
      setLoading(true);
      const user = getUserFromToken();
      if (!user || !user.id) {
        toast.error('No se pudo obtener información del usuario');
        return;
      }

      const response = await api.get(`/grupos?profesorId=${user.id}`);
      setGrupos(response.data || []);
    } catch (error) {
      console.error('Error al cargar grupos:', error);
      toast.error('Error al cargar los grupos');
    } finally {
      setLoading(false);
    }
  };

  const cargarEstudiantes = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/estudiantes?grupoId=${selectedGrupo}`);
      setEstudiantes(response.data || []);
      setEstudianteIndex(0);
      
      if (response.data && response.data.length > 0) {
        setSelectedEstudiante(response.data[0].id);
      } else {
        setSelectedEstudiante('');
      }
    } catch (error) {
      console.error('Error al cargar estudiantes:', error);
      toast.error('Error al cargar los estudiantes');
    } finally {
      setLoading(false);
    }
  };

  const cargarLogrosYCalificaciones = async () => {
    try {
      setLoading(true);
      
      // Obtener grado del estudiante
      const estudianteObj = estudiantes.find(e => e.id === parseInt(selectedEstudiante));
      if (!estudianteObj) return;

      const grupo = grupos.find(g => g.id === parseInt(selectedGrupo));
      if (!grupo) return;

      // Cargar logros del grado
      const logrosResponse = await api.get(`/logros?grado=${grupo.grado}`);
      const logros = logrosResponse.data || [];

      // Cargar calificaciones existentes
      const califResponse = await api.get(
        `/calificaciones?estudianteId=${selectedEstudiante}&periodo=${periodo}`
      );
      const calificaciones = califResponse.data || [];

      // Combinar logros con calificaciones
      const logrosConCalificaciones = logros.map(logro => {
        const calif = calificaciones.find(c => c.logroId === logro.id);
        return {
          logroId: logro.id,
          nombre: logro.nombre,
          categoria: logro.categoria || 'Sin categoría',
          calificacionId: calif?.id || null,
          nota: calif?.nota || null
        };
      });

      setLogrosConCalif(logrosConCalificaciones);
    } catch (error) {
      console.error('Error al cargar logros y calificaciones:', error);
      toast.error('Error al cargar las calificaciones');
    } finally {
      setLoading(false);
    }
  };

  // ==================== FUNCIONES DE GUARDADO ====================
  const handleSaveCalificacion = async (logro, nota) => {
    try {
      setSavingId(logro.logroId);
      setSaving(true);

      if (logro.calificacionId) {
        // Actualizar calificación existente
        await api.put(`/calificaciones/${logro.calificacionId}`, { nota });
        toast.success('Calificación actualizada correctamente');
      } else {
        // Crear nueva calificación
        await api.post('/calificaciones', {
          estudianteId: parseInt(selectedEstudiante),
          logroId: logro.logroId,
          periodo,
          nota
        });
        toast.success('Calificación guardada correctamente');
      }

      // Recargar calificaciones
      await cargarLogrosYCalificaciones();
    } catch (error) {
      console.error('Error al guardar calificación:', error);
      toast.error(error.response?.data?.mensaje || 'Error al guardar la calificación');
    } finally {
      setSavingId(null);
      setSaving(false);
    }
  };

  const handleSaveAll = async () => {
    try {
      setSaving(true);
      
      const promises = logrosConCalif
        .filter(logro => logro.nota !== null && logro.nota !== undefined && logro.nota !== '')
        .map(async (logro) => {
          const nota = parseFloat(logro.nota);
          const validation = calificacionSchema.safeParse({ nota });
          
          if (!validation.success) {
            throw new Error(`${logro.nombre}: ${validation.error.errors[0].message}`);
          }

          if (logro.calificacionId) {
            return api.put(`/calificaciones/${logro.calificacionId}`, { nota });
          } else {
            return api.post('/calificaciones', {
              estudianteId: parseInt(selectedEstudiante),
              logroId: logro.logroId,
              periodo,
              nota
            });
          }
        });

      await Promise.all(promises);
      toast.success('Todas las calificaciones se guardaron correctamente');
      await cargarLogrosYCalificaciones();
    } catch (error) {
      console.error('Error al guardar todas las calificaciones:', error);
      toast.error(error.message || 'Error al guardar algunas calificaciones');
    } finally {
      setSaving(false);
    }
  };

  // ==================== FUNCIONES DE ELIMINACIÓN ====================
  const handleDeleteCalificacion = (logro) => {
    setDeleteModal({ isOpen: true, logro });
  };

  const confirmDelete = async () => {
    if (!deleteModal.logro) return;

    try {
      setSaving(true);
      await api.delete(`/calificaciones/${deleteModal.logro.calificacionId}`);
      toast.success('Calificación eliminada correctamente');
      setDeleteModal({ isOpen: false, logro: null });
      await cargarLogrosYCalificaciones();
    } catch (error) {
      console.error('Error al eliminar calificación:', error);
      toast.error('Error al eliminar la calificación');
    } finally {
      setSaving(false);
    }
  };

  // ==================== FUNCIÓN DESCARGA PDF ====================
  const handleDownloadPDF = async () => {
    try {
      setDownloading(true);
      const response = await api.get(
        `/calificaciones/reporte/boletin.pdf?estudianteId=${selectedEstudiante}&periodo=${periodo}`,
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      const estudianteObj = estudiantes.find(e => e.id === parseInt(selectedEstudiante));
      link.setAttribute('download', `boletin_${estudianteObj?.nombre}_periodo${periodo}.pdf`);
      
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Boletín descargado correctamente');
    } catch (error) {
      console.error('Error al descargar PDF:', error);
      toast.error('Error al descargar el boletín');
    } finally {
      setDownloading(false);
    }
  };

  // ==================== NAVEGACIÓN ESTUDIANTES ====================
  const handleEstudianteChange = (index) => {
    setEstudianteIndex(index);
    setSelectedEstudiante(estudiantes[index].id);
  };

  const handleEstudianteSelect = (e) => {
    const id = e.target.value;
    setSelectedEstudiante(id);
    const index = estudiantes.findIndex(est => est.id === parseInt(id));
    setEstudianteIndex(index);
  };

  // ==================== RENDER ====================
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Gestión de Calificaciones</h1>
      </div>

      {/* Filtros */}
      <div className={styles.filtros}>
        <div className={styles.filtroItem}>
          <label htmlFor="grupo">Grupo:</label>
          <select
            id="grupo"
            value={selectedGrupo}
            onChange={(e) => setSelectedGrupo(e.target.value)}
            className={styles.select}
            disabled={loading}
          >
            <option value="">Seleccione un grupo</option>
            {grupos.map((grupo) => (
              <option key={grupo.id} value={grupo.id}>
                {grupo.nombre} - Grado {grupo.grado}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filtroItem}>
          <label htmlFor="estudiante">Estudiante:</label>
          <select
            id="estudiante"
            value={selectedEstudiante}
            onChange={handleEstudianteSelect}
            className={styles.select}
            disabled={!selectedGrupo || loading}
          >
            <option value="">Seleccione un estudiante</option>
            {estudiantes.map((estudiante) => (
              <option key={estudiante.id} value={estudiante.id}>
                {estudiante.nombre} {estudiante.apellido}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filtroItem}>
          <label htmlFor="periodo">Periodo:</label>
          <select
            id="periodo"
            value={periodo}
            onChange={(e) => setPeriodo(parseInt(e.target.value))}
            className={styles.select}
          >
            {[1, 2, 3, 4].map((p) => (
              <option key={p} value={p}>Periodo {p}</option>
            ))}
          </select>
        </div>

        <div className={styles.filtroItem}>
          <button
            onClick={handleDownloadPDF}
            className={styles.btnDownload}
            disabled={!selectedEstudiante || downloading}
            aria-label="Descargar boletín"
            type="button"
          >
            {downloading ? '⏳' : '📥'} Descargar Boletín
          </button>
        </div>
      </div>

      {/* Paginación Estudiantes */}
      {estudiantes.length > 0 && (
        <PaginationEstudiante
          estudiantes={estudiantes}
          currentIndex={estudianteIndex}
          onChange={handleEstudianteChange}
        />
      )}

      {/* Contenido Principal */}
      <div className={styles.mainContent}>
        {/* Tabla de Calificaciones */}
        <div className={styles.tablaSection}>
          {loading ? (
            <div className={styles.loadingContainer}>
              <Spinner />
              <p>Cargando...</p>
            </div>
          ) : selectedEstudiante && periodo ? (
            <TablaCalificaciones
              logros={logrosConCalif}
              periodo={periodo}
              estudianteId={selectedEstudiante}
              onSave={handleSaveCalificacion}
              onDelete={handleDeleteCalificacion}
              onSaveAll={handleSaveAll}
              saving={saving}
              savingId={savingId}
            />
          ) : (
            <div className={styles.noData}>
              Seleccione un grupo, estudiante y periodo para ver las calificaciones
            </div>
          )}
        </div>

        {/* Preview Boletín */}
        <PreviewBoletin
          calificaciones={logrosConCalif}
          estudiante={estudiantes.find(e => e.id === parseInt(selectedEstudiante))}
          periodo={periodo}
          onDownload={handleDownloadPDF}
          downloading={downloading}
        />
      </div>

      {/* Modal de Confirmación */}
      <ModalConfirmDelete
        isOpen={deleteModal.isOpen}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, logro: null })}
        logroNombre={deleteModal.logro?.nombre}
      />
    </div>
  );
};

export default Calificaciones;
