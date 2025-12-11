import { NavLink } from 'react-router-dom';
import {
  TbHome,
  TbUsers,
  TbUserPlus,
  TbSchool,
  TbSchoolOff,
  TbBell,
  TbFileText,
  TbClipboardList,
} from 'react-icons/tb';
import LogoVeritas from '../../assets/LogoVeritas';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Sidebar.module.css';

const menuItems = {
  ADMIN: [
    { path: '/dashboard', label: 'Inicio', icon: TbHome },
    { path: '/admin/usuarios', label: 'Usuarios', icon: TbUsers },
    { path: '/admin/aspirantes', label: 'Aspirantes', icon: TbUserPlus },
    { path: '/admin/grupos', label: 'Grupos', icon: TbSchool },
    { path: '/admin/estudiantes', label: 'Gestión Estudiantes', icon: TbSchoolOff },
  ],
  PROFESOR: [
    { path: '/dashboard', label: 'Inicio', icon: TbHome },
    { path: '/profesor/grupos', label: 'Mis Grupos', icon: TbSchool },
    { path: '/profesor/citaciones', label: 'Citaciones', icon: TbBell },
    { path: '/profesor/calificaciones', label: 'Calificaciones', icon: TbFileText },
  ],
  ACUDIENTE: [
    { path: '/dashboard', label: 'Inicio', icon: TbHome },
    { path: '/acudiente/citaciones', label: 'Citaciones', icon: TbBell },
    { path: '/acudiente/calificaciones', label: 'Calificaciones', icon: TbFileText },
    { path: '/acudiente/boletines', label: 'Boletines', icon: TbClipboardList },
  ],
};

export const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const items = menuItems[user?.rol] || [];

  return (
    <>
      <div
        className={`${styles.overlay} ${isOpen ? styles.visible : ''}`}
        onClick={onClose}
      />
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.logo}>
          <LogoVeritas color="white" width={32} height={32} />
          <span className={styles.logoText}>Veritas</span>
        </div>

        <nav className={styles.nav}>
          {items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
              onClick={onClose}
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};
