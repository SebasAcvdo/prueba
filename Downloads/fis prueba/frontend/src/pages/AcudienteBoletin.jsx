import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Layout } from '../components/common/Layout';
import toast from 'react-hot-toast';
import styles from './AcudienteBoletin.module.css';
import api from '../services/auth';

// ==================== COMPONENTE SPINNER ====================
const SpinnerLocal = ({ size = 'medium' }) => {
  const sizeClass = size === 'small' ? styles.spinnerSmall : styles.spinner;
  return <div className={sizeClass}></div>;
};

// ==================== COMPONENTE TABLA CALIFICACIONES ====================
const TablaCalificaciones = ({ calificaciones, periodo }) => {
  if (calificaciones.length === 0) {
    return (
      <div className={styles.noData}>
        No hay calificaciones registradas para este periodo
      </div>
    );
  }

  const calcularPromedio = () => {
    const notasValidas = calificaciones.filter(c => c.valor !== null && c.valor !== undefined);
    if (notasValidas.length === 0) return 0;
    const suma = notasValidas.reduce((acc, c) => acc + parseFloat(c.valor), 0);
    return (suma / notasValidas.length).toFixed(1);
  };

  return (
    <div className={styles.tablaWrapper}>
      <div className={styles.periodoHeader}>
        <h3>Calificaciones - Periodo {periodo}</h3>
        <div className={styles.promedio}>
          <span>Promedio:</span>
          <span className={styles.promedioValor}>{calcularPromedio()}</span>
        </div>
      </div>
      <table className={styles.tabla}>
        <thead>
          <tr>
            <th>Logro</th>
            <th>Categoría</th>
            <th className={styles.textCenter}>Nota</th>
          </tr>
        </thead>
        <tbody>
          {calificaciones.map((cal) => (
            <tr key={cal.id}>
              <td>{cal.logro?.nombre || 'N/A'}</td>
              <td>{cal.logro?.categoria || 'Sin categoría'}</td>
              <td className={styles.textCenter}>
                <span className={styles.nota}>{parseFloat(cal.valor).toFixed(1)}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ==================== COMPONENTE TABLA ACUMULADO ====================
const TablaAcumulado = ({ calificaciones }) => {
  if (calificaciones.length === 0) {
    return (
      <div className={styles.noData}>
        No hay calificaciones registradas
      </div>
    );
  }

  // Agrupar por periodo
  const periodos = [1, 2, 3, 4];
  const calificacionesPorPeriodo = {};
  periodos.forEach(p => {
    calificacionesPorPeriodo[p] = calificaciones.filter(c => c.periodo === p);
  });

  // Calcular promedio por periodo
  const promediosPorPeriodo = {};
  periodos.forEach(p => {
    const cals = calificacionesPorPeriodo[p];
    if (cals.length > 0) {
      const suma = cals.reduce((acc, c) => acc + parseFloat(c.valor), 0);
      promediosPorPeriodo[p] = (suma / cals.length).toFixed(1);
    } else {
      promediosPorPeriodo[p] = '-';
    }
  });

  // Calcular promedio general
  const todasNotas = calificaciones.map(c => parseFloat(c.valor));
  const promedioGeneral = todasNotas.length > 0
    ? (todasNotas.reduce((a, b) => a + b, 0) / todasNotas.length).toFixed(1)
    : '-';

  return (
    <div className={styles.tablaWrapper}>
      <div className={styles.periodoHeader}>
        <h3>Boletín Acumulado - Todos los Periodos</h3>
        <div className={styles.promedio}>
          <span>Promedio General:</span>
          <span className={styles.promedioValor}>{promedioGeneral}</span>
        </div>
      </div>
      
      <div className={styles.promediosGrid}>
        {periodos.map(p => (
          <div key={p} className={styles.promedioCard}>
            <span className={styles.promedioLabel}>Periodo {p}</span>
            <span className={styles.promedioNumero}>{promediosPorPeriodo[p]}</span>
            <span className={styles.promedioDetalle}>
              {calificacionesPorPeriodo[p].length} calificaciones
            </span>
          </div>
        ))}
      </div>

      <table className={styles.tabla}>
        <thead>
          <tr>
            <th>Logro</th>
            <th>Categoría</th>
            <th className={styles.textCenter}>P1</th>
            <th className={styles.textCenter}>P2</th>
            <th className={styles.textCenter}>P3</th>
            <th className={styles.textCenter}>P4</th>
            <th className={styles.textCenter}>Promedio</th>
          </tr>
        </thead>
        <tbody>
          {(() => {
            // Obtener todos los logros únicos
            const logrosMap = new Map();
            calificaciones.forEach(cal => {
              if (cal.logro && !logrosMap.has(cal.logro.id)) {
                logrosMap.set(cal.logro.id, {
                  id: cal.logro.id,
                  nombre: cal.logro.nombre,
                  categoria: cal.logro.categoria,
                  notas: {}
                });
              }
              if (cal.logro) {
                logrosMap.get(cal.logro.id).notas[cal.periodo] = cal.valor;
              }
            });

            return Array.from(logrosMap.values()).map(logro => {
              const notas = [1, 2, 3, 4].map(p => logro.notas[p] || null);
              const notasValidas = notas.filter(n => n !== null);
              const promedioLogro = notasValidas.length > 0
                ? (notasValidas.reduce((a, b) => a + b, 0) / notasValidas.length).toFixed(1)
                : '-';

              return (
                <tr key={logro.id}>
                  <td>{logro.nombre}</td>
                  <td>{logro.categoria || 'Sin categoría'}</td>
                  {[1, 2, 3, 4].map(p => (
                    <td key={p} className={styles.textCenter}>
                      {logro.notas[p] ? (
                        <span className={styles.nota}>{parseFloat(logro.notas[p]).toFixed(1)}</span>
                      ) : (
                        <span className={styles.notaVacia}>-</span>
                      )}
                    </td>
                  ))}
                  <td className={styles.textCenter}>
                    <span className={styles.notaPromedio}>{promedioLogro}</span>
                  </td>
                </tr>
              );
            });
          })()}
        </tbody>
      </table>
    </div>
  );
};

// ==================== COMPONENTE PRINCIPAL ====================
export const AcudienteBoletin = () => {
  const { user } = useAuth();
  const [estudiantes, setEstudiantes] = useState([]);
  const [selectedEstudiante, setSelectedEstudiante] = useState('');
  const [periodo, setPeriodo] = useState(1);
  const [calificacionesPeriodo, setCalificacionesPeriodo] = useState([]);
  const [calificacionesAcumuladas, setCalificacionesAcumuladas] = useState([]);
  const [vistaActual, setVistaActual] = useState('periodo'); // 'periodo' o 'acumulado'
  const [loading, setLoading] = useState(false);
  const [loadingCalif, setLoadingCalif] = useState(false);
  const [downloadingPeriodo, setDownloadingPeriodo] = useState(false);
  const [downloadingAcumulado, setDownloadingAcumulado] = useState(false);

  useEffect(() => {
    cargarEstudiantes();
  }, []);

  useEffect(() => {
    if (selectedEstudiante) {
      if (vistaActual === 'periodo') {
        cargarCalificacionesPeriodo();
      } else {
        cargarCalificacionesAcumuladas();
      }
    }
  }, [selectedEstudiante, periodo, vistaActual]);

  const cargarEstudiantes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/estudiantes', {
        params: { acudienteId: user.id }
      });
      setEstudiantes(response.data || []);
      if (response.data && response.data.length > 0) {
        setSelectedEstudiante(response.data[0].id);
      }
    } catch (error) {
      console.error('Error al cargar estudiantes:', error);
      toast.error('Error al cargar los estudiantes');
    } finally {
      setLoading(false);
    }
  };

  const cargarCalificacionesPeriodo = async () => {
    try {
      setLoadingCalif(true);
      const response = await api.get('/calificaciones', {
        params: {
          estudianteId: selectedEstudiante,
          periodo: periodo
        }
      });
      setCalificacionesPeriodo(response.data || []);
    } catch (error) {
      console.error('Error al cargar calificaciones:', error);
      toast.error('Error al cargar las calificaciones');
    } finally {
      setLoadingCalif(false);
    }
  };

  const cargarCalificacionesAcumuladas = async () => {
    try {
      setLoadingCalif(true);
      const response = await api.get('/calificaciones', {
        params: {
          estudianteId: selectedEstudiante
        }
      });
      setCalificacionesAcumuladas(response.data || []);
    } catch (error) {
      console.error('Error al cargar calificaciones:', error);
      toast.error('Error al cargar las calificaciones');
    } finally {
      setLoadingCalif(false);
    }
  };

  const handleDownloadPeriodo = async () => {
    try {
      setDownloadingPeriodo(true);
      const response = await api.get('/calificaciones/reporte/boletin', {
        params: {
          estudianteId: selectedEstudiante,
          periodo: periodo
        },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const estudianteObj = estudiantes.find(e => e.id === parseInt(selectedEstudiante));
      link.setAttribute('download', `boletin_${estudianteObj?.nombre}_periodo${periodo}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Boletín descargado correctamente');
    } catch (error) {
      console.error('Error al descargar boletín:', error);
      toast.error('Error al descargar el boletín');
    } finally {
      setDownloadingPeriodo(false);
    }
  };

  const handleDownloadAcumulado = async () => {
    try {
      setDownloadingAcumulado(true);
      const response = await api.get('/calificaciones/reporte/boletin', {
        params: {
          estudianteId: selectedEstudiante
          // Sin periodo = acumulado de todos
        },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const estudianteObj = estudiantes.find(e => e.id === parseInt(selectedEstudiante));
      link.setAttribute('download', `boletin_acumulado_${estudianteObj?.nombre}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Boletín acumulado descargado correctamente');
    } catch (error) {
      console.error('Error al descargar boletín:', error);
      toast.error('Error al descargar el boletín');
    } finally {
      setDownloadingAcumulado(false);
    }
  };

  const estudianteSeleccionado = estudiantes.find(e => e.id === parseInt(selectedEstudiante));

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Calificaciones y Boletines</h1>
          <p>Consulta las calificaciones académicas de tus hijos</p>
        </div>

        {loading ? (
          <div className={styles.loadingContainer}>
            <SpinnerLocal />
            <p>Cargando...</p>
          </div>
        ) : estudiantes.length === 0 ? (
          <div className={styles.noData}>
            No tienes estudiantes asignados
          </div>
        ) : (
          <>
            {/* Filtros */}
            <div className={styles.filtros}>
              <div className={styles.filtroItem}>
                <label htmlFor="estudiante">Estudiante:</label>
                <select
                  id="estudiante"
                  value={selectedEstudiante}
                  onChange={(e) => setSelectedEstudiante(e.target.value)}
                  className={styles.select}
                >
                  {estudiantes.map((est) => (
                    <option key={est.id} value={est.id}>
                      {est.nombre} {est.apellido}
                    </option>
                  ))}
                </select>
              </div>

              {vistaActual === 'periodo' && (
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
              )}
            </div>

            {/* Tabs */}
            <div className={styles.tabs}>
              <button
                className={`${styles.tab} ${vistaActual === 'periodo' ? styles.tabActive : ''}`}
                onClick={() => setVistaActual('periodo')}
              >
                Por Periodo
              </button>
              <button
                className={`${styles.tab} ${vistaActual === 'acumulado' ? styles.tabActive : ''}`}
                onClick={() => setVistaActual('acumulado')}
              >
                Boletín Acumulado
              </button>
            </div>

            {/* Información del estudiante */}
            {estudianteSeleccionado && (
              <div className={styles.infoCard}>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Nombre:</span>
                    <span className={styles.infoValue}>
                      {estudianteSeleccionado.nombre} {estudianteSeleccionado.apellido}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Grado:</span>
                    <span className={styles.infoValue}>{estudianteSeleccionado.grado}</span>
                  </div>
                  {estudianteSeleccionado.grupo && (
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Grupo:</span>
                      <span className={styles.infoValue}>{estudianteSeleccionado.grupo.nombre}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Botones de descarga */}
            <div className={styles.downloadActions}>
              {vistaActual === 'periodo' ? (
                <button
                  onClick={handleDownloadPeriodo}
                  className={styles.btnDownload}
                  disabled={downloadingPeriodo || !selectedEstudiante}
                >
                  {downloadingPeriodo ? '⏳ Descargando...' : '📥 Descargar Boletín Periodo ' + periodo}
                </button>
              ) : (
                <button
                  onClick={handleDownloadAcumulado}
                  className={styles.btnDownload}
                  disabled={downloadingAcumulado || !selectedEstudiante}
                >
                  {downloadingAcumulado ? '⏳ Descargando...' : '📥 Descargar Boletín Acumulado'}
                </button>
              )}
            </div>

            {/* Contenido */}
            <div className={styles.content}>
              {loadingCalif ? (
                <div className={styles.loadingContainer}>
                  <SpinnerLocal />
                  <p>Cargando calificaciones...</p>
                </div>
              ) : vistaActual === 'periodo' ? (
                <TablaCalificaciones calificaciones={calificacionesPeriodo} periodo={periodo} />
              ) : (
                <TablaAcumulado calificaciones={calificacionesAcumuladas} />
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};
