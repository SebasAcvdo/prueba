import { TbMenu2, TbLogout } from 'react-icons/tb';
import { useAuth } from '../../contexts/AuthContext';
import styles from './TopBar.module.css';

export const TopBar = ({ onMenuClick, title }) => {
  const { user, logout } = useAuth();

  return (
    <div className={styles.topbar}>
      <div className={styles.left}>
        <button className={styles.menuButton} onClick={onMenuClick}>
          <TbMenu2 size={24} />
        </button>
        <h1 className={styles.title}>{title}</h1>
      </div>

      <div className={styles.right}>
        <div className={styles.userInfo}>
          <div className={styles.userDetails}>
            <div className={styles.userName}>{user?.nombre}</div>
            <div className={styles.userRole}>{user?.rol}</div>
          </div>
        </div>

        <button className={styles.logoutButton} onClick={logout} title="Cerrar sesión">
          <TbLogout size={20} />
        </button>
      </div>
    </div>
  );
};
