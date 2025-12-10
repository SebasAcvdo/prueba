import { useNavigate } from 'react-router-dom';
import { TbError404, TbHome } from 'react-icons/tb';
import { Button } from './Button';
import styles from './NotFound.module.css';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <TbError404 size={120} className={styles.icon} />
      <h1 className={styles.title}>Página no encontrada</h1>
      <p className={styles.message}>
        La página que buscas no existe o no tienes permisos para acceder a ella.
      </p>
      <Button
        icon={TbHome}
        onClick={() => navigate('/dashboard')}
        className={styles.button}
      >
        Volver al inicio
      </Button>
    </div>
  );
};
