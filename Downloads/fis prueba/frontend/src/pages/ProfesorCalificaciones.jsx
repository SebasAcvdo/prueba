import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Layout } from '../components/common/Layout';
import styles from './ProfesorCalificaciones.module.css';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Spinner';
import api from '../services/auth';

export const ProfesorCalificaciones = () => {
  const { user } = useAuth();
  const [grupos, setGrupos] = useState([]);
  const [selectedGrupo, setSelectedGrupo] = useState('');
  const [estudiantes, setEstudiantes] = useState([]);
  const [selectedEstudiante, setSelectedEstudiante] = useState('');
  const [logros, setLogros] = useState([]);
  const [calificaciones, setCalificaciones] = useState({});
  const [periodo, setPeriodo] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchGrupos();
    fetchLogros();
  }, []);

  useEffect(() => {
    if (selectedGrupo) {
      fetchEstudiantes();
    }
  }, [selectedGrupo]);

  useEffect(() => {
    if (selectedEstudiante && selectedGrupo) {
      fetchCalificaciones();
    }
  }, [selectedEstudiante, periodo]);

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
      if (response.data.estudiantes?.length > 0) {
        setSelectedEstudiante(response.data.estudiantes[0].id);
      }
    } catch (err) {
      setError('Error al cargar estudiantes');
    }
  };

  const fetchLogros = async () => {
    try {
      const response = await api.get('/logros');
      setLogros(response.data);
    } catch (err) {
      setError('Error al cargar logros');
    }
  };

  const fetchCalificaciones = async () => {
    try {
      const response = await api.get('/calificaciones', {
        params: {
          estudianteId: selectedEstudiante,
          periodo: periodo
        }
      });
      
      // Convertir array de calificaciones a objeto { logroId: { id, valor } }
      const calsMap = {};
      response.data.forEach(cal => {
        calsMap[cal.logro.id] = {
          id: cal.id,
          valor: cal.valor
        };
      });
      setCalificaciones(calsMap);
    } catch (err) {
      setError('Error al cargar calificaciones');
    }
  };

  const handleCalificacionChange = (logroId, valor) => {
    // Validar que sea un número entre 1.0 y 5.0
    const numValor = parseFloat(valor);
    if (valor === '' || (numValor >= 1.0 && numValor <= 5.0)) {
      setCalificaciones(prev => ({
        ...prev,
        [logroId]: {
          ...prev[logroId],
          valor: valor
        }
      }));
    }
  };

  const handleGuardarCalificaciones = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const promises = Object.entries(calificaciones).map(async ([logroId, data]) => {
        if (!data.valor || data.valor === '') return;

        const payload = {
          estudianteId: parseInt(selectedEstudiante),
          logroId: parseInt(logroId),
          valor: parseFloat(data.valor),
          periodo: periodo
        };

        if (data.id) {
          // Actualizar existente
          return api.put(`/calificaciones/${data.id}`, payload);
        } else {
          // Crear nueva
          return api.post('/calificaciones', payload);
        }
      });

      await Promise.all(promises);
      setSuccess('Calificaciones guardadas exitosamente');
      fetchCalificaciones(); // Recargar para obtener IDs actualizados
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Error al guardar calificaciones: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const getCategoriaNombre = (categoria) => {
    const nombres = {
      PERSONAL_SOCIAL: 'Personal Social',
      COGNITIVO_LENGUAJE: 'Cognitivo Lenguaje',
      AREA_MOTRIZ: 'Área Motriz'
    };
    return nombres[categoria] || categoria;
  };

  const agruparLogrosPorCategoria = () => {
    const agrupados = {};
    logros.forEach(logro => {
      if (!agrupados[logro.categoria]) {
        agrupados[logro.categoria] = [];
      }
      agrupados[logro.categoria].push(logro);
    });
    return agrupados;
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

  const logrosAgrupados = agruparLogrosPorCategoria();

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Gestión de Calificaciones</h1>
          <p>Registra y actualiza las calificaciones de los estudiantes</p>
        </div>

      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label htmlFor="grupo">Grupo:</label>
          <select
            id="grupo"
            value={selectedGrupo}
            onChange={(e) => setSelectedGrupo(e.target.value)}
            className={styles.select}
          >
            <option value="">Seleccione un grupo</option>
            {grupos.map((grupo) => (
              <option key={grupo.id} value={grupo.id}>
                {grupo.nombre} - {grupo.grado}
              </option>
            ))}
          </select>
        </div>

        {estudiantes.length > 0 && (
          <div className={styles.filterGroup}>
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
        )}

        {selectedEstudiante && (
          <div className={styles.filterGroup}>
            <label htmlFor="periodo">Periodo:</label>
            <select
              id="periodo"
              value={periodo}
              onChange={(e) => setPeriodo(parseInt(e.target.value))}
              className={styles.select}
            >
              <option value={1}>Periodo 1</option>
              <option value={2}>Periodo 2</option>
              <option value={3}>Periodo 3</option>
              <option value={4}>Periodo 4</option>
            </select>
          </div>
        )}
      </div>

      {selectedEstudiante && selectedGrupo && (
        <div className={styles.content}>
          <div className={styles.card}>
            {Object.entries(logrosAgrupados).map(([categoria, logrosCategoria]) => (
              <div key={categoria} className={styles.categoriaSection}>
                <h2 className={styles.categoriaTitle}>{getCategoriaNombre(categoria)}</h2>
                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Logro</th>
                        <th>Descripción</th>
                        <th style={{ width: '150px' }}>Calificación</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logrosCategoria.map((logro) => (
                        <tr key={logro.id}>
                          <td>{logro.nombre}</td>
                          <td className={styles.descripcion}>{logro.descripcion}</td>
                          <td>
                            <input
                              type="number"
                              min="1.0"
                              max="5.0"
                              step="0.1"
                              value={calificaciones[logro.id]?.valor || ''}
                              onChange={(e) => handleCalificacionChange(logro.id, e.target.value)}
                              className={styles.input}
                              placeholder="1.0 - 5.0"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}

            <div className={styles.actions}>
              <Button
                onClick={handleGuardarCalificaciones}
                disabled={saving}
                variant="primary"
              >
                {saving ? 'Guardando...' : 'Guardar Calificaciones'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {!selectedGrupo && (
        <div className={styles.emptyState}>
          <p>Seleccione un grupo para comenzar</p>
        </div>
      )}
    </div>
    </Layout>
  );
};
