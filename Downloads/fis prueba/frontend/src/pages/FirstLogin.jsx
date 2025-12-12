import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TbLock } from 'react-icons/tb';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/forms/Input';
import { Button } from '../components/common/Button';
import LogoVeritas from '../assets/LogoVeritas';
import styles from './Login.module.css';

export const FirstLogin = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const usuario = location.state?.usuario;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!newPassword || !confirmPassword) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      setLoading(true);
      await resetPassword(usuario, newPassword);
      
      // Redirigir según el rol del usuario
      if (rol === 'ASPIRANTE') {
        navigate('/aspirante');
      } else if (rol === 'PROFESOR') {
        navigate('/profesor');
      } else if (rol === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cambiar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftSide}>
        <div className={styles.logo}>
          <LogoVeritas color="white" width={80} height={80} />
        </div>
        <h1 className={styles.welcomeText}>Primera Conexión</h1>
        <p className={styles.subtitle}>
          Por seguridad, debes cambiar tu contraseña temporal
        </p>
      </div>

      <div className={styles.rightSide}>
        <div className={styles.formContainer}>
          <h2 className={styles.formTitle}>Cambiar Contraseña</h2>
          <p className={styles.formSubtitle}>
            Crea una contraseña segura para tu cuenta
          </p>

          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <Input
              label="Nueva Contraseña"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
            />

            <Input
              label="Confirmar Contraseña"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repite tu nueva contraseña"
              required
            />

            <Button
              type="submit"
              fullWidth
              loading={loading}
              icon={TbLock}
              className={styles.submitButton}
            >
              Cambiar Contraseña
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
