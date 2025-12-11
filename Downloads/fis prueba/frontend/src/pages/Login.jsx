import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TbLogin } from 'react-icons/tb';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/forms/Input';
import { Button } from '../components/common/Button';
import LogoVeritas from '../assets/LogoVeritas';
import styles from './Login.module.css';

export const Login = () => {
  const [searchParams] = useSearchParams();
  const esAspirante = searchParams.get('esAspirante') === 'true';
  const correoParam = searchParams.get('correo') || '';
  
  const [usuario, setUsuario] = useState(correoParam);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (correoParam) {
      setUsuario(correoParam);
    }
  }, [correoParam]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!usuario || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    try {
      setLoading(true);
      const response = await login(usuario, password);

      // Redirigir según el rol del usuario (response ya tiene los datos directamente)
      const rol = response.rol;
      
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
      setError(err.response?.data?.message || 'Credenciales incorrectas');
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
        <h1 className={styles.welcomeText}>Bienvenido a Jardín Aprendiendo Juntos</h1>
        <p className={styles.subtitle}>
          Sistema de Gestión Educativa para mejorar la experiencia de aprendizaje
        </p>
      </div>

      <div className={styles.rightSide}>
        <div className={styles.formContainer}>
          <h2 className={styles.formTitle}>Iniciar Sesión</h2>
          <p className={styles.formSubtitle}>
            Ingresa tus credenciales para acceder al sistema
          </p>

          {error && <div className={styles.error}>{error}</div>}

          {esAspirante && (
            <div className={styles.infoAspirante}>
              <p>✉️ <strong>Usa la clave temporal que recibiste</strong></p>
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <Input
              label="Usuario o Correo"
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="Tu usuario o correo"
              required
              readOnly={esAspirante && correoParam !== ''}
            />

            <Input
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tu contraseña"
              required
            />

            <Button
              type="submit"
              fullWidth
              loading={loading}
              icon={TbLogin}
              className={styles.submitButton}
            >
              Iniciar Sesión
            </Button>
          </form>

          <div className={styles.preInscripcion}>
            <p>¿Eres aspirante nuevo?</p>
            <a href="/aspirante/preinscripcion" className={styles.linkPreInscripcion}>
              Completa tu pre-inscripción aquí
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
