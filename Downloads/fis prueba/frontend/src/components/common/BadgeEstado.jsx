import { TbCircleFilled } from 'react-icons/tb';
import styles from './BadgeEstado.module.css';

const estadoLabels = {
  ACTIVO: 'Activo',
  INACTIVO: 'Inactivo',
  PENDIENTE: 'Pendiente',
  APROBADO: 'Aprobado',
  RECHAZADO: 'Rechazado',
  EN_PROCESO: 'En Proceso',
  CONFIRMADO: 'Confirmado',
  SIN_CONFIRMAR: 'Sin Confirmar',
};

export const BadgeEstado = ({ estado }) => {
  const estadoKey = estado?.toUpperCase().replace(' ', '_');
  const label = estadoLabels[estadoKey] || estado;
  const className = `${styles.badge} ${styles[estadoKey?.toLowerCase()] || ''}`;

  return (
    <span className={className}>
      <TbCircleFilled size={8} />
      {label}
    </span>
  );
};
