import { useNavigate } from 'react-router-dom';
import {
  TbUsers,
  TbUserPlus,
  TbSchool,
  TbBell,
  TbPlus,
  TbFileText,
} from 'react-icons/tb';
import { Layout } from '../components/common/Layout';
import { Button } from '../components/common/Button';
import { useAuth } from '../contexts/AuthContext';
import styles from './Dashboard.module.css';

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 19) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const renderAdminDashboard = () => (
    <>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.primary}`}>
            <TbUsers size={24} />
          </div>
          <div className={styles.statContent}>
            <h3>-</h3>
            <p>Usuarios</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.accent}`}>
            <TbUserPlus size={24} />
          </div>
          <div className={styles.statContent}>
            <h3>-</h3>
            <p>Aspirantes</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.success}`}>
            <TbSchool size={24} />
          </div>
          <div className={styles.statContent}>
            <h3>-</h3>
            <p>Grupos</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.info}`}>
            <TbBell size={24} />
          </div>
          <div className={styles.statContent}>
            <h3>-</h3>
            <p>Citaciones</p>
          </div>
        </div>
      </div>

      <div className={styles.quickActions}>
        <h2 className={styles.quickActionsTitle}>Acciones Rápidas</h2>
        <div className={styles.actionButtons}>
          <Button icon={TbUsers} onClick={() => navigate('/admin/usuarios')}>
            Gestionar Usuarios
          </Button>
          <Button icon={TbUserPlus} onClick={() => navigate('/admin/aspirantes')}>
            Gestionar Aspirantes
          </Button>
          <Button
            icon={TbBell}
            variant="accent"
            onClick={() => navigate('/admin/citaciones')}
          >
            Gestionar Citaciones
          </Button>
          <Button icon={TbPlus} onClick={() => navigate('/admin/grupos')}>
            Gestionar Grupos
          </Button>
        </div>
      </div>
    </>
  );

  const renderProfesorDashboard = () => (
    <>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.primary}`}>
            <TbSchool size={24} />
          </div>
          <div className={styles.statContent}>
            <h3>-</h3>
            <p>Mis Grupos</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.accent}`}>
            <TbBell size={24} />
          </div>
          <div className={styles.statContent}>
            <h3>-</h3>
            <p>Citaciones Pendientes</p>
          </div>
        </div>
      </div>

      <div className={styles.quickActions}>
        <h2 className={styles.quickActionsTitle}>Acciones Rápidas</h2>
        <div className={styles.actionButtons}>
          <Button
            icon={TbFileText}
            onClick={() => navigate('/profesor/calificaciones')}
          >
            Gestionar Calificaciones
          </Button>
          <Button
            icon={TbSchool}
            onClick={() => navigate('/profesor/grupos')}
          >
            Ver Mis Grupos
          </Button>
          <Button icon={TbUsers} onClick={() => navigate('/profesor/listado-estudiantes')}>
            Listado Estudiantes
          </Button>
          <Button icon={TbBell} variant="accent" onClick={() => navigate('/profesor/citaciones')}>
            Ver Citaciones
          </Button>
          <Button icon={TbFileText} onClick={() => navigate('/profesor/observador')}>
            Observador
          </Button>
        </div>
      </div>
    </>
  );

  const renderAcudienteDashboard = () => (
    <>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.primary}`}>
            <TbBell size={24} />
          </div>
          <div className={styles.statContent}>
            <h3>-</h3>
            <p>Citaciones</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.success}`}>
            <TbFileText size={24} />
          </div>
          <div className={styles.statContent}>
            <h3>-</h3>
            <p>Calificaciones</p>
          </div>
        </div>
      </div>

      <div className={styles.quickActions}>
        <h2 className={styles.quickActionsTitle}>Acceso Rápido</h2>
        <div className={styles.actionButtons}>
          <Button
            icon={TbFileText}
            onClick={() => navigate('/acudiente/boletin')}
          >
            Ver Boletín
          </Button>
          <Button icon={TbBell} variant="accent" onClick={() => navigate('/acudiente/citaciones')}>
            Ver Citaciones
          </Button>
          <Button icon={TbSchool} onClick={() => navigate('/acudiente/observador')}>
            Ver Observador
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <Layout title="Dashboard">
      <div className={styles.dashboard}>
        <div className={styles.welcome}>
          <h1 className={styles.welcomeTitle}>
            {getGreeting()}, {user?.nombre}
          </h1>
          <p className={styles.welcomeSubtitle}>
            Bienvenido al sistema de gestión educativa Veritas
          </p>
        </div>

        {user?.rol === 'ADMIN' && renderAdminDashboard()}
        {user?.rol === 'PROFESOR' && renderProfesorDashboard()}
        {user?.rol === 'ACUDIENTE' && renderAcudienteDashboard()}
        {user?.rol === 'ASPIRANTE' && (
          <div className={styles.quickActions}>
            <h2 className={styles.quickActionsTitle}>Estado de Solicitud</h2>
            <div className={styles.actionButtons}>
              <Button icon={TbFileText} onClick={() => navigate('/aspirante/estado')}>
                Consultar Estado
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
