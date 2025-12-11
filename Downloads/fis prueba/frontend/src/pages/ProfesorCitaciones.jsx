import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Layout } from '../components/common/Layout';
import { Spinner } from '../components/common/Spinner';
import { TbBell, TbCalendar, TbUser } from 'react-icons/tb';
import api from '../services/auth';
import styles from './ProfesorCitaciones.module.css';

export const ProfesorCitaciones = () => {
  const { user } = useAuth();
  const [citaciones, setCitaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('TODAS');

  useEffect(() => {
    fetchCitaciones();
  }, []);

  const fetchCitaciones = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/citaciones', {
        params: { profesorId: user.id }
      });
      setCitaciones(response.data);
    } catch (err) {
      setError('Error al cargar citaciones: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const citacionesFiltradas = citaciones.filter(c => 
    filtroEstado === 'TODAS' || c.estadoCita === filtroEstado
  );

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'PENDIENTE': return 'warning';
      case 'REALIZADA': return 'success';
      case 'CANCELADA': return 'danger';
      default: return 'info';
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
          <h1 className={styles.title}>Mis Citaciones</h1>
          <p className={styles.subtitle}>Citaciones asignadas a {user.nombre}</p>
        </div>

        <div className={styles.filters}>
          {['TODAS', 'PENDIENTE', 'REALIZADA', 'CANCELADA'].map(estado => (
            <button
              key={estado}
              className={`${styles.filterBtn} ${filtroEstado === estado ? styles.active : ''}`}
              onClick={() => setFiltroEstado(estado)}
            >
              {estado}
            </button>
          ))}
        </div>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        {citacionesFiltradas.length === 0 ? (
          <div className={styles.emptyState}>
            <TbBell size={64} />
            <p>No hay citaciones {filtroEstado !== 'TODAS' ? filtroEstado.toLowerCase() + 's' : ''}</p>
          </div>
        ) : (
          <div className={styles.citacionesList}>
            {citacionesFiltradas.map((citacion) => (
              <div key={citacion.id} className={styles.citacionCard}>
                <div className={styles.citacionHeader}>
                  <div className={styles.headerLeft}>
                    <span className={`${styles.tipoBadge} ${styles[citacion.tipo.toLowerCase()]}`}>
                      {citacion.tipo}
                    </span>
                    <span className={`${styles.estadoBadge} ${styles[getEstadoColor(citacion.estadoCita)]}`}>
                      {citacion.estadoCita}
                    </span>
                  </div>
                  <div className={styles.fecha}>
                    <TbCalendar size={16} />
                    <span>{formatearFecha(citacion.fecha)}</span>
                  </div>
                </div>

                <div className={styles.citacionBody}>
                  <h3 className={styles.motivo}>{citacion.motivo}</h3>

                  {citacion.acudientes && citacion.acudientes.length > 0 && (
                    <div className={styles.participantes}>
                      <div className={styles.participantesHeader}>
                        <TbUser size={16} />
                        <span>Acudientes citados:</span>
                      </div>
                      <div className={styles.participantesList}>
                        {citacion.acudientes.map((acudiente, idx) => (
                          <div key={idx} className={styles.participante}>
                            {acudiente.nombre} - {acudiente.correo}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {citacion.aspirantes && citacion.aspirantes.length > 0 && (
                    <div className={styles.participantes}>
                      <div className={styles.participantesHeader}>
                        <TbUser size={16} />
                        <span>Aspirantes citados:</span>
                      </div>
                      <div className={styles.participantesList}>
                        {citacion.aspirantes.map((aspirante, idx) => (
                          <div key={idx} className={styles.participante}>
                            {aspirante.nombre} - {aspirante.correo}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};
