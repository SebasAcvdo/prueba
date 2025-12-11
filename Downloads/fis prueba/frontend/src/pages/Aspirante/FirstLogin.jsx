import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/auth';
import styles from './FirstLogin.module.css';

/**
 * FirstLogin - Pantalla genérica para primer inicio de sesión
 * Obliga a cambiar la contraseña temporal por una definitiva
 * Funciona para todos los roles: ASPIRANTE, PROFESOR, ACUDIENTE, ADMIN
 */
const FirstLogin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  
  const rol = searchParams.get('rol') || 'ASPIRANTE';
  const correo = searchParams.get('correo') || '';
  
  const [formData, setFormData] = useState({
    correo: correo,
    claveTemporal: '',
    nuevaPassword: '',
    confirmarPassword: '',
  });
  
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Valida la fortaleza de la contraseña
   * Mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número
   */
  const validarPassword = (password) => {
    const errores = [];
    if (password.length < 8) {
      errores.push('Mínimo 8 caracteres');
    }
    if (!/[A-Z]/.test(password)) {
      errores.push('Al menos una mayúscula');
    }
    if (!/[a-z]/.test(password)) {
      errores.push('Al menos una minúscula');
    }
    if (!/[0-9]/.test(password)) {
      errores.push('Al menos un número');
    }
    return errores;
  };

  /**
   * Valida el formulario completo
   */
  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.correo) {
      nuevosErrores.correo = 'El correo es requerido';
    }

    if (!formData.claveTemporal) {
      nuevosErrores.claveTemporal = 'La clave temporal es requerida';
    }

    const erroresPassword = validarPassword(formData.nuevaPassword);
    if (erroresPassword.length > 0) {
      nuevosErrores.nuevaPassword = erroresPassword.join(', ');
    }

    if (formData.nuevaPassword !== formData.confirmarPassword) {
      nuevosErrores.confirmarPassword = 'Las contraseñas no coinciden';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  /**
   * Maneja cambios en los inputs
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpia error del campo al escribir
    if (errores[name]) {
      setErrores(prev => ({ ...prev, [name]: null }));
    }
  };

  /**
   * Envía el cambio de contraseña al backend
   * POST /api/auth/first-login → {token, usuario}
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    setEnviando(true);
    setError(null);

    try {
      const response = await api.post('/auth/first-login', {
        correo: formData.correo,
        passwordTemporal: formData.claveTemporal,
        nuevaPassword: formData.nuevaPassword,
      });

      // Guarda token y usuario en contexto
      login(response.data.token, response.data.usuario);

      // Redirige según rol
      const rutas = {
        ASPIRANTE: '/aspirante',
        PROFESOR: '/profesor',
        ACUDIENTE: '/acudiente',
        ADMIN: '/admin',
      };

      navigate(rutas[rol] || '/dashboard');
    } catch (err) {
      console.error('Error al cambiar contraseña:', err);
      setError(
        err.response?.data?.message || 
        'Error al cambiar la contraseña. Verifica que la clave temporal sea correcta.'
      );
    } finally {
      setEnviando(false);
    }
  };

  /**
   * Obtiene el título según el rol
   */
  const getTitulo = () => {
    const titulos = {
      ASPIRANTE: 'Bienvenido Aspirante',
      PROFESOR: 'Bienvenido Profesor',
      ACUDIENTE: 'Bienvenido Acudiente',
      ADMIN: 'Bienvenido Administrador',
    };
    return titulos[rol] || 'Bienvenido';
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.iconoLock}>
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <h1 className={styles.titulo}>{getTitulo()}</h1>
          <p className={styles.subtitulo}>
            Por seguridad, debes crear una contraseña definitiva
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Correo */}
          <div className={styles.formGroup}>
            <label htmlFor="correo" className={styles.label}>
              Correo electrónico
            </label>
            <input
              id="correo"
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              className={`${styles.input} ${errores.correo ? styles.inputError : ''}`}
              readOnly
            />
            {errores.correo && (
              <span className={styles.errorText}>{errores.correo}</span>
            )}
          </div>

          {/* Clave Temporal */}
          <div className={styles.formGroup}>
            <label htmlFor="claveTemporal" className={styles.label}>
              Clave temporal
            </label>
            <input
              id="claveTemporal"
              type="text"
              name="claveTemporal"
              value={formData.claveTemporal}
              onChange={handleChange}
              className={`${styles.input} ${errores.claveTemporal ? styles.inputError : ''}`}
              placeholder="Ingresa la clave que recibiste"
              required
              disabled={enviando}
            />
            {errores.claveTemporal && (
              <span className={styles.errorText}>{errores.claveTemporal}</span>
            )}
          </div>

          {/* Nueva Contraseña */}
          <div className={styles.formGroup}>
            <label htmlFor="nuevaPassword" className={styles.label}>
              Nueva contraseña
            </label>
            <input
              id="nuevaPassword"
              type="password"
              name="nuevaPassword"
              value={formData.nuevaPassword}
              onChange={handleChange}
              className={`${styles.input} ${errores.nuevaPassword ? styles.inputError : ''}`}
              placeholder="Mínimo 8 caracteres"
              required
              disabled={enviando}
            />
            {errores.nuevaPassword && (
              <span className={styles.errorText}>{errores.nuevaPassword}</span>
            )}
          </div>

          {/* Confirmar Contraseña */}
          <div className={styles.formGroup}>
            <label htmlFor="confirmarPassword" className={styles.label}>
              Confirmar contraseña
            </label>
            <input
              id="confirmarPassword"
              type="password"
              name="confirmarPassword"
              value={formData.confirmarPassword}
              onChange={handleChange}
              className={`${styles.input} ${errores.confirmarPassword ? styles.inputError : ''}`}
              placeholder="Repite la contraseña"
              required
              disabled={enviando}
            />
            {errores.confirmarPassword && (
              <span className={styles.errorText}>{errores.confirmarPassword}</span>
            )}
          </div>

          {/* Error general */}
          {error && (
            <div className={styles.errorMessage}>
              <span>⚠️</span>
              <p>{error}</p>
            </div>
          )}

          {/* Botón submit */}
          <button
            type="submit"
            className={styles.botonPrincipal}
            disabled={enviando}
          >
            {enviando ? (
              <>
                <span className={styles.spinner}></span>
                Cambiando contraseña...
              </>
            ) : (
              'Cambiar contraseña'
            )}
          </button>

          {/* Requisitos */}
          <div className={styles.infoBox}>
            <p className={styles.infoTitulo}>La contraseña debe contener:</p>
            <ul className={styles.requisitos}>
              <li>Mínimo 8 caracteres</li>
              <li>Al menos una letra mayúscula</li>
              <li>Al menos una letra minúscula</li>
              <li>Al menos un número</li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FirstLogin;
